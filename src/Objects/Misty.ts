import Phaser, { Scene } from 'phaser';
import BaseState, { StateReturn } from '../states/BaseState';
import IdleState from '../states/IdleState';

export enum Direction {
    Left,
    Right
}

export default class Misty extends Phaser.GameObjects.Sprite {

    movementState: BaseState|null = null;
    body: Phaser.Physics.Arcade.Body;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    gamepad: Phaser.Input.Gamepad.Gamepad|null = null;

    // horizontal movement maximums (these can be exceeded, but they will dampen/decay)
    maxSpeed = {
        run: 750,               // misty's max running speed
        slide: 2250,            // misty's max sliding speed
    }
    // horizontal acceleration
    acceleration = {
        run: 32,                 // acceleration when running
        turn: 32 * 1.33,         // acceleration when turning around
        slide: 40,              // acceleration when sliding
    }
    // dampening factors for different conditions
    dampenVelocity = {
        ground: 0.80,           // dampening factor when idle on ground
        air: 0.97,              // dampening factor when jumping/falling without pushing left or right
        overMax: 0.998,         // dampening factor to apply when moving over any maximum
    }

    // jumping constants
    jumpPower = 1200;           // velocity.y impluse for jumping
    graceJumpTimer = 120;       // ms to allow a jump input following a run off an edge
    fallThruPower = 400;        // velocity.y to add when falling thru
    fallThruTimer = 300;        // ms to disable collisions when misty falls thru a platform
    jumpDecay = 0.90;           // amount to decay velocity.y per frame when jump button released
    jumpJustPressed = false;    // was the jump button pressed on the current frame?
    hasDoubleJump = false;      // does misty have a double jump available?
    fallThru = false;           // is misty currently falling thru?

    // tracks the wire misty is currently sliding on (if any)
    touchingWire: Phaser.GameObjects.Line|null = null;

    // particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
    particles!: {
        sparks: Phaser.GameObjects.Particles.ParticleEmitterManager;
        stars: Phaser.GameObjects.Particles.ParticleEmitterManager;
        sparkles: Phaser.GameObjects.Particles.ParticleEmitterManager;
        poofs: Phaser.GameObjects.Particles.ParticleEmitterManager;
    }

    constructor(scene:Scene, world: Phaser.Physics.Arcade.World, cursors: Phaser.Types.Input.Keyboard.CursorKeys, x: number, y: number, texture: string, frame?: number) {

        // gamepad: Phaser.Input.Gamepad.Gamepad,
        super(scene, x, y, texture, frame); // The frame is optional

        // add Misty to the scene
        scene.add.existing(this); // add Misty to this scene


        this.particles = {
            sparks: scene.add.particles('sparks'),
            stars: scene.add.particles('stars'),
            sparkles: scene.add.particles('sparkles'),
            poofs: scene.add.particles('poofs'),
        }

        this.particles.sparks.createEmitter({
            on: false,
            follow: this,
            followOffset: {x: 0, y: 85},
            speed: 500,
            gravityY: 1000,
            lifespan: 500,
            blendMode: 'ADD', // 'ADD'
            frequency: 20,
            angle: { min: 240, max: 300 },
            frame: {
                frames: [0,1,2,3],
                cycle: false,
            }
        });

        this.particles.stars.createEmitter({
            name: 'jump',
            on: false,
            follow: this,
            followOffset: {x: 0, y: 50},
            alpha: { start: 1, end: 0.5},
            scale: { start: 2, end: 0.3 },
            rotate: { min: 0, max: 360},
            speed: 400,
            gravityY: 100,
            lifespan: 300,
            blendMode: 'ADD', // 'ADD'
            frequency: 0,
            quantity: 7,
            angle: { min: 0, max: 180 },
            frame: {
                frames: [0,1],
                cycle: true,
            }
        });

        this.particles.stars.createEmitter({
            name: 'deliver',
            on: false,
            follow: this,
            followOffset: {x: 0, y: -25},
            alpha: { start: 0.5, end: 0.2},
            scale: { start: 2, end: 1 },
            rotate: { min: 0, max: 360},
            speed: { min: 500, max: 600},
            gravityY: 400,
            lifespan: 600,
            blendMode: 'ADD', // 'ADD'
            frequency: 0,
            quantity: 15,
            frame: {
                frames: [0,1],
                cycle: true,
            }
        });

        this.particles.sparkles.createEmitter({
            on: false,
            follow: this,
            followOffset: {x: 0, y: 85},
            speed: 20,
            alpha: { start: 1, end: 0},
            gravityY: 100,
            lifespan: 1000,
            blendMode: 'ADD', // 'ADD'
            frequency: 60,
            // angle: { min: 240, max: 300 },
            frame: {
                frames: [0,1],
                cycle: true,
            }
        });

        this.particles.poofs.createEmitter({
            on: false,
            follow: this,
            alpha: { start: 0.4, end: 0.1},
            rotate: { min: 0, max: 360},
            scale: { start: 1, end: 0.5 },
            speed: 320,
            gravityY: 1100,
            lifespan: 250,
            blendMode: 'SCREEN', // 'ADD'
            frequency: 300,
            followOffset: {x: 0, y: 85},
            quantity: 2,
            angle: { min: 180, max: 360 },
            frame: {
                frames: [0,1],
                cycle: true,
            }
        });


        // this.particles.stars.createEmitter({
        //     ...starsConfig,
        //     angle: { min: 120, max: 180 },
        // });


        // save referece to cursors
        this.cursors = cursors;
        // this.gamepad = gamepad;
        // console.log(gamepad);

        // set jump handler
        cursors.space.on('down', this.handleJump.bind(this));
        this.scene.input.gamepad.on('down', function (this: any, pad, button, index) {
            this.gamepad = pad;
            if (button.index == 0) {
                this.handleJump();
            }
        }, this);


        // set rendering depth
        this.setDepth(1);

        // add Misty to the Physics world
        this.body = new Phaser.Physics.Arcade.Body(world, this);
        world.add(this.body);

        // set Misty's collision properties
        this.body.setCollideWorldBounds(true);
        this.body.setSize(40,90);
        this.body.setOffset(30,60);

        // Create animations
        this.anims.create({
            key: 'misty_idle',
            frames: this.anims.generateFrameNumbers('misty_idle', { start: 0, end: 7 }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'misty_run',
            frames: this.anims.generateFrameNumbers('misty_run', { start: 0, end: 6 }),
            frameRate: 18,
            repeat: -1
        });

        this.anims.create({
            key: 'misty_jump',
            frames: this.anims.generateFrameNumbers('misty_jump', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'misty_fall',
            frames: this.anims.generateFrameNumbers('misty_fall', { start: 0, end: 2 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'misty_double_jump',
            frames: this.anims.generateFrameNumbers('misty_double_jump', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'misty_slide',
            frames: this.anims.generateFrameNumbers('misty_slide', { start: 0, end: 1 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'misty_collect',
            frames: this.anims.generateFrameNumbers('misty_collect', { start: 0, end: 4 }),
            duration: 400,
        });

        this.anims.create({
            key: 'misty_deliver',
            frames: this.anims.generateFrameNumbers('misty_deliver', { start: 0, end: 7 }),
            duration: 600,
        });

        // set initial MovementState
        // this.movementState = new IdleState(this, cursors);
        this.changeState({type: IdleState});

    }

    update(time: number, delta: number) {
        if (this.body.moves) {
            // Update MovementState and respond to state changes
            const nextState = this.movementState!.update(delta);
            if (nextState) {
                this.changeState(nextState);
            }
            this.jumpJustPressed = false;
        }
    }

    updateVelocityX(direction: Direction) {

        if (direction == Direction.Left){
            if (this.body.velocity.x > 0) {
                this.body.velocity.x -= this.acceleration.turn;
            } else if (this.body.velocity.x > -this.maxSpeed.run) {
                this.body.velocity.x -= this.acceleration.run;
            } else if (this.body.velocity.x < -this.maxSpeed.run) {
                this.body.velocity.x *= this.dampenVelocity.overMax;
            }
        } else if (direction == Direction.Right) {
            if (this.body.velocity.x < 0) {
                this.body.velocity.x += this.acceleration.turn;
            } else if (this.body.velocity.x < this.maxSpeed.run) {
                this.body.velocity.x += this.acceleration.run;
            } else if (this.body.velocity.x > this.maxSpeed.run) {
                this.body.velocity.x *= this.dampenVelocity.overMax;
            }
        }

    }

    handleJump() {
        this.jumpJustPressed = true;
    }

    changeState(nextState: StateReturn) {
        // console.log(nextState.type.name, nextState.params);
        if (this.movementState != null) {
            this.movementState.exit();
        }
        this.movementState = new nextState.type(this, this.cursors); // this.gamepad
        this.movementState.enter(nextState.params || {});
    }

    exclaim(type: string, delay?: number) {
        this.body.moves = false;
        this.anims.play(type, true);
        var timer = this.scene.time.delayedCall( delay? delay : 350, this.move, [this]);
    }

    move() {
        arguments[0].body.moves = true;
    }
}