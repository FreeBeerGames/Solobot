#pragma strict

private var textMesh : TextMesh;
private var lastTimeMeasured : float = 0.0;
private var initialTime : float;
public var blinkInterval : float = 0.45;

public var loadMenuDelay : float = 7.5;

function Start () {
	textMesh = GetComponent(TextMesh);
	initialTime = Time.time;
}

function Update () {
	var sampleTime = Time.time;
	if (sampleTime > initialTime && sampleTime > (lastTimeMeasured + blinkInterval)) {
		textMesh.renderer.enabled = !textMesh.renderer.enabled;
		lastTimeMeasured = Time.time;
	}
	
	if (sampleTime > initialTime + loadMenuDelay) {
		Application.LoadLevel('MainMenu');
	}
}