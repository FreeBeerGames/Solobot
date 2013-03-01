// This camera is similar to the one used in Jak & Dexter

var target : Transform;
var distance = 4.0;
var height = 1.0;
var smoothLag = 0.2;
var maxSpeed = 10.0;
var snapLag = 0.3;
var clampHeadPositionScreenSpace = 0.75;
var lineOfSightMask : LayerMask = 0;

private var isSnapping = false;
private var headOffset = Vector3.zero;
private var centerOffset = Vector3.zero;
private var controller : ThirdPersonController;
private var velocity = Vector3.zero;
private var targetHeight = 100000.0;

function Awake ()
{
	var characterController : CharacterController = target.collider;
	if (characterController)
	{
		centerOffset = characterController.bounds.center - target.position;
		headOffset = centerOffset;
		headOffset.y = characterController.bounds.max.y - target.position.y;
	}
	
	if (target)
	{
		controller = target.GetComponent(ThirdPersonController);
	}
	
	if (!controller)
		Debug.Log("Please assign a target to the camera that has a Third Person Controller script component.");
}

function LateUpdate () {
	
	var targetCenter = target.position + centerOffset;
	var targetHead = target.position + headOffset;
	
	// When jumping don't move camera upwards but only down!
	if (controller.IsJumping ())
	{
		// We'd be moving the camera upwards, do that only if it's really high
		var newTargetHeight = targetCenter.y + height;
		if (newTargetHeight < targetHeight || newTargetHeight - targetHeight > 5)
			targetHeight = targetCenter.y + height;
	}
	// When walking always update the target height
	else
	{
		targetHeight = targetCenter.y + height;
	}
	
	// We start snapping when user pressed Fire2!
	if (Input.GetButton("Fire2") && !isSnapping)
	{
		velocity = Vector3.zero;
		isSnapping = true;
	}

	if (isSnapping)
	{
		ApplySnapping (targetCenter);
	}
	else
	{
		ApplyPositionDamping (Vector3(targetCenter.x, targetHeight, targetCenter.z));
	}
	
	SetUpRotation(targetCenter, targetHead);
}

function ApplySnapping (targetCenter : Vector3)
{
	var position = transform.position;
	var offset = position - targetCenter;
	offset.y = 0;
	var currentDistance = offset.magnitude;

	var targetAngle = target.eulerAngles.y;
	var currentAngle = transform.eulerAngles.y;

	currentAngle = Mathf.SmoothDampAngle(currentAngle, targetAngle, velocity.x, snapLag);
	currentDistance = Mathf.SmoothDamp(currentDistance, distance, velocity.z, snapLag);

	var newPosition = targetCenter;
	newPosition += Quaternion.Euler(0, currentAngle, 0) * Vector3.back * currentDistance;

	newPosition.y = Mathf.SmoothDamp (position.y, targetCenter.y + height, velocity.y, smoothLag, maxSpeed);

	newPosition = AdjustLineOfSight(newPosition, targetCenter);
	
	transform.position = newPosition;
	
	// We are close to the target, so we can stop snapping now!
	if (AngleDistance (currentAngle, targetAngle) < 3.0)
	{
		isSnapping = false;
		velocity = Vector3.zero;
	}
}

function AdjustLineOfSight (newPosition : Vector3, target : Vector3)
{
	var hit : RaycastHit;
	if (Physics.Linecast (target, newPosition, hit, lineOfSightMask.value))
	{
		velocity = Vector3.zero;
		return hit.point;
	}
	return newPosition;
}

function ApplyPositionDamping (targetCenter : Vector3)
{
	// We try to maintain a constant distance on the x-z plane with a spring.
	// Y position is handled with a seperate spring
	var position = transform.position;
	var offset = position - targetCenter;
	offset.y = 0;
	var newTargetPos = offset.normalized * distance + targetCenter;
	
	var newPosition : Vector3;
	newPosition.x = Mathf.SmoothDamp (position.x, newTargetPos.x, velocity.x, smoothLag, maxSpeed);
	newPosition.z = Mathf.SmoothDamp (position.z, newTargetPos.z, velocity.z, smoothLag, maxSpeed);
	newPosition.y = Mathf.SmoothDamp (position.y, targetCenter.y, velocity.y, smoothLag, maxSpeed);
	
	newPosition = AdjustLineOfSight(newPosition, targetCenter);
	
	transform.position = newPosition;
}

function SetUpRotation (centerPos : Vector3, headPos : Vector3)
{
	// Now it's getting hairy. The devil is in the details here, the big issue is jumping of course.
	// * When jumping up and down don't center the guy in screen space. This is important to give a feel for how high you jump.
	//   When keeping him centered, it is hard to see the jump.
	// * At the same time we dont want him to ever go out of screen and we want all rotations to be totally smooth
	//
	// So here is what we will do:
	//
	// 1. We first find the rotation around the y axis. Thus he is always centered on the y-axis
	// 2. When grounded we make him be cented
	// 3. When jumping we keep the camera rotation but rotate the camera to get him back into view if his head is above some threshold
	// 4. When landing we must smoothly interpolate towards centering him on screen
	var cameraPos = transform.position;
	var offsetToCenter = centerPos - cameraPos;
	
	// Generate base rotation only around y-axis
	var yRotation = Quaternion.LookRotation(Vector3(offsetToCenter.x, 0, offsetToCenter.z));

	var relativeOffset = Vector3.forward * distance + Vector3.down * height;
	transform.rotation = yRotation * Quaternion.LookRotation(relativeOffset);

	// Calculate the projected center position and top position in world space
	var centerRay = camera.ViewportPointToRay(Vector3(.5, 0.5, 1));
	var topRay = camera.ViewportPointToRay(Vector3(.5, clampHeadPositionScreenSpace, 1));

	var centerRayPos = centerRay.GetPoint(distance);
	var topRayPos = topRay.GetPoint(distance);
	
	var centerToTopAngle = Vector3.Angle(centerRay.direction, topRay.direction);
	
	var heightToAngle = centerToTopAngle / (centerRayPos.y - topRayPos.y);

	var extraLookAngle = heightToAngle * (centerRayPos.y - centerPos.y);
	if (extraLookAngle < centerToTopAngle)
	{
		extraLookAngle = 0;
	}
	else
	{
		extraLookAngle = extraLookAngle - centerToTopAngle;
		transform.rotation *= Quaternion.Euler(-extraLookAngle, 0, 0);
	}
}

function AngleDistance (a : float, b : float)
{
	a = Mathf.Repeat(a, 360);
	b = Mathf.Repeat(b, 360);
	
	return Mathf.Abs(b - a);
}

@script AddComponentMenu ("Third Person Camera/Spring Follow Camera")