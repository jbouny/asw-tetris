/** 
 * @author Jérémy BOUNY / https://github.com/jbouny | http://www.jeremybouny.fr
 * @file js/main.js
 * 
 * Part of the project asw-tetris https://github.com/jbouny/asw-tetris
 * 
 * Main file that provide the start of the game.
 * Initialize all other files and start them.
 */
 
function MainLoop()
{
	setTimeout( "MainLoop()", Game.GetTimeout() );
	Game.Update();
	if( Display.ms_View != null )
		Display.ms_View.Display();
}

function Play( inSound ) 
{
	if( window.HTMLAudioElement )
	{
		var aSound = new Audio('');

		if( aSound.canPlayType( 'audio/mp3' ) )
		{
			var aSound = new Audio( inSound );
			aSound.play();
			aSound.addEventListener( 'ended', function() {
				this.currentTime = 0;
				this.play();
			}, false );
		}
	}
	else
		consol.log( 'HTML5 Audio is not supported by your browser.' );
}

$( function() {
	var aViewers = [ DisplayASCII, Display2D, Display3D ];
	if( Display3D.Enable )
		aViewers.push( Display3DShader );
	
	// Initialization of game configuration, window management (user actions), game and viewer selector
	Window.Initialize();
	Game.Initialize();
	Display.Initialize( aViewers );
	
	// Initialize the Wrapping that permits to link the user, the game and the current viewer
	Window.RotateCallback = function() { Game.Rotate(); Display.ms_View.Display(); };
	Window.LeftCallback = function() { Game.Left(); Display.ms_View.Display(); };
	Window.RightCallback = function() { Game.Right(); Display.ms_View.Display(); };
	Window.FallCallback = function() { Game.Fall(); Display.ms_View.Display(); };
	Window.DownCallback = function() { Game.Down(); Display.ms_View.Display(); };
	Window.ResizeCallback = function( inWidth, inHeight ) { Display.ms_View.Resize( inWidth, inHeight ); } ;
	Window.NextViewCallback = function() { Display.SelectNext(); };
	Window.PrevViewCallback = function() { Display.SelectPrev(); };
	Window.PauseCallback = function() { Game.Pause(); Display.ms_View.Display(); };
	Window.ReloadCallback = function() { Game.Reload(); Display.ms_View.Display(); };
	
	Display.Select( '2d' );
	
	// Start the game
	setTimeout( "MainLoop()", Game.GetTimeout() );
	Play( 'assets/mp3/tetris.mp3' );
} );