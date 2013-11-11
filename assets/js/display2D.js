/** 
 * @author Jérémy BOUNY / https://github.com/jbouny | http://www.jeremybouny.fr
 * @file js/displayASCII.js
 * 
 * Part of the project asw-tetris https://github.com/jbouny/asw-tetris
 * 
 * Display the tetris game in an 2D View.
 */

 var Display2D =
{
	ms_Canvas: null,
	ms_Context: null,
	ms_Scale: 0,
	ms_Colors: [ "#0FF", "#00F", "#F90", "#FF0", "#F00", "#C0F", "#0F0" ],
	
	Id: function() { return '2d'; },
	ConvertX: function( inX ) { return Window.ms_MiddleX - ( Config.ms_GameWidth * 0.5 - inX ) * Display2D.ms_Scale ; },
	ConvertY: function( inY ) { return inY * Display2D.ms_Scale ; },
	Initialize: function( inIdCanvas )
	{
		Display2D.ms_Canvas = document.getElementById( 'canvas-' + Display2D.Id() );
		Display2D.ms_Context = Display2D.ms_Canvas.getContext( "2d" );
		Display2D.Resize( Window.ms_Width, Window.ms_Height );
	},
	Display: function()
	{
		var aBlockSize = Display2D.ms_Scale - 1;
		
		// Draw background
		Display2D.ms_Context.clearRect( 0, 0, Window.ms_Width, Window.ms_Height );
		Display2D.ms_Context.fillStyle = "#000";
		Display2D.ms_Context.fillRect( 0, 0, Window.ms_Width, Window.ms_Height );
		Display2D.ms_Context.strokeStyle = "#555";
		Display2D.ms_Context.strokeRect( Display2D.ConvertX( 0 ), Display2D.ConvertY( 0 ), Display2D.ms_Scale * Config.ms_GameWidth, Display2D.ms_Scale * Config.ms_GameHeight );
		
		// Draw fixed blocks
		for( var i = 0; i < Config.ms_GameHeight; ++i )
		{
			for( var j = 0; j < Config.ms_GameWidth; ++j )
			{
				if( Game.ms_Blocks[i][j] != null )
				{
					Display2D.ms_Context.fillStyle = Display2D.ms_Colors[Game.ms_Blocks[i][j].m_Type];
					Display2D.ms_Context.fillRect( Display2D.ConvertX( j ), Display2D.ConvertY( i ), aBlockSize, aBlockSize ); 
				}
			}
		}
		// Draw the movable object
		if( Game.ms_Shape != null )
		{
			Display2D.ms_Context.fillStyle = Display2D.ms_Colors[Game.ms_Shape.m_Type];
			for( var i = 0; i < Game.ms_Shape.m_Blocks.length; ++i ) 
			{
				var aBlock = Game.ms_Shape.m_Blocks[i];
				Display2D.ms_Context.fillRect( Display2D.ConvertX( aBlock.m_X ), Display2D.ConvertY( aBlock.m_Y ), aBlockSize, aBlockSize ); 
			}
		}
		
		// Pause or game over
		if( Game.ms_IsEnd || Game.ms_IsPause )
		{
			var aText = Game.ms_IsEnd ? "Game Over" : "Pause";
			Display2D.ms_Context.fillStyle = "rgba(0, 0, 0, 0.5)";
			Display2D.ms_Context.fillRect( Window.ms_MiddleX - 50, Window.ms_MiddleY - 30, 100, 30 ); 
			Display2D.ms_Context.fillStyle = "#ffffff";
			Display2D.ms_Context.textAlign = 'center';
			Display2D.ms_Context.font = '12pt Calibri';
			Display2D.ms_Context.fillText( aText, Window.ms_MiddleX, Window.ms_MiddleY - 10 );
		}
	},
	Resize: function( inWidth, inHeight )
	{
		Display2D.ms_Canvas.width = inWidth;
		Display2D.ms_Canvas.height = inHeight;
		Display2D.ms_Scale = Window.ms_Height / Config.ms_GameHeight;
		Display2D.Display();
	}
};