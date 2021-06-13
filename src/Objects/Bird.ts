import Phaser, { Scene } from 'phaser';

export default class Bird extends Phaser.GameObjects.Sprite {

    body: Phaser.Physics.Arcade.StaticBody;
    world: Phaser.Physics.Arcade.World|null = null;
    id: number;
    rightFacing: boolean;
    flyingHome: boolean = false;
    originalXCoord: number;
    flapSpeed: number = 5;
    coordinates = {
        x: 0,
        y: 0,
    }

    constructor(scene:Scene, world: Phaser.Physics.Arcade.World, x: number, y: number, texture: string, id: number, right: boolean, frame?: number) {

        super(scene, x, y, texture, frame); // The frame is optional
        this.originalXCoord = x;
        this.rightFacing = right;
        this.world = world;
        this.id = id;
        // add bird to the scene
        scene.add.existing(this); // add bird to this scene

        // add bird to the Physics world
        this.body = new Phaser.Physics.Arcade.StaticBody(world, this);
        world.add(this.body);

        // set letter''s collision properties
        // this.body.setCollideWorldBounds(true);
        this.body.setSize(165, 55);
        this.body.setOffset(-30,45);
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
        if (right) {
            this.setFlip(true,false)
        }
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
        if (this.y > 0 && !this.flyingHome) {
            this.x = this.rightFacing? this.x + this.flapSpeed: this.x - this.flapSpeed;
            this.y = this.rightFacing? this.y - this.flapSpeed: this.y - this.flapSpeed;
            var timer = this.world?.scene.time.delayedCall(12, this.flapFlap, undefined, this);
        } else if (this.y < 3000) {
            this.flyingHome = true;
            if (this.rightFacing) {
                this.setFlip(false,false)
            } else {
                this.setFlip(true,false)
            }
            this.x = this.rightFacing? this.x - this.flapSpeed: this.x + this.flapSpeed;
            this.y = this.rightFacing? this.y + this.flapSpeed: this.y + this.flapSpeed;
            var timer = this.world?.scene.time.delayedCall(12, this.flapFlap, undefined, this);
        } else if (this.flyingHome && this.x != this.originalXCoord) {
            this.x = this.rightFacing? this.x - this.flapSpeed: this.x + this.flapSpeed;
            this.y = this.rightFacing? this.y + this.flapSpeed: this.y + this.flapSpeed;
            var timer = this.world?.scene.time.delayedCall(12, this.flapFlap, undefined, this);
        } else if (this.x == this.originalXCoord) {
            this.flyingHome = false;
            this.anims.play('bird_resting', true);
            this.body.enable = true;
            this.rightFacing = !this.rightFacing;
        }
    }
}