/*
    This is a JavasScript port of
     Rambo, by movax13h
     https://www.lexaloffle.com/bbs/?pid=17880#p17908
     http://blog.thrill-project.com/rambo-prison-break-pico-8/
*/


// ---------------------------------

var intro = true;
var win = false;
var f = 0;
var fshake = 100;
var fflash = 100;
var maxtime = 30 * 60 * 5;
var mwidth = 32;
var mheight = 32;

var game = {};
var p1 = {};


// Game ----------------------------

game.reset = function () {
    
    reload();  // not quite the same as P8, but similar effect
    
    f = 0;
    fshake = 100;
    fflash = 100;
    win = false;
    game.stats = {

        t1 : 0,
        t2 : 0,
        t3 : 0,
        cops : 0,
        doors : 0,
        notes : 0
    };
    game.npcs = [];
    game.cops = [];
    game.notes = [];
    game.time = 0;
    
    p1.t1 = 0;
    p1.t2 = 0;
    p1.t3 = 0;
    p1.f = 0;
    p1.x = 122;
    p1.y = 120;
    // p1.x = 100;  // temp debug
    // p1.y = 126;  // temp debug
    p1.dx = 0;
    p1.dy = 0;
    p1.sel = - 1;
    p1.esc = false;  // is escaping
    p1.walk = false;
    p1.alive = true;
    p1.note = false;
    p1.bot = false;
    
    game.addnote(

        148, 136,
        [
            "hey john!",
            "where are you?",
            "what?! again?",
            "*grml*",
            "understand.. well..",
            "are you sure?",
            "ok, i'll be waiting",
            "at the main entrance.",
            "meanwhile, keep cool,",
            "don't touch the cops!",
            "i just teleported an",
            "anti-personnel mine",
            "to your inventory.",
            // "(hold [a] to open)",
            "(press [z] to open)",
            "you have 5 minutes.",
            "good luck my friend!"
        ],
        0, 1, 0
    );

    game.addnote(

        8, 78,
        [
            "yo! let me guess...",
            "you need more mines?",
            "here's another one.",
            "*click*"
        ],
        0, 1, 0
    );

    game.addnote(

        200, 16,
        [
            "take this biobot",
            "prototype v0.1!",
            "you can program them",
            "to chase cops and",
            "blast doors.",
            "have fun!"
        ],
        0, 0, 1
    );

    game.addnote(

        31, 136,
        [
            "try this turret!",
            "is has 4 bullets.",
            "the cops might be",
            "able to disable these",
            "turrets so use them",
            "wisely!"
        ],
        1, 0, 0
    );

    game.addnote(

        28, 54,
        [
            "you seem to run",
            "out of items fast!",
            "two more turrets",
            "for you!"
        ],
        2, 0, 0
    );

    game.addnote(

        140, 54,
        [
            "two more biobots",
            "should help you",
            "to get out of there!",
            "i'm waiting."
        ],
        0, 0, 2
    );

    // checking prisoner
    var cop = game.addnpc( 4 );
    cop.x = 16;
    cop.y = 88;
    cop.dir.x = 1;
    cop.dir.y = 0;
    cop.doortime = 80;
    cop.say = "i'll keep an eye on you!";
    cop.dirs.push( { x :   0, y :   1 } );
    cop.dirs.push( { x :   1, y :   0 } );
    cop.dirs.push( { x :   0, y : - 1 } );
    cop.dirs.push( { x : - 1, y :   0 } );
    cop.dirs.push( { x :   0, y : - 1 } );
    cop.dirs.push( { x :   1, y :   0 } );
    
    // patrol block left of prison
    cop = game.addnpc( 4 );
    cop.x = 80;
    cop.y = 150;
    cop.dir.x = 1;
    cop.dir.y = 0;
    cop.distract = true;
    cop.dirs.push( { x : - 1, y :   1 } );
    cop.dirs.push( { x : - 1, y :   0 } );
    cop.dirs.push( { x :   1, y : - 1 } );
    cop.dirs.push( { x :   0, y : - 1 } );
    cop.dirs.push( { x : - 1, y :   0 } );
    cop.dirs.push( { x :   0, y :   1 } );
    cop.dirs.push( { x :   1, y :   0 } );
    
    // temp debug
    // var t = game.addnpc(2);
    // t.x = 95;
    // t.y = 150;

    // cop top right in room
    cop = game.addnpc( 4 );
    cop.x = 220;
    cop.y = 16;
    cop.dir.x = 1;
    cop.dir.y = 0;
    cop.distract = true;
    cop.dirs.push( { x :   0, y : - 1 } );
    cop.dirs.push( { x : - 1, y :   0 } );
    cop.dirs.push( { x :   0, y :   1 } );
    cop.dirs.push( { x :   1, y :   0 } );
    
    // cop patrol left/right top  
    cop = game.addnpc( 4 );
    cop.x = 140;
    cop.y = 40;
    cop.dir.x = 1;
    cop.dir.y = 0;
    cop.distract = true;
    cop.dirs.push( { x : - 1, y : 0 } );
    cop.dirs.push( { x :   1, y : 0 } );
    
    // cop in room top of prison
    cop = game.addnpc( 4 );
    cop.x = 110;
    cop.y = 60;
    cop.dir.x = 1;
    cop.dir.y = 0;
    cop.distract = true;
    cop.dirs.push( { x :   0, y :   1 } );
    cop.dirs.push( { x : - 1, y :   0 } );
    cop.dirs.push( { x :   0, y : - 1 } );
    cop.dirs.push( { x :   1, y :   0 } );
    
    cop = game.addnpc( 4 );
    cop.x = 180;
    cop.y = 80;
    cop.dir.x = - 0.6;
    cop.dir.y = - 0.5;
    
    // patrol left/right outside  
    cop = game.addnpc( 4 );
    cop.x = 30;
    cop.y = 220;
    cop.dir.x = 1;
    cop.dir.y = 0;
    cop.distract = true;
    cop.dirs.push( { x : - 1, y : 0 } );
    cop.dirs.push( { x :   1, y : 0 } );
    
    // patrol left/right outside  
    cop = game.addnpc( 4 );
    cop.x = 200;
    cop.y = 210;
    cop.dir.x = 1;
    cop.dir.y = 0;
    cop.distract = false;
    cop.dirs.push( { x : - 1, y : 0 } );
    cop.dirs.push( { x :   1, y : 0 } );


    // enable sliding doors
    var door;
    for ( var y = 0; y <= mheight; y += 1 ) {
        
        for ( var x = 0; x <= mwidth; x += 1 ) {
            
            var s = mget( x, y );
            
            if( fget( s, 1 ) ) {
                
                // door hor
                door = game.addnpc( 5 );
                door.hor = true;
                door.x = x * 8;
                door.y = y * 8;
                door.mx = x;
                door.my = y;
    
            }
            else if( fget( s, 2 ) ) {
                
                // door vert
                door = game.addnpc( 5 );
                door.hor = false;
                door.x = x * 8;
                door.y = y * 8;
                door.mx = x;
                door.my = y;
            }
        }
    }

};

game.addnote = function ( x, y, text, t1, t2, t3 ) {
    
    var n = {

        x : x,
        y : y,
        text : text,
        t1 : t1,
        t2 : t2,
        t3 : t3
    };
    
    game.notes.push( n );
    
    return n;
};

game.drwlvl = function () {

    pal( 14, 0 );
    pmap( 0, 0, 0, 0, mwidth, mheight );
    pal();
    for ( var i = 0; i < game.notes.length; i += 1 ) {
        
        var n = game.notes[ i ];
        
        spr( 90 + f % 5, n.x, n.y, 1, 1 );
    }
};

game.drwnpcs = function () {

    for ( var i = 0; i < game.npcs.length; i += 1 ) {
        
        var n = game.npcs[ i ];
        
        n.drw( n );
    }
};

game.updnpcs = function () {

    for ( var i = 0; i < game.npcs.length; i += 1 ) {
        
        var n = game.npcs[ i ];
        
        n.upd( n );
    }
};

game.addnpc = function ( nr ) {
    
    var n = {};
    n.type = nr;
    n.x = p1.x - 2;
    n.y = p1.y;
    n.f = 0;

    if ( nr === 1 ) { // turret
    
        n.upd = updturret;
        n.drw = drwturret;
        n.exp = false;
        n.bullets = [];
        n.lock = 0;
        n.maxb = 4;
        game.stats.t1 += 1;
    }
    else if ( nr === 2 ) { // mine
    
        n.upd = updmine;
        n.drw = drwmine;
        n.exp = false;
        game.stats.t2 += 1;
    }
    else if ( nr === 3 ) { // bot
    
        n.upd = updbot;
        n.drw = drwbot;
        n.exp = false;
        n.dirs = [];
        n.alive = true;
        p1.bot = n;
        game.stats.t3 += 1;
    }
    else if ( nr === 4 ) { // cop
    
        n.upd = updcop;
        n.drw = drwcop;
        n.hit = cophit;
        n.dir = { x : 0, y : 0 };
        n.wait = 0;
        n.exp = false;
        n.colls = -1;
        n.door = { t : 0 };
        n.doortime = 80;
        n.say = "";
        n.dirs = [];
        n.distract = true;
        game.cops.push( n );
    }
    else if ( nr === 5 ) { // slide door

        n.upd = upddoor;
        n.drw = drwdoor;
        n.hor = true;
    }

    game.npcs.push( n );

    return n;
};

var removenpc = function ( npc ) {
    
    del( game.npcs, npc );
};

var delcop = function ( cop ) {
    
    removenpc( cop );

    del( game.cops, cop );
};


// Turrets -------------------------

var updturret = function ( tur ) {
        
    if ( tur.lock > 0 ) {
    
        tur.lock -= 1;
    }
    
    // update bullets
    var db = [];
    var hit = false;
    for ( var i = 0; i < tur.bullets.length; i += 1 ) {
    
        var b = tur.bullets[ i ];
        b.f += 1;
        b.x += b.dx;
        b.y += b.dy;
        hit = false;
        // bullet hits wall
        if ( coll( b.x, b.y ).s > 0 ) {
    
            hit = true;
            // sfx( 11 );
        }
        else {
    
            // bullet hits cop
            for ( var i = 0; i < game.cops.length; i += 1 ) {
    
                var cop = game.cops[ i ];
    
                if ( ! cop.exp && 
                     Math.abs( cop.x - b.x ) < 6 &&
                     Math.abs( cop.y - b.y ) < 6 )
                {
                    cop.f = 0;
                    cop.exp = true;
                    game.stats.cops += 1;
                    p1.escapes();
                    // sfx( 10 );
                    hit = true;
                }
            }
        }
    
        if ( hit ) {
    
            db.push( b );
        }
    }
    
    //remove dead bullets
    for ( var i = 0; i < db.length; i += 1 ) {
    
        var b = db[ i ];
    
        del( tur.bullets, b );
    }
    
    // explode turret
    if ( tur.exp ) {
    
        tur.f += 0.5;
    }
    if ( tur.f > 6 ) {
        
        removenpc( tur );
    }
    else {
    
        for ( var i = 0; i < game.cops.length; i += 1 ) {
    
            var cop = game.cops[ i ];
    
            // cop dismounts turret
            // or turret is empty
            if ( ( tur.lock <= 0 &&
                   tur.maxb <= 0 &&
                   tur.bullets.length === 0
                 ) || 
                 sees( tur, cop, 10 ) )
            {
                tur.exp = true;
                p1.escapes();
                // sfx( 9 );
            }
            // turret fires at cop
            else if ( tur.maxb > 0 &&
                      tur.lock <= 0 &&
                      sees( tur, cop, 50 ) )
            {
                var dx = cop.x - tur.x;
                var dy = cop.y - tur.y;
                var len = Math.sqrt( dx * dx + dy * dy );
    
                tur.bullets.push( {
    
                    x : tur.x + 4,
                    y : tur.y + 4,
                    dx : dx / len,
                    dy : dy / len,
                    f : 0
                } );
    
                tur.lock = 10;
                tur.maxb -= 1;
                // sfx( 12 );
            }
        }
    }
};

var drwturret = function ( tur ) {
    
    if ( tur.exp ) {
        
        expp( 17, tur.x, tur.y, tur.f );
    }
    else {
        
        spr( 20 - tur.maxb, tur.x, tur.y, 1, 1 );
    }
    
    for ( var i = 0; i < tur.bullets.length; i += 1 ) {
        
        var b = tur.bullets[ i ];
        
        pset( b.x, b.y, 8 );
    }
};


// Mines ---------------------------

var updmine = function ( mine ) {
    
    if ( mine.exp ) {
        
        mine.f += 2;
        
        if ( mine.f > 20 ) {
            
            removenpc( mine );
        }
    }
    else {
        
        for ( var i = 0; i < game.cops.length; i += 1 ) {
            
            var cop = game.cops[ i ];
            
            if ( sees( mine, cop, 10 ) ) {
                
                mine.exp = true;
                cop.f = 0;
                cop.exp = true;
                game.stats.cops += 1;
                fshake = 0;
                p1.escapes();
                applyexp( mine.x, mine.y, 1 );
                //sfx( 3 );
            }
        }
    }
};

var drwmine = function ( mine ) {
    
    if ( mine.exp ) {
        
        expp( 33, mine.x, mine.y, mine.f );
    }
    else {
        
        spr( 33 + ( Math.floor( f * 0.25 ) % 4 ), mine.x, mine.y, 1, 1 );
    }
};


// Biobot --------------------------

var updbot = function ( bot ) {

    bot.f += 1;

    if ( ! bot.alive ) {

        if ( bot.f > 20 ) {

            removenpc( bot );
        }
        return;
    }

    if ( bot.f < 10 ) {

        return;
    }

    if ( bot.dirs.length === 0 ) {

        bot.f = 0;
        bot.alive = false;
        // sfx( 3 );
        return;
    }
    
    var ox = bot.x;
    var oy = bot.y;
    bot.x += bot.dirs[ 0 ].x;
    bot.y += bot.dirs[ 0 ].y;

    var hit = coll_bot( bot );

    if ( hit.s === 86 ) {

        bot.alive = false;
        bot.f = 0;
        fshake = 0;
        p1.escapes();
        applyexp( bot.x, bot.y, 1 );
        // sfx( 3 );
        return;
    }
    else if ( hit.s > 0 ) {

        bot.x = ox;
        bot.y = oy;

        del( bot.dirs, bot.dirs[ 0 ] );

        /*if ( bot.dirs.length > 0 ){

            sfx( 16 );
        }*/

        return;
    }

    for ( var i = 0; i < game.cops.length; i += 1 ) {

        var cop = game.cops[ i ];

        if ( sees( bot, cop, 10 ) ) {

            bot.alive = false;
            bot.f = 0;
            cop.f = 0;
            cop.exp = true;
            game.stats.cops += 1;
            fshake = 0;
            p1.escapes();
            applyexp( bot.x, bot.y, 1 );
            // sfx( 3 );
            return;
        }
    }
};

var drwbot = function ( bot ) {

    if ( bot.alive ) {

        spr( 49 + ( Math.floor( f * 0.25 ) % 4 ), bot.x, bot.y, 1, 1 );
    }
    else {

        expp( 49, bot.x, bot.y, bot.f );
    }
};

var coll_bot = function ( bot ) {

    var hit;

    hit = coll( bot.x + 3, bot.y + 3 );
    if ( hit.s > 0 ) { return hit; }

    hit = coll( bot.x + 3, bot.y + 6 );
    if ( hit.s > 0 ) { return hit; }

    hit = coll( bot.x + 6, bot.y + 3 );
    if ( hit.s > 0 ) { return hit; }

    hit = coll( bot.x + 6, bot.y + 3 );
    if ( hit.s > 0 ) { return hit; }

    return { s : 0 };
};


// Cops ----------------------------

var updcop = function ( cop ) {

    // srand( f );  // js Math.random() doesn't support seed select
    
    if ( cop.exp ) {

        cop.f += 2;
        return;
    }
    
    var l = 0;

    // cop follows player    
    if ( p1.esc && cop.distract && sees( cop, p1, 80 ) ) {

        var d = {
            x : p1.x - cop.x,
            y : p1.y - cop.y
        };

        l = Math.sqrt( d.x * d.x + d.y * d.y );

        cop.dir.x = d.x / l;
        cop.dir.y = d.y / l;        
    }
    //door is open
    if ( cop.door.t > 0 ) {

        cop.door.t -= 1;

        if ( cop.door.t === 0 ) {

            cop.say = "";
            mset( cop.door.hit.x / 8, cop.door.hit.y / 8, 86 );
            // sfx( 4 );
        }
    }
    // wait after wall hit
    if ( cop.wait < 0 ) { 
        
        cop.wait += 1;
        
        if ( cop.wait === 0 ) {

            if ( p1.esc ) {

                cop.wait = Math.floor( random( 15 ) ) + 10;
            }
            else {

                cop.wait = Math.floor( random( 40 ) ) + 20;
            }
        }
    }
    
    if ( cop.wait > 0 ) {

        cop.wait -= 1;

        if ( cop.wait === 0 ) {
            //resume in modified dir
            var numdirs = cop.dirs.length;

            if ( numdirs > 0 ) {

                cop.dir.x = cop.dirs[ cop.colls % numdirs ].x;
                cop.dir.y = cop.dirs[ cop.colls % numdirs ].y;
            }
            else {

                cop.dir.x += random( 2 ) - 1;
                cop.dir.y += random( 2 ) - 1;            
            }
            //uniform length
            l = Math.sqrt( cop.dir.x * cop.dir.x + cop.dir.y * cop.dir.y );
            cop.dir.x = cop.dir.x / l;
            cop.dir.y = cop.dir.y / l;
        }

        return;
    }

    var ox = cop.x;
    var oy = cop.y;
    cop.x += cop.dir.x;
    var hit = coll_char( cop );
    if ( hit.s > 0 ) {  //println( 'a cop hit something x' );

        cop.x = ox;
        cop.dir.x *= - 1;
        cop.colls += 1;
        if ( cop.wait === 0 ) {

            cop.wait = - 6;
        }
        cop.hit( cop, hit );
        return;
    }
    
    cop.y += cop.dir.y;
    hit = coll_char( cop );
    if ( hit.s > 0 ) {  //println( 'a cop hit something y' );

        cop.y = oy;
        cop.dir.y *= -1;
        cop.colls += 1;
        if ( cop.wait === 0 ) {

            cop.wait = - 6;
        }
        cop.hit( cop, hit );
        return;
    }
    
    cop.f += 0.4;
};

var cophit = function (cop,hit) {

    if ( hit.s === 86 ) {

        cop.door = { t : cop.doortime, hit : hit };
        cop.wait = cop.doortime;
        if ( cop.dirs.length === 0 ) {

            cop.wait = 0;  //cop.wait *= 0.5
        }
        mset( hit.x / 8, hit.y / 8, 87 );
        // sfx( 2 );
    }
};

var drwcop = function ( cop ) {

    var sx = 5;
    var sy = 0;
    
    if ( cop.exp ) {

        expp( 5, cop.x, cop.y, cop.f );

        if ( cop.f > 20 ) {

            delcop( cop );
        }
        
        return;
    }
    
    if ( cop.door.t > 0 && cop.say !== "" ) {

        sprint( cop.say, cop.x - 39, cop.y + 11, 12 , 1 );
    }
    
    if ( cop.wait <= 0 &&
         ( cop.dir.x !== 0 || cop.dir.y !== 0 ) )
    {

        if ( Math.abs( cop.dir.x ) > Math.abs( cop.dir.y ) ) {

            sx = 9;
        } 
        else if ( cop.dir.y < 0 ) {

            sy = 8;
        }
        
        var flip = cop.dir.x < 0;

        sspr(

            8 * ( sx + Math.floor( cop.f % 4 ) ),
            sy, 5, 8, cop.x, cop.y, 5, 8, flip
        );
    }
    else {

        spr( sx, cop.x, cop.y );
    }
};


// Sliding doors -------------------

var upddoor = function ( d ) {

    //check sensor
    var sx = d.x;
    var sy = d.y;

    if ( d.hor ) {

        sx += 7;
    }
    else {

        sy += 7;
    }
    
    if ( doorsensor( sx, sy, 12 ) ) {

        d.f = Math.min( d.f + 1, 2 );
    }
    else {

        d.f = Math.max( d.f - 1, 0 );
    }

    /*if ( d.f === 1 ) {

        sfx( 13 );
    } */

    //swap tiles
    if ( d.hor ) {

        mset( d.mx, d.my, 105 + 2 * d.f );
        mset( d.mx + 1, d.my, 106 + 2 * d.f );
    }
    else {

        mset( d.mx, d.my, 121 + d.f );
        mset( d.mx, d.my + 1, 124 + d.f );
    }
};

var drwdoor = function ( d ) {};

var doorsensor = function ( ax, ay, dist ) {

    var dx = Math.abs( p1.x - ax );
    var dy = Math.abs( p1.y - ay );

    if ( dx < dist && dy < dist ) {

        return true;
    }
    for ( var i = 0; i < game.npcs.length; i += 1 ) {

        var n = game.npcs[ i ];

        if ( n.type === 3 || n.type === 4 ) {

            dx = Math.abs( n.x - ax );
            dy = Math.abs( n.y - ay );
            if ( dx < dist && dy < dist ) {

                return true;
            }
        }
    }

    return false;
};


// Player --------------------------

p1.drw = function () {

    pal( 11, 0 );

    if ( p1.walk ) {

        var sx = 5;
        var sy = 2;
        var flip = false;

        if ( p1.dy < 0 && p1.dx === 0 ) {

            sy = 3;
        }
        else if ( p1.dx !== 0 ) {

            sx = 9;
            flip = p1.dx < 0;
        }

        sspr(
            8 * ( sx + Math.floor( p1.f * 0.4 ) % 4 ),
            8 * sy, 5, 8, p1.x, p1.y, 5, 8, flip
        );
    }    
    else { 
        
        spr( 37, p1.x, p1.y, 1, 1 );
    }

    pal();

    //selection menu    
    if ( p1.sel > - 1 ) {

        for ( var i = -1; i <= 1; i += 1 ) {

            var c = 7;
            var s = 0;

            if ( i + 2 === p1.sel ) {

                c = 8 - Math.floor( f * 0.5 ) % 2; 
                s += 1 + Math.floor( f * 0.2 ) % 4;
            }
            var x = p1.x + 2 + i * 14;
            var y = p1.y - 10 + Math.abs( i ) * 4;
            circfill( x, y, 5, 0 );
            circ( x, y, 5,c );
            spr( 32 + i * 16 + s, x - 4, y - 4, 1, 1 );
        }
    }
};

var selectingItem = false;  // workaround for only one key at a time
p1.upd = function () {

    p1.f += 1;
    
    if ( p1.y > 234 ) {

        win = true;
        f = 0;
        p1.f = 0;
        // sfx( 19 );
        return;
    }
    
    if ( f < 15 ) {

        return;
    }

    /*if ( btn( 4 ) ) {

        p1.sel = Math.max( 0, p1.sel );
        if ( btn( 0 ) ) { p1.sel = 1; }
        if ( btn( 1 ) ) { p1.sel = 3; }
        if ( btn( 2 ) ) { p1.sel = 2; }
        if ( btn( 3 ) ) { p1.sel = 0; }
        p1.sel = p1.sel % 4;
    }*/
    
    // Workaround for only one key at a time
    if ( btn( 4 ) ) {
        
        selectingItem = ! selectingItem;  // toggle
        
        p1.sel = Math.max( 0, p1.sel );
    }
    else if ( selectingItem ) {

        if ( btn( 0 ) ) { p1.sel = 1; }
        if ( btn( 1 ) ) { p1.sel = 3; }
        if ( btn( 2 ) ) { p1.sel = 2; }
        if ( btn( 3 ) ) { p1.sel = 0; }
    }
    
    else {

        if ( p1.sel > 0 ) {

            if ( p1.sel === 1 && p1.t1 > 0 ) {

                p1.t1 -= 1;
                // sfx( 14 );
                game.addnpc( p1.sel );
            }
            else if ( p1.sel === 2 && p1.t2 > 0 ) {

                p1.t2 -= 1;
                // sfx( 14 );
                game.addnpc( p1.sel );
            }
            else if ( p1.sel === 3 && p1.t3 > 0 ) {

                p1.t3 -= 1;
                // sfx( 14 );
                game.addnpc( p1.sel );
            }
            /*else

                sfx( 8 );
            }*/
        }

        p1.sel = - 1;
        
        p1.walk = false;
        var ox = p1.x;
        var oy = p1.y;
        
        if ( btn( 0 ) ) { p1.x -= 1; p1.walk = true; }
        if ( btn( 1 ) ) { p1.x += 1; p1.walk = true; }
        
        if ( coll_char( p1 ).s > 0 ) {  //println( 'player hit something x' );

            p1.x = ox;
        }     
        if ( btn( 2 ) ) { p1.y -= 1; p1.walk = true; }
        if ( btn( 3 ) ) { p1.y += 1; p1.walk = true; }

        if ( coll_char( p1 ).s > 0 ) {  //println( 'player hit something y' );

            p1.y = oy;
        }
        p1.dx = p1.x - ox;
        p1.dy = p1.y - oy;
    }
    
    if ( entityat( p1, game.cops ) ) {

        die();
    }

    var note = entityat( p1, game.notes );

    if ( note ) {

        processnote( note );
    }
};

var die = function () {

    p1.walk = false;
    p1.alive = false;
    f = 0;
    fshake = 0;
    // sfx ( 0 );
};

var processnote = function ( note ) {

    f = 0;
    p1.walk = false;
    p1.note = note;
    game.stats.notes += 1;
    // sfx( 18 );
    del( game.notes, note );
};

p1.escapes = function () {

    if ( p1.esc ) {

        return;
    }
    p1.f = 0;
    p1.esc = true;
    fflash = 0;
    // sfx( 5 );
};


// Helpers -------------------------

var coll_char = function ( p ) {

    var hit;

    hit = coll( p.x,     p.y + 7 ); if ( ( hit.s > 0 ) ) { return hit; }
    hit = coll( p.x + 4, p.y + 7 ); if ( ( hit.s > 0 ) ) { return hit; }
    hit = coll( p.x + 2, p.y + 7 ); if ( ( hit.s > 0 ) ) { return hit; }
    hit = coll( p.x,     p.y + 4 ); if ( ( hit.s > 0 ) ) { return hit; }
    hit = coll( p.x + 4, p.y + 4 ); if ( ( hit.s > 0 ) ) { return hit; }

    return { s : 0 };
};

var coll = function ( x, y ) {

    var s = mget( x / 8, y / 8 );
    
    if ( fget( s, 0 ) ) { 

        var c = sget(
            8 * ( s % 16 ) + x % 8,
            8 * Math.floor( s / 16 ) + y % 8
        );
        if ( c > 0 ) {

            return { s : s, x : x, y : y };
        }
    }
    return { s : 0 };
};

var collcell = function ( x, y ) {

    var s = mget( x, y );
    return fget( s, 0 );
};

var entityat = function ( a, list ) {

    for( var i = 0; i < list.length; i += 1 ) {

        var b = list[ i ];

        var dx = b.x - a.x;
        var dy = b.y - a.y;

        if ( Math.abs( dx ) < 6 && Math.abs( dy ) < 6 ) {

            return b;
        }
    }

    return false;
};

var expp = function ( id, x, y, t ) {

    t *= 1.8;
    var mx = 8 * ( id % 16 );
    var my = 8 * ( Math.floor( id / 16 ) );
    // srand( id );    // js Math.random() doesn't support seed select

    for ( var j = 0; j <= 8; j += 1 ) {

        for ( var i = 0; i <= 8; i += 1 ) {
    
            var c = sget( mx + i, my + j );

            if ( c > 0 ) {

                pset(
                    x + i + t * ( random( 2 ) - 1 ),
                    y + j + t * ( random( 2 ) - 1 ),
                    c
                );
            }
        }
    }
};

// xchg tiles on the map
var applyexp = function( x, y, rad ) {

    for ( var j = - rad; j <= rad; j += 1 ) {

        for ( var i = - rad; i <= rad; i += 1 ) {

            var mx = Math.floor( x / 8 ) + i;
            var my = Math.floor( y / 8 ) + j;
            var s = mget( mx, my );
            if ( s === 86 || s === 87 ) {

                mset( mx, my, 102 );
                game.stats.doors += 1;
            }
        }
    }
};

var sees = function ( a, b, far ) {

    var ax = a.x;
    var ay = a.y;
    var d = { x : b.x - ax, y : b.y - ay };
    if ( Math.abs( d.x ) > 80 || Math.abs( d.y ) > 80 ) {

        return false;
    }
    var l = Math.sqrt( d.x * d.x + d.y * d.y );
    if ( l < 8 ) {

        return true;
    }
    if ( l > far) {

        return false;
    }
    var steps = Math.floor( l / 5 );

    for ( var i = 0; i <= steps; i += 1 ) {

        var j = i / steps;

        if ( collcell(
                ( ax + j * d.x + 2 ) / 8,
                ( ay + j * d.y + 4 ) / 8 ) )
        {
            return false;
        }
    }

    return true;
};


// Hud/ui --------------------------

var bcsel = - 1;
var bcwait = 0;

var rstbotcode = function () {};

var to = { x : 0, y : 0 };  // moved here as workaround for only one key at a time
var updbotcode = function () {

    // bcsel = - 1;
    if ( bcwait > 0 ) {
        
        bcwait -= 1;
        if ( bcwait === 0 ) {

            p1.bot = false;
        }

        return;
    }
    
    // var to = { x : 0, y : 0 };
    var l = btn( 0 );
    var r = btn( 1 );
    var u = btn( 2 );
    var d = btn( 3 );
    // Diagonals not available due to only one key detected at a time
    /*if ( u && r ) {

        bcsel = 1;
        to.x = 0.7;
        to.y = - 0.7;
    }
    else if ( d && r ) {

        bcsel = 3;
        to.x = 0.7;
        to.y = 0.7;
    }
    else if ( d && l ) {

        bcsel = 5;
        to.x = - 0.7;
        to.y = 0.7;
    }
    else if ( u && l ) {

        bcsel = 7;
        to.x = - 0.7;
        to.y = - 0.7;
    }
    else if ( u ) {*/
    if ( u ) {

        bcsel = 0;
        to.x = 0;
        to.y = - 1;
    }
    else if ( r ) {

        bcsel = 2;
        to.x = 1;
        to.y = 0;
    }
    else if ( d ) {

        bcsel = 4;
        to.x = 0;
        to.y = 1;
    }
    else if ( l ) {

        bcsel = 6;
        to.x = - 1;
        to.y = 0;
    }
    
    if ( btnp( 4 ) ) {

        if ( bcsel > - 1 ) {

            p1.bot.dirs.push( { id : bcsel, x : to.x, y : to.y } );
            
            to = { x : 0, y : 0 };  // moved here as workaround for only one key at a time

            if ( p1.bot.dirs.length === 4 ) {
                
                // bcwait = 40;
                bcwait = 3;  // temp debug
                // sfx( 15 );
            }
            /*else {

                sfx( 6 );
            }*/
            
            bcsel = - 1;  // moved this over here
        }
        /*else {

            sfx( 8 );
        }*/
    }
};

var iconfromsel;
var drwbotcode = function () {

    rectfill( 5, 10, 122, 118, 0 );
    prect( 5, 10, 122, 118, 8 );
    pprint( "biobot v0.1 program", 14, 21, 9 );
    spr( 48, 108, 19 );
    pline( 14, 27, 114, 27, 9 );
    pprint( "list of directions (" + str( p1.bot.dirs.length ) + "/4)", 17, 42, 6 );
    // pprint( "hold and select with [a]", 16, 100, 1 );
    // pprint( "(diagonals available)", 22, 108, 1 );
    pprint( "select with [z]", 32, 100, 1 );

    if ( bcwait > 0 ) {

        spr( 103, 31, 81, 1, 1 );
        pprint( "uploading...", 45, 80, 8 );
        rectfill( 45, 86, 85 - bcwait, 88, 8 );
    }
    else {

        spr( iconfromsel( bcsel ), 60, 82, 1, 1 );
    }
    
    for ( var i = 0; i <= 3; i += 1 ) {

        var x = 25 + i * 20;
        if ( i < p1.bot.dirs.length ) {

            var d = p1.bot.dirs[ i ];
            spr( iconfromsel( d.id ), x + 5, 58 );
            prect( x, 53, x + 16, 69, 8 );
        }
        else {

            prect( x, 53, x + 16, 69, 9 );
        }
    }    
};

var iconfromsel = function ( n ) {

    var id = n;

    if ( id === 7 ) {

        id = 95;
    }
    else if ( id === - 1 ) {

        id = 89;
    }
    else {

        id += 73;
    }
    
    return id;
};

var drwhud = function () {

    pcamera( 0, 0 );
    
    if ( p1.bot ) {

        drwbotcode();
        return;
    }
    
    if (  p1.alive ) {

        // note
        if ( p1.note ) {

            rectfill(5, 10, 122, 40, 0 );
            prect(5, 10, 122, 40, 8 );
            spr(14, 10, 12, 2, 3 );
            pprint( p1.note.text[ 0 ], 31, 18, 7 );

            var c = p1.note.text.length;

            if ( c > 1 ) {

                pprint( p1.note.text[ 1 ], 31, 28, 7 );
            }
            if ( c > 2 ) {

                spr( 4, 116, 36 );
            }
            if ( c <= 2 &&
                 ( p1.note.t1 > 0 || p1.note.t2 > 0 || p1.note.t3 > 0 ) )
            {
                rectfill( 108, 36, 118, 46, 0 );
                prect( 108, 36, 118, 46, 8 );
                if ( f % 8 > 2 ) {

                    if ( p1.note.t1 > 0 ) { spr( 16, 109, 37 ); }
                    if ( p1.note.t2 > 0 ) { spr( 32, 109, 37 ); }
                    if ( p1.note.t3 > 0 ) { spr( 48, 109, 37 ); }
                }
            }
        }
        // inventory
        else {

            spr( 16, 1, 0, 1, 1 );
            spr( 32, 1, 8, 1, 1 );
            spr( 48, 1, 16, 1, 1 );
            pprint( p1.t1, 10, 2, 7 );
            pprint( p1.t2, 10, 10, 7 );
            pprint( p1.t3, 10, 18, 7 );
            spr( 200 + Math.floor( 6 * game.time / maxtime ), 119, 1, 1, 1 );
        }
    }
    
    // red blinking frame
    if ( p1.esc && fflash < 20 ) {

        if ( fflash % 2 === 0 ) {

            prect( 0, 0, 127, 127, 8 );
            prect( 1, 1, 126, 126, 8 );
            prect( 2, 2, 125, 125, 8 );
        }
    }
};

var drwbusted = function () {

    pal( 11, 0 );
    for ( var i = 0; i <= 4; i += 1 ) {

        sspr(
            120, 48, 8, 8, i * 24 + 12,
            0, 8, Math.min( 128, f * 6 )
        );
    }
    pal();
    
    if ( f < 26 ) {

        return;
    }
    /*if ( f === 26 ) {

        sfx( 1 );
    }*/

    var y = Math.min( 0, -288 + f * 8 );
    
    rectfill( 23, 35 + y, 105, 75 + y, 0 );
    prect( 23, 35 + y, 105, 75 + y, 8 );
    
    var c = 8;
    if ( f % 8 < 4 ) {

        c = 14;
    }
    if ( game.time > maxtime ) {

        sprint( "time is up!", 43, 44 + y, c, 1 );
    }
    else {

        sprint( "escape failed!", 38, 44 + y, c, 1 );
    }
    
    pprint( "press key", 47, 55 + y, 1 );
    pprint( "to try again", 41, 63 + y, 1 );
};

var sprint = function ( s, x, y, c1, c2 ) {

    pprint( s, x, y+1, c2 );
    pprint( s, x, y, c1 );
};


// Intro ---------------------------

var updintro = function () {

    if ( btnp() > 0 ) {

        intro = false;
        // music( -1 );
        f = 0;
        // sfx( 17 );
        return;
    }
};

var drwintro = function () {

    spr( 128, 32, 14, 8, 8 );
    spr( 136, 32, 82, 8, 2 );
    spr( 168, 102, 0, 3, 1 );
    spr( 62, 0, 0, 2, 1 );
    
    pline( 0, 118, 127, 118, 1 );
    pline( 0, 6, 127, 6, 1 );
    var a = Math.floor( f * 0.5 ) % 4;
    spr( 9 + a, f % 300 - 10, 110 );
    spr( 49 + a, f % 300 - 30, 111 );
    
    pprint( "prison break", 48, 100, 7 - f % 2 );
    pprint( "by movax13h,  december 2015", 13, 120, 1 );
};


// Win -----------------------------

var updwin = function () {

    p1.y += Math.max( 0, sgn( 240 - p1.y ) );
    p1.walk = false;
    p1.f += 1;
    if ( f === 90 ) {
        
        p1.f = 0;
        // sfx( 3 );
    }
};

var drwwin = function () {

    pal( 11, 0 );
    if ( f < 90 ) {

        spr( 37, p1.x, p1.y );
        spr( 
            25 + 2 * ( Math.floor( f * 0.5 ) % 2 ),
            Math.max( p1.x, 200 - f * 2 ), 242, 2, 1
        );
    }
    else {

        expp( 37, p1.x, p1.y, p1.f );
        spr( 25, p1.x, 242, 2, 1 );
    }
    pal();
    pcamera();
    rectfill( 10, 10, 117, 100, 0 );
    prect( 10, 10, 117, 100, 8 );
    pprint( "congratulations!!", 30, 22, 2 );
    pprint( "congratulations!!", 30, 21, 8 );
    pprint( "escape successful", 30, 29, 5 );
    
    spr( 16, 30, 40 );
    pprint( str( game.stats.t1 ) + " turrets used", 42, 42, 7 );
    spr( 32, 30, 48 );
    pprint( str( game.stats.t2 ) + " mines used", 42, 50, 7 );
    spr( 48, 30, 56 );
    pprint( str( game.stats.t3 ) + " biobots used", 42, 58, 7 );
    spr( 86, 30, 68 );
    pprint( str( game.stats.doors ) + " doors blasted", 42, 70, 7 );
    spr( 5, 32, 78 );
    pprint( str( game.stats.cops ) + " cops done", 42, 80, 7 );   
};


// Main ----------------------------

var _init = function () {

    game.reset();
    // music( 10 );
};

var _update = function () {

    f += 1;
    if ( intro ) {

        updintro();
        return;
    }
    
    if ( win ) {

        updwin();
        return;
    }

    fshake += 1;
    fflash += 1;
    game.time += 1;

    if ( game.time === maxtime ) {

        die();
    }
    
    if ( p1.bot ) {

        updbotcode();
        return;
    }
    else {

        rstbotcode();
    }
    
    if ( p1.note ) {

        // advance note    
        if ( f > 20 && btnp() > 0 ) {

            // sfx( 7 );
            del( p1.note.text, p1.note.text[ 0 ] );
            
            if ( p1.note.text.length > 0 ) {

                del( p1.note.text, p1.note.text[ 0 ] );
            }
            if ( p1.note.text.length === 0 ) {

                p1.t1 += p1.note.t1;
                p1.t2 += p1.note.t2;
                p1.t3 += p1.note.t3;
                /*if ( p1.note.t1 + p1.note.t2 + p1.note.t3 > 0 ) {

                    sfx( 6 );
                }*/
                p1.note = false;
            }
        }

        return;
    }
    
    if ( p1.alive ) {

        p1.upd();
        game.updnpcs();
    }
    else if ( f > 40 ) {

        if ( btnp() > 0 ) {

            game.reset();
        }
    }
};

var _draw = function () {

    cls();
    pcamera( 0, 0 );

    if ( intro ) {

        drwintro();
        return;
    }
    
    rectfill( 0, 0, 127, 127, 13 );
    var r1 = 0;
    var r2 = 0;
    if ( fshake < 26 ) {

        r1 = random( 4 ) - 2;
        r2 = random( 4 ) - 2;
    }
    
    pcamera(
        Math.min( 125, Math.max( 3, p1.x - 64 + r1 ) ),
        Math.min( 125, Math.max( 2, p1.y - 64 + r2 ) ) 
    );
    game.drwlvl();
    game.drwnpcs();
    if ( win ) {

        drwwin();
    }
    else {

        p1.drw();
        drwhud();
    }
    if ( ! p1.alive ) {

        drwbusted();
    }
};


// Sprites -------------------------

rom_gfx = [

	'00000000000000000000000006666660808000001191100011911000119110001191100000119000001190000011900000119000666666660000000000000000',
	'00000000dbdddddd0000000006666660080000000ccc00000ccc00000ccc00000ccc0000111c0000111c0000111c0000111c0000666666660000000000000000',
	'00000000b33dddbd666666660555555000000000f1f1f000f1f1f000f1f1f000f1f1f00001510000015100000151000001510000555555550000000000000000',
	'00000000ddb3db3b6666666605b56650000000000fff00000fff00000fff00000fff000005ff000005ff000005ff000005ff00005bb557d50000444044440000',
	'00000000dd2323d355555555055555500000000011d1100011d1100011d1100011d1100001100000011000000110000001100000567576650004444444444000',
	'00000000dd4b34ddd1dddd1d000000000000000011711000117110001171100011711000071000000770000007100000017000005765d6550044444444440400',
	'00000000dd3b33dd000000000000000000000000f111f000f111f000f111f000f111f00001f000000f1100000f11000001f00000555555550044444444944000',
	'00000000ddd44d3d0000000000000000000000000101000000010000010100000100000001100000001000001001000010100000000000000449444499994000',
	'0000000000000000000000000000000000000000119110001191100011911000119110000000000c8000000000000008c000000066666666042f99f9ff9f2000',
	'00000000000000000000000000000000000000001111100011111000111110001111100000000077777700000000007777770000666666660492222f22224000',
	'0088088000770880007707700077077000770770f111f000f111f000f111f000f111f000000007117111770000000711711177005555555500f4c7c2c7cf4000',
	'0082028000720280007202700072027000720270055500000555000005550000055500000111171171177110011117117117711058bc5bc500047ccf7cc44000',
	'00007000000070000000700000007000000070001111100011111000111110001111100011111177777711111111117777771111555555550000fff99ff40000',
	'008202800082028000820280008202700072027011111000111110001111100011111000111651111111651111156111111156115959b5850000fffffff00000',
	'0088088000880880008808800088077000770770f111f000f111f000f111f000f111f000000560000000560000065000000065005555555500001f999f100000',
	'0000000000000000000000000000000000000000010100000001000001010000010000000000000000000000000000000000000000000000000659ffff560000',
	'00000000000000000000000000000000000000008bbbb0008bbbb0008bbbb0008bbbb0000bbbb0000bbbb0000bbbb0000bbbb0000000000005600f999f006570',
	'0000000000000000000000000000000000000000b8888000b8888000b8888000b8888000bb880000bb880000bb880000bb88000000000000657600fff0067576',
	'0080008000800080008000800080008000800080f1f1f000f1f1f000f1f1f000f1f1f00088f1000088f1000088f1000088f100000ddd60007656700000675667',
	'00888880008888800088888000888880008888800fff00000fff00000fff00000fff0000bfff0000bfff0000bfff0000bfff00000dd650006775660056757776',
	'0082278000822e80008222800082228000822780f4fbf000f4fbf000f4fbf000f4fbf0000f4000000f4000000f4000000f4000000d6550006666576557567667',
	'00822280008222800082278000822e8000822280fb4bf000fb4bf000fb4bf000fb4bf0000bf000000fb000000fb000000bf00000066510007777657565577776',
	'00088800000888000008880000088800000888000bb400000bb400000bb400000bb400000bb0000000bb00000bb000000bb0000005d5d0006667765655776667',
	'00000000000000000000000000000000000000000b0b0000000b00000b0b00000b00000000b000000bb00000b00b0000b0b00000000000006776677656667766',
	'0000000000000000000000000000000000000000bbbb0000bbbb0000bbbb0000bbbb000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000008bbb80008bbb80008bbb80008bbb8000000000000000005d8888888000000000000000000606006006000000',
	'0008880000088800000888000008880000088800f888f000f888f000f888f000f888f00077d67777000000668efffe80000000000006ddd00606006006000000',
	'00878780008787800087878000878780008787800fff00000fff00000fff00000fff000077d6777700d66d6608efe8000000000000056dd00060506506500000',
	'0088888000888880008888800088888000888880fbb4f000fbb4f000fbb4f000fbb4f00077d6777700611666008f800000000000000556d00000000000000000',
	'0028882000288820002888200028882000288820f44bf000f44bf000f44bf000f44bf00077d6777700611655082f280000000000000156600000000000000000',
	'00020200000200000000020000020000000002000bbb00000bbb00000bbb00000bbb00005555555500d66555822f228000000000000d5d500000000000000000',
	'00000000000000000000000000000000000000000b0b0000000b00000b0b00000b0000000000000000d55d558888888000000000000000000000000000000000',
	'000000000000000000000000000000000000000033b3b3bb00076000000760000007600000080000008888800008000080000000000800000000008000080000',
	'0000000000000000000000000000000000000000b3bb3bb3000760000007e000000e600000888000001118800001800018000000000800000000081000810000',
	'000777777777777777776000000000000000000066666666777777770007d000000d600008181800000081800000180001800080000800008000810008100000',
	'000766666666666666676000600000000000000655555555666766660007e000000e600081080180000810808888888000180080800800808008100088888880',
	'00076ffffffffffffff760001d66d6d55d66d6d155555555fff76fff0007d000000d600010080010008100801111181000018080180808108081000018111110',
	'00076ffffffffffffff76000155555566555555155555555fff76fff0007e000000e600000080000081000100000810000001880018881008810000001800000',
	'00076ffffffffffffff76000336666666666663355555555fff76fff0007d000000d600000080000810000000008100000888880001810008888800000180000',
	'0007600000000000000760003b666666666666b359995999000760000007e000000e600000010000100000000001000000111110000100001111100000010000',
	'000760000000000000076000000d00000000d0005555555500000000200000000000000000999000000000000000000000000000000000000000000088888000',
	'00076000000000000007600000600000000006005555555500000000250000000000000009111900000000000000000000000000000000000800000088111000',
	'00076000777777777777600000600000000006005555555552222225500000050000077001000900000000000000000000000000088000000008000081800000',
	'0007600066676666666760000d000000000000d055555555e226622ee000000e00000cc000009100000000000800000000800000000800000000000080180000',
	'00076000fff76ffffff76000100000000000000166666666e222222ee000000e66676cc6000910007e0000007e8000007e0000007e0800007e00800080018000',
	'00076000fff76ffffff76000155555511555555100000000e22222dee000000e6766666600010000770000007700000077000000770000007700000010001800',
	'00076000fff76ffffff76000336666666666663300000000e222222ee000000e5555555500090000770000007700000077000000770000007700000000000180',
	'0007600000076000000760003b666666666666b3000000000000000000000000d1dddd1d00010000550000005500000055000000550000005500000000000010',
	'0007600000076000000760000007600000076000333b3b33000000000000000900000000000000000000000000000000000000000000000000000000b157651b',
	'00076000000760000007600000076000000767b0b33333b3000000000000009000000000000000000000000000000000000000000000000000000000b157651b',
	'00077777777777777777600000077777000767703b3b3333520000050000091000004440767777755577777676755000000055767650000000000056b157651b',
	'0006666666666666666660000007666600076770b3333b33e2000000000009000004494465cccccc6cccccc565cc600000006cc56560000000000065b157651b',
	'000ffffffffffffffffff00000076fff00076550333b333be00000000900910000049494f5cccc6c6cccc6c5f5cc600000006cc5f560000000000065b157651b',
	'000ffffffffffffffffff00000076fff00076000b3333b33e00000060190900000049494f5ccc6cc6ccc6cc5f5cc600000006cc5f560000000000065b157651b',
	'000ffffffffffffffffff00000076fff000760003b33b333e50060050019100000044944f5cccccc6cccccc5f5cc600000006cc5f560000000000065b157651b',
	'000000000000000000000000000760000007600033b3333b000500200001000000004440000000000000000000000000000000000000000000000000b157651b',
	'00000000000000000000000000000000000000000007700000076440000760000000000000076000000760000007600000057000000000000000000000060000',
	'000000000000000000000000000000000000000000077000000764400447600000000000000670000006700000015000000c7000000000000000000000000060',
	'777777777777777777777777777777777777777700055000000764400447600077777777000c7000000c700000015000000c7000000000000000000060006000',
	'edededed6666666666666666666666666666666600055000000764400447600066666666000c7000000c700000000000000c7000000570000000000000060000',
	'ededededffc9ccff5c1c1c5fffccacffff7777ff000550000007622004476000ffffffff000c70000001500000000000000c7000000c70000000000000000006',
	'ededededff3b34ff5c1c1c5fffbb33ffff6cc6ff000550000007624004476000ff9999ff000c70000001500000000000000c7000000c70000005700006000600',
	'ededededfffffffff77777ffffffffffff5555ff000550000007622002276000ff5555ff000c7000000000000000000000067000000670000006700000000000',
	'000000000000000000000000000000000055550000055000000762d0022760000055550000057000000000000000000000076000000760000007600000600006',
];
rom_shared = [

	'0000000000000000015d651000000001515555111000000000000000000000000888888888800000888888000088888800888888088888888800008888888800',
	'00000000000000001dddd50000000000111000001100000000000000000000000888888888880000888888000088888800888888088888888880088888888880',
	'000000000000000156dd510000000000000000000011000000000000000000000888888888888008888888800088888800888888088888888888088888888880',
	'000000000000001d66d1000015001000000000000005510000000000000000000288882288888008888888800088888800888888088882288888088882288880',
	'00000000000001dddd55100150000000000000000005555000000000000000000088880028888008888888800028888888888882088880028888088880088880',
	'0000000000000566d511000510000000000000000000111000000000000000000088880088882008882288800008888888888880088880088888088880088880',
	'0000000000001d6d5100000100000000000000000000000100000000000000000088888888880088880088880008828888828880088888888882088880088880',
	'000000000000dd550000000100000000000000000000000110000000000000000088888888820088880088880008808888808880088888888880088880088880',
	'00000000001d60000000000000000000000000000000000011000000000000000088888888800088888888880008808888808880088888888888088880088880',
	'0000000000d6d5100000000000000000000000000000000005100000000000000088882288880088888888880008802888208880088882288888088880088880',
	'0000000005665d550000000000000000000000000000000011001000000000000088880088880088888888880008800888008880088880028888088880088880',
	'000000051d6ddd110000000000000000000000000000000001100000000000000888888088888888882288888088880888088888088880088888088880088880',
	'00000001d6d511100000000000000000000000000010000000010000000000000888888088888888880088888088880888088888088888888888088888888880',
	'0000000051d100000001100000000000000000000001000000155000000000000888888088888888880088888088880282088888088888888882088888888880',
	'00000001d55000000005100000000000000000000000000000051100000000000888888088888888880088888088880080088888088888888820028888888820',
	'00000005ddd500000015000000000000000010000000000000010100000000000222222022222222220022222022220020022222022222222200002222222200',
	'00000005d6650000005d0000000000000000220000000000000001000000000000008000000000000000000000055b330007533b000663b30000000000000000',
	'000000155dd5000000150000100000000000222000000000000001000000000000097f0006660606060060600007533b00055333000663330000000000000000',
	'0000001d5511000000551100022000000002222220000000001111000000000000a777e0060606560600060000055333557573b3555113330000000000000000',
	'000000ddd5000000002505101222000000022222200000000001551000000000000b7d00066606060660060000057b337555533357511b330000000000000000',
	'00001d66d50000010005150022220110002422222000000000015d50000000000000c00000000000000000000005533b0007533b0005733b0000000000000000',
	'001d6d5650000000000111002422110000242222200000000000155100000000000000000000000000000000000753335755533355715b330000000000000000',
	'005555dd00000000002501012422500000242222200000000000000110000000000000000000000000000000000553b355575b33755753330000000000000000',
	'00011dd51000001020200001222510000022222220000000000000000000000000000000000000000000000000057333b33b333bb3b333b30000000000000000',
	'00005dd5000000012220100022251000022222222000000000000550000000000000000000000000000000000006600000000000000663330000000000000000',
	'00055d510000000055421000022100000222222200000000000000110000000000000000000000000000000000066000000000000006633b0000000000000000',
	'00010d5000000010254210002220000002222222220000000000000000000000000000000000000000000000000115755575557575511b330000000000000000',
	'000055501000011026d5000011200015444444222000000000000001000000000000000000000000000000000001155575557555557113330000000000000000',
	'00005d510000010225555f555ff4502444444444222000000000000550000000000000000000000000000000000110000000000000011b330000000000000000',
	'00005655100000015ff444fddff452444444400002200000000000005100000000000000000000000000000000011755575557555751133b0000000000000000',
	'0000566500000005f452100554444544445000052222000000000000500000000000000000000000000000000001155755575557555113330000000000000000',
	'000055d500000005f444550000544f4220000005444200000000000051000000000000000000000000000000000b33b333b33b33b3b333b30000000000000000',
	'0000151000000004f44445101154ff44021510002442200000000000115000000000000000000000000000000000000000000000000000000000000000000000',
	'0000055500000004ff445610d544f444225651550244220000000000111100008888888088888880888888808888888088888880888888800000000000000000',
	'0000565100000004ffffffffd44fff442444dd422242220000000000111000008efffe808efffe808e222e808211128082111280821112800000000000000000',
	'00016d5100000104ffffff4444ffff442444444444422200000000001550000008efe80008efe80008fff80008e2e80008222800082128000000000000000000',
	'00166d5500001404fffffffff4ffff4444444444444222000000000015500000008f8000008f8000008f8000008f8000008e8000008280000000000000000000',
	'01dd6d5500005444ffffffffffffff4444444444444222000000000105510000082f2800082f2800082f280008efe80008efe80008efe8000000000000000000',
	'055d665510005445ffffffffffffff4444444444444222005000000500100000821f128082fff2808efffe808efffe808efffe808efffe800000000000000000',
	'115dddd1500004f4ff99449fffffff442444444444222224d0000005100000008888888088888880888888808888888088888880888888800000000000000000',
	'0051ddd555000055ff9444ffffffff44444444444422205f50000005510000000000000000000000000000000000000000000000000000000000000000000000',
	'0000565511100000444944ffffffff4442444444442220d500000005000000000000000000000000000000000000000000000000000000000000000000000000',
	'0000155011110000544444ffffffff44444444444222100000000015000000000000000000000000000000000000000000000000000000000000000000000000',
	'0000051001100100544444fffffffff4444444444222110000000001000000000000000000000000000000000000000000000000000000000000000000000000',
	'0000011011500000044449fffff44442224444444422510000000001000000000000000000000000000000000000000000000000000000000000000000000000',
	'000001105155000004449fffffdd4445002444224221500000000001100000000000000000000000000000000000000000000000000000000000000000000000',
	'00000015500510000544ffffff4f4454011224222220500000000155510000000000000000000000000000000000000000000000000000000000000000000000',
	'00000015d51100000544fffffffff45f4550222422015005000015d5500000000000000000000000000000000000000000000000000000000000000000000000',
	'0000000d5d5500000044fffff4fd444444444222220d500d10000155000000000000000000000000000000000000000000000000000000000000000000000000',
	'0000000d5d5d555000554ff44455224442224422211d000d60000565100000000000000000000000000000000000000000000000000000000000000000000000',
	'000000151255d4d000054ff45d4ff4f4444444222055100d6d000551000000000000000000000000000000000000000000000000000000000000000000000000',
	'000000d1225155d1000554f4fffd4444424444201051220d56601000000000000000000000000000000000000000000000000000000000000000000000000000',
	'000000d222515d650005d444fff44222224442201102222d55661100000000000000000000000000000000000000000000000000000000000000000000000000',
	'000005d222505d6550006d444ff44445544442000002222dd05d6555100000000000000000000000000000000000000000000000000000000000000000000000',
	'00000d22255025d551005f4444f4df4fe442211000222225d0015d566d5000000000000000000000000000000000000000000000000000000000000000000000',
	'00000d22251022555550066444dfffff4442011000222222500121056676d1000000000000000000000000000000000000000000000000000000000000000000',
	'00000d222d002221055105fd44ff6d444422110002222222500121100156776d0000000000000000000000000000000000000000000000000000000000000000',
	'000055220d0022210155016ff4dd555442221101122222225011200000551dd60000000000000000000000000000000000000000000000000000000000000000',
	'0001d2221d002220001000dfff442105522222222222222210125000011000010000000000000000000000000000000000000000000000000000000000000000',
	'0005522255022220001005ffffff4444444222242224222211221000100000000000000000000000000000000000000000000000000000000000000000000000',
	'0005512255022220000057ffffffffff444244444444442212221001000000000000000000000000000000000000000000000000000000000000000000000000',
	'000d2011d12222200016fff4ffffffffe42244444444422212220000000000000000000000000000000000000000000000000000000000000000000000000000',
	'00152105d5242240057dff444ffff44ff42244444444442212250000000000000000000000000000000000000000000000000000000000000000000000000000',
	'0052215552242241d65df44f4fffff44442244444444442225110000000000000000000000000000000000000000000000000000000000000000000000000000',    
];
rom_map = [

	'40724141417241414172414178514173415141724171414151417274787273420000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'501d0d0000000000030303000079000001503d022d00580350010000000058500000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'500000000000000000000000007c00000150000000002d015000000000002d500000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'50000000004041414141414141620000016056414141414161415641514141520000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'6371696a735200000000000000000000000000000000000000000000500158500000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'7600000000640000000000000000000000000000000000000000000050003d500000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'506800000063696a51787141414173714178415174696a7142000000500000500000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'7600000058770000760000000000000200001d760000000250000000605641520000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'500000002d5000005000000000000000000068770000006877000000000000500000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'63414141786200006041415642000000000000790000000050000000000000500000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'50001d1d0000000000000000766800000000007c0000000050000000000000500000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'50000000000000000000000060425800000000775800580050000000000000500000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'50000000000000000000000000503d00000001763d002d0176580000000001500000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'5000004041564170747042000063414141417446414141416141696a696a41520000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'5000005003000000003a48000064000000003a500200000000010000000001500000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'50000047000000004141520000470000004171520000000000000000000000500000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'50000050000000000039500000500000000039500000000000000000000000500000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'5000004700000000000248000047003d000200500000000000000000000000500000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'50000060417041704170620000605641704170464141414141415156565172620000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'7600000000000000000000000000000000000150656565656565507f7fab65650000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'6341414141414141420000000000000000000077656565656565507f7fab65650000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'ab65656565656565640000000000004041724152656565656565507f7fab65650000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'ab6565656565656550013d022d0001507f7f7f50656565656565507f7fab65650000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'ab6565656565656560417241417241627f7f7f50656565656565507f7fab65650000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'ab65656565656565656565657f7f7f7f7f7f7f50656565656565507f7fab65650000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'ab65656565656565657f7f7f7f7f7f7f7f7f7f604141696a4141627f7fbbbcad0000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'ab657f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7fab0000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'ab7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7fab0000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'ab7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7fab0000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'bbbc696abcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbd0000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'45454545454545454545454545454545454545454545454545454545454545450000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'55555555555555555555555555555555555555555555555555555555555555550000000000000000000000000000000000000000000000000000000000000000',
	'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
];
rom_flags = [

    '0001010100000000000000000001000000000000000000000000000000010000000000000000000000000000000100000000000000000000000101000001000001010101010001010100000000000000010101000000010001000000000000000101010101000000000301020002000001010101010101010105040401000000',
	'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001010100000000000000000000000000010101000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',    
];


// Run ///////////////////////////////////////

var bdr = sc( originalDimension );
var bdr_btm = height - bdr;
var bdr_right = width - bdr;
var clearOutside = function () {
    
    fill(255, 255, 255);
    noStroke();
    rect( 0, bdr, width, bdr_btm );
    rect( bdr, 0, bdr_right, height );
};


// reload();
// _init();

var draw = function () {
    
    _update();
    _draw();
    
    clearOutside();
    
    // noLoop();
};


// Talk to outside world (invasive =/) ---------------------

setup_ = function () {

    reload();
    _init();
};

draw_ = function () {

    draw();

    if ( loop_ )
        window.requestAnimationFrame( draw_ );
};

