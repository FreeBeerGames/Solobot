#pragma strict

public var turretArmMoveSpeed : float = 10.0;
public var weaponTransform : Transform;
public var sightingDistance : float = 30.0;
public var projectile : Rigidbody;
public var projectileSpeed : float = 8.0;

public var target : Transform;

private var isFiring : boolean = false;

private var targetDistance : float;

function LateUpdate () {
	targetDistance = weaponTransform.position.x - target.position.x;
	if (targetDistance < sightingDistance && targetDistance > 0) {
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

function RotateTurretArms() {
	var targetDirection = Vector3(target.position.x, target.position.y + 1, target.position.z) - weaponTransform.position;
	var newDirection = Vector3.RotateTowards(weaponTransform.forward, targetDirection, turretArmMoveSpeed / 10 * Time.deltaTime, 0.0);
    weaponTransform.rotation = Quaternion.LookRotation(newDirection);
}

function FireTurret() {
	while (true) {
		var projectileClone1 : Rigidbody = Instantiate(projectile, Vector3(weaponTransform.position.x - 1, weaponTransform.position.y, weaponTransform.position.z), weaponTransform.rotation);
		projectileClone1.velocity = weaponTransform.forward * projectileSpeed;
		yield WaitForSeconds(0.5);
		
		var projectileClone2 : Rigidbody = Instantiate(projectile, Vector3(weaponTransform.position.x - 1, weaponTransform.position.y, weaponTransform.position.z), weaponTransform.rotation);
		projectileClone2.velocity = weaponTransform.forward * projectileSpeed;
		yield WaitForSeconds(0.5);
		
		var projectileClone3 : Rigidbody = Instantiate(projectile, Vector3(weaponTransform.position.x - 1, weaponTransform.position.y, weaponTransform.position.z), weaponTransform.rotation);
		projectileClone3.velocity = weaponTransform.forward * projectileSpeed;
		yield WaitForSeconds(0.5);
		
		yield WaitForSeconds(3);
	}
}