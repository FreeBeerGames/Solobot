enum PickupType { Health = 0, Jetpack = 1, ForceField = 2}
var pickupType = PickupType.Health;
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

function ApplyPickup (playerStatus : PlayerStatus)
{
	// A switch...case statement may seem overkill for this, but it makes adding new pickup types trivial.
	switch (pickupType)
	{
		case PickupType.Health:
			playerStatus.AddHealth(amount);
			break;
		
		case PickupType.Jetpack:
			playerStatus.SetPowerup(Powerup.Jetpack);
			break;
		
		case PickupType.ForceField:
			playerStatus.SetPowerup(Powerup.ForceField);
			break;
	}
	
	return true;
}

function OnTriggerEnter (col : Collider) {
	if(mover && mover.enabled) return;
	var playerStatus : PlayerStatus = col.GetComponent(PlayerStatus);
	
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
	var destroyDelay : float = 0.0;
	if (animation && animation.clip)
	{
		animation.Play();
		destroyDelay = animation.clip.length;
	}
	Destroy(gameObject, destroyDelay);
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