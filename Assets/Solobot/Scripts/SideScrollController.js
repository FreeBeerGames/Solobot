
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

private var jumpRepeatTime = 0.05;
private var wallJumpTimeout = 0.15;
private var jumpTimeout = 0.15;
private var groundedTimeout = 0.25;

// The current move direction in x-z
private var moveDirection = Vector3.zero;
// The current vertical speed
private var verticalSpeed = 0.0;
// The current x-z move speed
private var moveSpeed = 0.0;

// The last collision flags returned from controller.Move
private var collisionFlags : CollisionFlags; 

// Are we jumping? (Initiated with jump button and not grounded yet)
private var jumping = false;
private var jumpingReachedApex = false;

// Is the user pressing any keys?
private var isMoving = false;
// When did the user start walking (Used for going into trot after a while)
private var walkTimeStart = 0.0;
// Last time the jump button was clicked down
private var lastJumpButtonTime = -10.0;
// Last time we performed a jump
private var lastJumpTime = -1.0;
// Average normal of the last touched geometry
private var wallJumpContactNormal : Vector3;
private var wallJumpContactNormalHeight : float;

// the height we jumped from (Used to determine for how long to apply extra jump power after jumping.)
private var lastJumpStartHeight = 0.0;

// When did we touch the wall the first time during this jump (Used for wall jumping)
private var touchWallJumpTime = -1.0;

private var inAirVelocity = Vector3.zero;

private var lastGroundedTime = 0.0;

private var lean = 0.0;
private var slammed = false;

private var isControllable = true;

private var meshRenderer : SkinnedMeshRenderer;

/** Jetpack editor flag and private support variables */
private var hasJetpack : boolean = false;
public var jetpackJumpHeightBoost : float = 5.0;

function Awake ()
{
	meshRenderer = GetComponentInChildren(SkinnedMeshRenderer);
	moveDirection = transform.TransformDirection(Vector3.forward);
}

// This next function responds to the "HidePlayer" message by hiding the player. 
// The message is also 'replied to' by identically-named functions in the collision-handling scripts.
// - Used by the LevelStatus script when the level completed animation is triggered.
function HidePlayer()
{
	meshRenderer.enabled = false;
	isControllable = false;
}


// This is a complementary function to the above. We don't use it in the tutorial, but it's included for
// the sake of completeness. (I like orthogonal APIs; so sue me!)
function ShowPlayer()
{
	meshRenderer.enabled = true; // start rendering the player again.
	isControllable = true;	// allow player to control the character again.
}

function IsControllable() { return isControllable; }

private var extraJumpHeightTemp : float = 0.0;

function EnableJetpack() {
	if (!IsJetpackEnabled()) {
		hasJetpack = true;
		canControlDescent = true;
		extraJumpHeightTemp = extraJumpHeight;
		extraJumpHeight = 0.0;
		jumpHeight += jetpackJumpHeightBoost;
	}
}

function DisableJetpack() {
	if (IsJetpackEnabled()) {
		hasJetpack = false;
		canControlDescent = false;
		extraJumpHeight = extraJumpHeightTemp;
		jumpHeight -= jetpackJumpHeightBoost;
	}
}


function IsJetpackEnabled() {
	return hasJetpack;
}


function UpdateSmoothedMovementDirection ()
{
	var grounded = IsGrounded();
	var h = Input.GetAxisRaw("Horizontal");
		
	var wasMoving = isMoving;
	isMoving = Mathf.Abs (h) > 0.1;
		
	// Target direction is either positive or negative y axis in side scroller
	var targetDirection = Vector3.zero;
	if (h < 0) targetDirection = Vector3(-1,0,-transform.position.z);
	else if (h > 0) targetDirection = Vector3(1,0,-transform.position.z);
	
	if(grounded || canChangeDirectionInAir) {
		// We store speed and direction seperately,
		// so that when the character stands still we still have a valid forward direction
		// moveDirection is always normalized, and we only update it if there is user input.
		if (targetDirection != Vector3.zero)
		{
			moveDirection = targetDirection.normalized;
		}
		
		// Smooth the speed based on the current target direction
		var curSmooth = speedSmoothing * Time.deltaTime;
		
		// Choose target speed
		//* We want to support analog input but make sure you cant walk faster diagonally than just forward or sideways
		var targetSpeed = Mathf.Min(targetDirection.magnitude, 1.0);
	
		// Pick speed modifier
		if (Input.GetButton ("Fire3") && grounded)
		{
			targetSpeed *= runSpeed;
		}
		else if (Time.time - trotAfterSeconds > walkTimeStart)
		{
			targetSpeed *= trotSpeed;
		}
		else
		{
			targetSpeed *= walkSpeed;
		}
		
		moveSpeed = Mathf.Lerp(moveSpeed, targetSpeed, curSmooth);
		
		// Reset walk time start when we slow down
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
	
	verticalSpeed = CalculateJumpVerticalSpeed (jumpHeight);
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
			verticalSpeed = CalculateJumpVerticalSpeed (jumpHeight);
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
		var controlledDescent = canControlDescent && verticalSpeed <= 0.0 && jumpButton && jumping;
		
		// When we reach the apex of the jump we send out a message
		if (jumping && !jumpingReachedApex && verticalSpeed <= 0.0)
		{
			jumpingReachedApex = true;
			SendMessage("DidJumpReachApex", SendMessageOptions.DontRequireReceiver);
		}
	
		// * When jumping up we don't apply gravity for some time when the user is holding the jump button
		//   This gives more control over jump height by pressing the button longer
		var extraPowerJump =  IsJumping () && verticalSpeed > 0.0 && jumpButton && transform.position.y < lastJumpStartHeight + extraJumpHeight;
		
		if (controlledDescent)			
			verticalSpeed -= controlledDescentGravity * Time.deltaTime;
		else if (extraPowerJump)
			return;
		else if (IsGrounded ())
			verticalSpeed = 0.0;
		else
			verticalSpeed -= gravity * Time.deltaTime;
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
	
	// Apply gravity
	// - extra power jump modifies gravity
	// - controlledDescent mode modifies gravity
	ApplyGravity ();

	// Perform a wall jump logic
	// - Make sure we are jumping against wall etc.
	// - Then apply jump in the right direction)
	if (canWallJump)
		ApplyWallJump();

	/** Apply jumping logic every update based on last jump time */
	ApplyJumping ();
	
	/** Use everything to calculate our final actual movement */
	var movement = moveDirection * moveSpeed + Vector3 (0, verticalSpeed, 0) + inAirVelocity;
	movement *= Time.deltaTime;
	
	/** Pass newly calculated movement data to the character controller */
	var controller : CharacterController = GetComponent(CharacterController);
	wallJumpContactNormal = Vector3.zero;
	collisionFlags = controller.Move(movement);
	
	/** Apply slamming from enemy melees */
	if (IsGrounded())
	{
		if(slammed) // we got knocked over by an enemy. We need to reset some stuff
		{
			slammed = false;
			controller.height = 2;
			transform.position.y += 0.75;
		}
		
		transform.rotation = Quaternion.LookRotation(moveDirection);
			
	}	
	else
	{
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
	verticalSpeed = CalculateJumpVerticalSpeed (height);
	collisionFlags = CollisionFlags.None;
	SendMessage("DidJump", SendMessageOptions.DontRequireReceiver);
}

function SuperJump (height : float, jumpVelocity : Vector3)
{
	verticalSpeed = CalculateJumpVerticalSpeed (height);
	inAirVelocity = jumpVelocity;
	
	collisionFlags = CollisionFlags.None;
	SendMessage("DidJump", SendMessageOptions.DontRequireReceiver);
}

function Slam (direction : Vector3)
{
	verticalSpeed = CalculateJumpVerticalSpeed (1);
	inAirVelocity.x = direction.x * 6;
	inAirVelocity.y = direction.y * 6;
	direction.y = 1.5;
	Quaternion.LookRotation(-direction);
	var controller : CharacterController = GetComponent(CharacterController);
	controller.height = 1.0;
	slammed = true;
	collisionFlags = CollisionFlags.None;
	SendMessage("DidJump", SendMessageOptions.DontRequireReceiver);
}

function GetDirection () {
	return moveDirection;
}

function IsMoving ()  : boolean
{
	return Mathf.Abs(Input.GetAxisRaw("Vertical")) + Mathf.Abs(Input.GetAxisRaw("Horizontal")) > 0.5;
}

function HasJumpReachedApex ()
{
	return jumpingReachedApex;
}

function IsGroundedWithTimeout ()
{
	return lastGroundedTime + groundedTimeout > Time.time;
}

function IsControlledDescent ()
{
	// * When falling down we use controlledDescentGravity (only when holding down jump)
	var jumpButton = Input.GetButton("Jump");
	return canControlDescent && verticalSpeed <= 0.0 && jumpButton && jumping;
}

function Reset ()
{
	gameObject.tag = "Player";
}
// Require a character controller to be attached to the same game object
@script RequireComponent(CharacterController)
@script AddComponentMenu("Side Scroll Player/Side Scroll Controller")
