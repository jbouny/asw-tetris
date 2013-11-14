asw-tetris : A Scalable Web Tetris
==========

This project offer a way to explore possibilities of current web technology with a the visualization of a simple Tetris game.

### Demo
http://www.jeremybouny.fr/tetris/

### Features

- Tetris game
- Full cross plateform game (in browser)
- Use of specific inputs
  - Mouse / Keyboard and buttons on PC
  - Gestures and buttons on smartphone
- Different viewers for a unique game
- Dynamic selection of the viewer
- A single web page

### Web technologies

Some viewers permit to viualize the game :

- ASCII Viewer : A simple way to display informations with characters.
- 2D canvas Viewer : The basic mode with simple blocks in 2D. Use of the canvas introduced with HTML5.
- 3D Viewer : Use of others stuff introduced with HTML5 : WebGL. The viewer is based on the library three.js in order to simplify it.
- Advanced 3D Viewer : This view extend the simple 3D viewer and add use of shaders and some others elements.

Others viewers will be surely developed as SVG Viewer, CSS Viewer, CSS3 Viewer and others.


### Cross plateform

/!\ This part is to complete in order to check the compatibility

- Windows : Seems to work on all relative recents browsers
  - Chrome [OK]
  - Firefox [OK]
  - Internet explorer [OK]
  - ?
  
- Mac : Seems to work on all relative recents browsers
  - Safari [OK]
  - Opera [OK]
  - ?
  
- IOS
  - ?

- Android : Seems to work on recents browsers
  - Chrome [OK]
  - Firefox [OK]
  - ?
  - 

### Libraries

The application is based on :

- JQuery 1.10.2 : Provide simple dom selector, events and callbacks (https://github.com/jquery/jquery)
- Hammer.JS v1.0.6dev (11/05/13) : Provide complete gesture recognition and abstraction of input (touch, mouse) (https://github.com/EightMedia/hammer.js/tree/v1.0.5)
- jQuery plugin for Hammer.JS v1.0.0 : Use of Hammer events based on JQuery selector (https://github.com/EightMedia/jquery.hammer.js)
- three.js r62 : Complete 3D library based on WebGL (https://github.com/mrdoob/three.js/)
