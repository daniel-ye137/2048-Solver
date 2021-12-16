# 2048
A small clone of [1024](https://play.google.com/store/apps/details?id=com.veewo.a1024), based on [Saming's 2048](http://saming.fr/p/2048/) (also a clone).

Made just for fun. [Play it here!](http://gabrielecirulli.github.io/2048/)

The official app can also be found on the [Play Store](https://play.google.com/store/apps/details?id=com.gabrielecirulli.app2048) and [App Store!](https://itunes.apple.com/us/app/2048-by-gabriele-cirulli/id868076805)

### My Contributions
The majority of my changes were done in solver.js, where I tested out different heuristic and game-playing algorithms. I also did some work on the UI in index.html and main.css to reflect AI game-playing capabilities. I also made changes to grid.js to add logic for mutating game boards without actually updating the real game state so that the game-tree search algorithms could examine different states behind the scenes. Lastly, I made some changes to game_manager.js in order to create an option to allow the AI to play on its own. Methods/blocks of code in files that were not created by me are labeled with my netID dzy3.

To run locally, simply open index.html in your web browser of choice. 
