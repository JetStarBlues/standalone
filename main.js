/*
    Code by www.jk-quantized.com
    Redistribution and use of this code in source and binary forms
    must retain the above attribution notice and this condition./
*/

var width = 384
var height = 384;

var canvas, ctx;

document.addEventListener( 'DOMContentLoaded', function () {


	// Setup Canvas ------------------------------------------------------

	canvas = document.getElementById( 'program_canvas' );
	canvas.width = width;
	canvas.height = height;
	canvas.tabIndex = '1';  // stackoverflow.com/a/12887221

	ctx = canvas.getContext( '2d' );

	canvas.addEventListener( 'click', function ( evt ) {

		updateMousePos( evt );
	});

	canvas.addEventListener( 'keydown', function ( evt ) {

		keyCode = evt.keyCode;

		keyIsPressed = true;
	});

	canvas.addEventListener( 'keyup', function ( evt ) {

		keyCode = null;

		keyIsPressed = false;
	});


	// Setup P8 ----------------------------------------------------------

	initP8Font();


	// KA Program --------------------------------------------------------

	setup_();  // invasive, =/

	window.requestAnimationFrame( draw_ );


	// -------------------------------------------------------------------
});
