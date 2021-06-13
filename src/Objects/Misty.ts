import Phaser, { Scene } from 'phaser';
import BaseState, { StateReturn } from '../states/BaseState';
import IdleState from '../states/IdleState';

export default class Misty extends Phaser.GameObjects.Sprite {

    movementState: BaseState|null = null;
    body: Phaser.Physics.Arcade.Body;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    runSpeed = 800;
    jumpPower = 1200;
    jumpJustPressed = false;
    hasDoubleJump = false;

    graceFrames = 8;



    constructor(scene:Scene, world: Phaser.Physics.Arcade.World, cursors: Phaser.Types.Input.Keyboard.CursorKeys, x: number, y: number, texture: string, frame?: number) {

        super(scene, x, y, texture, frame); // The frame is optional

        // add Misty to the scene
        scene.add.existing(this); // add Misty to this scene

        // save referece to cursors
        this.cursors = cursors;

        // set jump handler
        cursors.space.on('down', this.handleJump.bind(this));

        // add Misty to the Physics world
        this.body = new Phaser.Physics.Arcade.Body(world, this);
        this.setDepth(1);
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

        // set initial MovementState
        // this.movementState = new IdleState(this, cursors);
        this.changeState({type: IdleState});

    }

    update(time: number, delta: number) {

        // Update MovementState and respond to state changes
        const nextState = this.movementState!.update();
        if (nextState) {
            this.changeState(nextState);
        }
        this.jumpJustPressed = false;
    }

    handleJump() {
        // console.log('SPACE!');
        this.jumpJustPressed = true;
        // console.log(this);
    }

    changeState(nextState: StateReturn) {
        console.log(nextState.type.name, nextState.params);
        if (this.movementState != null) {
            this.movementState.exit();
        }
        this.movementState = new nextState.type(this, this.cursors);
        this.movementState.enter(nextState.params || {});
    }
}