
/** Walk/Run Settings */
public var walkSpeed = 3.0; /** Speed of normal initial walk */
public var trotSpeed = 4.0; /** Speed when trotting, automatic */
public var runSpeed = 6.0;	/** Speed when running, Input('Fire3') */
var trotAfterSeconds = 3.0; /** Amount of time before walk->trot transisition */

/** Height of jump when pressing jump button and lettting go immediately */
public var jumpHeight = 0.5;

/** Extra height when holding jump button, set to zero when jetpack enabled */
public var extraJumpHeight = 2.5; 

/** Gravity floating point settings */
public var gravity : float = 20.0;
public var controlledDescentGravity : float = 2.0;
public var speedSmoothing : float = 10.0;
public var rotateSpeed : float = 500.0;
public var inAirControlAcceleration = 3.0;

/** Jumping flags */
public var canJump : boolean = true;
public var canControlDescent : boolean = true;
public var canWallJump : boolean = false;
public var canChangeDirectionInAir : boolean = true;

/** Private jumping logic constants */
private var jumpRepeatTime = 0.05;
private var wallJumpTimeout = 0.15;
private var jumpTimeout = 0.15;
private var groundedTimeout = 0.25;

// The current move direction in x-z
private var moveDirection = Vector3.zero;
// The current vertical speed
private var jumpSpeed = 0.0;
// The current x-z move speed
private var moveSpeed = 0.0;

// The last collision flags returned from controller.Move
private var collisionFlags : CollisionFlags; 

// Are we jumping? (Initiated with jump button and not grounded yet)
private var jumping = false;
private var jumpingReachedApex = false;

/** Timer variables */
private var walkTimeStart = 0.0; // Timer for going into 'trot' speed
private var lastJumpButtonTime = -10.0; // Last time jump input pressed
private var lastJumpTime = -1.0; // Last time we actually jumped

private var wallJumpContactNormal : Vector3;
private var wallJumpContactNormalHeight : float;
private var lastJumpStartHeight = 0.0; // Height at which last jump began
private var touchWallJumpTime = -1.0; // Time first touched wall during jump

private var inAirVelocity = Vector3.zero;
private var lastGroundedTime = 0.0;

private var slammed = false;
private var isControllable = true;
private var isMoving = false;

/** Needed components of the game object cached on Awake. */
private var meshRenderer : SkinnedMeshRenderer;
private var characterController : CharacterController;

public var jetpackJumpHeightBoost : float = 5.0;
private var jetpackEnabled : boolean = false;
private var forceFieldController : ForceFieldController;

private var playerStatus : PlayerStatus;

function Awake ()
{
	characterController = GetComponent(CharacterController);
	meshRenderer = GetComponentInChildren(SkinnedMeshRenderer);
	moveDirection = transform.TransformDirection(Vector3.forward);
	
	playerStatus = GetComponent(PlayerStatus);
	
	var forceField = GameObject.FindGameObjectWithTag('Force Field');
	forceFieldController = forceField.GetComponent(ForceFieldController);
}

function HidePlayer()
{
	meshRenderer.enabled = false;
	isControllable = false;
}

function ShowPlayer()
{
	meshRenderer.enabled = true;
	isControllable = true;
}

function IsControllable() { return isControllable; }

private var extraJumpHeightTemp : float = 0.0;

function EnableJetpack() {
	canControlDescent = true;
	extraJumpHeightTemp = extraJumpHeight;
	extraJumpHeight = 0.0;
	jumpHeight += jetpackJumpHeightBoost;
	jetpackEnabled = true;
}

function DisableJetpack() {
	canControlDescent = false;
	extraJumpHeight = extraJumpHeightTemp;
	jumpHeight -= jetpackJumpHeightBoost;
	jetpackEnabled = false;
}

function IsJetpackEnabled() { return jetpackEnabled; }

function IsJetpackActive() { return jetpackEnabled && IsJumping(); }

function UpdateSmoothedMovementDirection ()
{		
	/** Depending on input on the Horizontal Axis, the target direction should
	    be directly down the positive (facing forward) or negative (facing
	    backwards) x-axis. By setting the rotation about the z-axis to be the
	    opposite of the player's position offset on the z-axis from the z=0
	    plane, we make it so that when the player veers off the z=0 plane he
	    rotates more and more back to it. */
	var targetDirection = Vector3.zero;
	var hAxis = Input.GetAxisRaw("Horizontal");
	if (hAxis < 0) targetDirection = Vector3(-1,0,-transform.position.z);
	else if (hAxis > 0) targetDirection = Vector3(1,0,-transform.position.z);
	
	var grounded = IsGrounded();
	var wasMoving = isMoving;
	isMoving = Mathf.Abs (hAxis) > 0.1;
	
	if(grounded || canChangeDirectionInAir) {
		/** Speed and direction stored separately so there is still a valid
		    forward direction even when the player is standing still */
		if (targetDirection != Vector3.zero)
			moveDirection = targetDirection.normalized;
		
		/** We take into account different frame rates by multiplying by the
		    time between frames */
		var curSmooth = speedSmoothing * Time.deltaTime;
		
		/** Support analog input, but ensure the player cannot walk faster
		    diagonally rather than forward. */
		var targetSpeed = Mathf.Min(targetDirection.magnitude, 1.0);
	
		/** Modify our speed based on whether we are walking, 'trotting',
		    or running. */
		if (Input.GetButton ("Fire3") && grounded)
			targetSpeed *= runSpeed;
		else if (Time.time - trotAfterSeconds > walkTimeStart)
			targetSpeed *= trotSpeed;
		else
			targetSpeed *= walkSpeed;
		
		/** Calculate our new move speed by linear interpolation, so we do not
		    have rough jumps when it changes. */
		moveSpeed = Mathf.Lerp(moveSpeed, targetSpeed, curSmooth);
		
		/** Reset the walk timer when the player slows down too much */
		if (moveSpeed < walkSpeed * 0.3)
			walkTimeStart = Time.time;
	}
	
	if (!grounded && isMoving)
		inAirVelocity += targetDirection.normalized * Time.deltaTime * inAirControlAcceleration;
}

function ApplyWallJump ()
{
	// We must actually jump against a wall for this to work
	if (!jumping) return;

	// Store when we first touched a wall during this jump
	if (collisionFlags == CollisionFlags.CollidedSides)
	{
		touchWallJumpTime = Time.time;
	}

	// The user can trigger a wall jump by hitting the button shortly before or shortly after hitting the wall the first time.
	var mayJump = lastJumpButtonTime > touchWallJumpTime - wallJumpTimeout && lastJumpButtonTime < touchWallJumpTime + wallJumpTimeout;
	if (!mayJump)
		return;
	
	// Prevent jumping too fast after each other
	if (lastJumpTime + jumpRepeatTime > Time.time)
		return;
	
		
	if (Mathf.Abs(wallJumpContactNormal.y) < 0.2)
	{
		wallJumpContactNormal.y = 0;
		moveDirection = wallJumpContactNormal.normalized;
		// Wall jump gives us at least trotspeed
		moveSpeed = Mathf.Clamp(moveSpeed * 1.5, trotSpeed, runSpeed);
	}
	else
	{
		moveSpeed = 0;
	}
	
	jumpSpeed = CalculateJumpVerticalSpeed (jumpHeight);
	DidJump();
	SendMessage("DidWallJump", null, SendMessageOptions.DontRequireReceiver);
}

function ApplyJumping ()
{
	// Prevent jumping too fast after each other
	if (lastJumpTime + jumpRepeatTime > Time.time)
		return;

	if (IsGrounded()) {
		// Jump
		// - Only when pressing the button down
		// - With a timeout so you can press the button slightly before landing		
		if (canJump && Time.time < lastJumpButtonTime + jumpTimeout) {
			jumpSpeed = CalculateJumpVerticalSpeed (jumpHeight);
			SendMessage("DidJump", SendMessageOptions.DontRequireReceiver);
		}
	}
}


function ApplyGravity ()
{
	if (isControllable)	// don't move player at all if not controllable.
	{
		// Apply gravity
		var jumpButton = Input.GetButton("Jump");
		
		// * When falling down we use controlledDescentGravity (only when holding down jump)
		var controlledDescent = canControlDescent && jumpSpeed <= 0.0 && jumpButton && jumping;
		
		// When we reach the apex of the jump we send out a message
		if (jumping && !jumpingReachedApex && jumpSpeed <= 0.0)
		{
			jumpingReachedApex = true;
			SendMessage("DidJumpReachApex", SendMessageOptions.DontRequireReceiver);
		}
	
		// * When jumping up we don't apply gravity for some time when the user is holding the jump button
		//   This gives more control over jump height by pressing the button longer
		var extraPowerJump =  IsJumping () && jumpSpeed > 0.0 && jumpButton && transform.position.y < lastJumpStartHeight + extraJumpHeight;
		
		if (controlledDescent)			
			jumpSpeed -= controlledDescentGravity * Time.deltaTime;
		else if (extraPowerJump)
			return;
		else if (IsGrounded ())
			jumpSpeed = 0.0;
		else
			jumpSpeed -= gravity * Time.deltaTime;
	}
}

function CalculateJumpVerticalSpeed (targetJumpHeight : float)
{
	// From the jump height and gravity we deduce the upwards speed 
	// for the character to reach at the apex.
	return Mathf.Sqrt(2 * targetJumpHeight * gravity);
}

function DidJump ()
{
	jumping = true;
	jumpingReachedApex = false;
	lastJumpTime = Time.time;
	lastJumpStartHeight = transform.position.y;
	touchWallJumpTime = -1;
	lastJumpButtonTime = -10;
}

function Update() {
	/** Kills all user inputs if controllable flag set false */
	if (!isControllable) Input.ResetInputAxes();
	
	/** Record the most recent jump time */
	if (Input.GetButtonDown ("Jump")) lastJumpButtonTime = Time.time;
	
	/** Update the player's direction */
	UpdateSmoothedMovementDirection();
	
	/** Apply gravity and jumping logic */
	ApplyGravity ();
	if (canWallJump)ApplyWallJump();
	ApplyJumping ();
	
	/** Vertical speed stored as seperate vector. */
	var verticalSpeed = Vector3(0, jumpSpeed, 0);
	
	/** Calculate our final movement vector and smooth it based
	    on the framerate, (time between frames) */
	var movement = moveDirection * moveSpeed + verticalSpeed + inAirVelocity;
	movement *= Time.deltaTime;
	
	/** Pass newly calculated movement data to the character controller */
	wallJumpContactNormal = Vector3.zero;
	collisionFlags = characterController.Move(movement);
	
	if (IsGrounded())
	{
		/** If we've been slammed, reset needed stats */
		if(slammed)
		{
			slammed = false;
			characterController.height = 2;
			transform.position.y += 0.75;
		}
		transform.rotation = Quaternion.LookRotation(moveDirection);
	}	
	else
	{
		/** Set the rotation of our transform */
		if(!slammed)
		{
			var xzMove = movement;
			xzMove.y = 0;
			if (xzMove.sqrMagnitude > 0.001)
			{
				transform.rotation = Quaternion.LookRotation(xzMove);
			}
		}
	}	
	
	/** Set grounded time and apply landing logic when necessary */
	if (IsGrounded())
	{
		lastGroundedTime = Time.time;
		inAirVelocity = Vector3.zero;
		if (jumping)
		{
			jumping = false;
			SendMessage("DidLand", SendMessageOptions.DontRequireReceiver);
		}
	}
	
	if (Input.GetButtonDown('Powerup')) {
		var currentPowerup : Powerup = playerStatus.GetCurrentPowerup();
		
		if (currentPowerup == Powerup.Jetpack) {
			if (!jetpackEnabled) EnableJetpack();
			else DisableJetpack();
		}
		else if (currentPowerup == Powerup.ForceField) {
			if (forceFieldController) {
				forceFieldController.SendMessage('Activate');
			}
		}
	}
}

function OnControllerColliderHit (hit : ControllerColliderHit )
{
//	Debug.DrawRay(hit.point, hit.normal);
	if (hit.moveDirection.y > 0.01) 
		return;
	wallJumpContactNormal = hit.normal;
}

function GetSpeed () {
	return moveSpeed;
}

function IsJumping () {
	return jumping && !slammed;
}

function IsGrounded () {
	return (collisionFlags & CollisionFlags.CollidedBelow) != 0;
}

function SuperJump (height : float)
{
	jumpSpeed = CalculateJumpVerticalSpeed (height);
	collisionFlags = CollisionFlags.None;
	SendMessage("DidJump", SendMessageOptions.DontRequireReceiver);
}

function SuperJump (height : float, jumpVelocity : Vector3)
{
	jumpSpeed = CalculateJumpVerticalSpeed (height);
	inAirVelocity = jumpVelocity;
	
	collisionFlags = CollisionFlags.None;
	SendMessage("DidJump", SendMessageOptions.DontRequireReceiver);
}

/** Knocks the player back in response to an external force. */
function Slam (direction : Vector3)
{
	jumpSpeed = CalculateJumpVerticalSpeed (1);
	inAirVelocity.x = direction.x * 6;
	inAirVelocity.y = direction.y * 6;
	direction.y = 1.5;
	Quaternion.LookRotation(-direction);
	characterController.height = 1.0;
	slammed = true;
	collisionFlags = CollisionFlags.None;
	SendMessage("DidJump", SendMessageOptions.DontRequireReceiver);
}

function GetDirection () {
	return moveDirection;
}

function IsMoving ()  : boolean
{
	return Mathf.Abs(Input.GetAxisRaw("Horizontal")) > 0.5;
}

function HasJumpReachedApex ()
{
	return jumpingReachedApex;
}

function IsGroundedWithTimeout ()
{
	return lastGroundedTime + groundedTimeout > Time.time;
}

/** Limits controlled descent to only jumping */
function IsControlledDescent ()
{
	return Input.GetButton("Jump") && canControlDescent && jumpSpeed <= 0.0 && jumping;
}

function Reset ()
{
	gameObject.tag = "Player";
}
// Require a character controller to be attached to the same game object
@script RequireComponent(CharacterController)
@script AddComponentMenu("Side Scroll Player/Side Scroll Controller")
