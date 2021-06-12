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
    this.load.spritesheet('misty', 'assets/run_animation.png', {frameWidth: 100, frameHeight: 150});
    this.load.spritesheet('misty_stand', 'assets/misty_testanim.png', {frameWidth: 100, frameHeight: 150});
  }

  create() {



    this.misty =  new Misty(this, 200, 9000, 'misty_stand');

    // add to this scene
    this.add.existing(this.misty);

    // add to physics engine
    this.physics.add.existing(this.misty);
    this.misty.body.setCollideWorldBounds(true);




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
      key: 'left',
      frames: this.anims.generateFrameNumbers('misty', { start: 0, end: 6 }),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('misty', { start: 0, end: 6 }),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [ { key: 'misty_stand', frame: 0 } ],
      frameRate: 20
    });

  }

  update(time: number, delta: number) {

    if(!this.misty || !this.cursors) {
      return;
    }

    // this.bg!.setPosition(this.cameras.main., 10000);
    // this.bg!.


    const nextState = this.misty.movementState!.update(this.cursors);
    if (nextState) {
      console.log(this.misty.movementState);
      this.misty.movementState = nextState;
    }

  }
}