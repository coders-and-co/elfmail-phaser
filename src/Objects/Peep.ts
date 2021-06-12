import Phaser, { Scene } from 'phaser';
import BaseState from '../states/BaseState';
import IdleState from '../states/IdleState';

export default class Peep extends Phaser.GameObjects.Sprite {

    body: Phaser.Physics.Arcade.StaticBody;
    sender: boolean;
    world: Phaser.Physics.Arcade.World|null = null;
    id: number;
    coordinates = {
        x: 0,
        y: 0,
    }

    constructor(scene:Scene, world: Phaser.Physics.Arcade.World, x: number, y: number, texture: string, id: number, sender: boolean, frame?: number) {

        super(scene, x, y, texture, frame); // The frame is optional

        this.world = world;
        this.id = id;
        this.sender = sender;
        // add letter to the scene
        //if (sender) {
            scene.add.existing(this); // add letter to this scene
        //}

        // add letter to the Physics world
        this.body = new Phaser.Physics.Arcade.StaticBody(world, this);
        world.add(this.body);

        // set letter''s collision properties
        // this.body.setCollideWorldBounds(true);
        this.body.setSize(90,73);
        this.body.setOffset(5,15);
        this.setDepth(0);

        this.anims.create({
            key: 'computer_peep',
            frames: this.anims.generateFrameNumbers('computer_peep', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: -1
        });
        this.anims.play('computer_peep', true);

    }

    collected () {
        this.destroy();
    }
}