var Display3DShader =
{
	ms_Canvas: null,
	ms_Renderer: null,
	ms_Camera: null, 
	ms_Scene: null, 
	ms_Composer: null,
	ms_CubeGeometry: null,
	ms_EffectFXAA: null,
	ms_Mirror: null,
	Blocks3D: {
		ms_Materials: [],
		Mat: function( inType ) { return Display3DShader.Blocks3D.ms_Materials[ inType ]; },
		Initialize: function()
		{
			var aColors = [ 0x00ffff, 0x0000ff, 0xff9900, 0xffff00, 0xff0000, 0xcc00ff, 0x00ff00, 0x555555 ];
			var aNormalMap = THREE.ImageUtils.loadTexture('assets/img/cube_normal.jpg');
			for( var i in aColors )
				Display3DShader.Blocks3D.ms_Materials.push( new THREE.MeshPhongMaterial( { normalMap: aNormalMap, color: aColors[i] } ) );
		}
	},
	
	Id: function() { return '3dshader'; },
	
	Detector: ( function() {
        try { 
			var aCanvas = document.createElement( 'canvas' ); 
			return !! window.WebGLRenderingContext && ( aCanvas.getContext( 'webgl' ) || aCanvas.getContext( 'experimental-webgl' ) ); 
		} 
		catch( e ) { return false; } 
	} )(),
	
	Initialize: function( inIdCanvas )
	{
		Display3DShader.Blocks3D.Initialize();
		Display3DShader.ms_Canvas = $( '#canvas-' + Display3DShader.Id() );
		Display3DShader.ms_CubeGeometry = new THREE.CubeGeometry( 0.92, 0.92, 0.92 );
		
		// Initialize Renderer, Camera and Scene
		Display3DShader.ms_Renderer = Display3DShader.Detector? new THREE.WebGLRenderer( { antialias : true } ) : new THREE.CanvasRenderer();
		Display3DShader.ms_Canvas.html( Display3DShader.ms_Renderer.domElement );
		Display3DShader.ms_Camera = new THREE.PerspectiveCamera( 70.0, Window.ms_Width / Window.ms_Height, 0.01, 10000 );
		Display3DShader.ms_Camera.position.set( 0, Config.ms_GameHeight / 4, Config.ms_GameHeight * 0.64 );
		Display3DShader.ms_Camera.lookAt( new THREE.Vector3( 0, Config.ms_GameHeight * 0.43, 0 ) );
		Display3DShader.ms_Scene = new THREE.Scene() ;
	
		// Add light
		/*Display3DShader.ms_Renderer.shadowMapEnabled = true;
		Display3DShader.ms_Renderer.shadowMapSoft = true;
		Display3DShader.ms_Renderer.shadowCameraNear = 3;
		Display3DShader.ms_Renderer.shadowCameraFar = Display3DShader.ms_Camera.far;
		Display3DShader.ms_Renderer.shadowCameraFov = 50;
		Display3DShader.ms_Renderer.shadowMapBias = 0.0039;
		Display3DShader.ms_Renderer.shadowMapDarkness = 0.5;
		Display3DShader.ms_Renderer.shadowMapWidth = 1024;
		Display3DShader.ms_Renderer.shadowMapHeight = 1024;*/
		
		var aLight = new THREE.PointLight( 0x999922, 1, 70 );
		aLight.position.set( 15, 4, 4 );
		Display3DShader.ms_Scene.add( aLight );	
		
		aLight = new THREE.PointLight( 0x229999, 1, 70 );
		aLight.position.set( -15, 4, 4);
		Display3DShader.ms_Scene.add( aLight );	
		
		aLight = new THREE.PointLight( 0xffffff, 1, 70 );
		aLight.position.set( 10, 30, 10 );
		Display3DShader.ms_Scene.add( aLight );
		
		aLight = new THREE.PointLight( 0x992299, 1, 70 );
		aLight.position.set( 15, -10, 4 );
		Display3DShader.ms_Scene.add( aLight );
		
		/*var light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.x = 10;
		light.position.y = 10;
		light.position.z = 10;
		light.castShadow = true;
		Display3DShader.ms_Scene.add(light);*/
		
		// Contour of the game
		var aLines = new THREE.Geometry();
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( Config.ms_GameWidth / 2, 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		Display3DShader.ms_Scene.add( new THREE.Line( aLines, new THREE.LineBasicMaterial( { color: 0x555555 } ) ) );
		
	
		// Add mirror
		Display3DShader.ms_Mirror = new THREE.Mirror( Display3DShader.ms_Renderer, Display3DShader.ms_Camera, { clipBias: 0.003, textureWidth: Window.ms_Width, textureHeight: Window.ms_Height, color: 0x161616 } );
		var aPlane = new THREE.Mesh( new THREE.PlaneGeometry( Config.ms_GameWidth, Config.ms_GameHeight ), Display3DShader.ms_Mirror.material );
		aPlane.add( Display3DShader.ms_Mirror );
		aPlane.position.set( 0, Config.ms_GameHeight / 2 + 0.5, -0.75 );
		Display3DShader.ms_Scene.add( aPlane );
		
		//var aPlane = new THREE.Mesh( new THREE.PlaneGeometry( Config.ms_GameWidth, Config.ms_GameHeight ), Blocks3D.Mat( 7 ) );
		// Background plane
		/*aPlane.overdraw = true;
		aPlane.position.set( 0, Config.ms_GameHeight / 2 + 0.5, -0.51 );
		aPlane.receiveShadow = true;
		Display3DShader.ms_Scene.add( aPlane );*/
		
		// Create FXAA Shader
		// This shader permits to add force antialiasing
		Display3DShader.ms_EffectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
		var aDpr = (window.devicePixelRatio !== undefined)? window.devicePixelRatio : 1;
		Display3DShader.ms_EffectFXAA.uniforms[ 'resolution' ].value.set( 1 / ( Window.ms_Width * aDpr ), 1 / ( Window.ms_Height * aDpr ) );
		//Display3DShader.ms_EffectFXAA.renderToScreen = true;
		
		// Create bloom in order to create glow effet
		var aBloomFactor = 0.5, aBloomStrength = 0.8;
		var aEffectBloom = new THREE.BloomPass( aBloomStrength, aBloomFactor * 25.0, aBloomFactor * 4.0, 512 );
		//var aEffectBloom = new THREE.BloomPass( 5, 25, 4 , 256);
		
		var aEffectCopy = new THREE.ShaderPass( THREE.CopyShader );
		aEffectCopy.renderToScreen = true;
		
		//var aEffectScreen = new THREE.ShaderPass( THREE.ShaderExtras[ "screen" ] );
		//aEffectScreen.renderToScreen = true;					
		
		// Create the post-effect system
		var aRenderModel = new THREE.RenderPass( Display3DShader.ms_Scene, Display3DShader.ms_Camera );
		
		Display3DShader.ms_Composer = new THREE.EffectComposer( Display3DShader.ms_Renderer );
        Display3DShader.ms_Composer.addPass( aRenderModel );
		Display3DShader.ms_Composer.addPass( Display3DShader.ms_EffectFXAA );
		Display3DShader.ms_Composer.addPass( aEffectBloom );
		Display3DShader.ms_Composer.addPass( aEffectCopy );
		//Display3DShader.ms_Composer.addPass( aEffectScreen );


	},
	
	CreateBlock: function( inBlock )
	{
		var aCube = new THREE.Mesh( Display3DShader.ms_CubeGeometry, Display3DShader.Blocks3D.Mat( inBlock.m_Type ) );
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
				aGroup.add( Display3DShader.CreateBlock( Game.ms_Shape.m_Blocks[i] ) );
		
		// Create fixed blocks
		for( var i = 0; i < Config.ms_GameHeight; ++i )
			for( var j = 0; j < Config.ms_GameWidth; ++j )
				if( Game.ms_Blocks[i][j] != null )
					aGroup.add( Display3DShader.CreateBlock( Game.ms_Blocks[i][j] ) );
		
		// Render the group of object, then remove it
		Display3DShader.ms_Scene.add( aGroup );
		
		Display3DShader.ms_Renderer.clear();
		Display3DShader.ms_Renderer.autoClear  = false;

		Display3DShader.ms_Mirror.render();
		Display3DShader.ms_Composer.render();
		//Display3DShader.ms_Renderer.render( Display3DShader.ms_Scene, Display3DShader.ms_Camera );
		Display3DShader.ms_Scene.remove( aGroup );
		
	},
	Resize: function( inWidth, inHeight )
	{
		var aDpr = (window.devicePixelRatio !== undefined)? window.devicePixelRatio : 1;
		Display3DShader.ms_EffectFXAA.uniforms[ 'resolution' ].value.set( 1 / ( Window.ms_Width * aDpr ), 1 / ( Window.ms_Height * aDpr ) );
		Display3DShader.ms_Camera.aspect =  inWidth / inHeight;
		Display3DShader.ms_Camera.updateProjectionMatrix();
		Display3DShader.ms_Composer.reset();
		Display3DShader.ms_Renderer.setSize( Window.ms_Width, Window.ms_Height );
		Display3DShader.ms_Canvas.html( Display3DShader.ms_Renderer.domElement );
		Display3DShader.Display();
	}
};

