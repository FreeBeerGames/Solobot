var target : Transform;

var xOffset : float;
var yOffset : float;

var distance : float;

function Start () {
	if (target) {
		transform.position.x = target.position.x + xOffset;
		transform.position.y = target.position.y + yOffset;
		transform.position.z = target.position.z - distance;
	}
}

function Update () {
	if (target) {
		transform.position.x = target.position.x + xOffset;
		transform.position.y = target.position.y + yOffset;
		transform.position.z = target.position.z - distance;
	}
}