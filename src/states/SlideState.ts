import BaseState, { StateReturn } from './BaseState';
import { Direction } from '../Objects/Misty';
import IdleState from './IdleState';
import FallState from './FallState';
import JumpState from './JumpState';
import { KeyDict, KeyMap } from '../types';

export default class SlideState extends BaseState {

    name = 'slide';

    wire!: Phaser.GameObjects.Line;
    pointTop!: Phaser.Math.Vector2;
    pointBottom!: Phaser.Math.Vector2;
    wireDirection!: Phaser.Math.Vector2;
    mistyOffset!: number;

    enter(params: {}) {

        if (this.sprite.touchingWire) {
            // shortcut reference to the current wire.
            this.wire = this.sprite.touchingWire;
            const wireGeom = this.wire.geom as Phaser.Geom.Line;

            let x1 = this.wire.x + wireGeom.x1;
            let y1 = this.wire.y + wireGeom.y1;
            let x2 = this.wire.x + wireGeom.x2;
            let y2 = this.wire.y + wireGeom.y2;

            // find our end-of-wire target
            let target = null;
            if (y1 < y2) {
                this.pointTop = new Phaser.Math.Vector2(x1, y1);
                this.pointBottom = new Phaser.Math.Vector2(x2, y2);
            } else {
                this.pointTop = new Phaser.Math.Vector2(x2, y2);
                this.pointBottom = new Phaser.Math.Vector2(x1, y1);
            }
            if (this.pointTop.x < this.pointBottom.x) {
                // this.wireDirection = Direction.Right;
                this.sprite.setFlip(false, false);
                this.mistyOffset = 10;
            } else {
                // this.wireDirection = Direction.Left;
                this.sprite.setFlip(true, false);
                this.mistyOffset = -10;
            }

            // find a unit vector (length 1.0) pointing towards the lower end of the wire
            this.wireDirection = this.pointBottom.clone().subtract(this.pointTop).normalize();

            // console.log('pointTop:', this.pointTop);
            // console.log('pointBottom:', this.pointBottom);
            // console.log('wireDirection:', this.wireDirection);
        }

        // suspend normal physics
        this.sprite.body.allowGravity = false;

        // this.sprite.body.stop();
        // stop VERTICAL velocity, but allow horizontal to carry over.
        this.sprite.body.velocity.y = 0;

        // emit sparks
        this.sprite.particles.sparks.emitters.first.start();
        this.sprite.anims.play('misty_slide', true);
    }

    exit() {
        // resume normal physics
        this.sprite.body.allowGravity = true;
        this.sprite.touchingWire = null;

        // stop emitting sparks
        this.sprite.particles.sparks.emitters.first.stop();
    }

    // determine misty's position along the wire from 0 to 1
    calculateWireFactor(): number {
        let width = Math.abs(this.pointTop.x - this.pointBottom.x);
        let factor;
        if (this.wireDirection.x > 0) {
            factor = (this.sprite.body.x - this.pointTop.x) / width;
        } else {
            factor = 1 - (this.sprite.body.x - this.pointBottom.x) / width;
        }
        return factor
    }

    update(delta: number, controls: KeyMap): StateReturn|void {

        let factor = this.calculateWireFactor();
        // console.log('FACTOR:', factor);

        if (controls.jumpJustPressed) {
            if (controls.down) {
                return { type: FallState, params: { fallThru: true }};
            } else {
                return { type: JumpState };
            }
        } else if (factor < -0.025 || factor > 1.05) { //
            if (this.sprite.body.onFloor()) {
                return { type: IdleState }
            } else {
                return { type: FallState }
            }
        } else {

            // shortcut reference to the current wire.
            // const wire = this.sprite.touchingWire;

            let wireHeight = this.pointTop.y + (this.pointBottom.y - this.pointTop.y) * factor;

            // snap misty to the wire position
            this.sprite.setY(wireHeight - (this.sprite.height / 2) + this.mistyOffset);

            let wd = this.wireDirection.x > 0 ? Direction.Right : Direction.Left;
            let acc = this.sprite.acceleration.slide;
            if (controls.right && wd == Direction.Right || controls.left && wd == Direction.Left) {
                acc *= 1.333;
            } else if (controls.right && wd == Direction.Left || controls.left && wd == Direction.Right) {
                acc *= 0.5;
            }

            // accelerate along wire (using the x component of the target wireDirection)
            if (Math.abs(this.sprite.body.velocity.x) < this.sprite.maxSpeed.slide) {
                this.sprite.body.velocity.x += acc * this.wireDirection.x;
            }

        }
    }
}