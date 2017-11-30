/*
    This is a JavaScript port of the Adafruit GFX Library
    https://github.com/adafruit/Adafruit-GFX-Library/blob/master/Adafruit_GFX.cpp

    The original code is Copyright (c) 2013 Adafruit Industries.
*/


// Ada GFX Functions --------------------------------

var strokeCircle = function ( x0, y0, r ) {
    
    var f, ddF_x, ddF_y, x, y;
    
    var a, b, c, d, e, g, h, i;
    
    f = 1 - r;
    ddF_x = 1;
    ddF_y = - 2 * r;
    x = 0;
    y = r;
    
    drawPixel( x0, y0 + r );
    drawPixel( x0, y0 - r );
    drawPixel( x0 + r, y0 );
    drawPixel( x0 - r, y0 );
    
    while ( x < y ) {
        
        if ( f >= 0 ) {
            
            y -= 1;
            ddF_y += 2;
            f += ddF_y;
        }
        
        x += 1;
        ddF_x += 2;
        f += ddF_x;
        
        a = x0 + x;
        b = x0 - x;
        c = x0 + y;
        d = x0 - y;
        e = y0 + y;
        g = y0 - y;
        h = y0 + x;
        i = y0 - x;
        
        drawPixel( a, e );
        drawPixel( b, e );
        drawPixel( a, g );
        drawPixel( b, g );
        drawPixel( c, h );
        drawPixel( d, h );
        drawPixel( c, i );
        drawPixel( d, i );
    }
};

var strokeCircleHelper = function ( x0, y0, r, cornerName ) {
    
    var f, ddF_x, ddF_y, x, y;
    
    var a, b, c, d, e, g, h, i;
    
    f = 1 - r;
    ddF_x = 1;
    ddF_y = - 2 * r;
    x = 0;
    y = r;
    
    while ( x < y ){
        
        if ( f >= 0 ) {
            
            y -= 1;
            ddF_y += 2;
            f += ddF_y;
        }
        
        x += 1;
        ddF_x += 2;
        f += ddF_x;

        a = x0 + x;
        b = x0 - x;
        c = x0 + y;
        d = x0 - y;
        e = y0 + y;
        g = y0 - y;
        h = y0 + x;
        i = y0 - x;

        if ( cornerName & 0x4 ) {
        // if ( cornerName & 4 ) {   // Test if this works
            
            drawPixel( a, e );
            drawPixel( c, h );
        }
        if ( cornerName & 0x2 ) {
        // if ( cornerName & 2 ) {
            
            drawPixel( a, g );
            drawPixel( c, i );
        }
        if ( cornerName & 0x8 ) {
        // if ( cornerName & 8 ) {
            
            drawPixel( b, e );
            drawPixel( d, h );
        }
        if ( cornerName & 0x1 ) {
        // if ( cornerName & 1 ) {
            
            drawPixel( b, g );
            drawPixel( d, i );
        }
    }
};

var fillCircle = function ( x0, y0, r ) {
    
    drawFastVLine( x0, y0 - r, 2 * r + 1 );
    fillCircleHelper( x0, y0, r, 3, 0 );
};

var fillCircleHelper = function ( x0, y0, r, cornerName, delta ) {
    
    var f, ddF_x, ddF_y, x, y;
    
    var a, b, c, d;
    
    f = 1 - r;
    ddF_x = 1;
    ddF_y = - 2 * r;
    x = 0;
    y = r;
    
    while ( x < y ){
        
        if ( f >= 0 ) {
            
            y -= 1;
            ddF_y += 2;
            f += ddF_y;
        }
        
        x += 1;
        ddF_x += 2;
        f += ddF_x;

        a = y0 - y;
        b = y0 - x;
        c = 2 * y + 1 + delta;
        d = 2 * x + 1 + delta;
        
        if ( cornerName & 0x1 ) {
            
            drawFastVLine( x0 + x, a, c );
            drawFastVLine( x0 + y, b, d );
        }
        if ( cornerName & 0x2 ) {
            
            drawFastVLine( x0 - x, a, c );
            drawFastVLine( x0 - y, b, d );
        }
    }
};

var drawLine = function ( x0, y0, x1, y1 ) {
    
    var steep;
    var dx, dy;
    var err;
    var ystep;
    
    var temp;
    var placeholder;
    
    steep = Math.abs( y1 - y0 ) > Math.abs( x1 - x0 );
    
    if ( steep ) {
        
        // swap x0, y0
        temp = x0;
        x0 = y0;
        y0 = temp;
        
        // swap x1, y1
        temp = x1;
        x1 = y1;
        y1 = temp;
    }

    if ( x0 > x1 ) {
        
        // swap( x0, x1 )
        temp = x0;
        x0 = x1;
        x1 = temp;
        
        // swap( y0, y1 )
        temp = y0;
        y0 = y1;
        y1 = temp;
    }
    
    dx = x1 - x0;
    dy = Math.abs( y1 - y0 );
    
    err = dx / 2;
    
    if ( y0 < y1 ) {
        
        ystep = 1;
    }
    else {
        
        ystep = - 1;
    }
    
    for ( placeholder = 0; x0 <= x1; x0 += 1 ) {
        
        if ( steep ) {
            
            drawPixel( y0, x0 );
        }
        else {
            
            drawPixel( x0, y0 );
        }
        err -= dy;
        if ( err < 0 ) {
            
            y0 += ystep;
            err += dx;
        }
    }
    
    return;
};

var drawFastVLine = function ( x, y, h ) {

    drawLine( x, y, x, y + h - 1 );
    return;
};

var drawFastHLine = function ( x, y, w ) {

    drawLine( x, y, x + w - 1, y );
    return;
};

var strokeRect = function ( x, y, w, h ) {
    
    drawFastHLine( x,         y,         w );
    drawFastHLine( x,         y + h - 1, w );
    drawFastVLine( x,         y,         h );
    drawFastVLine( x + w - 1, y,         h );
};

var pline = function ( x0, y0, x1, y1, c ) {
    
    if ( c !== undefined ) {
        
        pcolor( c );
    }
    
    var prevT = curColorT;  // save
    curColorT = false;      // according to docs, transparency not observed
    
    drawLine( x0, y0, x1, y1 );
    
    curColorT = prevT;  // restore
};

var prect = function ( x0, y0, x1, y1, c ) {
    
    if ( c !== undefined ) {
        
        pcolor( c );
    }
    
    var w = x1 - x0 + 1;
    var h = y1 - y0 + 1;

    var prevT = curColorT;  // save
    curColorT = false;      // according to docs, transparency not observed
    
    strokeRect( x0, y0, w, h );
    
    curColorT = prevT;  // restore
};

var circ = function ( x, y, r, c ) {
    
    if ( c !== undefined ) {
        
        pcolor( c );
    }

    var prevT = curColorT;  // save
    curColorT = false;      // according to docs, transparency not observed
    
    strokeCircle( x, y, r );
    
    curColorT = prevT;  // restore
};

var circfill = function ( x, y, r, c ) {
    
    if ( c !== undefined ) {
        
        pcolor( c );
    }

    var prevT = curColorT;  // save
    curColorT = false;      // according to docs, transparency not observed
    
    fillCircle( x, y, r );
    
    curColorT = prevT;  // restore
};
