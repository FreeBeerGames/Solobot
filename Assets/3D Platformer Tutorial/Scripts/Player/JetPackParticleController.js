
private var litAmount = 0.00;

function Start () {

	var playerController : ThirdPersonController = GetComponent(ThirdPersonController);
	
	// The script ensures an AudioSource component is always attached.
	
	// First, we make sure the AudioSource component is initialized correctly:
	audio.loop = false;
	audio.Stop();
	
	
	// Init the particles to not emit and switch off the spotlights:
	var particles : Component[] = GetComponentsInChildren(ParticleEmitter);
	var childLight : Light = GetComponentInChildren(Light);
	
	for (var p : ParticleEmitter in particles)
	{
		p.emit = false;
	}
	childLight.enabled = false;

	// Once every frame  update particle emission and lights
	while (true)
	{
		var isFlying = playerController.IsJumping();
				
		// handle thruster sound effect
		if (isFlying)
		{
			if (!audio.isPlaying)
			{
				audio.Play();
			}
		}
		else
		{
			audio.Stop();
		}
		
		
		for (var p : ParticleEmitter in particles)
		{
			p.emit = isFlying;
		}
		
		if(isFlying)
			litAmount = Mathf.Clamp01(litAmount + Time.deltaTime * 2);
		else
			litAmount = Mathf.Clamp01(litAmount - Time.deltaTime * 2);
		childLight.enabled = isFlying;
		childLight.intensity = litAmount;
					
		yield;
	}
}

@script RequireComponent(AudioSource)