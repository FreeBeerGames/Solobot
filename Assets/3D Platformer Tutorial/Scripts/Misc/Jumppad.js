var jumpHeight = 5.0;

function OnTriggerEnter (col : Collider) 
{
	var controller : ThirdPersonController = col.GetComponent(ThirdPersonController);
	if (controller != null)
	{
		if (audio) 
		{
			audio.Play();
		}

		controller.SuperJump(jumpHeight);
	}
	
}


// Auto setup the script and associated trigger.
function Reset ()
{
	if (collider == null)	
		gameObject.AddComponent(BoxCollider);
	collider.isTrigger = true;
}

@script RequireComponent(BoxCollider)
@script AddComponentMenu("Third Person Props/Jump pad")