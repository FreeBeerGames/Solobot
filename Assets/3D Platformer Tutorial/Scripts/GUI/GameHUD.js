// GameHUD: Platformer Tutorial Master GUI script.

// This script handles the in-game HUD, showing the lives, number of fuel cells remaining, etc.

var guiSkin: GUISkin;
var nativeVerticalResolution = 1200.0;

// main decoration textures:
var healthImage: Texture2D;
var healthImageOffset = Vector2(0, 0);

// the health 'pie chart' assets consist of six textures with alpha channels. Only one is ever shown:
var healthPieImages : Texture2D[];
var healthPieImageOffset = Vector2(10, 147);

// the lives count is displayed in the health image as a text counter
var livesCountOffset = Vector2(425, 160);

// The fuel cell decoration image on the right side
var fuelCellsImage: Texture2D;
var fuelCellOffset = Vector2(0, 0);

// The counter text inside the fuel cell image
var fuelCellCountOffset = Vector2(391, 161);

private var playerInfo : ThirdPersonStatus;

// Cache link to player's state management script for later use.
function Awake()
{
	playerInfo = FindObjectOfType(ThirdPersonStatus);

	if (!playerInfo)
		Debug.Log("No link to player's state manager.");
}

function OnGUI ()
{

	var itemsLeft = playerInfo.GetRemainingItems();	// fetch items remaining -- the fuel cans. This can be a negative number!

	// Similarly, health needs to be clamped to the number of pie segments we can show.
	// We also need to check it's not negative, so we'll use the Mathf Clamp() function:
	var healthPieIndex = Mathf.Clamp(playerInfo.health, 0, healthPieImages.length);

	// Displays fuel cans remaining as a number.	
	// As we don't want to display negative numbers, we clamp the value to zero if it drops below this:
	if (itemsLeft < 0)
		itemsLeft = 0;

	// Set up gui skin
	GUI.skin = guiSkin;

	// Our GUI is laid out for a 1920 x 1200 pixel display (16:10 aspect). The next line makes sure it rescales nicely to other resolutions.
	GUI.matrix = Matrix4x4.TRS (Vector3(0, 0, 0), Quaternion.identity, Vector3 (Screen.height / nativeVerticalResolution, Screen.height / nativeVerticalResolution, 1)); 

	// Health & lives info.
	DrawImageBottomAligned( healthImageOffset, healthImage); // main image.

	// now for the pie chart. This is where a decent graphics package comes in handy to check relative sizes and offsets.
	var pieImage = healthPieImages[healthPieIndex-1];
	DrawImageBottomAligned( healthPieImageOffset, pieImage );
	
	// Displays lives left as a number.	
	DrawLabelBottomAligned( livesCountOffset, playerInfo.lives.ToString() );	
	
	// Now it's the fuel cans' turn. We want this aligned to the lower-right corner of the screen:
	DrawImageBottomRightAligned( fuelCellOffset, fuelCellsImage);

	DrawLabelBottomRightAligned( fuelCellCountOffset, itemsLeft.ToString() );
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