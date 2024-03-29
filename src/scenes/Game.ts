import Phaser, { Input, Physics } from 'phaser';
import Misty from "../Objects/Misty";
import Letter, {LetterTypes} from "../Objects/Letter";
import Peep from "../Objects/Peep";
import UI from './UI';
import Bird from "../Objects/Bird";

import { Delivery, Point, DeliveryState, KeyDict } from '../types';


export default class ElfMail extends Phaser.Scene {

    ui!: UI;
    misty!: Misty;
    letter!: Letter;

    keys!: KeyDict;
    gamepad: Input.Gamepad.Gamepad|null = null;

    // gamepad!: Phaser.Input.Gamepad.Gamepad;
    deliveries: Delivery[] = [];
    windowLocations: Point[] = [];
    letterMessages: any;
    themeMusic: any;
    score: number = 0;

    tutorial = true;

    messages: string[] = [];
    usedMessages: string[] = [];

    constructor() {
        super('GameScene');
    }

    preload() {
        // map
        this.load.tilemapTiledJSON('tutorial_tilemap', 'assets/maps/tutorial.json');
        this.load.tilemapTiledJSON('city_tilemap', 'assets/maps/city.json');

        this.load.text('messages', 'assets/letter/messages.txt');

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
        this.load.spritesheet('letter_get', 'assets/letter/letter_get.png', {frameWidth: 100, frameHeight: 100});
        this.load.image('letter', 'assets/letter/letter.png');
        this.load.image('splash_art', 'assets/splash_art.png');

        this.load.spritesheet('sparks', 'assets/particles/spark_samples.png', {frameWidth: 9, frameHeight: 9});
        this.load.spritesheet('stars', 'assets/particles/star_samples.png', {frameWidth: 14, frameHeight: 14});
        this.load.spritesheet('sparkles', 'assets/particles/sparkle_samples.png', {frameWidth: 9, frameHeight: 12});
        this.load.spritesheet('poofs', 'assets/particles/poof_samples.png', {frameWidth: 11, frameHeight: 8});

        this.load.spritesheet('bird_resting', 'assets/misc_animations/bird_idle.png', {frameWidth: 100, frameHeight: 100});
        this.load.spritesheet('bird_flying', 'assets/misc_animations/bird_flying.png', {frameWidth: 100, frameHeight: 100});

        this.load.spritesheet('all_peeps', 'assets/peeps/random_peep.png', {frameWidth: 200, frameHeight: 200});

        this.load.audio('theme', 'assets/sound/elfmail_theme.mp3');
        this.load.audio('theme-tutorial', 'assets/sound/elfmail_tutorial_song.mp3');
        this.load.audio('collect', 'assets/sound/elfmail_collect.mp3');
        this.load.audio('deliver', 'assets/sound/elfmail_deliver.mp3');
        this.load.audio('jump', 'assets/sound/elfmail_jump.mp3');
        this.load.audio('doublejump', 'assets/sound/elfmail_doublejump.mp3');
        this.load.audio('landing', 'assets/sound/elfmail_landing.mp3', { volume: 0.00001 });
    }

    addNewDelivery(indexSender?: number, indexReceiver?: number) {

        if (typeof indexSender == 'undefined')
            indexSender = Math.floor(Math.random() * this.windowLocations.length);
        const pointSender = this.windowLocations.splice(indexSender, 1)[0];

        // if (!indexReceiver)
        if (typeof indexReceiver == 'undefined')
             indexReceiver = Math.floor(Math.random() * this.windowLocations.length);
        const pointReceiver = this.windowLocations.splice(indexReceiver, 1)[0];

        const peep1 = Math.floor(Math.random() * 4);
        const peep2 = Math.floor(Math.random() * 4);

        if (this.messages.length == 0) {
            this.messages = [...this.usedMessages];
            this.usedMessages = [];
        }

        const msgIndex = Math.floor(Math.random() * this.messages.length);
        const msg = this.messages.splice(msgIndex, 1)[0];

        this.usedMessages.push(msg);

        const delivery = {
            sender: new Peep(this, this.physics.world, pointSender.x, pointSender.y, 'all_peeps', 1, true, peep1, peep1*2 ),
            receiver: new Peep(this, this.physics.world, pointReceiver.x, pointReceiver.y, 'all_peeps', 1, false, peep2, peep2*2 ),
            letter: new Letter(this, this.physics.world, pointSender.x, pointSender.y - 100, 'letter', 1, LetterTypes.love),
            message: msg,
            state: DeliveryState.Waiting,
        }

        this.deliveries.push(delivery);

        this.physics.add.overlap(delivery.letter, this.misty, this.collected, undefined, [this, delivery]);
        this.physics.add.overlap(delivery.receiver, this.misty, this.deliver, undefined, [this, delivery]);

        this.ui.addIndicator(delivery);
    }

    create() {
        var refStart = this.add.sprite(1000,2550,'splash_art',0).setDepth(5000).setScale(1.2,1.2);
        this.messages = (this.cache.text.get('messages') as string).split('\n');

        // Controls
        // this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.UP,
            'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
            'w': Phaser.Input.Keyboard.KeyCodes.W,
            'a': Phaser.Input.Keyboard.KeyCodes.A,
            's': Phaser.Input.Keyboard.KeyCodes.S,
            'd': Phaser.Input.Keyboard.KeyCodes.D,
            'space': Phaser.Input.Keyboard.KeyCodes.SPACE,
        }) as KeyDict;


        // fade the title screen out
        const fadeSplash = function(this: ElfMail) {
            if (!refStart) {
                return;
            }
            this.add.tween({
                targets: [refStart],
                alpha: 0,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    refStart.destroy();
                }
            });
        }

        const bindGamepad = function(this: ElfMail, pad: Phaser.Types.Input.Gamepad.Pad, button: Phaser.Input.Gamepad.Button, index: number) {
            this.gamepad = pad as Input.Gamepad.Gamepad;
            this.misty.gamepad = pad as Input.Gamepad.Gamepad;
            if (button.index == 0) {
                fadeSplash.call(this);
            }
        }

        this.keys.space.once('down', fadeSplash, this);
        this.input.gamepad.once('down', bindGamepad, this);

        this.ui = this.scene.add('ui', new UI({
            active: true,
        }), true) as UI;

        // TODO: Spawn her at the map's spawn point instead of a hardcoded value
        this.misty = new Misty(this, this.physics.world, this.keys, 0, 0, 'misty_idle');
        this.ui.misty = this.misty;

        this.loadCity();
    }

    loadCity() {

        if(this.tutorial) {
            this.themeMusic = this.sound.add('theme-tutorial');
        } else {
            this.themeMusic = this.sound.add('theme');
        }

        this.themeMusic.play({
            loop: true
        });


        // Load Tilemap
        let city;
        if (this.tutorial) {
            city = this.make.tilemap({ key: 'tutorial_tilemap' });
        } else {
            city = this.make.tilemap({ key: 'city_tilemap' });
        }

        // add the tileset image we are using
        const base_tileset = city.addTilesetImage('tileset_buildings', 'city_tiles');

        // load layers
        // ---
        // 'BG Parallax 1' (image)
        // 'BG Parallax 2' (image)
        // 'BG Parallax 3' (image)
        // 'Background Tiles'
        // 'Foreground Tiles'
        // 'Overlay Tiles'
        // 'Wires'
        // 'Triggers'

        const tileLayers = [
            city.createLayer('Background Tiles', base_tileset),
            city.createLayer('Foreground Tiles', base_tileset),
            city.createLayer('Overlay Tiles', base_tileset),
        ]

        // process wires
        const wires = city.getObjectLayer('Wires');
        if (wires) {
            for (const w of wires.objects) {
                // console.log(w);
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
                    this.physics.add.overlap(this.misty, wire, this.physicsCollideWire, this.physicsProcessWire, this.misty);
                }
            }
        }

        // clear window locations
        this.windowLocations = [];

        // process spawn triggers
        const triggers = city.getObjectLayer('Spawn Triggers');
        if (triggers) {
            for (const t of triggers.objects) {
                if (!t.x || !t.y) continue;
                switch (t.type) {
                    case 'player':
                        // Misty
                        this.misty.setPosition(t.x, t.y);
                        break;
                    case 'window':
                        this.windowLocations.push({x: t.x + 100, y: t.y + 100});
                        break;
                    case 'bird':
                        var newBird = new Bird(this, this.physics.world, t.x + 8, t.y-45, 'bird_resting', 1, t.name == 'right');
                        this.physics.add.overlap(newBird, this.misty, newBird.fly, undefined, newBird);
                        break;
                }

            }
        }

        // spawn letters
        if (this.tutorial) {
            this.addNewDelivery(0);
        } else {
            for (let x of Array(3)) {
                this.addNewDelivery();
            }
        }

        tileLayers[0].setDepth(-1);
        tileLayers[2].setDepth(100);

        // recalculate faces first, because if we do it after adding the one-way platforms,
        // we'll make odd holes in the ground when a platform is directly above a solid block!
        tileLayers[1].setCollision([207, 247], true);

        tileLayers[1].forEachTile(t => {
            switch (t.index) {
                case 11:
                    // one-way platforms
                    t.setCollision(false, false, true, false, false);
                    break;
            }
        });

        // this.physics.add.collider(this.misty, tileLayers[1]);
        this.physics.add.collider(this.misty, tileLayers[1], this.physicsCollisionPlatform, this.physicsProcessPlatform, this.misty);

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

        if ((misty as Misty).fallThru) {
            return false;
        }

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
        // collide with the wire?
    }

    physicsCollisionPlatform(obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody, obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody) {

    }

    physicsProcessPlatform(this: Misty, obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody, obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody) {

        const obj2Tile = (obj2 as unknown) as Phaser.Tilemaps.Tile;
        if (obj2Tile.index == 11) {
            if (this.fallThru ) {
                return false;
            } else if (this.body.velocity.y <= 0) {
                return false;
            }
            // else if (obj1.body.bottom > obj2Tile.getTop()) {
            //     return false;
            // }
        }
        // collide with full tile
        return true;
    }

    update(time: number, delta: number) {
        this.misty.update(time, delta);
        // this.ui.updateScore(this.score);
    }


    collected(this: [this, Delivery]){

        this[0].misty.exclaim('misty_collect');
        this[0].playSound('collect', 0.5);

        this[0].windowLocations.push({x: this[1].sender.x, y: this[1].sender.y})

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

        const scene = this[0];
        const delivery = this[1];

        if(!delivery.sender.body){

            scene.score = scene.score + 1;
            scene.ui.updateScore(scene.score);
            scene.misty.exclaim('misty_deliver', 1000);
            scene.playSound('deliver', 0.5);
            scene.misty.particles.stars.emitters.getByName('deliver')!.emitParticle();
            // delivery.receiver.x, delivery.receiver.y

            var ref = scene.add.text(delivery.receiver.x, delivery.receiver.y - 145, delivery.message, { fontFamily: 'Courier', fontSize: '30px', align: 'center', wordWrap: { width: 450, useAdvancedWrap: true }}).setOrigin(0.5);

            scene.add.tween({
                targets: [ref],
                alpha: 0,
                duration: 1000,
                delay: 3000,
                ease: 'Power2',
                onComplete: () => {
                    ref.destroy();
                }
            });

            delivery.receiver.destroy();
            scene.ui.removeIndicator(delivery);

            if(!scene.tutorial) {
                // create new delivery to replaced completed one
                scene.addNewDelivery();

                // add window location back
                scene.windowLocations.push({x: delivery.receiver.x, y: delivery.receiver.y});
                scene.deliveries.splice(scene.deliveries.indexOf(delivery),1);
            } else {
                console.log('TUTORIAL COMPLETE');
                var timerA = scene.time.delayedCall(2000, function() {
                    scene.cameras.main.fadeOut(2500, 0, 0, 0);
                }, undefined, this);
                var timer = scene.time.delayedCall(3000, function() {
                    scene.cameras.main.fadeIn(3000, 0, 0, 0);
                    scene.tutorial = false;
                    scene.themeMusic.stop();
                    scene.loadCity();
                }, undefined, this);
             }
        }
    }

    playSound(name: string, volume?: number){
        var soundEffect = this.sound.add(name);
        soundEffect.play({
            loop: false,
            volume: volume? volume : 1
        });
    }

}