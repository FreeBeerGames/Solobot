#pragma strict

public var textSpeed : float = 5.0;

private var textMesh : TextMesh;

private var isRunning : boolean = false;

private var startPosition : Vector3 = Vector3.zero;

function Start () {
	textMesh = GetComponent(TextMesh);
	textMesh.text = 'Solobot\n\nA\nFree Beer Games\nProduction\n\nCory Gross\nDillon Daugherty\nJack Satriano\nWilliam Wallace\nJoshua Kane\nCarter Michaels\n\nA long time ago in a laboratory\nfar, far away...Bud Miller has been\nkidnapped by an evil mad scientist\nwho threatens to add him to his army\nof robots if he cannot escape the lab!';
//	startPosition.x = transform.position.x;
//	startPosition.y = transform.position.y;
//	startPosition.z = transform.position.z;
	startPosition = transform.position;
}

function MoveText() {
	var positionDelta = textSpeed * Time.deltaTime / 10;
	transform.position += Vector3(0, positionDelta, 2 * positionDelta);
}

function Update () {
	if (isRunning)
		MoveText();
	if (transform.position.z > 125) {
		transform.position = startPosition;
		isRunning = false;
	}
}

function StartText() {
	if (!isRunning)
		isRunning = true;
}

