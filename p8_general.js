/*
    Code by www.jk-quantized.com
    Redistribution and use of this code in source and binary forms
    must retain the above attribution notice and this condition./
*/

/*
    A reverse engineering of PICO 8's functions
    https://www.lexaloffle.com/pico-8.php?page=manual
*/


// --------------------------------------------------

var del = function ( list, item ) {
    
    var idx = list.indexOf( item );
    
    if ( idx > - 1 ) {
        
        list.splice( idx, 1 );
    }
};

var sgn = function ( n ) { 
    
    if ( n >= 0 ) { return 1; }
    else { return -1; }
};

var btn = function ( n ) {
    
    // var bf = Array.new( 6 ).fill( '0' );
    
    if ( keyIsPressed ) {
        
        if ( n === 0 ) {
            
            return keyCode === LEFT;
        }
        else if ( n === 1 ) {
            
            return keyCode === RIGHT;
        }
        else if ( n === 2 ) {
            
            return keyCode === UP;
        }
        else if ( n === 3 ) {
            
            return keyCode === DOWN;
        }
        else if ( n === 4 ) {
            
            // return key.code === 122;  // z
            return keyCode === 90;  // z
        }
        else if ( n === 5 ) {
            
            // return key.code === 120;  // x
            return keyCode === 88;  // x
        }
        
        return true;  // other key pressed
    }
    
    return false;

    /*
        // https://www.lexaloffle.com/pico-8.php?page=manual
        If no parameters supplied, returns a bitfield of all 12 button states for player 0 & 1
            P0: bits 0..5  P1: bits 8..13
    */
};

var btnp = function ( n ) {

    // http://pico-8.wikia.com/wiki/Btnp
    return btn( n );  // is this good enough?

    /*
        // https://www.lexaloffle.com/pico-8.php?page=manual
        Same as btn() but only true when the button was not pressed the last frame
        btnp() also returns true every 4 frames after the button is held for 15 frames.
        Useful for things like 'press a button to continue' or menu item movement.
    */
};
