/** 
 * @author Jérémy BOUNY / https://github.com/jbouny | http://www.jeremybouny.fr
 * @file js/display3D.js
 * 
 * Part of the project asw-tetris https://github.com/jbouny/asw-tetris
 * 
 * Display the tetris game in a simple 3D View.
 */
 
var Display3D =
{
	ms_Canvas: null,
	ms_Renderer: null,
	ms_Camera: null, 
	ms_Scene: null, 
	ms_CubeGeometry: null,
	ms_Texts: null,
	ms_LightStrength: 100,
	Blocks3D: {
		ms_Materials: [],
		ms_Colors: [ 0x00ffff, 0x0000ff, 0xff9900, 0xffff00, 0xff0000, 0xcc00ff, 0x00ff00, 0x555555 ],
		Mat: function( inType ) { return this.ms_Materials[ inType ]; },
		Initialize: function()
		{
			for( var i in this.ms_Colors )
				this.ms_Materials.push( new THREE.MeshPhongMaterial( { color: this.ms_Colors[i] } ) );
		}
	},
	
	Id: function() { return '3d'; },
	
	Enable: ( function() {
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
		this.ms_Renderer = this.Enable? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
		this.ms_Canvas.html( this.ms_Renderer.domElement );
		this.ms_Camera = new THREE.PerspectiveCamera( 70.0, Window.ms_Width / Window.ms_Height, 0.01, 10000 );
		this.ms_Camera.position.set( 0, Config.ms_GameHeight / 4, Config.ms_GameHeight * 0.64 );
		this.ms_Camera.lookAt( new THREE.Vector3( 0, Config.ms_GameHeight * 0.43, 0 ) );
		this.ms_Scene = new THREE.Scene() ;
	
		// Add light
		this.ms_Scene.add( this.CreatePointLight( 0xffff55, 15, 4, 4 ) );
		this.ms_Scene.add( this.CreatePointLight( 0x55ffff, -15, 4, 4 ) );
		this.ms_Scene.add( this.CreatePointLight( 0xff55ff, 15, -10, 4 ) );
		this.ms_Scene.add( this.CreatePointLight( 0xffffff, 10, 30, 10 ) );
		
		// Contour of the game
		var aLines = new THREE.Geometry();
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( Config.ms_GameWidth / 2, 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, 0.5, -0.5 ) );
		aLines.vertices.push( new THREE.Vector3( - Config.ms_GameWidth / 2, Config.ms_GameHeight + 0.5, -0.5 ) );
		this.ms_Scene.add( new THREE.Line( aLines, new THREE.LineBasicMaterial( { color: 0x555555 } ) ) );
		
		// Generate texts
		var aTextValues = [ "Game Over", "Pause" ];
		var aMaterials = new THREE.MeshFaceMaterial( [ new THREE.MeshBasicMaterial( { color: 0xcccccc } ), new THREE.MeshBasicMaterial( { color: 0x333333 } ) ] );
		this.ms_Texts = {};
		for( var i in aTextValues )
		{
			var aTextGeometry = new THREE.TextGeometry( aTextValues[i], { size: 0.5, height: 0.1, curveSegments: 2, font: "helvetiker", weight: "normal", style: "normal", bevelEnabled: false, material: 0, extrudeMaterial: 1 } );
			var aTextMesh = new THREE.Mesh( aTextGeometry, aMaterials );
			aTextGeometry.computeBoundingBox();
			aTextMesh.position.set( -0.5 * aTextGeometry.boundingBox.max.x - aTextGeometry.boundingBox.min.x, Config.ms_GameHeight * 0.4, 2 );
			this.ms_Texts[aTextValues[i]] = aTextMesh;
		}
	},
	
	CreatePointLight: function( inColor, inX, inY, inZ )
	{
		var aLight = new THREE.PointLight( inColor, 1, this.ms_LightStrength );
		aLight.position.set( inX, inY, inZ );
		return aLight;
	},
	
	CreateBlock: function( inBlock )
	{
		var aCube = new THREE.Mesh( this.ms_CubeGeometry, this.Blocks3D.Mat( inBlock.m_Type ) );
		aCube.position.set( Math.round( inBlock.m_X ) - Config.ms_GameWidth / 2 + 0.5, Config.ms_GameHeight - Math.round( inBlock.m_Y ), 0 );
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
		
		// Pause or game over
		if( Game.ms_IsEnd || Game.ms_IsPause )
			aGroup.add( this.ms_Texts[Game.ms_IsEnd ? "Game Over" : "Pause"] );
		
		// Render the group of object, then remove it
		this.ms_Scene.add( aGroup );
		this.Render();
		this.ms_Scene.remove( aGroup );
	},
	
	Render: function()
	{
		this.ms_Renderer.render( this.ms_Scene, this.ms_Camera );
	},
	
	Resize: function( inWidth, inHeight )
	{
		this.ms_Camera.aspect =  inWidth / inHeight;
		this.ms_Camera.updateProjectionMatrix();
		this.ms_Renderer.setSize( Window.ms_Width, Window.ms_Height );
		this.ms_Canvas.html( this.ms_Renderer.domElement );
		this.Display();
	}
};

