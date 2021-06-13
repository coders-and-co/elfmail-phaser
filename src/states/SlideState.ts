import BaseState, { StateReturn } from './BaseState'
import FallState from './FallState';
import JumpState from './JumpState';

export default class SlideState extends BaseState {

    name = 'slide';

    wire!: Phaser.GameObjects.Line|null;

    enter(params: {}) {
        this.wire = this.sprite.touchingWire;

        this.sprite.anims.play('misty_slide', true);
        this.sprite.body.allowGravity = false;
        this.sprite.body.stop();
    }

    exit() {
        this.sprite.body.allowGravity = true;
        this.sprite.touchingWire = null;
    }

    update(): StateReturn|void {

        if (this.sprite.jumpJustPressed) {
            return { type: JumpState }
        } else if (this.wire) {
            let wireGeom = this.wire.geom as Phaser.Geom.Line;

            let x1 = this.wire.x + wireGeom.x1;
            let x2 = this.wire.x + wireGeom.x2;
            let y1 = this.wire.y + wireGeom.y1;
            let y2 = this.wire.y + wireGeom.y2;

            let slope = y2 - y1 / this.wire.width;
            let factor = (this.sprite.body.x - this.wire.x) / (this.wire.width);

            if (factor < -0.05 || factor > 1.05) {
                return { type: FallState }
            }

            // // interpolate
            let y = y1 + ((y2-y1) * factor);
            this.sprite.setY(y - this.sprite.height/2 - 10);

            let target = null;
            if (y1 > y2) {
                target = new Phaser.Math.Vector2(x2, y2);
            } else {
                target = new Phaser.Math.Vector2(x1, y1);
            }

            let a = this.sprite.body.position.clone().subtract(target).normalize();
            this.sprite.body.setVelocityX(a.x * 1000);

        }






        // if (this.sprite.jumpJustPressed) {
        //     if (this.graceFrames > 0) {
        //         return { type: JumpState };
        //     } else if (this.sprite.hasDoubleJump) {
        //         return { type: JumpState, params: { isDouble: true }};
        //     }
        // } else {
        //     this.graceFrames = this.graceFrames - 1;
        // }

        // if (this.sprite.body.onFloor()) {
        //     return { type: IdleState };
        // } else {
        //     if (this.cursors.left.isDown) {
        //         this.sprite.setFlip(true, false);
        //         this.sprite.body.setVelocityX(-this.sprite.runSpeed);
        //     } else if (this.cursors.right.isDown) {
        //         this.sprite.setFlip(false, false);
        //         this.sprite.body.setVelocityX(this.sprite.runSpeed);
        //     } else {
        //         this.sprite.body.velocity.x = this.sprite.body.velocity.x * 0.90;
        //     }
        // }
    }
}