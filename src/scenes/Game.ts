import Phaser, { Textures } from 'phaser';
import Misty from "../objects/Misty";
import IdleState from '../states/IdleState';
import BaseState from '../states/BaseState';

export default class Demo extends Phaser.Scene {

  cursors: Phaser.Types.Input.Keyboard.CursorKeys|null = null;
  misty: Misty|null = null;
  bg: Phaser.GameObjects.Image|null = null;


  constructor() {
    super('GameScene');
  }
  preload() {
    this.load.image('sky','assets/sky_gradient.png');
    this.load.tilemapTiledJSON('tilemap', 'assets/test-map.json');
    this.load.image('base_tiles', 'assets/tiles_sheet.png');
    this.load.spritesheet('misty_run', 'assets/run_animation.png', {frameWidth: 100, frameHeight: 150});
    this.load.spritesheet('misty_idle', 'assets/misty_testanim.png', {frameWidth: 100, frameHeight: 150});
    this.load.spritesheet('misty_fall', 'assets/fall_animation.png', {frameWidth: 100, frameHeight: 150});
    this.load.spritesheet('misty_jump', 'assets/jump_animation.png', {frameWidth: 100, frameHeight: 150});
  }
  create() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0);
    this.misty =  new Misty(this, 200, 9500, 'misty_idle');

    // add to this scene
    this.add.existing(this.misty);

    // add to physics engine
    this.physics.add.existing(this.misty);
    this.misty.body.setCollideWorldBounds(true);
    this.misty.body.setSize(33,90);
    this.misty.body.setOffset(33,60)




    // TILEMAP LOADING
    const map = this.make.tilemap({ key: 'tilemap' })
    // add the tileset image we are using
    const tileset = map.addTilesetImage('tiles_sheet', 'base_tiles')
    // load layers
    const bgLayer = map.createLayer('Background', tileset);
    const fgLayer = map.createLayer('Tile Layer 1', tileset);
    bgLayer.setDepth(-1);
    fgLayer.setCollisionByExclusion([-1], true);

    this.physics.add.collider(this.misty, fgLayer);

    this.misty.movementState = new IdleState(this.misty);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.cameras.main.setScroll(0, 10000);
    this.cameras.main.startFollow(this.misty);

    // BACKGROUND
    this.bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'sky');
    this.bg.setDepth(-2);
    this.bg.setScrollFactor(this.bg.width / (map.widthInPixels * 5), 0.04);


    this.cursors = this.input.keyboard.createCursorKeys();

    //this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
    this.anims.create({
      key: 'misty_run',
      frames: this.anims.generateFrameNumbers('misty_run', { start: 0, end: 6 }),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'misty_idle',
      frames: [ { key: 'misty_idle', frame: 0 } ],
      frameRate: 20
    });

    this.anims.create({
      key: 'misty_fall',
      frames: this.anims.generateFrameNumbers('misty_fall', { start: 0, end: 2 }),
        frameRate: 15,
        repeat: -1
      });

    this.anims.create({
      key: 'misty_jump',
      frames: this.anims.generateFrameNumbers('misty_jump', { start: 0, end: 1 }),
      frameRate: 15,
      repeat: -1
    });
  }

  update(time: number, delta: number) {

    if(!this.misty || !this.cursors) {
      return;
    }

    const nextState = this.misty.movementState!.update(this.cursors);
    if (nextState) {
      console.log(this.misty.movementState);
      this.misty.movementState = nextState;
    }
  }
}