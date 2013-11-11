/** 
 * @author Jérémy BOUNY / https://github.com/jbouny | http://www.jeremybouny.fr
 * @file js/display3DShader.js
 * 
 * Part of the project asw-tetris https://github.com/jbouny/asw-tetris
 * 
 * Display the tetris game in an extended 3D View.
 * This view extend the file js/display3DShader.js and add some effects like reflection and shaders.
 */

var Display3DShader = Object.create( Display3D );

Display3DShader.ms_Composer = null;
Display3DShader.ms_EffectFXAA = null;
Display3DShader.ms_Mirror = null;
Display3DShader.ms_LightStrength = 52;

Display3DShader.Blocks3D  =
{
	ms_Materials: [],
	ms_Colors: [ 0x00ffff, 0x0033ff, 0xff9900, 0xffff00, 0xff0000, 0xcc00ff, 0x33ff00, 0x555555 ],
	Mat: function( inType ) { return this.ms_Materials[ inType ]; },
	Initialize: function()
	{
		var aNormalMap = THREE.ImageUtils.loadTexture('assets/img/cube_normal.jpg');
		for( var i in this.ms_Colors )
			this.ms_Materials.push( new THREE.MeshPhongMaterial( { normalMap: aNormalMap, color: this.ms_Colors[i] } ) );
	}
};

Display3DShader.Id = function() { return '3dshader'; };

Display3DShader.Initialize = function()
{
	Display3D.Initialize.apply( this, [] );
	
	// Add mirror
	this.ms_Mirror = new THREE.Mirror( this.ms_Renderer, this.ms_Camera, { clipBias: 0.003, textureWidth: Window.ms_Width, textureHeight: Window.ms_Height, color: 0x161616 } );
	var aPlane = new THREE.Mesh( new THREE.PlaneGeometry( Config.ms_GameWidth, Config.ms_GameHeight ), this.ms_Mirror.material );
	aPlane.add( this.ms_Mirror );
	aPlane.position.set( 0, Config.ms_GameHeight / 2 + 0.5, -0.75 );
	this.ms_Scene.add( aPlane );
	
	// Create FXAA Shader, wich permits to force antialiasing
	this.ms_EffectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
	var aDpr = (window.devicePixelRatio !== undefined)? window.devicePixelRatio : 1;
	this.ms_EffectFXAA.uniforms[ 'resolution' ].value.set( 1 / ( Window.ms_Width * aDpr ), 1 / ( Window.ms_Height * aDpr ) );
	
	// Create bloom in order to create glow effet
	var aBloomFactor = 1, aBloomStrength = 0.70;
	var aEffectBloom = new THREE.BloomPass( aBloomStrength, aBloomFactor * 25.0, aBloomFactor * 4.0, 512 );
	
	// Create the post-effect system
	var aEffectCopy = new THREE.ShaderPass( THREE.CopyShader );
	aEffectCopy.renderToScreen = true;		
	var aRenderModel = new THREE.RenderPass( this.ms_Scene, this.ms_Camera );
	
	// Create the rendering pass
	this.ms_Composer = new THREE.EffectComposer( this.ms_Renderer );
	this.ms_Composer.addPass( aRenderModel );
	this.ms_Composer.addPass( this.ms_EffectFXAA );
	this.ms_Composer.addPass( aEffectBloom );
	this.ms_Composer.addPass( aEffectCopy );
};
	
Display3DShader.Display = function()
{
	Display3D.Display.apply( this, [] );
};
	
Display3DShader.Render = function()
{
	this.ms_Renderer.clear();
	this.ms_Renderer.autoClear  = false;
	this.ms_Mirror.render();
	this.ms_Composer.render();
};

Display3DShader.Resize = function( inWidth, inHeight )
{
	var aDpr = (window.devicePixelRatio !== undefined)? window.devicePixelRatio : 1;
	this.ms_EffectFXAA.uniforms[ 'resolution' ].value.set( 1 / ( Window.ms_Width * aDpr ), 1 / ( Window.ms_Height * aDpr ) );
	this.ms_Composer.reset();
	Display3D.Resize.apply( this, [inWidth, inHeight] );
};

var Display3DShaderOld =
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
		Mat: function( inType ) { return this.ms_Materials[ inType ]; },
		Initialize: function()
		{
			var aColors = [ 0x00ffff, 0x0000ff, 0xff9900, 0xffff00, 0xff0000, 0xcc00ff, 0x00ff00, 0x555555 ];
			var aNormalMap = THREE.ImageUtils.loadTexture('assets/img/cube_normal.jpg');
			for( var i in aColors )
				this.ms_Materials.push( new THREE.MeshPhongMaterial( { normalMap: aNormalMap, color: aColors[i] } ) );
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
		this.Blocks3D.Initialize();
		this.ms_Canvas = $( '#canvas-' + this.Id() );
		this.ms_CubeGeometry = new THREE.CubeGeometry( 0.92, 0.92, 0.92 );
		
		// Initialize Renderer, Camera and Scene
		this.ms_Renderer = this.Detector? new THREE.WebGLRenderer( { antialias : true } ) : new THREE.CanvasRenderer();
		this.ms_Canvas.html( this.ms_Renderer.domElement );
		this.ms_Camera = new THREE.PerspectiveCamera( 70.0, Window.ms_Width / Window.ms_Height, 0.01, 10000 );
		this.ms_Camera.position.set( 0, Config.ms_GameHeight / 4, Config.ms_GameHeight * 0.64 );
		this.ms_Camera.lookAt( new THREE.Vector3( 0, Config.ms_GameHeight * 0.43, 0 ) );
		this.ms_Scene = new THREE.Scene() ;
	
		// Add light
		/*this.ms_Renderer.shadowMapEnabled = true;
		this.ms_Renderer.shadowMapSoft = true;
		this.ms_Renderer.shadowCameraNear = 3;
		this.ms_Renderer.shadowCameraFar = this.ms_Camera.far;
		this.ms_Renderer.shadowCameraFov = 50;
		this.ms_Renderer.shadowMapBias = 0.0039;
		this.ms_Renderer.shadowMapDarkness = 0.5;
		this.ms_Renderer.shadowMapWidth = 1024;
		this.ms_Renderer.shadowMapHeight = 1024;*/
		
		var aLight = new THREE.PointLight( 0x999922, 1, 70 );
		aLight.position.set( 15, 4, 4 );
		this.ms_Scene.add( aLight );	
		
		aLight = new THREE.PointLight( 0x229999, 1, 70 );
		aLight.position.set( -15, 4, 4);
		this.ms_Scene.add( aLight );	
		
		aLight = new THREE.PointLight( 0xffffff, 1, 70 );
		aLight.position.set( 10, 30, 10 );
		this.ms_Scene.add( aLight );
		
		aLight = new THREE.PointLight( 0x992299, 1, 70 );
		aLight.position.set( 15, -10, 4 );
		this.ms_Scene.add( aLight );
		
		/*var light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.x = 10;
		light.position.y = 10;
		light.position.z = 10;
		light.castShadow = true;
		this.ms_Scene.add(light);*/
		
		// Contour of the game
		var aLines = new THREE.Geometry();
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( Config.ms_GameWidth / 2, 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		this.ms_Scene.add( new THREE.Line( aLines, new THREE.LineBasicMaterial( { color: 0x555555 } ) ) );
		
	
		// Add mirror
		this.ms_Mirror = new THREE.Mirror( this.ms_Renderer, this.ms_Camera, { clipBias: 0.003, textureWidth: Window.ms_Width, textureHeight: Window.ms_Height, color: 0x161616 } );
		var aPlane = new THREE.Mesh( new THREE.PlaneGeometry( Config.ms_GameWidth, Config.ms_GameHeight ), this.ms_Mirror.material );
		aPlane.add( this.ms_Mirror );
		aPlane.position.set( 0, Config.ms_GameHeight / 2 + 0.5, -0.75 );
		this.ms_Scene.add( aPlane );
		
		//var aPlane = new THREE.Mesh( new THREE.PlaneGeometry( Config.ms_GameWidth, Config.ms_GameHeight ), Blocks3D.Mat( 7 ) );
		// Background plane
		/*aPlane.overdraw = true;
		aPlane.position.set( 0, Config.ms_GameHeight / 2 + 0.5, -0.51 );
		aPlane.receiveShadow = true;
		this.ms_Scene.add( aPlane );*/
		
		// Create FXAA Shader
		// This shader permits to add force antialiasing
		this.ms_EffectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
		var aDpr = (window.devicePixelRatio !== undefined)? window.devicePixelRatio : 1;
		this.ms_EffectFXAA.uniforms[ 'resolution' ].value.set( 1 / ( Window.ms_Width * aDpr ), 1 / ( Window.ms_Height * aDpr ) );
		//this.ms_EffectFXAA.renderToScreen = true;
		
		// Create bloom in order to create glow effet
		var aBloomFactor = 0.5, aBloomStrength = 0.8;
		var aEffectBloom = new THREE.BloomPass( aBloomStrength, aBloomFactor * 25.0, aBloomFactor * 4.0, 512 );
		//var aEffectBloom = new THREE.BloomPass( 5, 25, 4 , 256);
		
		var aEffectCopy = new THREE.ShaderPass( THREE.CopyShader );
		aEffectCopy.renderToScreen = true;
		
		//var aEffectScreen = new THREE.ShaderPass( THREE.ShaderExtras[ "screen" ] );
		//aEffectScreen.renderToScreen = true;					
		
		// Create the post-effect system
		var aRenderModel = new THREE.RenderPass( this.ms_Scene, this.ms_Camera );
		
		this.ms_Composer = new THREE.EffectComposer( this.ms_Renderer );
        this.ms_Composer.addPass( aRenderModel );
		this.ms_Composer.addPass( this.ms_EffectFXAA );
		this.ms_Composer.addPass( aEffectBloom );
		this.ms_Composer.addPass( aEffectCopy );
		//this.ms_Composer.addPass( aEffectScreen );


	},
	
	CreateBlock: function( inBlock )
	{
		var aCube = new THREE.Mesh( this.ms_CubeGeometry, this.Blocks3D.Mat( inBlock.m_Type ) );
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
				aGroup.add( this.CreateBlock( Game.ms_Shape.m_Blocks[i] ) );
		
		// Create fixed blocks
		for( var i = 0; i < Config.ms_GameHeight; ++i )
			for( var j = 0; j < Config.ms_GameWidth; ++j )
				if( Game.ms_Blocks[i][j] != null )
					aGroup.add( this.CreateBlock( Game.ms_Blocks[i][j] ) );
		
		// Render the group of object, then remove it
		this.ms_Scene.add( aGroup );
		
		this.ms_Renderer.clear();
		this.ms_Renderer.autoClear  = false;

		this.ms_Mirror.render();
		this.ms_Composer.render();
		//this.ms_Renderer.render( this.ms_Scene, this.ms_Camera );
		this.ms_Scene.remove( aGroup );
		
	},
	Resize: function( inWidth, inHeight )
	{
		var aDpr = (window.devicePixelRatio !== undefined)? window.devicePixelRatio : 1;
		this.ms_EffectFXAA.uniforms[ 'resolution' ].value.set( 1 / ( Window.ms_Width * aDpr ), 1 / ( Window.ms_Height * aDpr ) );
		this.ms_Camera.aspect =  inWidth / inHeight;
		this.ms_Camera.updateProjectionMatrix();
		this.ms_Composer.reset();
		this.ms_Renderer.setSize( Window.ms_Width, Window.ms_Height );
		this.ms_Canvas.html( this.ms_Renderer.domElement );
		this.Display();
	}
};

