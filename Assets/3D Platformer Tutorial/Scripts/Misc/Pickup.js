enum PickupType { Health = 0, FuelCell = 1 }
var pickupType = PickupType.FuelCell;
var amount = 1;
var sound : AudioClip;
var soundVolume : float = 2.0;


private var used = false;
private var mover : DroppableMover;

function Start ()
{
	// do we exist in the level or are we instantiated by an enemy dying?
	mover = GetComponent(DroppableMover);
}

function ApplyPickup (playerStatus : ThirdPersonStatus)
{
	// A switch...case statement may seem overkill for this, but it makes adding new pickup types trivial.
	switch (pickupType)
	{
		case PickupType.Health:
			playerStatus.AddHealth(amount);
			break;
		
		case PickupType.FuelCell:
			playerStatus.FoundItem(amount);
			break;
	}
	
	return true;
}

function OnTriggerEnter (col : Collider) {
	if(mover && mover.enabled) return;
	var playerStatus : ThirdPersonStatus = col.GetComponent(ThirdPersonStatus);
	
	//* Make sure we are running into a player
	//* prevent picking up the trigger twice, because destruction
	//  might be delayed until the animation has finished
	if (used || playerStatus == null)
		return;
	
	if (!ApplyPickup (playerStatus))
		return;

	used = true;
	
	// Play sound
	if (sound)
		AudioSource.PlayClipAtPoint(sound, transform.position, soundVolume);
		
	
	
	// If there is an animation attached.
	// Play it.
	if (animation && animation.clip)
	{
		animation.Play();
		Destroy(gameObject, animation.clip.length);
	}
	else
	{
		Destroy(gameObject);
	}
}

// Auto setup the pickup
function Reset ()
{
	if (collider == null)	
		gameObject.AddComponent(BoxCollider);
	collider.isTrigger = true;
}

@script RequireComponent(SphereCollider)
@script AddComponentMenu("Third Person Props/Pickup")