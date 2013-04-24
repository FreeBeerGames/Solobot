// PlayerStatus: Handles the player's state machine.

// Keeps track of inventory, health, lives, etc.

public var health : int = 6;
private var maximumHealth : int;
public var lives = 4;
private var maximumLives : int;

// sound effects.

public var struckSound: AudioClip;
public var deathSound: AudioClip;

private var levelStateMachine : LevelStatus;		// link to script that handles the level-complete sequence.

private var remainingItems : int;	// total number to pick up on this level. Grabbed from LevelStatus.

enum Powerup {None = 0, Jetpack = 1, ForceField = 2}

public var currentPowerup : Powerup = Powerup.None;

private var isDead : boolean = false;

function SetPowerup(newPowerup : Powerup) {
	if (currentPowerup != newPowerup) {
		DisableActivePowerups();
		currentPowerup = newPowerup;
	}
}

function GetCurrentPowerup () { return currentPowerup; }

function DisableActivePowerups() {
	SendMessage("DisableJetpack");
}

function Awake()
{
	levelStateMachine = FindObjectOfType(LevelStatus);
	if (!levelStateMachine)
		Debug.Log("No link to Level Status");
	
	remainingItems = levelStateMachine.itemsNeeded;
	maximumHealth = health;
	maximumLives = lives;
}

// Utility function used by HUD script:
function GetRemainingItems() : int
{
	return remainingItems;
}

function GetMaxLives() { return maximumLives; }
function GetMaxHealth() { return maximumHealth; }

function ApplyDamage (damage : int)
{
	if (!isDead) {
		if (struckSound)
			AudioSource.PlayClipAtPoint(struckSound, transform.position);	// play the 'player was struck' sound.
	
		health -= damage;
		if (health <= 0)
		{
			SendMessage("Die");
		}
	}
}

function AddLife (powerUp : int)
{
	lives += powerUp;
	maximumLives += powerUp;
	health = maximumHealth;
}

function AddHealth (powerUp : int)
{
	health += powerUp;
	maximumHealth += powerUp;
}


function FoundItem (numFound: int)
{
	remainingItems-= numFound;
}


function FalloutDeath ()
{
	Die();
	return;
}

function Die ()
{
	if (deathSound)
		AudioSource.PlayClipAtPoint(deathSound, transform.position);
		
	lives--;
	health = maximumHealth;
	
	if(lives < 0)
		Application.LoadLevel("GameOver");	
	
	
	// Hide the player briefly to give the death sound time to finish...
	// (NOTE: "HidePlayer" also disables the player controls.)
	SendMessage("HidePlayer");
	isDead = true;
	
	var sideScrollCam : SideScrollCamera = Camera.main.GetComponent(SideScrollCamera);
	sideScrollCam.SendMessage("Disable");
		
	yield WaitForSeconds(1.6);	// give the sound time to complete.
	
	// If we've reached here, the player still has lives remaining, so respawn.
	respawnPosition = Respawn.currentRespawn.transform.position;
	
	Camera.main.transform.position = respawnPosition - (transform.forward * 4) + Vector3.up;	// reset camera too
	sideScrollCam.SendMessage("Enable");
	transform.position = respawnPosition + Vector3.up;
	SendMessage("ShowPlayer");
	isDead = false;
	Respawn.currentRespawn.FireEffect();
}