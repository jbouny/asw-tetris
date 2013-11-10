function MainLoop()
{
	setTimeout( "MainLoop()", 500 );
	Game.Update();
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
		alert( 'HTML5 Audio is not supported by your browser!' );
}

$( function() {
	
	// Initialization of game configuration, window management (user actions), game and viewer selector
	Config.Initialize();
	Window.Initialize();
	Game.Initialize();
	Display.Initialize();
	
	// Initialize the Wrapping that permits to link the user, the game and the current viewer
	Window.RotateCallback = function() { Game.Rotate(); Display.ms_View.Display(); }
	Window.LeftCallback = function() { Game.Left(); Display.ms_View.Display(); }
	Window.RightCallback = function() { Game.Right(); Display.ms_View.Display(); }
	Window.FallCallback = function() { Game.Fall(); Display.ms_View.Display(); }
	Window.DownCallback = function() { Game.Down(); Display.ms_View.Display(); }
	Window.ResizeCallback = function( inWidth, inHeight ) { Display.ms_View.Resize( inWidth, inHeight ); } 
	Window.ChangeViewCallback = function() { Display.SelectNext(); }
	
	Display.Select( '3d' );
	
	// Start the game
	setTimeout( "MainLoop()", 500 );
	Play( 'assets/mp3/tetris.mp3' );
} );