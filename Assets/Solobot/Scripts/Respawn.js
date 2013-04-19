/*
Respawn: Allows players to respawn to this point in the level, effectively saving their progress.

The Respawn object has three main states and one interim state: Inactive, Active and Respawn, plus Triggered.

- Inactive: Player hasn't reached this point and the player will not respawn here.

- Active: Player has touched this respawn point, so the player will respawn here.

- Respawn: Player is respawning at this respawn point.

Each state has its own visual effect(s).

Respawn objects also require a simple collider, so the player can activate them. The collider is set as a trigger.

*/

public var initialRespawn : Respawn;	// set this to the initial respawn point for the level.
public var finalRespawn : Respawn;

/** Sound Effects Settings */
var SFXPlayerRespawn: AudioClip;
var SFXRespawnActivate: AudioClip;
var SFXRespawnActiveLoop: AudioClip;
var SFXVolume: float;	// volume for one-shot sounds.

/** Respawn prefab particle emitters and lights */
private var emitterActive: ParticleEmitter;
private var emitterInactive: ParticleEmitter;
private var emitterRespawn1: ParticleEmitter;
private var emitterRespawn2: ParticleEmitter;
private var emitterRespawn3: ParticleEmitter;
private var respawnLight: Light;

/** Currently active respawn, STATIC VARIABLE SHARED BETWEEN ALL RESPAWN PREFABS IN THE GAME */
static var currentRespawn : Respawn;

private var isActive : boolean = false;

function Start()
{	
	/** Cache access to respawn particle emitters */
	emitterActive = transform.Find("RSParticlesActive").GetComponent(ParticleEmitter);
	emitterInactive = transform.Find("RSParticlesInactive").GetComponent(ParticleEmitter);
	emitterRespawn1 = transform.Find("RSParticlesRespawn1").GetComponent(ParticleEmitter);
	emitterRespawn2 = transform.Find("RSParticlesRespawn2").GetComponent(ParticleEmitter);
	emitterRespawn3 = transform.Find("RSParticlesRespawn3").GetComponent(ParticleEmitter);
	respawnLight = transform.Find("RSSpotlight").GetComponent(Light);
	
	/** Setup to loop the respawn active sound effect */
	if (SFXRespawnActiveLoop)
	{
		audio.clip = SFXRespawnActiveLoop;
		audio.loop = true;
		audio.playOnAwake = false;
	}
	
	/** Initialize the current respawn point to the initial respawn prefab */
	currentRespawn = initialRespawn;
	if (currentRespawn == this)	SetActive();
}


/** Collision Trigger Handler for activating inactive respawn points when the player steps on them. */
function OnTriggerEnter(collider : Collider)
{	/** Only detect collisions on the static 'current' respawn prefab, and only from GameObjects with the
	    'Player' tag. Built-in and self-defined object level tags for quick object lookup is more efficient
	    than other methods available such as GameObject.Find(string), which is much slower. */
	if (currentRespawn != this && collider.gameObject.CompareTag('Player'))
	{
		/** Set the curret respawn inactive so the new respawn point can be activated */
		currentRespawn.SetInactive ();
		
		/** Fire our particle burst effect and play sound effects depending on what is available */
		if (SFXRespawnActivate) FireEffect(SFXRespawnActivate);
		else if (SFXPlayerRespawn) FireEffect();
		
		/** Set static currentRespawn variable to point at this particular respawn prefab.
			The player will now be respawned to this point on player death until another
			previously unactivated respawn point is activated by player contact */
		currentRespawn = this;		
		SetActive ();
		if (currentRespawn == finalRespawn) Application.LoadLevel('YouWin');
	}
}

/** Sets active state for this particular respawn prefab */
function SetActive () 
{
	isActive = true;
	emitterActive.emit = true;
	emitterInactive.emit = false;
	respawnLight.intensity = 3.5;	
	audio.Play();
}

/** Sets inactive state for this particular respawn prefab */
function SetInactive () 
{
	emitterActive.emit = false;
	emitterInactive.emit = true;
	respawnLight.intensity = 1.5;		
	audio.Stop();
	isActive = false;
}

function IsActive() { return isActive; }

/** Emit a burst of particles upward in a concentrated ring */
function EmitParticleBurst() {
	emitterRespawn1.Emit();
	emitterRespawn2.Emit();
	emitterRespawn3.Emit();
}

/** Brightens the light intensity, emit's a particle burst and plays the
    given AudioClip before lowering the intensity of the light again. */
function FireEffect (sfxClip : AudioClip) 
{
	respawnLight.intensity = 3.5;
	EmitParticleBurst();
	if (sfxClip)
	{	// if we have a 'player is respawning' sound effect, play it now.
		AudioSource.PlayClipAtPoint(sfxClip, transform.position, SFXVolume);
	}
	
	yield WaitForSeconds (2);
	respawnLight.intensity = 2.0;
}

/** Create default arguments *indirectly* by utilizing function overloading */
function FireEffect () {
	FireEffect(SFXPlayerRespawn);
}