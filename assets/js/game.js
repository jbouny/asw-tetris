/** 
 * @author Jérémy BOUNY / https://github.com/jbouny | http://www.jeremybouny.fr
 * @file js/game.js
 * 
 * Part of the project asw-tetris https://github.com/jbouny/asw-tetris
 * 
 * Contains all the game core and game objects.
 */

/**
 * Represents a unique block that compose shapes.
 */
function Block( inX, inY, inType )
{
	this.m_Type = inType;
	this.m_X = inX;
	this.m_Y = inY;
};
Block.prototype.RotateAround = function( inCenterX, inCenterY, inAngle )
{
	// Translate point back to origin
	this.m_X -= inCenterX;
	this.m_Y -= inCenterY;

	// Rotate point and translate point back
	var aNewX = ( this.m_X * Math.cos( inAngle ) - this.m_Y * Math.sin( inAngle ) ) + inCenterX;
	var aNewY = ( this.m_X * Math.sin( inAngle ) + this.m_Y * Math.cos( inAngle ) ) + inCenterY;
	this.m_X = Math.round( aNewX );
	this.m_Y = Math.round( aNewY );
};

/**
 * A shape is an object movable by the user when he control it.
 * It is composed of blocks.
 */
function Shape( inCenterX, inCenterY, inBlocks, inType )
{
	this.m_CenterX = inCenterX;
	this.m_CenterY = inCenterY;
	this.m_Blocks = inBlocks;
	this.m_Type = inType;
}
Shape.prototype.Rotate = function( inAngle )
{
	for( var i = 0; i < this.m_Blocks.length; ++i ) 
		this.m_Blocks[i].RotateAround( this.m_CenterX, this.m_CenterY, inAngle );
};
Shape.prototype.CanTranslate = function( inX, inY, inBlocks )
{
	for( var i = 0; i < this.m_Blocks.length; ++i ) 
	{
		var aNewX = Math.round( this.m_Blocks[i].m_X + inX );
		var aNewY = Math.round( this.m_Blocks[i].m_Y + inY );
		
		if( aNewY >= Config.ms_GameHeight || inBlocks[aNewY][aNewX] != null
			|| aNewX < 0 || aNewX >= Config.ms_GameWidth )
			return false;
	}
	return true;
};
Shape.prototype.HasConflict = function( inBlocks )
{
	return !this.CanTranslate( 0, 0, inBlocks );
}
Shape.prototype.Translate = function( inX, inY )
{
	this.m_CenterX += inX;
	this.m_CenterY += inY;
	for( var i = 0; i < this.m_Blocks.length; ++i ) 
	{
		this.m_Blocks[i].m_X = Math.round( this.m_Blocks[i].m_X + inX );
		this.m_Blocks[i].m_Y = Math.round( this.m_Blocks[i].m_Y + inY );
	}
};
Shape.prototype.TryTranslate = function( inX, inY, inBlocks )
{
	if( this.CanTranslate( inX, inY, inBlocks ) )
	{
		this.Translate( inX, inY );
		return true;
	}
	return false;
};
Shape.prototype.Update = function( inBlocks )
{
	return !this.TryTranslate( 0, 1, inBlocks );
};
/**
 * The factory provides an easy way to create instances of tetris shapes.
 */
var ShapeFactory =
{
	Type: { I : 0, J : 1, L : 2, O : 3, Z : 4, T : 5, S : 6 },
	ms_Shapes: { 
		0: [ [ 0, 1, 0 ], [ 0, 1, 0 ], [ 0, 1, 0 ], [ 0, 1, 0 ] ],
		1: [ [ 0, 1, 0 ], [ 0, 1, 0 ], [ 1, 1, 0 ], [ 0, 0, 0 ] ],
		2: [ [ 0, 1, 0 ], [ 0, 1, 0 ], [ 0, 1, 1 ], [ 0, 0, 0 ] ],
		3: [ [ 1, 1, 0 ], [ 1, 1, 0 ], [ 0, 0, 0 ], [ 0, 0, 0 ] ],
		4: [ [ 1, 1, 0 ], [ 0, 1, 1 ], [ 0, 0, 0 ], [ 0, 0, 0 ] ],
		5: [ [ 0, 1, 0 ], [ 1, 1, 1 ], [ 0, 0, 0 ], [ 0, 0, 0 ] ],
		6: [ [ 0, 1, 1 ], [ 1, 1, 0 ], [ 0, 0, 0 ], [ 0, 0, 0 ] ]
	},
	CreateShape: function( inType )
	{
		var aBlocks = ShapeFactory.ms_Shapes[inType];
		var aBlocksShape = new Array();
		
		var aMinX = Number.MAX_VALUE;
			aMaxX = Number.MIN_VALUE;
			aMinY = Number.MAX_VALUE;
			aMaxY = Number.MIN_VALUE;
		
		for( var i = 0; i < 4; ++i )
		{
			for( var j = 0; j < 3; ++j )
			{
				if( aBlocks[i][j] == 1 )
				{
					var aX = Math.round( Config.ms_GameWidth * 0.5 - 1 + j ); 
					var aY = i; 
					
					aMinX = Math.min( aMinX, aX );
					aMaxX = Math.max( aMaxX, aX );
					aMinY = Math.min( aMinY, aY );
					aMaxY = Math.max( aMaxY, aY );
					
					aBlocksShape.push( new Block( aX, aY, inType ) );
				}
			}
		}
		
		return new Shape( Math.round( ( aMinX + aMaxX ) * 0.5 ), Math.round( ( aMinY + aMaxY ) * 0.5 ), aBlocksShape, inType );
	},
	RandomShape: function()
	{
		return ShapeFactory.CreateShape( Math.floor( Math.random() * 7 ) );
	}
};

/**
 * Game core
 */
var Game = {
	ms_Shape: null,
	ms_Blocks: null,
	ms_IsEnd: false,
	ms_IsPause: false,
	
	Initialize: function()
	{
		// Get an alea shape at the beginning
		Game.ms_Shape = ShapeFactory.RandomShape();
		
		// Initialize game board
		Game.ms_Blocks = new Array( Config.ms_GameHeight );
		for( var i = 0; i < Config.ms_GameHeight; ++i )
			Game.ms_Blocks[i] = new Array( Config.ms_GameWidth );
	},
	
	Update: function()
	{
		// If the game is not in pause or ended or if there is a shape, update the game
		if( ! Game.ms_IsPause && ! Game.ms_IsEnd && Game.ms_Shape != null && Game.ms_Shape.Update( Game.ms_Blocks ) )
		{
			// If the current shape is stopped, create a new shape
			var aShape = Game.ms_Shape;
			Game.ms_Shape = ShapeFactory.RandomShape();
			for( var i = 0; i < aShape.m_Blocks.length; ++i ) 
			{
				var aBlock = aShape.m_Blocks[i];
				Game.ms_Blocks[Math.round( aBlock.m_Y )][Math.round( aBlock.m_X )] = aBlock	;
			}
			// Check game over
			if( Game.ms_Shape.HasConflict( Game.ms_Blocks ) )
				Game.ms_IsEnd = true;
			else
				Game.CheckLines();
		}
	},
	
	Rotate: function()
	{
		if( Game.ms_IsPause || Game.ms_IsEnd )
			return;
		Game.ms_Shape.Rotate( Math.PI / 2 );
		if( Game.ms_Shape.HasConflict( Game.ms_Blocks ) )
			Game.ms_Shape.Rotate( - Math.PI / 2 );
	},
	
	Fall: function()
	{
		if( Game.ms_IsPause || Game.ms_IsEnd )
			return;
		while( Game.ms_Shape.TryTranslate( 0, 1, Game.ms_Blocks ) );
		Game.Update();
	},
	
	TranslateShape: function( inX, inY )
	{
		if( Game.ms_IsPause || Game.ms_IsEnd )
			return;
		Game.ms_Shape.TryTranslate( inX, inY, Game.ms_Blocks );
	},
	
	Left: function() { Game.TranslateShape( -1, 0 ); },
	Right: function() { Game.TranslateShape( 1, 0 ); },
	Down: function() { Game.TranslateShape( 0, 1 ); },
	
	RemoveLine: function( inId )
	{
		for( var i = inId; i >= 1; --i )
		{
			for( var j = 0; j < Config.ms_GameWidth; ++j )
			{
				Game.ms_Blocks[i][j] = Game.ms_Blocks[i-1][j];
				if( Game.ms_Blocks[i][j] != null )
					Game.ms_Blocks[i][j].m_Y++;
			}
		}
	},
	
	CheckLines: function()
	{
		var aLine = Config.ms_GameHeight - 1;
		while( aLine >= 0 )
		{
			var aRemove = true;
			for( var j = 0; j < Config.ms_GameWidth; ++j )
			{
				if( Game.ms_Blocks[aLine][j] == null )
				{
					aRemove = false;
					aLine--;
					break;
				}
			}
			
			if( aRemove )
				Game.RemoveLine( aLine );
		}
	},
	
	Pause: function() 
	{ 
		Game.ms_IsPause = ! Game.ms_IsPause; 
		if( !Game.ms_IsPause )
			this.Update();
	}
};