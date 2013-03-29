var pushPower = 0.5;
var pushLayers : LayerMask = -1;
private var controller : ThirdPersonController;

@script RequireComponent(ThirdPersonController)

function Start ()
{
	controller = GetComponent (ThirdPersonController);
}

function OnControllerColliderHit (hit : ControllerColliderHit)
{
	var body : Rigidbody = hit.collider.attachedRigidbody;
	// no rigidbody
	if (body == null || body.isKinematic)
		return;
	// Ignore pushing those rigidbodies
	var bodyLayerMask = 1 << body.gameObject.layer;
	if ((bodyLayerMask & pushLayers.value) == 0)
		return;
		
	// We dont want to push objects below us
	if (hit.moveDirection.y < -0.3) 
		return;
	
	// Calculate push direction from move direction, we only push objects to the sides
	// never up and down
	var pushDir = Vector3 (hit.moveDirection.x, 0, hit.moveDirection.z);
	
	// push with move speed but never more than walkspeed
	body.velocity = pushDir * pushPower * Mathf.Min(controller.GetSpeed(), controller.walkSpeed);
}