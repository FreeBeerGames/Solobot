// GameHUD: Platformer Tutorial Master GUI script.

// This script handles the in-game HUD, showing the lives, number of fuel cells remaining, etc.

var guiSkin: GUISkin;
var nativeVerticalResolution = 1200.0;

// the lives count is displayed in the health image as a text counter
var livesCountOffset = Vector2(425, 160);

// The counter text inside the fuel cell image
var fuelCellCountOffset = Vector2(391, 161);

private var playerStatus : PlayerStatus;
private var playerController : SideScrollController;

// Cache link to player's state management scripts for later use.
function Awake()
{
	var player = GameObject.FindWithTag('Player');
	playerStatus = player.GetComponent(PlayerStatus);
	playerController = player.GetComponent(SideScrollController);
	if (!playerController)	Debug.Log("GameHUD.js: Player controller is null");
	if (!player) Debug.Log('GameHUD.js: Player target is null');
	if (!playerStatus) Debug.Log("GameHUD.js: Player controller is null");
}

function OnGUI ()
{	
	GUI.backgroundColor = Color.red;
	GUI.Box (Rect (10,10,220,40), "Health: " + playerStatus.health + "/" + playerStatus.maxHealth);
	
	GUI.backgroundColor = Color.green;
	GUI.HorizontalScrollbar(Rect(20,30,200,20),0,playerStatus.health,0,playerStatus.maxHealth);
	
	GUI.Toggle(Rect(10,60,100,50), playerController.IsJetpackEnabled() , "Jetpack");
	
	/*
	if (GUI.Button (Rect (20,40,80,20), "Level 1")) {
		Application.LoadLevel (1);
	}
	*/

	// Set up gui skin
	GUI.skin = guiSkin;

	// Our GUI is laid out for a 1920 x 1200 pixel display (16:10 aspect). The next line makes sure it rescales nicely to other resolutions.
	GUI.matrix = Matrix4x4.TRS (Vector3(0, 0, 0), Quaternion.identity, Vector3 (Screen.height / nativeVerticalResolution, Screen.height / nativeVerticalResolution, 1)); 

}

function DrawImageBottomAligned (pos : Vector2, image : Texture2D)
{
	GUI.Label(Rect (pos.x, nativeVerticalResolution - image.height - pos.y, image.width, image.height), image);
}

function DrawLabelBottomAligned (pos : Vector2, text : String)
{
	GUI.Label(Rect (pos.x, nativeVerticalResolution - pos.y, 100, 100), text);
}

function DrawImageBottomRightAligned (pos : Vector2, image : Texture2D)
{
	var scaledResolutionWidth = nativeVerticalResolution / Screen.height * Screen.width;
	GUI.Label(Rect (scaledResolutionWidth - pos.x - image.width, nativeVerticalResolution - image.height - pos.y, image.width, image.height), image);
}

function DrawLabelBottomRightAligned (pos : Vector2, text : String)
{
	var scaledResolutionWidth = nativeVerticalResolution / Screen.height * Screen.width;
	GUI.Label(Rect (scaledResolutionWidth - pos.x, nativeVerticalResolution - pos.y, 100, 100), text);
}