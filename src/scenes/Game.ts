import Phaser from 'phaser';
import Misty from "../objects/Misty";

export default class Demo extends Phaser.Scene {

  // cursors = null as Phaser.Types.Input.Keyboard.CursorKeys|null;
  controls = null as Phaser. Cameras.Controls.FixedKeyControl|null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private misty;


  constructor() {
    super('GameScene');
  }
  preload() {
    this.load.tilemapTiledJSON('tilemap', 'assets/test-map.json');
    this.load.image('base_tiles', 'assets/tiles_sheet.png');
    this.load.spritesheet('misty', 'assets/player_sheet.png', {frameWidth: 70, frameHeight: 100});
  }
  create() {

    this.misty =  new Misty(this, 200, 7700, 'misty');


    // add to this scene
    this.add.existing(this.misty);

    // add to physics engine
    this.physics.add.existing(this.misty);

    // create the Tilemap
    const map = this.make.tilemap({ key: 'tilemap' })

    // add the tileset image we are using
    const tileset = map.addTilesetImage('tiles_sheet', 'base_tiles')
    const layer = map.createLayer('Tile Layer 1', tileset);
    layer.setCollisionByExclusion([-1], true);

    this.physics.add.collider(this.misty, layer);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setScroll(0, 10000);
    this.cameras.main.startFollow(this.misty);

    // var cursors = this.input.keyboard.createCursorKeys();
    this.cursors = this.input.keyboard.createCursorKeys();


    // var controlConfig = {
    //   camera: this.cameras.main,
    //   left: cursors.left,
    //   right: cursors.right,
    //   up: cursors.up,
    //   down: cursors.down,
    //   speed: 5.0
    // };

    //this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

  }

  update(time: number, delta: number) {
    //this.controls?.update(delta);
    if (this.cursors.left.isDown)
    {
      console.log('leftt');
      this.misty.body.setVelocityX(-160);

      this.misty.anims.play('left', true);
    }
    else if (this.cursors.right.isDown)
    {
      this.misty.body.setVelocityX(160);

      this.misty.anims.play('right', true);
    }
    else
    {
      this.misty.body.setVelocityX(0);

      this.misty.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.misty.body.touching.down)
    {
      this.misty.body.setVelocityY(-330);
     }
  }

}
