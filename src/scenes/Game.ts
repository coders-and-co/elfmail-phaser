import Phaser, { GameObjects } from 'phaser';
import Misty from "../Objects/Misty";
import Letter, {LetterTypes} from "../Objects/Letter";
// import City from "../city";
import Peep from "../Objects/Peep";


enum DeliveryState {
    Waiting,
    PickedUp,
    Delivered,
}

export interface Delivery {
    sender: Peep,
    receiver: Peep,
    letter: Letter,
    message: string,
    state: DeliveryState,
}

export interface Point {
    x: number;
    y: number;
}



export default class Demo extends Phaser.Scene {

    misty!: Misty;
    letter!: Letter;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    deliveries: Delivery[] = [];
    windowLocations: Point[] = [];

    constructor() {
        super('GameScene');
    }

    preload() {
        // map
        this.load.tilemapTiledJSON('city_tilemap', 'assets/maps/city.json');
        // images
        this.load.image('sky','assets/sky_gradient.png');
        // this.load.image('test_tiles', 'assets/tiles_sheet.png');
        this.load.image('city_tiles', 'assets/Tileset/tileset_city.png');
        this.load.spritesheet('misty_run', 'assets/misty_animations/run_animation.png', {frameWidth: 100, frameHeight: 150});
        this.load.spritesheet('misty_idle', 'assets/misty_animations/idle_animation_blink.png', {frameWidth: 100, frameHeight: 150});
        this.load.spritesheet('misty_fall', 'assets/misty_animations/fall_animation.png', {frameWidth: 100, frameHeight: 150});
        this.load.spritesheet('misty_jump', 'assets/misty_animations/jump_animation.png', {frameWidth: 100, frameHeight: 150});
        this.load.image('letter', 'assets/letter.png');
        this.load.spritesheet('computer_peep', 'assets/peeps/computer_peep.png', {frameWidth: 200, frameHeight: 200});
        this.load.spritesheet('phone_peep', 'assets/peeps/phone_peep.png', {frameWidth: 200, frameHeight: 200});
    }

    addNewDelivery() {

        const indexSender = Math.floor(Math.random() * this.windowLocations.length);
        const pointSender = this.windowLocations.splice(indexSender, 1)[0];
        const indexReceiver = Math.floor(Math.random() * this.windowLocations.length);
        const pointReceiver = this.windowLocations.splice(indexReceiver, 1)[0];

        const delivery = {
            sender: new Peep(this, this.physics.world, pointSender.x, pointSender.y, 'computer_peep', 1, true),
            receiver: new Peep(this, this.physics.world, pointReceiver.x, pointReceiver.y, 'phone_peep', 1, false),
            letter: new Letter(this, this.physics.world, pointSender.x, pointSender.y - 100, 'letter', 1, LetterTypes.love),
            message: 'watermelons on sale',
            state: DeliveryState.Waiting,
        }

        this.deliveries.push(delivery);

        console.log('delivery', delivery);
        this.physics.add.overlap(delivery.letter, this.misty, this.collected, undefined, delivery);

    }

    create() {

        // Keyboard Controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Misty
        // TODO: Spawn her at the map's spawn point instead of a hardcoded value
        this.misty = new Misty(this, this.physics.world, this.cursors, 200, 9500, 'misty_idle');



        // Load Tilemap
        const city = this.make.tilemap({ key: 'city_tilemap' });

        // add the tileset image we are using
        // const test_tileset = city.addTilesetImage('tiles_sheet', 'test_tiles');
        const base_tileset = city.addTilesetImage('tileset_buildings', 'city_tiles');

        // load layers

        // 'BG Parallax 1' (image)
        // 'BG Parallax 2' (image)
        // 'BG Parallax 3' (image)
        // 'Background Tiles'
        // 'Foreground Tiles'
        // 'Overlay Tiles'
        // 'Wires'
        // 'Triggers'

        // const bgLayers = [
        //     map.createLayer('BG Parallax 1', tileset),
        //     map.createLayer('BG Parallax 2', tileset),
        //     map.createLayer('BG Parallax 3', tileset),
        // ]
        console.log('Image Layers:');
        console.log(city.images);

        const tileLayers = [
            city.createLayer('Background Tiles', base_tileset),
            city.createLayer('Foreground Tiles', base_tileset),
            city.createLayer('Overlay Tiles', base_tileset),
        ]

        // process spawn triggers
        const triggers = city.getObjectLayer('Spawn Triggers');
        for (const t of triggers.objects) {
            if (t.rectangle && t.type == 'window') {
                if (t.x && t.y) {
                    this.windowLocations.push({x: t.x + 100, y: t.y + 100});
                }
            }
        }

        console.log('WINDOW LOCATIONS:');
        console.log(this.windowLocations);

        // spawn letters
        for (let x of Array(3)) {
            this.addNewDelivery();
        }

        tileLayers[0].setDepth(-1);
        tileLayers[1].setCollisionFromCollisionGroup(true);
        tileLayers[2].setDepth(100);

        // Misty should collide with the the foreground map layer
        // this.physics.add.collider(this.misty, tileLayers[1])
        this.physics.add.collider(this.misty, tileLayers[1], this.physicsCollisionPlatform, this.physicsProcessPlatform, this.misty);
        // this.physics.add.overlap(this.letter, this.misty, this.letter.collected, undefined, this.letter);

        // Camera and Physics Bounds
        this.physics.world.setBounds(0, 0, city.widthInPixels, city.heightInPixels);
        this.cameras.main.setBounds(0, 0, city.widthInPixels, city.heightInPixels);
        this.cameras.main.startFollow(this.misty);

        // Starry Background
        const bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'sky');
        bg.setDepth(-2);
        bg.setScrollFactor(bg.width / (city.widthInPixels * 5), 0.04);

    }

    physicsCollisionPlatform(obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody, obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody) {

    }

    physicsProcessPlatform(this: Misty, obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody, obj2: Phaser.Tilemaps.Tile) {

        if (this == obj1 && [9, 10, 11].includes(obj2.index)) {
            if(obj1.body.velocity.y < 0) {
                return false;
            }
        }
        return true;
    }

    update(time: number, delta: number) {

        // collide
        // this.physics.collideTiles(this.misty, )

        // Update MovementState and respond to state changes
        const nextState = this.misty.movementState!.update();
        if (nextState) {
            this.misty.changeState(nextState);
        }
    }

    collected(this: Delivery){
        console.log('this in collected')
        console.log(this.sender);
        //this.sender.setTexture('computer_peep',1)
        console.log(this.sender.texture);
        this.sender.destroy();
        this.letter.destroy();
        //this.scene.add.existing(this.receiver);
        // new peeps image

    }

}