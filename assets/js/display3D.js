var Blocks3D =
{
	ms_Materials: [
		new THREE.MeshPhongMaterial( { color: 0x00ffff} ), // 0
		new THREE.MeshPhongMaterial( { color: 0x0000ff} ), // 1
		new THREE.MeshPhongMaterial( { color: 0xff9900} ), // 2
		new THREE.MeshPhongMaterial( { color: 0xffff00} ), // 3
		new THREE.MeshPhongMaterial( { color: 0xff0000} ), // 4
		new THREE.MeshPhongMaterial( { color: 0xcc00ff} ), // 5
		new THREE.MeshPhongMaterial( { color: 0x00ff00} ), // 6
		new THREE.MeshLambertMaterial( { color: 0x555555} ), // 7
	],
	Mat: function( inType ) { return Blocks3D.ms_Materials[ inType ]; }
}

var Display3D =
{
	ms_Canvas: null,
	ms_Renderer: null,
	ms_Camera: null, 
	ms_Scene: null, 
	ms_Composer: null,
	ms_CubeGeometry: null,
	ms_EffectFXAA: null,
	
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
		Display3D.ms_Canvas = $( '#canvas-' + Display3D.Id() );
		Display3D.ms_CubeGeometry = new THREE.CubeGeometry( 0.9, 0.9, 0.9 );
		
		// Initialize Renderer, Camera and Scene
		Display3D.ms_Renderer = Display3D.Detector? new THREE.WebGLRenderer( { antialias : true } ) : new THREE.CanvasRenderer();
		Display3D.ms_Canvas.html( Display3D.ms_Renderer.domElement );
		Display3D.ms_Camera = new THREE.PerspectiveCamera( 70.0, Window.ms_Width / Window.ms_Height, 0.01, 10000 );
		Display3D.ms_Camera.position.set( 0, Config.ms_GameHeight / 4, Config.ms_GameHeight * 0.64 );
		Display3D.ms_Camera.lookAt( new THREE.Vector3( 0, Config.ms_GameHeight * 0.43, 0 ) );
		Display3D.ms_Scene = new THREE.Scene() ;
	
		// Add light
		/*Display3D.ms_Renderer.shadowMapEnabled = true;
		Display3D.ms_Renderer.shadowMapSoft = true;
		Display3D.ms_Renderer.shadowCameraNear = 3;
		Display3D.ms_Renderer.shadowCameraFar = Display3D.ms_Camera.far;
		Display3D.ms_Renderer.shadowCameraFov = 50;
		Display3D.ms_Renderer.shadowMapBias = 0.0039;
		Display3D.ms_Renderer.shadowMapDarkness = 0.5;
		Display3D.ms_Renderer.shadowMapWidth = 1024;
		Display3D.ms_Renderer.shadowMapHeight = 1024;*/
		
		//var aLight = new THREE.PointLight(0xff5555);
		var aLight = new THREE.PointLight(0xffff55);
		aLight.position.set(5,4,5);
		Display3D.ms_Scene.add( aLight );	
		
		//aLight = new THREE.PointLight(0x55ff55);
		aLight = new THREE.PointLight(0x55ffff);
		aLight.position.set(-5,4,5);
		Display3D.ms_Scene.add( aLight );	
		
		//aLight = new THREE.PointLight(0x5555ff);
		aLight = new THREE.PointLight(0xff55ff);
		aLight.position.set(0,0,5);
		Display3D.ms_Scene.add( aLight );
		
		/*var light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.x = 10;
		light.position.y = 10;
		light.position.z = 10;
		light.castShadow = true;
		Display3D.ms_Scene.add(light);*/
		
		// Contour of the game
		var aLines = new THREE.Geometry();
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( Config.ms_GameWidth / 2, 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		Display3D.ms_Scene.add( new THREE.Line( aLines, new THREE.LineBasicMaterial( { color: 0x555555 } ) ) );
		
		// Background plane
		/*var aPlane = new THREE.Mesh( new THREE.PlaneGeometry( Config.ms_GameWidth, Config.ms_GameHeight ), Blocks3D.Mat( 7 ) );
		aPlane.overdraw = true;
		aPlane.position.set( 0, Config.ms_GameHeight / 2 + 0.5, -0.51 );
		aPlane.receiveShadow = true;
		Display3D.ms_Scene.add( aPlane );*/
		
		// Create the post-effect system, then add a FXAA Shader
		// This shader permits to add force antialiasing
		var aRenderModel = new THREE.RenderPass( Display3D.ms_Scene, Display3D.ms_Camera );
		Display3D.ms_EffectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
		var aDpr = (window.devicePixelRatio !== undefined)? window.devicePixelRatio : 1;
		Display3D.ms_EffectFXAA.uniforms[ 'resolution' ].value.set( 1 / ( Window.ms_Width * aDpr ), 1 / ( Window.ms_Height * aDpr ) );
		Display3D.ms_EffectFXAA.renderToScreen = true;
		Display3D.ms_Composer = new THREE.EffectComposer( Display3D.ms_Renderer );
        Display3D.ms_Composer.addPass( aRenderModel );
		Display3D.ms_Composer.addPass( Display3D.ms_EffectFXAA );	
	},
	
	CreateBlock: function( inBlock )
	{
		var aCube = new THREE.Mesh( Display3D.ms_CubeGeometry, Blocks3D.Mat( inBlock.m_Type ) );
		aCube.position.set( Math.round( inBlock.m_X ) - Config.ms_GameWidth / 2 + 0.5, Config.ms_GameHeight - Math.round( inBlock.m_Y ), 0 );
		//aCube.castShadow = true;
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
		Display3D.ms_Composer.render();
		//Display3D.ms_Renderer.render( Display3D.ms_Scene, Display3D.ms_Camera );
		Display3D.ms_Scene.remove( aGroup );
		
	},
	Resize: function( inWidth, inHeight )
	{
		var aDpr = (window.devicePixelRatio !== undefined)? window.devicePixelRatio : 1;
		Display3D.ms_EffectFXAA.uniforms[ 'resolution' ].value.set( 1 / ( Window.ms_Width * aDpr ), 1 / ( Window.ms_Height * aDpr ) );
		Display3D.ms_Camera.aspect =  inWidth / inHeight;
		Display3D.ms_Camera.updateProjectionMatrix();
		Display3D.ms_Composer.reset();
		Display3D.ms_Renderer.setSize( Window.ms_Width, Window.ms_Height );
		Display3D.ms_Canvas.html( Display3D.ms_Renderer.domElement );
		Display3D.Display();
	}
};

