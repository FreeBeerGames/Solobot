# Final Solobot TODO

 * Copper robot enemy should stop playing sound or it should fade out if the
   player jumps over and does not kill the enemy before passing it up and
   continuing on the level. This is probably a change that needs to be made in
   `EnemyController.js` or to the Audio component of the `Copper` prefab.

 * There needs to be a pause menu added for in-game use. This pause menu should
   preferably actually pause the game, but this is not needed. At the minimal
   there needs to be a button which allows the user to get back to the main
   menu in order to quit the game. If a pop up menu is implemented it should
   have both an option to return to the main menu or completely quit the game.
   Currently both the `space` and the `return` key are mapped to the Unity
   `Jump` input, this is so that we can listen for the `Jump` input on the
   main menu for selection. Using `Jump` allows us to support game pad input as
   well as keyboard and mouse on the main menu.