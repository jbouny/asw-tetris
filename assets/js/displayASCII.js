var DisplayASCII =
{
	ms_Canvas: null,
	ms_BlockSize: 11,
	ms_BlockRepeat: 2,
	ms_SupColumns: 0,
	ms_SupLines: 0,
	ms_Map: null,
	
	Id: function() { return 'ascii'; },
	
	Initialize: function( inIdCanvas )
	{
		DisplayASCII.ms_Canvas = $( '#canvas-' + DisplayASCII.Id() );
		DisplayASCII.ms_Map = new Array( Config.ms_GameHeighth );
		for ( var i = 0; i < Config.ms_GameHeight; ++i )
			DisplayASCII.ms_Map[i] = new Array( Config.ms_GameWidth );
			
	},
	Display: function()
	{
		// Fill map with fixed blocks
		for( var i = 0; i < Config.ms_GameHeight; ++i )
			for( var j = 0; j < Config.ms_GameWidth; ++j )
				DisplayASCII.ms_Map[i][j] = Game.ms_Blocks[i][j] == null ? "" : Game.ms_Blocks[i][j].m_Type;
		
		// Fill map with the movable shape
		if( Game.ms_Shape != null )
		{
			for( var i = 0; i < Game.ms_Shape.m_Blocks.length; ++i ) 
			{
				var aBlock = Game.ms_Shape.m_Blocks[i];
				DisplayASCII.ms_Map[aBlock.m_Y][aBlock.m_X] = aBlock.m_Type;
			}
		}
		
		// Create the view of this game in ASCII
		var aLines = Array( Config.ms_GameHeight ),
			aColumns = Array( Config.ms_GameWidth ),
			aCurrentLine = 0;
		for( var i = 0; i < Config.ms_GameHeight; ++i )
		{
			// Construct the current line of the game			
			var aCurrentColumn = 0;
			for( var j = 0; j < Config.ms_GameWidth; ++j )
			{
				var aRepeat = Math.round( DisplayASCII.ms_BlockRepeat + ( j < DisplayASCII.ms_SupColumns ? 1 : 0 ) );
				var aValue = DisplayASCII.ms_Map[i][j];
				aColumns[aCurrentColumn++] = ( aValue === "" )?
					Array(aRepeat+1).join("&nbsp;") :
					"<bl" + aValue + ">" + Array(aRepeat+1).join("#") + "</bl" + aValue + "/>";
			}
			aLines[aCurrentLine] = aColumns.join("");
			
			// Repeat the line a given number of times
			var aRepeat = Math.round( DisplayASCII.ms_BlockRepeat + ( i < DisplayASCII.ms_SupLines ? 1 : 0 ) );
			for( var aIter = 0; aIter < aRepeat; ++aIter )
				aLines[aCurrentLine+1] = aLines[aCurrentLine++];
		}
		// Construct the final display by joining all lines (use of join in order to optimize performance, act as a string buffer)
		DisplayASCII.ms_Canvas.html( aLines.join( "<br/>" ) );
	},
	Resize: function( inWidth, inHeight )
	{
		// Compute the number of lines and columns to correctly fill the screen
		var aNbLines = Math.floor( inHeight / DisplayASCII.ms_BlockSize );
		DisplayASCII.ms_BlockRepeat = Math.max( 1, Math.floor( aNbLines / Config.ms_GameHeight ) );
		DisplayASCII.ms_SupLines = Math.max( 0, Math.round( aNbLines - DisplayASCII.ms_BlockRepeat * Config.ms_GameHeight ) );
		DisplayASCII.ms_SupColumns = Math.round( Config.ms_GameWidth * DisplayASCII.ms_SupLines / Config.ms_GameHeight );		
		DisplayASCII.ms_Canvas.css( "width", DisplayASCII.ms_BlockSize * ( DisplayASCII.ms_BlockRepeat * Config.ms_GameWidth + DisplayASCII.ms_SupColumns ) );
		DisplayASCII.ms_Canvas.css( "height", DisplayASCII.ms_BlockSize * ( DisplayASCII.ms_BlockRepeat * Config.ms_GameHeight + DisplayASCII.ms_SupLines ) );
	}
};