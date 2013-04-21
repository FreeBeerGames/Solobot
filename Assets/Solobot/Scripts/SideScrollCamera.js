var target : Transform;

var xOffset : float;
var yOffset : float;
var distance : float;
var isEnabled : boolean = true;

var targetController : SideScrollController;

function Start() {
	targetController = target.GetComponent(SideScrollController);
	if (!targetController) Debug.Log('Target must have SideScrollController component');
}

function Disable() {
	isEnabled = false;
}

function Enable() {
	isEnabled = true;
}

function Update () {
	if (target && isEnabled) {
		transform.position.x = target.position.x + xOffset;
		transform.position.y = target.position.y + yOffset;
		transform.position.z = target.position.z - distance;
	}
}