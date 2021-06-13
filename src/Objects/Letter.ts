import Phaser, { Scene } from 'phaser';
import BaseState from '../states/BaseState';
import IdleState from '../states/IdleState';

export enum LetterTypes {
    love = 0,
    work = 1,
    meme = 2,
    canine = 3
}
export enum LetterStates {
    waiting = 0,
    pickedUp = 1,
    delivered = 2,
}
export default class Letter extends Phaser.GameObjects.Sprite {

    body: Phaser.Physics.Arcade.StaticBody;
    deliveryState: LetterStates|null = null;
    world: Phaser.Physics.Arcade.World|null = null;
    id: number;
    letterType: LetterTypes|null = null;
    coordinates = {
        x: 0,
        y: 0,
    }

    constructor(scene:Scene, world: Phaser.Physics.Arcade.World, x: number, y: number, texture: string, id: number, letterType: LetterTypes, frame?: number ) {

    super(scene, x, y, texture, frame); // The frame is optional

        this.world = world;
        this.id = id;
        this.deliveryState = LetterStates.waiting;
        this.setDepth(99);
        // add letter to the scene
        scene.add.existing(this); // add letter to this scene

        // add letter to the Physics world
        this.body = new Phaser.Physics.Arcade.StaticBody(world, this);
        world.add(this.body);

        // set letter''s collision properties
        // this.body.setCollideWorldBounds(true);
        this.body.setSize(90,73);
        this.body.setOffset(5,15);

        this.anims.create({
            key: 'letter_animation',
            frames: this.anims.generateFrameNumbers('letter_animation', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'letter_get',
            frames: this.anims.generateFrameNumbers('letter_get', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.play('letter_animation',true);


    }

    collected () {
        this.destroy();
    }
}