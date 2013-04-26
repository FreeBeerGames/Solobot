// GameHUD: Platformer Tutorial Master GUI script.

public var guiSkin : GUISkin;
public var guiFont : Font;
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

private var pauseMenuActive : boolean = false;


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

	if (guiSkin) GUI.skin = guiSkin;
	if (guiFont) {
		GUI.skin.font = guiFont;
		GUI.skin.label.font = guiFont;
	}
	GUI.skin.label.fontSize = 14;
	
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
	
	GUI.Box(Rect(Screen.width - 120, 20, 100, 100), powerupIcon);
	GUI.Box(Rect(Screen.width - 120, 125, 100, 40), powerupLabel);
	
	if (pauseMenuActive) {
		GUI.Box(Rect(Screen.width / 2 - 50, Screen.height / 2 - 40, 100, 80), '');
		if (GUI.Button(Rect(Screen.width / 2 - 40, Screen.height / 2 - 25, 80, 20), 'Main Menu')) {
			TogglePauseMenu();
			Application.LoadLevel('MainMenu');
		}
		
		var secondButtonLabel = 'Quit Game';
		
		var ap = Application.platform;
		var wwp = RuntimePlatform.WindowsWebPlayer;
		var osxwp = RuntimePlatform.OSXWebPlayer;
		var we = RuntimePlatform.WindowsEditor;
		var osxe = RuntimePlatform.OSXEditor;
		
		var fullscreenOption = false;
		if (ap == wwp || ap == osxwp || ap == we || ap == osxe) fullscreenOption = true;
		if (fullscreenOption) secondButtonLabel = 'Fullscreen';
		if (GUI.Button(Rect(Screen.width / 2 - 40, Screen.height / 2 + 5, 80, 20), secondButtonLabel)) {
			if (fullscreenOption) {
				ToggleFullscreen();
				TogglePauseMenu();
			} else {				
				TogglePauseMenu();
				Application.Quit();
			}
		}
	}
	
	GUI.Box(Rect(10, 10, 220, 90), '');
	GUI.backgroundColor = Color.green;
	GUI.Label (Rect (92, 10, 220, 90), "Health: " + playerStatus.health + "/" + playerStatus.GetMaxHealth());
	GUI.HorizontalScrollbar(Rect(20, 30, 200, 20), 0, playerStatus.health, 0, playerStatus.GetMaxHealth());
	GUI.Label (Rect (96, 50, 220, 40), "Lives: " + playerStatus.lives + "/" + playerStatus.GetMaxLives());
	GUI.HorizontalScrollbar(Rect(20, 70, 200, 20), 0, playerStatus.lives, 0, playerStatus.GetMaxLives());
	
	GUI.matrix = Matrix4x4.TRS (Vector3.zero,
								Quaternion.identity,
								Vector3 (Screen.height / nativeVerticalResolution,
								Screen.height / nativeVerticalResolution,
								1));
}

function ToggleFullscreen() {
	Screen.fullScreen = !Screen.fullScreen;
}

function Update() {
	if (Input.GetButtonDown('Pause')) TogglePauseMenu();
}

function TogglePauseMenu () {
	if (!pauseMenuActive) {
		Time.timeScale = 0;
		pauseMenuActive = true;
	} else {
		Time.timeScale = 1;
		pauseMenuActive = false;
	}
}