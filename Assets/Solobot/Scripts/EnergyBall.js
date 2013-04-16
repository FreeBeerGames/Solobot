#pragma strict

var range : int = 60;
var explosion : Transform;
var damageHitPoints : int = 1;

var damageTag : String;

private var startPosition : Vector3;

function Start() {
	startPosition = transform.position;
}

function Update() {
	var currentPosition = transform.position;
	if (Vector3.Distance(startPosition, currentPosition) > range)
		Destroy(gameObject);
}

function OnCollisionEnter(collision : Collision) {
	var ballPosition = transform.position;
	var ballRotation = transform.rotation;
	var explosionClone : Transform = Instantiate(explosion, ballPosition, ballRotation);	
	var collisionObj = collision.gameObject;
	
	Destroy(gameObject);
	
	if(collisionObj.CompareTag(damageTag)) {
		collisionObj.SendMessage("ApplyDamage", damageHitPoints);
	}
}