# Solobot - P3 Minimum Target

## Progress in Unity

We have learned a great deal about the Unity Editor during our project. We
started our development process by studying the Third Person Tutorial project
that is downloadable from the Unity Asset Store for free. This project contains
a sample player character model that we have used as a stand in until we are
able to develop a more suitable replacement. Our lack of an artist has been
somewhat of a hinderance. We started by identifying major scripts that
controlled the behavior of the Third Person Demo.

#### Basic Scripting (Scripts of Interest from Third Person Demo Project)--

* **ThirdPersonController**
 - This script is attached to your third person player and controls the player
   object based on user input. 
 - This is where the majority of your players behavior is handled. Since the 
   tutorial was third person and we were interested in creating a side 
   scroller, we used this as a guide, but we stripped out a lot of the
   behavior and locked the player to the XY plane.
 - This script controls the player object, but does not interact with the
   Camera at all. We called our new script SideScrollController based on
   this script.

   
* **ThirdPersonPlayerAnimation**
 - This script controls the player object's current animation based on data
   from the ThirdPersonController. 
 - We created a `SideScrollPlayerAnimation` script that calls the animations
   provided with the sample character that are provided with the tutorial 
   project.

* **Camera Scripts**
 - There were several camera scripts included in sample project, showing how
   to do a orbit camera based on mouse input, a smooth follow camera, and a
   spring follow camera. 
 - All of these were suitable for a Third Person game but we needed something
   different for a side-scroller. We were able to write a simple script using
   the scripting language. 
 - We use public variables accessible within the editor in order to change 
   the camera's distance from the player, as well as the x and y offset. For
   now our camera's `Update()` method simply follows the x and y position 
   of the players `tranform` component.

#### Basic Demo
   
At this point we were able to get basic side scroller functionality. Here is a
[**video screen capture**][1] showing a demo featuring basic side scroller 
functionality after we completed the above programming based on the Third
Person platformer tutorial included with Unity.

#### Additional Scripts--

- **ThirdPersonCharacterAttack**
 - This script is called `ThirdPersonCharacterAttack`, but it does not have
   anything to do with the fact that the game is ThirdPerson, we were able
   to use this as a guide to creating our our `SideScrollCharacterAttack`
   script. 
 - This script is set as a component of the player object and works
   by monitoring input and the Character Controller component within its
   `Update()` method calls. 
 - It also finds objects with the tag 'Enemy' and sends attack messages
   to them so that damage can be dealt and the appropriate actions can be
   taken. Simple enough.
 - This currently only handles a Melee attack, so we are going to have to
   develop either another script to handle our shooting functionality our
   add on to our script we created here.
   
- **ThirdPersonStatus**
 - This script once again has nothing to do really with the fact that this
   sample project is a third person example. 
 - This script simply keeps up with the players state, we used it as a 
   guide to create our own script that would keep up with our player's 
   current state in our side scroller game.

## Project Team Roles

We have a few various roles, but we have all generally contributed to the
project.

- **Cory Gross** - Documentation, Website, Source Control, Programmer
- **Dillon Daugherty** - Design, Sketches, Programmer
- **Jack Satriano** - Story, Programmer
- **Carter Micahels** - Story, Characters, Programmer
- **Joshua Kane** - Documentation, Story, Programmer
- **William Wallace** - Sound, Programmer

As we are lacking anyone with formal skills in 3D modelings or as an
artist, most of our progress has been technical, in scripting and
functionality, rather than in original content.

## Adding Enemies

The sample project we were studying also came with one sample enemy
and some scripts that controlled it. It also controlled the animations.
From this script we were able to create an `EnemyController` script
which is the basis for the script which will control the AI of our
enemies.

Here is a [**video screen capture**][2] showing a demo of how the
script interacting with our player script. They work by sending
messages back and forth, dealing damage to one another. You can
see the hit spheres for each of them in yellow in the video. The
enemy there had 3 hit points, we had a 6 hits points originally.
Because these variables are able to be changed dynamically in the
editor I was able to give myself more hit points while debugging
the game.

<iframe width="560" height="315" src="http://www.youtube.com/embed/FwJaNEnJowA" frameborder="0" allowfullscreen></iframe>
   
[1]: http://youtu.be/Nxl_eDH15NA
[2]: http://youtu.be/FwJaNEnJowA