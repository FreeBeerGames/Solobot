var hitPoints = 3;

var explosionPrefab : Transform;
var deadModelPrefab : Transform;
var healthPrefab : DroppableMover;
var fuelPrefab : DroppableMover;
var dropMin = 0;
var dropMax = 0;

// sound clips:
var struckSound : AudioClip;


private var dead = false;

function ApplyDamage (damage : int)
{
	// we've been hit, so play the 'struck' sound. This should be a metallic 'clang'.
	if (audio && struckSound)
		audio.PlayOneShot(struckSound);

	if (hitPoints <= 0)
		return;

	hitPoints -= damage;
	if (!dead && hitPoints <= 0)
	{
		Die();
		dead = true;
	}
}

function Die ()
{	
	// Kill ourselves
	Destroy(gameObject);
	
	// Instantiate replacement dead character model
	var deadModel = Instantiate(deadModelPrefab, transform.position, transform.rotation);
	CopyTransformsRecurse(transform, deadModel);
	
	// create an effect to let the player know he beat the enemy
	var effect : Transform = Instantiate(explosionPrefab, transform.position, transform.rotation);
	effect.parent = deadModel;
	
	// fall away from the player, and spin like a top
	var deadModelRigidbody = deadModel.rigidbody;
	var relativePlayerPosition = transform.InverseTransformPoint(Camera.main.transform.position);
	deadModelRigidbody.AddTorque(Vector3.up * 7);
	if (relativePlayerPosition.z > 0)
		deadModelRigidbody.AddForceAtPosition(-transform.forward * 2, transform.position + (transform.up * 5), ForceMode.Impulse);
	else
		deadModelRigidbody.AddForceAtPosition(transform.forward * 2, transform.position + (transform.up * 2), ForceMode.Impulse);
	
	// drop a random number of pickups in a random fashion
	var toDrop = Random.Range(dropMin, dropMax + 1);	// how many shall we drop?
	for (var i=0;i<toDrop;i++)
	{
		direction = Random.onUnitSphere;	// pick a random direction to throw the pickup.
		if(direction.y < 0)
			direction.y = -direction.y;	// make sure the pickup isn't thrown downwards
		
		// initial position of the pickup
		var dropPosition = transform.TransformPoint(Vector3.up * 1.5) + (direction / 2);
	
		var dropped : DroppableMover;

		// select a pickup type at random
		if(Random.value > 0.5)
			dropped = Instantiate(healthPrefab, dropPosition, Quaternion.identity);
		else
			dropped = Instantiate(fuelPrefab, dropPosition, Quaternion.identity);

		// set the pickup in motion
		dropped.Bounce(direction * 4 * (Random.value + 0.2));
	}
}


/* 
deadModel	When we instantiate the death sequence prefab, we ensure all its child 
	elements are the same as those in the original robot, by copying all 
	the transforms over. Hence this function.
*/

static function CopyTransformsRecurse (src : Transform,  dst : Transform)
{
	dst.position = src.position;
	dst.rotation = src.rotation;
	
	for (var child : Transform in dst)
	{
		// Match the transform with the same name
		var curSrc = src.Find(child.name);
		if (curSrc)
			CopyTransformsRecurse(curSrc, child);
	}
}

@script AddComponentMenu("Third Person Enemies/Enemy Damage")