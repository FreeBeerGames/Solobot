# Interim Report

## State of the Game

The current state of our game has reached our goals for layer 1. We have a working prototype game with a player character that can move around a simple level and perform basic actions like jumping and attacking. The player currently interacts properly with the environment and collides with geometry.  The controls the user can utilize to interact with the game are easily changeable and will be merged with our current design for controls very soon. The Unity engine has provided a lot of help for us in several aspects of the game. The built in PhysX engine that Unity includes has been working very well for us and has made the character interactions with the world a lot easier than we had originally planned. The art assets have been more difficult than we originally thought, because getting everything to look fluid has been very difficult. Our current prototype is still using built in assets to keep everything working.


## Power-Ups

- **Static Field**
	- This power will allow the player to project an electromagnetic field
	  surrounding them that can hurt or stun enemies. Movement will be
	  limited during use.
- **Energy Deflector**
	- Allows the player to use an energy shield that projects 
	  itself around the player and absorbs or deflects energy projectiles. 
	  Movement will be limited during use. If timed correctly, a deflection 
	  will occur.
- **Overload**
	- Allows the player to select and focus on a close enemy and overload
	  their power supply, causing a small explosion.
- **Power Jump**
	- Allows the player to jump much higher than normal. Requires charging.
	
## Enemy Types

- **Spiked Spinner**
	- Enemy that spins like a cap covered with spikes and tries to cut the
	  player.
	- Stats:
		- **Armor:** Medium
		- **Attack:** Medium
		- **Speed:** Medium
- **Stationary Turret**
	- Enemy that spins like a cap covered with spikes and tries to cut the
	  player.
	- Stats:
		- **Armor:** Low
		- **Attack:** High
		- **Speed:** N/A
- **Hoverbots**
	- Floating support enemy that hovers near its allies and provides them
	  with energy shields. Cannot attack on their own.
	- Stats:
		- **Armor:** High
		- **Attack:** None
		- **Speed:** High
