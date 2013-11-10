var Window = {
	ms_Width: 0,
	ms_Height: 0,
	ms_MiddleX: 0,
	ms_MiddleY: 0,
	ms_Callbacks: {
		37: "Window.LeftCallback()",			// Move left
		38: "Window.RotateCallback()",			// Rotate the shape
		39: "Window.RightCallback()",			// Move right
		32: "Window.FallCallback()",			// Fall on the ground
		40: "Window.DownCallback()",			// Move down
		80: "Window.PauseCallback()",			// Pause
		67: "Window.ChangeViewCallback()"		// Change viewer
	},
	
	Initialize: function()
	{
		Window.UpdateSize();
		$(document).keydown( function( inEvent ) { Window.CallAction( inEvent.keyCode ); } ) ;
		$(window).resize( function( inEvent ) {
			Window.UpdateSize();
			Window.ResizeCallback( Window.ms_Width, Window.ms_Height );
		} );
		
		$( '#ctrl-left' ).click( function( inEvent ) { Window.CallAction( 37 ); inEvent.stopPropagation(); } );
		$( '#ctrl-rotate' ).click( function( inEvent ) { Window.CallAction( 38 ); inEvent.stopPropagation(); } );
		$( '#ctrl-right' ).click( function( inEvent ) { Window.CallAction( 39 ); inEvent.stopPropagation(); } );
		$( '#ctrl-fall' ).click( function( inEvent ) { Window.CallAction( 32 ); inEvent.stopPropagation(); } );
		$( '#ctrl-down' ).click( function( inEvent ) { Window.CallAction( 40 ); inEvent.stopPropagation(); } );
		$( '#ctrl-switch' ).click( function( inEvent ) { Window.CallAction( 67 ); inEvent.stopPropagation(); } );
	},
	UpdateSize: function()
	{
		Window.ms_Width = $(window).width();
		Window.ms_Height = $(window).height() - 5;
		Window.ms_MiddleX = Window.ms_Width * 0.5;
		Window.ms_MiddleY = Window.ms_Height * 0.5;
	},
	CallAction: function( inId )
	{
		if( inId in Window.ms_Callbacks )
		{
			eval( Window.ms_Callbacks[inId] );
			return false ;
		}
	},
	
	ResizeCallback: function( inWidth, inHeight ) {},
	LeftCallback: function() {},
	RightCallback: function() {},
	RotateCallback: function() {},
	PauseCallback: function() {},
	FallCallback: function() {},
	DownCallback: function() {},
	ChangeViewCallback: function() {}
};