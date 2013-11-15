/** 
 * @author Jérémy BOUNY / https://github.com/jbouny | http://www.jeremybouny.fr
 * @file js/display3DShader.js
 * 
 * Part of the project asw-tetris https://github.com/jbouny/asw-tetris
 * 
 * Display the tetris game in an extended 3D View.
 * This view extend the file js/display3DShader.js and add some effects like reflection and shaders.
 */

var MaterialManager3DShader =
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

var Display3DShader = Object.create( Display3D );

Display3DShader.ms_Composer = null;
Display3DShader.ms_EffectFXAA = null;
Display3DShader.ms_Mirror = null;
Display3DShader.ms_LightStrength = 60;
Display3DShader.ms_PoolBlocks = new PoolBlocks3D( MaterialManager3DShader ),

Display3DShader.Id = function() { return '3dshader'; };
Display3DShader.Title = function() { return '++3D'; };

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
	/*var aDpr = (window.devicePixelRatio !== undefined)? window.devicePixelRatio : 1;
	this.ms_EffectFXAA.uniforms[ 'resolution' ].value.set( 1 / ( Window.ms_Width * aDpr ), 1 / ( Window.ms_Height * aDpr ) );*/
	this.ms_EffectFXAA.uniforms[ 'resolution' ].value.set( 1 / Window.ms_Width, 1 / ( Window.ms_Height + 22 ) );
	this.ms_Composer.reset();
	Display3D.Resize.apply( this, [inWidth, inHeight] );
};
