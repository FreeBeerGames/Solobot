private var litAmount : double = 0.0;

public var minIntensity : double = 0.0;
public var maxIntensity : double = 8.0;

public var audioClip : AudioClip;

private var playerController : SideScrollController;
private var particles : Component [];
private var childLight : Light;

private var isJetpackActive : boolean = false;

function Start () {
	playerController = GetComponent(SideScrollController);	
	particles = GetComponentsInChildren(ParticleEmitter);
	childLight = GetComponentInChildren(Light);
	
	if (minIntensity < 0) minIntensity = 0.0;
	else if (maxIntensity > 8.0) maxIntensity = 8.0;
 
	// The script ensures an AudioSource component is always attached.
 	audio.clip = audioClip;
 	
	// First, we make sure the AudioSource component is initialized correctly:
	audio.loop = false;
	audio.Stop();
	
	for (var p : ParticleEmitter in particles)
	{
		p.emit = false;
	}
	childLight.enabled = false;

	// Once every frame update particle emission and lights
	while (true)
	{
		isJetpackActive = playerController.IsJetpackActive();
		if (isJetpackActive)
		{
			if (!audio.isPlaying) audio.Play();
			litAmount = Mathf.Clamp(litAmount + Time.deltaTime * 2, minIntensity, maxIntensity);
		}
		else
		{
			audio.Stop();
			litAmount = Mathf.Clamp(litAmount - Time.deltaTime * 2, minIntensity, maxIntensity);
		}
		for (var p : ParticleEmitter in particles)
		{
			p.emit = isJetpackActive;
		}
			
		childLight.enabled = isJetpackActive;
		childLight.intensity = litAmount;
		yield;
	}
	audio.clip = null;
}

function IsActive() {
	return isJetpackActive;
}

@script RequireComponent(AudioSource)
