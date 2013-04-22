#pragma strict

public var activationDuration : float = 2.0;
public var activationCoolDown : float = 3.0;
private var lastActivationTime : float = 0.0;
private var isActive : boolean = false;
private var isCooling : boolean = false;

public var collisionEmissionBurst = 4000.0;
private var lastCollisionTime : float = 0.0;
private var initialEmissionRate : float = 0.0;
private var collisionEmissionRate : float = 5000.0;
private var collisionEmissionDuration : float = 1.0;
private var isCollisionEmissionActive : boolean = false;

function Awake() {
	Deactivate();
	initialEmissionRate = particleSystem.emissionRate;
	collisionEmissionRate = initialEmissionRate + collisionEmissionBurst;
}

function Update () {
	if (isActive) {
		var sampleTime : float = Time.time;
	
		if (isCollisionEmissionActive) {
			if (sampleTime > lastCollisionTime + collisionEmissionDuration)
				DisableCollisionEmission();
		}
		
		if (sampleTime > lastActivationTime + activationDuration) {
			Deactivate();
			isCooling = true;
		}
	}
	else if (isCooling) {
		var deactivationTime = lastActivationTime + activationDuration;
		if (Time.time > deactivationTime + activationCoolDown) isCooling = false;
	}
}

function OnCollisionEnter(collision : Collision) {
	if (!isCollisionEmissionActive) {
		EnableCollisionEmission();
	}
}

function IsCollisionEmissionActive() { return isCollisionEmissionActive; }

function EnableCollisionEmission () {
	lastCollisionTime = Time.time;
	particleSystem.emissionRate = collisionEmissionRate;
	isCollisionEmissionActive = true;
}

function DisableCollisionEmission() {
	particleSystem.emissionRate = initialEmissionRate;
	isCollisionEmissionActive = false;
}

function Activate() {
	if (!isCooling) {
		collider.enabled = true;
		renderer.enabled = true;
		lastActivationTime = Time.time;
		isActive = true;
	}
}

function Deactivate() {
	collider.enabled = false;
	renderer.enabled = false;
	if (isCollisionEmissionActive) DisableCollisionEmission();
	isActive = false;
}

function IsActive () { return isActive; }
function IsCooling () { return isCooling; }