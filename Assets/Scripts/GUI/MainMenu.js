#pragma strict

public var font : Font;

private var selectionInput : int = 0;
private var selectionTime : float = 0.0;

private var isWebPlayer : boolean = false;
private var isEditor : boolean = false;

private var menuItems : String[];

public var text : StarWarsText;

private var contextualButton : String = null;

function Start() {

	DeterminePlatform();
	if (isWebPlayer)
		contextualButton = 'Fullscreen';
	else if (!(isWebPlayer || isEditor))
		contextualButton = 'Exit';
	
	var numMenuItems = 2;
	if (contextualButton != null) numMenuItems = 3;
	
	menuItems = new String[numMenuItems];
	menuItems[0] = 'Start';
	menuItems[1] = 'About';
	menuItems[2] = contextualButton;
}

function DeterminePlatform() {
	if (Application.platform == RuntimePlatform.OSXWebPlayer 
		|| Application.platform == RuntimePlatform.WindowsWebPlayer)
	{
		isWebPlayer = true;
	}
	else if (Application.platform == RuntimePlatform.OSXEditor
			 || Application.platform == RuntimePlatform.WindowsEditor)
	{
		isEditor = true;
	}
}

function Update() {	
	if (Time.time > (selectionTime + 0.25) || selectionTime == 0.0) {
		var vAxis = Input.GetAxis('Vertical');
		if (vAxis < 0) {
			selectionInput++;
			if (selectionInput == menuItems.length) selectionInput = 0;
			selectionTime = Time.time;
		}
		else if (vAxis > 0) {
			selectionInput--;
			if (selectionInput < 0) selectionInput = menuItems.length - 1;
			selectionTime = Time.time;
		}
	}
}

function OnGUI () {
	GUI.skin.font = font;
	GUI.skin.label.fontSize = 36;
	
	GUI.Box(Rect(Screen.width / 2 - 100, 110, 200, 260), '');
	
	GUI.Label(Rect(Screen.width / 2 - 63, 120, 126, 100), 'Solobot');
	
	/** Start Button, loads the first level */
	GUI.SetNextControlName('Start');
	if (GUI.Button(Rect(Screen.width / 2 - 50, 185, 100, 40), 'Start Game')) {
		OnStartButtonPressed();
	}
	
	/** About Button, Display Story, Credits */
	GUI.SetNextControlName('About');
	if (GUI.Button(Rect(Screen.width / 2 - 50, 243, 100, 40), 'About')) {
		OnAboutButtonPressed();
	}
	
	
	/** Exit Button, quits the application, not available in Web-Player */
	GUI.SetNextControlName(contextualButton);
	if (contextualButton == 'Exit') {
		if (GUI.Button(Rect(Screen.width / 2 - 50, 301, 100, 40), 'Exit')) {
			OnExitButtonPressed();
		}
	} else if (contextualButton == 'Fullscreen') {
		if (GUI.Button(Rect(Screen.width / 2 - 50, 301, 100, 40), 'Fullscreen')) {
			OnFullscreenButtonPressed();
		}
	}
	
	GUI.FocusControl(menuItems[selectionInput]);
	if (Input.GetButtonDown('Jump')) {
		var focused = GUI.GetNameOfFocusedControl();
		if(focused == 'Start') {
			OnStartButtonPressed();
		}
		else if (focused == 'About') {
			OnAboutButtonPressed();
		}
		else if (focused == 'Exit') {
			OnExitButtonPressed();
		}
		else if (focused == 'Fullscreen') {
			OnFullscreenButtonPressed();
		}
	}
}

function OnFullscreenButtonPressed() {
	Screen.fullScreen = !Screen.fullScreen;
}

function OnStartButtonPressed() {
	Application.LoadLevel('DemoLevel');
}

function OnExitButtonPressed() {
	Application.Quit();
}

function OnAboutButtonPressed() {
	text.StartText();
}