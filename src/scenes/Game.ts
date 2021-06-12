import Phaser from 'phaser';

export default class Demo extends Phaser.Scene {

  // cursors = null as Phaser.Types.Input.Keyboard.CursorKeys|null;
  controls = null as Phaser.Cameras.Controls.FixedKeyControl|null;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.tilemapTiledJSON('tilemap', 'assets/test-map.json');
    this.load.image('base_tiles', 'assets/tiles_sheet.png');
  }

  create() {

    // create the Tilemap
    const map = this.make.tilemap({ key: 'tilemap' })

    // add the tileset image we are using
    const tileset = map.addTilesetImage('tiles_sheet', 'base_tiles')
    map.createLayer('Tile Layer 1', tileset);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setScroll(0, 100000);
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
