/*
Respawn: Allows players to respawn to this point in the level, effectively saving their progress.

The Respawn object has three main states and one interim state: Inactive, Active and Respawn, plus Triggered.

- Inactive: Player hasn't reached this point and the player will not respawn here.

- Active: Player has touched this respawn point, so the player will respawn here.

- Respawn: Player is respawning at this respawn point.

Each state has its own visual effect(s).

Respawn objects also require a simple collider, so the player can activate them. The collider is set as a trigger.

*/

var initialRespawn : Respawn;	// set this to the initial respawn point for the level.

var RespawnState = 0;

// Sound effects:
var SFXPlayerRespawn: AudioClip;
var SFXRespawnActivate: AudioClip;
var SFXRespawnActiveLoop: AudioClip;

var SFXVolume: float;	// volume for one-shot sounds.

// references for the various particle emitters...
private var emitterActive: ParticleEmitter;
private var emitterInactive: ParticleEmitter;
private var emitterRespawn1: ParticleEmitter;
private var emitterRespawn2: ParticleEmitter;
private var emitterRespawn3: ParticleEmitter;

// ...and for the light:
private var respawnLight: Light;


// The currently active respawn point. Static, so all instances of this script will share this variable.
static var currentRespawn : Respawn;

function Start()
{	
	// Get some of the objects we need later.
	// This is often done in a script's Start function. That way, we've got all our initialization code in one place, 
	// And can simply count on the code being fine.
	emitterActive = transform.Find("RSParticlesActive").GetComponent(ParticleEmitter);
	emitterInactive = transform.Find("RSParticlesInactive").GetComponent(ParticleEmitter);
	emitterRespawn1 = transform.Find("RSParticlesRespawn1").GetComponent(ParticleEmitter);
	emitterRespawn2 = transform.Find("RSParticlesRespawn2").GetComponent(ParticleEmitter);
	emitterRespawn3 = transform.Find("RSParticlesRespawn3").GetComponent(ParticleEmitter);

	respawnLight = transform.Find("RSSpotlight").GetComponent(Light);

	RespawnState = 0;
	
	// set up the looping "RespawnActive" sound, but leave it switched off for now:
	if (SFXRespawnActiveLoop)
	{
		audio.clip = SFXRespawnActiveLoop;
		audio.loop = true;
		audio.playOnAwake = false;
	}
	
	// Assign the respawn point to be this one - Since the player is positioned on top of a respawn point, it will come in and overwrite it.
	// This is just to make sure that we always have a respawn point.
	currentRespawn = initialRespawn;
	if (currentRespawn == this)
		SetActive();
}

function OnTriggerEnter()
{
	if (currentRespawn != this)		// make sure we're not respawning or re-activating an already active pad!
	{
		// turn the old respawn point off
		currentRespawn.SetInactive ();
		
		// play the "Activated" one-shot sound effect if one has been supplied:
		if (SFXRespawnActivate)
			AudioSource.PlayClipAtPoint(SFXRespawnActivate, transform.position, SFXVolume);

		// Set the current respawn point to be us and make it visible.
		currentRespawn = this;
		
		SetActive ();
	}
}

function SetActive () 
{
	emitterActive.emit = true;
	emitterInactive.emit = false;
	respawnLight.intensity = 1.5;	

	audio.Play();		// start playing the sound clip assigned in the inspector
}

function SetInactive () 
{
	emitterActive.emit = false;
	emitterInactive.emit = true;
	respawnLight.intensity = 1.5;		

	audio.Stop();	// stop playing the active sound clip.			
}

function FireEffect () 
{
	// Launch all 3 sets of particle systems.
	emitterRespawn1.Emit();
	emitterRespawn2.Emit();
	emitterRespawn3.Emit();

	respawnLight.intensity = 3.5;
		
	if (SFXPlayerRespawn)
	{	// if we have a 'player is respawning' sound effect, play it now.
		AudioSource.PlayClipAtPoint(SFXPlayerRespawn, transform.position, SFXVolume);
	}
	
	yield WaitForSeconds (2);
	
	respawnLight.intensity = 2.0;
}
