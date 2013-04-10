private var litAmount : double = 0.0;

public var minIntensity : double = 0.0;
public var maxIntensity : double = 8.0;

public var audioClip : AudioClip;

function Start () { 
	var playerController : SideScrollController = GetComponent(SideScrollController);
 
 	if (playerController.IsJetpackEnabled()) {
 
	 	if (minIntensity < 0) minIntensity = 0.0;
		else if (maxIntensity > 8.0) maxIntensity = 8.0;
	 
		// The script ensures an AudioSource component is always attached.
	 	audio.clip = audioClip;
	 	
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
				litAmount = Mathf.Clamp(litAmount + Time.deltaTime * 2, minIntensity, maxIntensity);
			else
				litAmount = Mathf.Clamp(litAmount - Time.deltaTime * 2, minIntensity, maxIntensity);
				
			childLight.enabled = isFlying;
			childLight.intensity = litAmount;
			yield;
		}
		audio.clip = null;
	}
}
 
@script RequireComponent(AudioSource)
