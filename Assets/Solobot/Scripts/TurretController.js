#pragma strict

public var turretArmMoveSpeed : float = 10.0;
public var weaponTransform : Transform;
public var attackRadius : float = 30.0;
public var projectile : Rigidbody;
public var projectileSpeed : float = 8.0;

public var secondsBetweenBursts : float = 3.0;
public var projectilesPerBurst : int = 3;
public var secondsBetweenProjectiles = 0.3;

private var target : Transform;
private var isFiring : boolean = false;
private var targetDistance : float = 0.0;

function Start () {
	var player = GameObject.FindWithTag('Player');
	if (!player) Debug.Log('TurretController.js: Player target is null.');
	else target = player.transform;
	if (secondsBetweenBursts < secondsBetweenProjectiles * projectilesPerBurst) {
		var debugString : String = "TurretController.js --> public variable ";
		debugString += "secondsBetweenBursts must be greater than or equal to -->";
		debugString += "   (secondsBetweenProjectiles * projectilePerBurst)";
		Debug.Log(debugString);
		secondsBetweenBursts = secondsBetweenProjectiles * projectilesPerBurst;
	} 
}

function LateUpdate () {
	var targetOffset = target.position - weaponTransform.position;
	if (targetOffset.magnitude < attackRadius && targetOffset.y > -1.0 && targetOffset.x < 0) {
		RotateTurretArms();
		if (!isFiring) {
			isFiring = true;
			StartCoroutine("FireTurret");
		}
	} else {
		if (isFiring) {
			isFiring = false;
			StopCoroutine("FireTurret");
		}
	}
}

function OperateArms() {

}

function RotateTurretArms() {
	var targetDirection = Vector3(target.position.x, target.position.y + 1, target.position.z) - weaponTransform.position;
	var newDirection = Vector3.RotateTowards(weaponTransform.forward, targetDirection, turretArmMoveSpeed / 10 * Time.deltaTime, 0.0);
    weaponTransform.rotation = Quaternion.LookRotation(newDirection);
}

function FireTurret() {
	while (true) {
		var projectileClone : Rigidbody;
		for (var i = 0; i < projectilesPerBurst; i++) {
			projectileClone = Instantiate(projectile, Vector3(weaponTransform.position.x - 1, weaponTransform.position.y, weaponTransform.position.z), weaponTransform.rotation);
			projectileClone.velocity = weaponTransform.forward * projectileSpeed;
			yield WaitForSeconds(secondsBetweenProjectiles);
		}
		yield WaitForSeconds(secondsBetweenBursts);
	}
}

function OnDrawGizmosSelected () {
	Gizmos.color = Color.red;
	Gizmos.DrawWireSphere(transform.position, attackRadius);
}