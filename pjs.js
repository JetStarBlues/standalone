/*
    Code by www.jk-quantized.com
    Redistribution and use of this code in source and binary forms
    must retain the above attribution notice and this condition./
*/

/*
    A reverse engineering of Processing.js's functions
    http://processingjs.org/reference/
    https://www.khanacademy.org/computer-programming/new/pjs#documentation
*/


// Graphics -----------------------------------------------

var stroke_ = true;
var fill_ = false;

var fill = function ( r, g, b ) {

	if( g === undefined )
		ctx.fillStyle = r; // assume color passed
	else
		ctx.fillStyle = color( r, g, b ); // create color

	fill_ = true;
};

var stroke = function ( r, g, b ) {

	if( g === undefined )
		ctx.strokeStyle = r; // assume color passed
	else
		ctx.strokeStyle = color( r, g, b ); // create color

	stroke_ = true;
};

var noStroke = function () {

	stroke_ = false;
};

var noFill = function () {

	fill_ = false;
};

var strokeWeight = function ( w ) {

	ctx.lineWidth = w;
};

var CORNER    = 'corner';
var CORNERS   = 'corners';
// var CENTER    = 'center';
var RADIUS    = 'radius';
var rectMode_ = CORNER;

var rectMode = function ( mode ) {

	rectMode_ = mode;
};

var rect = function ( x, y, w, h ) {

	var x = Math.floor( x );
	var y = Math.floor( y );

	ctx.beginPath();
	
	if ( rectMode_ === CORNER ) {

		ctx.rect( x, y, w, h );
	}
	else if ( rectMode_ === CORNERS ) {

		ctx.rect( x, y, w - x, h - y );
	}
	else if ( rectMode_ === CENTER ) {

		ctx.rect( x - w / 2, y - h / 2, w, h );
	}
	else if ( rectMode_ === RADIUS ) {

		ctx.rect( x - w / 2, y - h / 2, w * 2, h * 2 );
	}

	if( fill_ )   ctx.fill();
	if( stroke_ ) ctx.stroke();
};

var ellipse = function ( x, y, w, h ) {

	ctx.beginPath();
	ctx.ellipse( x, y, w, h, 0, 0, 2 * Math.PI );

	if( fill_ )   ctx.fill();
	if( stroke_ ) ctx.stroke();
};

var point = function ( x, y ) {

	ctx.beginPath();
	ctx.arc( x, y, ctx.lineWidth / 2, 0, 2 * Math.PI );

	if( stroke_ ){

		var save = ctx.fillStyle;
		ctx.fillStyle = ctx.strokeStyle;
		ctx.fill();
		ctx.fillStyle = save;
	}
};

var color = function ( r, g, b ) {

	return 'rgb(' + r + ',' + g + ',' + b + ')';
};

var text = function ( txt, x, y ) {

	ctx.fillText( txt, x, y );

	// Convoluted to support newlines ---
	/*
	t = txt.split( '\n' );

	if ( t.length == 1 ) {

		ctx.fillText( txt, x, y );
	}
	else {

		var txtHeight = parseInt( ctx.font.match( /\d+/ )[0] );

		if ( ctx.textBaseline = 'middle' ) {

			// TODO, center of bounding box
		}
		else if ( ctx.textBaseline = 'bottom' ) {

			// TODO, bottom of bounding box
		}
		else {

			ctx.fillText( t[0], x, y );

			for ( var i = 1; i < t.length; i += 1 ) {

				ctx.fillText( t[i], x, y + txtHeight * i );
			}
		}
	}
	*/
};

var textSize = function ( x ) {

	ctx.font = x + 'px ' + ctx.font.split( ' ' )[1];
};

var createFont = function ( font, size ) {

	var f;

	if ( size !== undefined ) {

		f = size + 'px' + ' ' + font;
	}
	else {

		f = ctx.font.split( ' ' )[0] + ' ' + font;
	}

	return f;
};

var textFont = function ( f, size ) {

	if ( size !== undefined ) {

		ctx.font = size + 'px ' + f.split( ' ' )[1];
	}
	else {

		ctx.font = f;
	}
};

var LEFT     = 'left';
var RIGHT    = 'right';
var TOP      = 'top';
var BOTTOM   = 'bottom';
var CENTER   = 'center';
var BASELINE = 'baseline';

var textAlign = function ( horz, vert ) {

	// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textBaseline

	if ( horz == LEFT || horz == RIGHT || horz == CENTER ) {
	
		ctx.textAlign = horz;
	}

	if ( vert == TOP || vert == BOTTOM ) {

		ctx.textBaseline = vert;
	}
	else if ( vert == CENTER ) {

		ctx.textBaseline = 'middle';
	}
	else if ( vert == BASELINE ) {

		ctx.textBaseline = 'alphabetic';
	}

};

var println = function ( thing ) {

	console.log( thing );
};


// Events -------------------------------------------------

var mouseX, mouseY;

var updateMousePos = function ( evt ) {

	//www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
	var rect = canvas.getBoundingClientRect();
	mouseX = Math.floor( evt.clientX - rect.left ),
	mouseY = Math.floor( evt.clientY - rect.top );

	// console.log( mouseX, mouseY );
};


var keyIsPressed, keyCode;
var LEFT  = 37;
var RIGHT = 39;
var UP    = 38;
var DOWN  = 40;


// Run ----------------------------------------------------

var loop_ = true

var loop = function () {

	loop_ = true;
};

var noLoop = function () {

	loop_ = false;
};

var setup_;
var draw_;


// Math ---------------------------------------------------

var random = function ( low, high ) {

	if ( high !== undefined ) {

		return Math.random() * ( high - low ) + low;
	}
	else {

		return Math.random() * low;
	}
};


// Other --------------------------------------------------

var str = function ( x ) {

	return x.toString();
};
