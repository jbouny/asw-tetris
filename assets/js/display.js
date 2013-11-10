var Display =
{
	ms_View: null,
	ms_IdsViewers: [ 'ascii', '2d', '3d', '3dshader' ],
	ms_CurrentId: 0,
	ms_Viewers: {
		'ascii' : DisplayASCII,
		'2d': Display2D,
		'3d': Display3D,
		'3dshader': Display3DShader
	},
	Initialize: function()
	{
		for( var aId in Display.ms_Viewers )
		{
			$( '#select-' + aId ).click( function() { 
				Display.Select( $( this ).attr( 'id' ).substring( 7 ) );
			} );
			Display.ms_Viewers[aId].Initialize();
		}
	},
	Select: function( inId )
	{
		Display.ms_View = Display.ms_Viewers[inId];
		Display.ms_CurrentId = Display.ms_IdsViewers.indexOf( inId );
		Window.ResizeCallback( Window.ms_Width, Window.ms_Height );
		Display.ms_View.Display();
		$( '.viewer' ).hide();
		$( '#canvas-' + inId ).show();
	},
	SelectNext: function()
	{
		Display.Select( Display.ms_IdsViewers[ ( Display.ms_CurrentId + 1 ) % Display.ms_IdsViewers.length ] );
	}
};