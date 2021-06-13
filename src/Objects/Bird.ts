import Phaser, { Scene } from 'phaser';

export default class Bird extends Phaser.GameObjects.Sprite {

    body: Phaser.Physics.Arcade.StaticBody;
    world: Phaser.Physics.Arcade.World|null = null;
    id: number;
    coordinates = {
        x: 0,
        y: 0,
    }

    constructor(scene:Scene, world: Phaser.Physics.Arcade.World, x: number, y: number, texture: string, id: number, frame?: number) {

        super(scene, x, y, texture, frame); // The frame is optional

        this.world = world;
        this.id = id;
        // add bird to the scene
        scene.add.existing(this); // add bird to this scene

        // add bird to the Physics world
        this.body = new Phaser.Physics.Arcade.StaticBody(world, this);
        world.add(this.body);

        // set letter''s collision properties
        // this.body.setCollideWorldBounds(true);
        this.body.setSize(140, 55);
        this.body.setOffset(-10,45);
        this.setDepth(0);

        this.anims.create({
            key: 'bird_resting',
            frames: this.anims.generateFrameNumbers('bird_resting', { start: 0, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'bird_flying',
            frames: this.anims.generateFrameNumbers('bird_flying', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.play('bird_resting', true);

    }

    fly () {
        this.anims.play('bird_flying', true);
        this.update()
    }

    update() {
        this.body.enable = false;
        this.flapFlap();
    }

    flapFlap() {
        if (this.y > 0) {
            this.x = this.x - 3;
            this.y = this.y - 3;
            var timer = this.world?.scene.time.delayedCall(12, this.flapFlap, undefined, this);
        }
    }
}