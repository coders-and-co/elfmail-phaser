import Misty from '../Objects/Misty';
import { Delivery, Point, DeliveryState } from '../types';
// import ElfMail from './Game';

interface Indicator {
    image: Phaser.GameObjects.Image,
    delivery: Delivery,
}

export default class ElfMailUI extends Phaser.Scene {

    center = new Phaser.Math.Vector2();
    misty!: Misty;
    // game!: ElfMail;
    scoreText!: any;
    indicators: Indicator[] = [];

    preload() {
        this.load.image('i1', 'assets/indicator_1_small.png');
        this.load.image('i2', 'assets/indicator_2_small.png');
    }

    create() {
        // const game = this.scene.get('GameScene');
        this.center.x = 1920 / 2;
        this.center.y = 1080 / 2;
        this.scoreText = this.add.text(this.cameras.main.midPoint.x + 450, this.cameras.main.midPoint.y - 500, 'Letters e(lf)-mailed: ' + 0, { fontFamily: 'Courier', fontSize: '30px', })
        //.setScrollFactor(0);
        for (const i of this.indicators) {
            i.image.setTexture('i1'      );
        }
    }

    update(time: number, delta: number) {


        for (const i of this.indicators) {

            let d;
            if (i.delivery.state == DeliveryState.Waiting) {
                d = i.delivery.letter.getCenter().clone().subtract(this.misty.getCenter());
            } else {
                d = i.delivery.receiver.getCenter().clone().subtract(this.misty.getCenter());
            }

            if (d.length() > 525) {
                 d.setLength(525);
            }
            let pos = this.center.clone().add(d)
            i.image.setPosition(pos.x, pos.y);

        }

    }

    addIndicator(delivery: Delivery) {

        let existingIndicator = this.indicators.find((x) => x.delivery == delivery);
        let texture;
        // console.log('adding indicator', delivery.state);
        switch(delivery.state) {
            case DeliveryState.Waiting:
                texture = 'i1';
                break;
            case DeliveryState.PickedUp:
            default:
                texture = 'i2';
                break;
        }

        const image = new Phaser.GameObjects.Image(this, 0, 0, texture);
        image.setDepth(98);

        if (existingIndicator) {
            // console.log('Existing!')
            // console.log(texture);
            existingIndicator.image.setTexture('i2');
            // existingIndicator.image.destroy();
            // existingIndicator.image = image;
        } else {

            this.indicators.push({
                image,
                delivery
            });
        }

        this.add.existing(image);

    }

    removeIndicator(delivery: Delivery) {
        let existingIndicator = this.indicators.find((x) => x.delivery == delivery);
        if (existingIndicator) {
            existingIndicator.image.destroy();
            this.indicators.splice(this.indicators.indexOf(existingIndicator), 1);
        }


    }

    updateScore(score: number) {
        this.scoreText.setText('Letters e(lf)-mailed: ' + score);
    }
}