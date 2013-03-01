var gravity = 10.00;
var collisionMask : LayerMask;

private var velocity = Vector3.zero;
private var position : Vector3;

function Bounce (force : Vector3)
{
	position = transform.position;
	velocity = force;
}

function Update ()
{
	velocity.y -= gravity * Time.deltaTime;
	moveThisFrame = velocity * Time.deltaTime;
	distanceThisFrame = moveThisFrame.magnitude;
	
	if (Physics.Raycast(position, moveThisFrame, distanceThisFrame, collisionMask))
	{
		enabled = false;	
	}
	else
	{
		position += moveThisFrame;
		transform.position = Vector3(position.x, position.y + 0.75, position.z);	
	}
}