# P3 Minimum Target Writeup

## Progress in Unity

We have learned a great deal about the Unity Editor during our project. We
started our development process by studying the Third Person Tutorial project
that is downloadable from the Unity Asset Store for free. This project contains
a sample player character model that we have used as a stand in until we are
able to develop a more suitable replacement. Our lack of an artist has been
somewhat of a hinderance. We started by identifying major scripts that
controlled the behavior of the Third Person Demo.

#### Third Person Scripts of Interest--

- **ThirdPersonController**
 - This script is attached to your third person player and controls the player
   object based on user input. This is where the majority of your players
   behavior is handled. Since the tutorial was third person and we were
   interested in creating a side scroller, we used this as a guide, but we
   stripped out a lot of the behavior and locked the player to the XY plane.
   This script controls the player object, but does not interact with the
   Camera at all. We called our new script SideScrollController based on
   this script.

- **ThirdPersonPlayerAnimation**
 - This script controls the player object's current animation based on data
   from the ThirdPersonController. We created a `SideScrollPlayerAnimation` 
   script that calls the animations provided with the sample character that
   are provided with the tutorial project.

- **Camera Scripts**
 - There were several camera scripts included in sample project, showing how
   to do a orbit camera based on mouse input, a smooth follow camera, and a
   spring follow camera. All of these were suitable for a Third Person game
   but we needed something different for a side-scroller. We were able to
   write a simple script using the scripting language. We use public
   variables accessible within the editor in order to change the camera's
   distance from the player, as well as the x and y offset. For now our
   camera's `Update()` method simply follows the x and y position of the
   players `tranform` component.
   
At this point we were able to get basic side scroller functionality.