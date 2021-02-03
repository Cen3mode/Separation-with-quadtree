let partickleSize = 5;
let particlkeCount = 1000;

let partickles;

class Partickle {
    constructor( pos, vel ) {
        this.pos = pos;
        this.vel = vel;
        this.acc = createVector();
    }

    separate( fellas ) {
        fellas.forEach( ( fella, i ) => {
            //if ( dist( this.pos.x, this.pos.y, fella.userData.pos.x, fella.userData.pos.y ) < partickleSize * 3 ) {
            let separation = p5.Vector.sub( this.pos, fella.userData.pos );
            separation.normalize();
            separation.mult( 0.7 );
            this.acc.add( separation );
            //}
        } );

    }

    wallFobia() {
        if ( this.pos.x < 0 ) this.acc.add( createVector( 1, 0 ) );
        if ( this.pos.y < 0 ) this.acc.add( createVector( 0, 1 ) );
        if ( this.pos.x > width ) this.acc.add( createVector( -1, 0 ) );
        if ( this.pos.y > height ) this.acc.add( createVector( 0, -1 ) );
    }

    update() {
        this.acc.limit( 0.1 );
        this.vel.add( this.acc );
        this.pos.add( this.vel );
        this.acc.mult( 0 );
    }

    draw() {
        ellipse( this.pos.x, this.pos.y, partickleSize, partickleSize );
    }
}

let showQuadTree;

function setup() {
    createCanvas( 800, 800 );

    showQuadTree = createCheckbox( "Show Quadtree", false );
    partickles = [];
    for ( var i = 0; i < particlkeCount; i++ ) {
        partickles.push( new Partickle( new p5.Vector( random( width ), random( height ) ), new p5.Vector( random( -1, 1 ), random( -1, 1 ) ) ) );
    }
}

function draw() {
    background( 120 );
    noStroke();
    let qt = new Quadtree();
    partickles.forEach( ( partickle, i ) => {
        qt.insert( new Point( partickle.pos.x, partickle.pos.y, partickle ) );
    } );

    partickles.forEach( ( particle, i ) => {
        let query = qt.query( new Area( particle.pos.x - partickleSize * 3, particle.pos.y - partickleSize * 3, particle.pos.x + partickleSize * 3, particle.pos.y + partickleSize * 3 ) )
        particle.draw();
        particle.separate( query );
        particle.wallFobia();
        particle.update();
    } );
    stroke( 2 );
    if ( showQuadTree.checked() ) qt.show();
    textSize( 20 );
    text( frameRate(), 4, 20 );
}