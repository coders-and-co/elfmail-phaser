import Phaser, { Physics } from 'phaser';
import Misty from "../Objects/Misty";
import Letter, {LetterTypes} from "../Objects/Letter";
import Peep from "../Objects/Peep";
import UI from './UI';
import Bird from "../Objects/Bird";

import { Delivery, Point, DeliveryState } from '../types';




export default class ElfMail extends Phaser.Scene {

    ui!: UI;
    misty!: Misty;
    letter!: Letter;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    deliveries: Delivery[] = [];
    windowLocations: Point[] = [];
    letterMessages: any;
    themeMusic: any;
    score: number = 0;


    constructor() {
        super('GameScene');
    }

    preload() {
        // map
        this.load.tilemapTiledJSON('city_tilemap', 'assets/maps/city.json');
        // images
        this.load.image('sky','assets/sky_gradient.png');
        this.load.image('city_tiles', 'assets/Tileset/tileset_city.png');
        this.load.spritesheet('misty_run', 'assets/misty_animations/run_animation.png', {frameWidth: 100, frameHeight: 150});
        this.load.spritesheet('misty_idle', 'assets/misty_animations/idle_animation_blink.png', {frameWidth: 100, frameHeight: 150});
        this.load.spritesheet('misty_fall', 'assets/misty_animations/fall_animation.png', {frameWidth: 100, frameHeight: 150});
        this.load.spritesheet('misty_jump', 'assets/misty_animations/jump_animation.png', {frameWidth: 100, frameHeight: 150});
        this.load.spritesheet('misty_double_jump', 'assets/misty_animations/double_jump_animation.png', {frameWidth: 100, frameHeight: 150});
        this.load.spritesheet('misty_slide', 'assets/misty_animations/slide_animation.png', {frameWidth: 100, frameHeight: 150});
        this.load.spritesheet('misty_collect', 'assets/misty_animations/collect_animation.png', {frameWidth: 100, frameHeight: 150});
        this.load.spritesheet('misty_deliver', 'assets/misty_animations/deliver_animation.png', {frameWidth: 100, frameHeight: 150});

        this.load.spritesheet('letter_animation', 'assets/letter/letter_animation.png', {frameWidth: 100, frameHeight: 100});
        this.load.spritesheet('bird_resting', 'assets/misc_animations/bird_idle.png', {frameWidth: 100, frameHeight: 100});

        this.load.spritesheet('letter_get', 'assets/letter/letter_get.png', {frameWidth: 100, frameHeight: 100});


        this.load.image('letter', 'assets/letter/letter.png');
        this.load.spritesheet('computer_peep', 'assets/peeps/computer_peep.png', {frameWidth: 200, frameHeight: 200});
        this.load.spritesheet('phone_peep', 'assets/peeps/phone_peep.png', {frameWidth: 200, frameHeight: 200});
        //this.load.text('messages', 'assets/letter/Messages_for_Misty');
        this.load.audio('theme', 'assets/sound/elfmail_theme.mp3');
        this.load.audio('collect', 'assets/sound/elfmail_collect.mp3');
        this.load.audio('deliver', 'assets/sound/elfmail_deliver.mp3');
        this.load.audio('jump', 'assets/sound/elfmail_jump.mp3');
        this.load.audio('doublejump', 'assets/sound/elfmail_doublejump.mp3');
        this.load.audio('landing', 'assets/sound/elfmail_landing.mp3', { volume: 0.00001 });
    }

    addNewDelivery() {

       const  indexSender = Math.floor(Math.random() * this.windowLocations.length);
        //const indexSender = 0;

        const pointSender = this.windowLocations.splice(indexSender, 1)[0];
        const indexReceiver = Math.floor(Math.random() * this.windowLocations.length);
        //const indexReceiver = 12;

        const pointReceiver = this.windowLocations.splice(indexReceiver, 1)[0];

        const delivery = {
            sender: new Peep(this, this.physics.world, pointSender.x, pointSender.y, 'computer_peep', 1, true),
            receiver: new Peep(this, this.physics.world, pointReceiver.x, pointReceiver.y, 'phone_peep', 1, false),
            letter: new Letter(this, this.physics.world, pointSender.x, pointSender.y - 100, 'letter', 1, LetterTypes.love),
            message: 'watermelons on sale',
            state: DeliveryState.Waiting,
        }

        this.deliveries.push(delivery);

        this.physics.add.overlap(delivery.letter, this.misty, this.collected, undefined, [this, delivery]);
        this.physics.add.overlap(delivery.receiver, this.misty, this.deliver, undefined, [this, delivery]);

        this.ui.addIndicator(delivery);
    }

    create() {




        // Keyboard Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        // this.letterMessages = fetch('Messages_for_Misty.txt')
        //     .then(response => {return [response.text()]})
        //     .then(text => console.log(text))
        // console.log(this.letterMessages);


        // Misty
        // TODO: Spawn her at the map's spawn point instead of a hardcoded value
        this.misty = new Misty(this, this.physics.world, this.cursors, 200, 9500, 'misty_idle');

        this.ui = this.scene.add('ui', new UI({
            active: true,
        }), true) as UI;

        this.ui.misty = this.misty;


        this.themeMusic = this.sound.add('theme');
        this.themeMusic.play({
            loop: true
        });



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

        // process wires
        const wires = city.getObjectLayer('Wires');
        for (const w of wires.objects) {
            console.log(w);
            if (w.type == 'wire' && w.polyline && w.x && w.y) {
                const points: {x: number, y: number}[] = [];
                let ox = city.widthInPixels;
                let oy = city.heightInPixels;
                for (let p of w.polyline) {
                    if (typeof p.x !== 'undefined' && typeof p.y !== 'undefined') {
                        let point = {x: w.x + p.x, y: w.y + p.y};
                        ox = Math.min(ox, point.x);
                        oy = Math.min(oy, point.y);
                        points.push(point);
                    }
                }
                let tp = points.map((p) => ({x: p.x - ox, y: p.y - oy}));
                let wire = this.add.line(ox, oy, tp[0].x, tp[0].y, tp[1].x, tp[1].y);
                // polygon(ox, oy, translatedPoints);
                wire.setOrigin(0, 0);
                wire.setStrokeStyle(5, 0xFFFFFF);
                wire.setLineWidth(5);

                this.physics.add.existing(wire, true);
                this.physics.add.collider(this.misty, wire, this.physicsCollideWire, this.physicsProcessWire, this.misty);
                this.physics.add.overlap(this.misty, wire, this.physicsCollideWire, this.physicsProcessWire, this.misty);

            }
        }


        // process spawn triggers
        const triggers = city.getObjectLayer('Spawn Triggers');

        for (const t of triggers.objects) {

            if (!t.x || !t.y) {
                continue;
            }

            switch (t.type) {

                case 'player':
                    this.misty.setPosition(t.x, t.y);
                    break;
                case 'window':
                    this.windowLocations.push({x: t.x + 100, y: t.y + 100});
                    break;
                case 'bird':
                    var newBird = new Bird(this, this.physics.world, t.x + 8, t.y-45, 'bird_resting', 1)
                    this.add.existing(newBird);
                    break;
            }

        }

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

    physicsProcessWire(misty: Phaser.Types.Physics.Arcade.GameObjectWithBody, wire: Phaser.Types.Physics.Arcade.GameObjectWithBody) {

        let wireGeom = (wire as Phaser.GameObjects.Line).geom as Phaser.Geom.Line;
        let wireLine = new Phaser.Geom.Line(
            wire.body.x + wireGeom.x1,
            wire.body.y + wireGeom.y1,
            wire.body.x + wireGeom.x2,
            wire.body.y + wireGeom.y2
        );
        let mistyRect = new Phaser.Geom.Rectangle(
            misty.body.left, misty.body.top, misty.body.width, misty.body.height
        )
        const isColliding = Phaser.Geom.Intersects.LineToRectangle(wireLine, mistyRect);
        if (isColliding) {
            (misty as Misty).touchingWire = wire as Phaser.GameObjects.Line;
        } else {
            (misty as Misty).touchingWire = null;
        }
        return isColliding;
    }

    physicsCollideWire(misty: Phaser.Types.Physics.Arcade.GameObjectWithBody, wire: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        // let w = (wire as Phaser.GameObjects.Line)
        // let wireGeom = w.geom as Phaser.Geom.Line;
        // let y1 = wire.body.y + wireGeom.y1;
        // let y2 = wire.body.y + wireGeom.y2;
        // let factor = (misty.body.x - wire.body.x) / (wire.body.width);
        // // interpolate
        // let y = y1 + ((y2-y1) * factor);
        // misty.body.stop();
        // misty.body.y = y - misty.body.height;
    }

    physicsCollisionPlatform(obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody, obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody) {

    }

    physicsProcessPlatform(this: Misty, obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody, obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody) {

        const obj2Tile = (obj2 as unknown) as Phaser.Tilemaps.Tile;
        if (this == obj1 && [9, 10, 11].includes(obj2Tile.index)) {
            if(this.fallThru) {
                return false;
            } else if(obj1.body.velocity.y <= 0 && obj2Tile.faceTop && obj1.body.bottom > obj2Tile.getTop()) {
                return false;
            }
        }
        return true;
    }

    update(time: number, delta: number) {
        this.misty.update(time, delta);
        // this.ui.updateScore(this.score);
    }

    collected(this: [this, Delivery]){
        this[0].misty.exclaim('misty_collect');
        this[0].playSound('collect')
        this[1].sender.destroy();
        this[1].letter.body.enable = false;
        this[1].letter.anims.play('letter_get', true);
        var timer = this[0].time.delayedCall(800, this[0].destroyLetter, [this[1]]);
        this[1].state = DeliveryState.PickedUp;
        this[0].ui.addIndicator(this[1]);
    }


    destroyLetter(){
        arguments[0].letter.destroy()
    }

    deliver(this: [this, Delivery]) {
        if(!this[1].sender.body){

            this[0].score = this[0].score + 1;
            this[0].ui.updateScore(this[0].score)

            this[0].misty.exclaim('misty_deliver', 1000);
            this[0].playSound('deliver')
            this[0].add.text(this[1].receiver.x, this[1].receiver.y, this[1].message, { fontFamily: 'Courier', fontSize: '30px'});
            // create new delivery to replaced completed one
            this[0].addNewDelivery();
            // add window location back
            this[0].windowLocations.push({x: this[1].receiver.x, y: this[1].receiver.y})
            this[1].receiver.destroy();
            this[0].deliveries.splice(this[0].deliveries.indexOf(this[1]),1);
            this[0].ui.removeIndicator(this[1]);
        }
    }

    playSound(name: string){
        var soundEffect = this.sound.add(name);
        soundEffect.play({
            loop: false
        });
    }

}