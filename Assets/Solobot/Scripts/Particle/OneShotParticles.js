
function Start () 
{
	yield WaitForSeconds(particleEmitter.minEnergy / 2);
	particleEmitter.emit = false;
}