import BaseState, { StateReturn } from './BaseState'
import IdleState from './IdleState';
import {Direction} from "./RunState";
import JumpState from "./JumpState";
import SlideState from "./SlideState";

export default class FallState extends BaseState {

    name = 'fall';
    graceJumpTimer = 0;
    fallThruTimer = 0;

    enter(params: { graceJump: boolean, fallThru: boolean }) {
        this.sprite.anims.play('misty_fall', true);
        if (params.graceJump) {
            this.graceJumpTimer = this.sprite.graceJumpTimer;
        }
        if (params.fallThru) {
            this.sprite.fallThru = true;
            this.fallThruTimer = this.sprite.fallThruTimer;
        } else {
            this.sprite.fallThru = false;
        }
    }

    exit() {
        this.sprite.fallThru = false;
    }

    update(delta: number): StateReturn|void {

        if (this.fallThruTimer > 0) {
            this.fallThruTimer -= delta;
            if (this.fallThruTimer <= 0) {
                this.sprite.fallThru = false;
            }
        }

        if (this.graceJumpTimer > 0) {
            this.graceJumpTimer -= delta;
        }


        if (this.sprite.jumpJustPressed) {
            if (this.graceJumpTimer > 0) {
                return { type: JumpState };
            } else if (this.sprite.hasDoubleJump) {
                return { type: JumpState, params: { isDouble: true }};
            }
        }

        if (this.sprite.touchingWire) {
            return { type: SlideState }
        } else if (!this.sprite.fallThru && this.sprite.body.onFloor()) {
            this.playSound('landing', 0.5)
            // this.sprite.particles.poofs.emitParticle();
            return { type: IdleState };
        } else {
            if (this.cursors.left.isDown) {
                this.sprite.setFlip(true, false);
                this.sprite.body.setVelocityX(-this.sprite.runSpeed);
            } else if (this.cursors.right.isDown) {
                this.sprite.setFlip(false, false);
                this.sprite.body.setVelocityX(this.sprite.runSpeed);
            } else {
                this.sprite.body.velocity.x = this.sprite.body.velocity.x * 0.90;
            }
        }
    }
}