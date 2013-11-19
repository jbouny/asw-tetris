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
	Title: function() { return '2D'; },
	ConvertX: function( inX ) { return Window.ms_MiddleX - ( Config.ms_GameWidth * 0.5 - inX ) * this.ms_Scale  },
	Initialize: function( inIdCanvas )
	{
		this.ms_Canvas = document.getElementById( 'canvas-' + this.Id() );
		this.ms_Context = this.ms_Canvas.getContext( "2d" );
		this.Resize( Window.ms_Width, Window.ms_Height );
	},
	Display: function()
	{
		var aBlockSize = this.ms_Scale - 1;
		
		// Draw background
		this.ms_Context.clearRect( 0, 0, Window.ms_Width, Window.ms_Height );
		this.ms_Context.fillStyle = "#000";
		this.ms_Context.fillRect( 0, 0, Window.ms_Width, Window.ms_Height );
		this.ms_Context.strokeStyle = "#555";
		this.ms_Context.strokeRect( Window.ms_MiddleX - Config.ms_GameWidth * 0.5 * this.ms_Scale, 0, this.ms_Scale * Config.ms_GameWidth, this.ms_Scale * Config.ms_GameHeight );
		
		// Draw fixed blocks
		for( var i = 0; i < Config.ms_GameHeight; ++i )
		{
			for( var j = 0; j < Config.ms_GameWidth; ++j )
			{
				if( Game.ms_Blocks[i][j] != null )
				{
					this.ms_Context.fillStyle = this.ms_Colors[Game.ms_Blocks[i][j].m_Type];
					this.ms_Context.fillRect( this.ConvertX( j ), i * this.ms_Scale, aBlockSize, aBlockSize ); 
				}
			}
		}
		// Draw the movable object
		if( Game.ms_Shape != null )
		{
			this.ms_Context.fillStyle = this.ms_Colors[Game.ms_Shape.m_Type];
			for( var i = 0; i < Game.ms_Shape.m_Blocks.length; ++i ) 
			{
				var aBlock = Game.ms_Shape.m_Blocks[i];
				this.ms_Context.fillRect( this.ConvertX( aBlock.m_X ), aBlock.m_Y * this.ms_Scale , aBlockSize, aBlockSize ); 
			}
		}
		
		// Pause or game over
		if( Game.ms_IsEnd || Game.ms_IsPause )
		{
			var aText = Game.ms_IsEnd ? "Game Over" : "Pause";
			this.ms_Context.fillStyle = "rgba(0, 0, 0, 0.5)";
			this.ms_Context.fillRect( Window.ms_MiddleX - 50, Window.ms_MiddleY - 30, 100, 30 ); 
			this.ms_Context.fillStyle = "#ffffff";
			this.ms_Context.textAlign = 'center';
			this.ms_Context.font = '12pt Calibri';
			this.ms_Context.fillText( aText, Window.ms_MiddleX, Window.ms_MiddleY - 10 );
		}
	},
	Resize: function( inWidth, inHeight )
	{
		this.ms_Canvas.width = inWidth;
		this.ms_Canvas.height = inHeight;
		this.ms_Scale = Window.ms_Height / Config.ms_GameHeight;
		this.Display();
	}
};