// PlayerStatus: Handles the player's state machine.

// Keeps track of inventory, health, lives, etc.

public var health : int = 6;
public var maxHealth : int = 6;
public var lives = 4;

// sound effects.

public var struckSound: AudioClip;
public var deathSound: AudioClip;

private var levelStateMachine : LevelStatus;		// link to script that handles the level-complete sequence.

private var remainingItems : int;	// total number to pick up on this level. Grabbed from LevelStatus.

enum Powerup {None = 0, Jetpack = 1, ForceField = 2}

public var currentPowerup : Powerup = Powerup.None;

function SetPowerup(newPowerup : Powerup) {
	if (currentPowerup != newPowerup) {
		currentPowerup = newPowerup;
	}
}

function GetCurrentPowerup () { return currentPowerup; }

function Awake()
{
	levelStateMachine = FindObjectOfType(LevelStatus);
	if (!levelStateMachine)
		Debug.Log("No link to Level Status");
	
	remainingItems = levelStateMachine.itemsNeeded;
}

// Utility function used by HUD script:
function GetRemainingItems() : int
{
	return remainingItems;
}

function ApplyDamage (damage : int)
{
	if (struckSound)
		AudioSource.PlayClipAtPoint(struckSound, transform.position);	// play the 'player was struck' sound.

	health -= damage;
	if (health <= 0)
	{
		SendMessage("Die");
	}
}


function AddLife (powerUp : int)
{
	lives += powerUp;
	health = maxHealth;
}

function AddHealth (powerUp : int)
{
	health += powerUp;
	
	if (health>maxHealth)		// We can only show six segments in our HUD.
	{
		health=maxHealth;	
	}		
}


function FoundItem (numFound: int)
{
	remainingItems-= numFound;

// NOTE: We are deliberately not clamping this value to zero. 
// This allows for levels where the number of pickups is greater than the target number needed. 
// This also lets us speed up the testing process by temporarily reducing the collecatbles needed. 
// Our HUD will clamp to zero for us.

}


function FalloutDeath ()
{
	Die();
	return;
}

function Die ()
{
	// play the death sound if available.
	if (deathSound)
	{
		AudioSource.PlayClipAtPoint(deathSound, transform.position);

	}
		
	lives--;
	health = maxHealth;
	
	if(lives < 0)
		Application.LoadLevel("GameOver");	
	
	
	// Hide the player briefly to give the death sound time to finish...
	// (NOTE: "HidePlayer" also disables the player controls.)
	SendMessage("HidePlayer");
	
	var sideScrollCam : SideScrollCamera = Camera.main.GetComponent(SideScrollCamera);
	sideScrollCam.SendMessage("Disable");
		
	yield WaitForSeconds(1.6);	// give the sound time to complete.
	
	// If we've reached here, the player still has lives remaining, so respawn.
	respawnPosition = Respawn.currentRespawn.transform.position;
	
	Camera.main.transform.position = respawnPosition - (transform.forward * 4) + Vector3.up;	// reset camera too
	sideScrollCam.SendMessage("Enable");
	transform.position = respawnPosition + Vector3.up;
	SendMessage("ShowPlayer");
	Respawn.currentRespawn.FireEffect();
}