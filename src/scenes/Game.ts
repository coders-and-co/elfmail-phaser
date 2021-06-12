import Phaser from 'phaser';
import Misty from "../objects/Misty";

export default class Demo extends Phaser.Scene {

  // cursors = null as Phaser.Types.Input.Keyboard.CursorKeys|null;
  controls = null as Phaser.Cameras.Controls.FixedKeyControl|null;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.tilemapTiledJSON('tilemap', 'assets/test-map.json');
    this.load.image('base_tiles', 'assets/tiles_sheet.png');
    this.load.spritesheet('misty', 'assets/player_sheet.png', {frameWidth: 70, frameHeight: 100});
  }

  create() {

    // create Misty
    const misty = new Misty(this, 200, 7700, 'misty')

    // add to this scene
    this.add.existing(misty);

    // add to physics engine
    this.physics.add.existing(misty);

    // create the Tilemap
    const map = this.make.tilemap({ key: 'tilemap' })

    // add the tileset image we are using
    const tileset = map.addTilesetImage('tiles_sheet', 'base_tiles')
    const layer = map.createLayer('Tile Layer 1', tileset);
    layer.setCollisionByExclusion([-1], true);

    this.physics.add.collider(misty, layer);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setScroll(0, 10000);
    this.cameras.main.startFollow(misty);

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 5.0
    };

    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

  }

  update(time: number, delta: number) {
    this.controls?.update(delta);
  }

}
