// GameHUD: Platformer Tutorial Master GUI script.

public var guiSkin: GUISkin;
public var nativeVerticalResolution : float = 1200.0;

public var PowerupNone : Texture2D;
public var PowerupJetpack : Texture2D;
public var PowerupJetpackDisabled : Texture2D;
public var PowerupForceField : Texture2D;
public var PowerupForceFieldCooldown : Texture2D;

private var playerStatus : PlayerStatus;
private var playerController : SideScrollController;
private var forceFieldController : ForceFieldController;

private var PowerupNoneIcon : GUIContent;
private var PowerupJetpackIcon : GUIContent;
private var PowerupJetpackDisabledIcon : GUIContent;
private var PowerupForceFieldIcon : GUIContent;
private var PowerupForceFieldCooldownIcon : GUIContent;

/** Cache links to player controller and status in order to
    display information on the HUD */
function Awake()
{
	var player = GameObject.FindWithTag('Player');
	playerStatus = player.GetComponent(PlayerStatus);
	playerController = player.GetComponent(SideScrollController);
	
	var forceField = GameObject.FindGameObjectWithTag('Force Field');
	if (forceField)
		forceFieldController = forceField.GetComponent(ForceFieldController);
	
	if (PowerupNone) PowerupNoneIcon = new GUIContent('', PowerupNone);
	if (PowerupJetpack) PowerupJetpackIcon = new GUIContent('', PowerupJetpack);
	if (PowerupJetpackDisabled) PowerupJetpackDisabledIcon = new GUIContent('', PowerupJetpackDisabled);
	if (PowerupForceField) PowerupForceFieldIcon = new GUIContent('', PowerupForceField);
	if (PowerupForceFieldCooldown) PowerupForceFieldCooldownIcon = new GUIContent('', PowerupForceFieldCooldown);
	
	if (!playerController)	Debug.Log("GameHUD.js: Player controller is null");
	if (!player) Debug.Log('GameHUD.js: Player target is null');
	if (!playerStatus) Debug.Log("GameHUD.js: Player controller is null");
	if (!forceFieldController) Debug.Log('GameHUD.js: Force field controller is null');
}

function OnGUI ()
{
	var powerupLabel : String = '';
	
	var currentPowerup : Powerup = playerStatus.GetCurrentPowerup();
	var powerupIcon : GUIContent;
	if (currentPowerup == Powerup.None) {
		powerupIcon = PowerupNoneIcon;
		powerupLabel = 'No Powerup\nAvailable';
	}
	else if (currentPowerup == Powerup.Jetpack) {
		if (playerController.IsJetpackEnabled()) {
			powerupIcon = PowerupJetpackIcon;
			powerupLabel = 'Jetpack\n(Enabled)';
		}
		else {
			powerupIcon = PowerupJetpackDisabledIcon;
			powerupLabel = 'Jetpack\n(Disabled)';
		}
	}
	else if (currentPowerup == Powerup.ForceField) {
		if (!forceFieldController.IsCooling()) {
			powerupIcon = PowerupForceFieldIcon;
			powerupLabel = 'Force Field\n(Available)';
		}
		else {
			powerupIcon = PowerupForceFieldCooldownIcon;
			powerupLabel = 'Force Field\n(Cooldown)';
		}
	}

	GUI.backgroundColor = Color.red;
	GUI.Box (Rect (10, 10, 220, 40), "Health: " + playerStatus.health + "/" + playerStatus.maxHealth);
	
	GUI.backgroundColor = Color.green;
	GUI.HorizontalScrollbar(Rect(20, 30, 200, 20), 0, playerStatus.health, 0, playerStatus.maxHealth);
	
	GUI.Box(Rect(Screen.width - 120, 20, 100, 100), powerupIcon);
	GUI.Box(Rect(Screen.width - 120, 125, 100, 40), powerupLabel);
	
	GUI.matrix = Matrix4x4.TRS (Vector3.zero,
								Quaternion.identity,
								Vector3 (Screen.height / nativeVerticalResolution,
								Screen.height / nativeVerticalResolution,
								1));
								
	if (guiSkin) GUI.skin = guiSkin;
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