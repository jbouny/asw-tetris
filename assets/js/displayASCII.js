/** 
 * @author Jérémy BOUNY / https://github.com/jbouny | http://www.jeremybouny.fr
 * @file js/displayASCII.js
 * 
 * Part of the project asw-tetris https://github.com/jbouny/asw-tetris
 * 
 * Display the tetris game in an ASCII View.
 */

var DisplayASCII =
{
	ms_Canvas: null,
	ms_BlockSize: 16,
	ms_NbLines: 0,
	ms_NbColumns: 0,
	
	Id: function() { return 'ascii'; },
	Title: function() { return 'ASCII'; },
	
	Initialize: function( inIdCanvas )
	{
		DisplayASCII.ms_Canvas = $( '#canvas-' + DisplayASCII.Id() );			
	},
	Display: function()
	{
		aBlocks = [];
		for( var i = 0; i < 7; ++i )
			aBlocks.push( "<bl" + i + ">#</bl" + i + ">" );
		
		// Create the view of this game in ASCII
		var aMap = new Array( Config.ms_GameHeight );
		for( var i = 0; i < Config.ms_GameHeight; ++i )
		{
			aMap[i] = new Array( Config.ms_GameWidth );
			for( var j = 0; j < Config.ms_GameWidth; ++j )
				aMap[i][j] = Game.ms_Blocks[i][j];
		}
		if( Game.ms_Shape != null )
			for( var i = 0; i < Game.ms_Shape.m_Blocks.length; ++i ) 
				aMap[Game.ms_Shape.m_Blocks[i].m_Y][Game.ms_Shape.m_Blocks[i].m_X] = Game.ms_Shape.m_Blocks[i];
		
		var aLinePause = Game.ms_IsPause? Math.round( DisplayASCII.ms_NbLines / 2 ) : -1; 
		var aLineEnd = Game.ms_IsEnd? Math.round( DisplayASCII.ms_NbLines / 2 ) : -1; 
		var aDisplay = "";
		for( var i = 0; i < DisplayASCII.ms_NbLines; ++i )
		{
			if( i == aLinePause )
				aDisplay += Array( Math.round( Math.max( DisplayASCII.ms_NbColumns / 2 - 5, 0 ) ) ).join('&nbsp;') + '## PAUSE ##';
			else if( i == aLineEnd )
				aDisplay += Array( Math.round( Math.max( DisplayASCII.ms_NbColumns / 2 - 7, 0 ) ) ).join('&nbsp;') + '## GAME OVER ##';
			else
			{
				var aY = Math.floor( Config.ms_GameHeight * i / DisplayASCII.ms_NbLines );
				for( var j = 0; j < DisplayASCII.ms_NbColumns; ++j )
				{
					var aBlock =  aMap[aY][Math.floor( Config.ms_GameWidth * j / DisplayASCII.ms_NbColumns )];
					aDisplay += ( aBlock == null )? '&nbsp;' : aBlocks[aBlock.m_Type];
				}
			}
			aDisplay += "<br/>";
		}
		DisplayASCII.ms_Canvas.html( aDisplay );
	},
	Resize: function( inWidth, inHeight )
	{
		// Compute the number of lines and columns to correctly fill the screen
		DisplayASCII.ms_NbLines = Math.floor( inHeight / DisplayASCII.ms_BlockSize );
		DisplayASCII.ms_NbColumns = Math.round( DisplayASCII.ms_NbLines * Config.ms_GameWidth / Config.ms_GameHeight );
		DisplayASCII.ms_Canvas.css( "width", DisplayASCII.ms_BlockSize * DisplayASCII.ms_NbColumns );
		DisplayASCII.ms_Canvas.css( "height", DisplayASCII.ms_BlockSize * DisplayASCII.ms_NbLines );
	}
};