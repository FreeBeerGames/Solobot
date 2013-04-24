#pragma strict

public var textSpeed : float = 5.0;

private var textMesh : TextMesh;

private var isRunning : boolean = false;

private var startPosition : Vector3 = Vector3.zero;

function Start () {
	textMesh = GetComponent(TextMesh);
	textMesh.text = 'Solobot\n\nA\nFree Beer Games\nProduction\n\nCory Gross\n';
	textMesh.text += 'Dillon Daugherty\nJack Satriano\nWilliam Wallace\nJoshua';
	textMesh.text += 'Kane\nCarter Michaels\n\nA long time ago in a laboratory';
	textMesh.text += '\nfar, far away...Bud Miller has been\nkidnapped by an e';
	textMesh.text += 'vil mad scientist\nwho threatens to add him to his army';
	textMesh.text += '\nof robots if he cannot escape the lab!';	
	startPosition = transform.position;
}

function MoveText() {
	var positionDelta = textSpeed * Time.deltaTime / 10;
	transform.position += Vector3(0, positionDelta, 2 * positionDelta);
}

function Update () {
	if (isRunning)
		MoveText();
}

function OnBecameInvisible () {
	transform.position = startPosition;
	isRunning = false;
}

function StartText() {
	if (!isRunning)
		isRunning = true;
}

