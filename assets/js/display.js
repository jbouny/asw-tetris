/** 
 * @author Jérémy BOUNY / https://github.com/jbouny | http://www.jeremybouny.fr
 * @file js/display.js
 * 
 * Part of the project asw-tetris https://github.com/jbouny/asw-tetris
 * 
 * Manage all the different views of the game.
 */

var Display =
{
	ms_View: null,
	ms_IdsViewers: [],
	ms_CurrentId: 0,
	ms_Viewers: {},
	ms_InitializedViewers: [],
	ms_InitializingViewers: [],
	
	Initialize: function( inViewers )
	{
		for( var i = 0; i < inViewers.length; ++i )
			this.ms_Viewers[inViewers[i].Id()] = inViewers[i];
		
		for( var aId in this.ms_Viewers )
			this.ms_IdsViewers.push( aId );
		
		var aButtonContainer = $( '#style-selector' );
		for( var aId in this.ms_Viewers )
		{
			aButtonContainer.append( "<button id=\"select-" + aId + "\">" + this.ms_Viewers[aId].Title() + "</button>" );
			$( '#select-' + aId ).click( function() { 
				Display.Select( $( this ).attr( 'id' ).substring( 7 ) );
			} );
		}
	},
	
	InitializeView: function( inId )
	{
		// Push the view in the stack of initializing viewers
		var aIndex = this.ms_InitializingViewers.length + 1;
		this.ms_InitializingViewers[ aIndex ] = inId;
		// Start the initialization
		this.ms_Viewers[inId].Initialize();
		// Remove it from the stack of initializing and push it in the stack of initialized
		this.ms_InitializingViewers.splice( aIndex, 1 );
		this.ms_InitializedViewers.push( inId );
	},
	
	Select: function( inId )
	{
		if( this.ms_IdsViewers.indexOf( inId ) !== -1 && this.ms_InitializingViewers.indexOf( inId ) === -1 )
		{
			if( this.ms_InitializedViewers.indexOf( inId ) === -1 )
				this.InitializeView( inId );
			
			this.ms_View = this.ms_Viewers[inId];
			this.ms_CurrentId = this.ms_IdsViewers.indexOf( inId );
			Window.ResizeCallback( Window.ms_Width, Window.ms_Height );
			this.ms_View.Display();
			$( '#style-selector button' ).attr('class', '');
			$( '.viewer' ).hide();
			$( '#select-' + inId ).attr('class', 'selected');
			$( '#canvas-' + inId ).show();
		}
	},
	
	SelectNext: function()
	{
		this.Select( this.ms_IdsViewers[ ( this.ms_CurrentId + 1 ) % this.ms_IdsViewers.length ] );
	},
	
	SelectPrev: function()
	{
		this.Select( this.ms_IdsViewers[ ( this.ms_CurrentId + this.ms_IdsViewers.length - 1 ) % this.ms_IdsViewers.length ] );
	},
	
	DisplayInfos: function()
	{
		$( '#infos' ).html( 'Level: ' + Math.round( Game.ms_TotalLines / Config.ms_LinesLevel ) + ' / Score: ' + Game.ms_Score + ' / Next: ' + ShapeFactory.Next() );
	}
};