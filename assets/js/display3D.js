var Display3D =
{
	ms_Canvas: null,
	ms_Renderer: null,
	ms_Camera: null, 
	ms_Scene: null, 
	ms_CubeGeometry: null,
	Blocks3D: {
		ms_Materials: [],
		Mat: function( inType ) { return Display3D.Blocks3D.ms_Materials[ inType ]; },
		Initialize: function()
		{
			var aColors = [ 0x00ffff, 0x0000ff, 0xff9900, 0xffff00, 0xff0000, 0xcc00ff, 0x00ff00, 0x555555 ];
			for( var i in aColors )
				Display3D.Blocks3D.ms_Materials.push( new THREE.MeshPhongMaterial( { color: aColors[i] } ) );
		}
	},
	
	Id: function() { return '3d'; },
	
	Detector: ( function() {
        try { 
			var aCanvas = document.createElement( 'canvas' ); 
			return !! window.WebGLRenderingContext && ( aCanvas.getContext( 'webgl' ) || aCanvas.getContext( 'experimental-webgl' ) ); 
		} 
		catch( e ) { return false; } 
	} )(),
	
	Initialize: function( inIdCanvas )
	{
		Display3D.Blocks3D.Initialize();
		Display3D.ms_Canvas = $( '#canvas-' + Display3D.Id() );
		Display3D.ms_CubeGeometry = new THREE.CubeGeometry( 0.92, 0.92, 0.92 );
		
		// Initialize Renderer, Camera and Scene
		Display3D.ms_Renderer = Display3D.Detector? new THREE.WebGLRenderer( { antialias : true } ) : new THREE.CanvasRenderer();
		Display3D.ms_Canvas.html( Display3D.ms_Renderer.domElement );
		Display3D.ms_Camera = new THREE.PerspectiveCamera( 70.0, Window.ms_Width / Window.ms_Height, 0.01, 10000 );
		Display3D.ms_Camera.position.set( 0, Config.ms_GameHeight / 4, Config.ms_GameHeight * 0.64 );
		Display3D.ms_Camera.lookAt( new THREE.Vector3( 0, Config.ms_GameHeight * 0.43, 0 ) );
		Display3D.ms_Scene = new THREE.Scene() ;
	
		// Add light
		
		var aLight = new THREE.PointLight( 0x999922, 1, 100 );
		aLight.position.set( 15, 4, 4 );
		Display3D.ms_Scene.add( aLight );	
		
		aLight = new THREE.PointLight( 0x229999, 1, 100 );
		aLight.position.set( -15, 4, 4 );
		Display3D.ms_Scene.add( aLight );	
		
		aLight = new THREE.PointLight( 0xffffff, 1, 100 );
		aLight.position.set( 10, 30, 10 );
		Display3D.ms_Scene.add( aLight );
		
		aLight = new THREE.PointLight( 0x992299, 1, 100 );
		aLight.position.set( 15, -10, 4 );
		Display3D.ms_Scene.add( aLight );
		
		// Contour of the game
		var aLines = new THREE.Geometry();
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( Config.ms_GameWidth / 2, 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		Display3D.ms_Scene.add( new THREE.Line( aLines, new THREE.LineBasicMaterial( { color: 0x555555 } ) ) );
	},
	
	CreateBlock: function( inBlock )
	{
		var aCube = new THREE.Mesh( Display3D.ms_CubeGeometry, Display3D.Blocks3D.Mat( inBlock.m_Type ) );
		aCube.position.set( Math.round( inBlock.m_X ) - Config.ms_GameWidth / 2 + 0.5, Config.ms_GameHeight - Math.round( inBlock.m_Y ), 0 );
		return aCube;
	},
	
	Display: function()
	{
		var aGroup = new THREE.Object3D();
		
		// Create the movable object
		if( Game.ms_Shape != null )
			for( var i = 0; i < Game.ms_Shape.m_Blocks.length; ++i ) 
				aGroup.add( Display3D.CreateBlock( Game.ms_Shape.m_Blocks[i] ) );
		
		// Create fixed blocks
		for( var i = 0; i < Config.ms_GameHeight; ++i )
			for( var j = 0; j < Config.ms_GameWidth; ++j )
				if( Game.ms_Blocks[i][j] != null )
					aGroup.add( Display3D.CreateBlock( Game.ms_Blocks[i][j] ) );
		
		// Render the group of object, then remove it
		Display3D.ms_Scene.add( aGroup );
		Display3D.ms_Renderer.render( Display3D.ms_Scene, Display3D.ms_Camera );
		Display3D.ms_Scene.remove( aGroup );
		
	},
	Resize: function( inWidth, inHeight )
	{
		Display3D.ms_Camera.aspect =  inWidth / inHeight;
		Display3D.ms_Camera.updateProjectionMatrix();
		Display3D.ms_Renderer.setSize( Window.ms_Width, Window.ms_Height );
		Display3D.ms_Canvas.html( Display3D.ms_Renderer.domElement );
		Display3D.Display();
	}
};

