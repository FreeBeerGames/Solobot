#pragma strict

function Update () { if(!particleSystem.IsAlive()) Destroy(gameObject); }