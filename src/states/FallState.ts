import BaseState, { StateReturn } from './BaseState';
import { Direction } from '../Objects/Misty';
import IdleState from './IdleState';
import JumpState from "./JumpState";
import SlideState from "./SlideState";
import { KeyDict, KeyMap } from '../types';

export default class FallState extends BaseState {

    name = 'fall';
    hasDouble = true;
    graceJumpTimer = 0;
    fallThruTimer = 0;

    enter(params: { hasDouble: boolean, graceJump: boolean, fallThru: boolean }) {

        if ('hasDouble' in params) {
            this.hasDouble = params.hasDouble;
        }

        if ('graceJump' in params) {
            this.graceJumpTimer = this.sprite.graceJumpTimer;
        }

        if ('fallThru' in params) {
            // add extra downward force!
            this.sprite.body.setVelocityY(this.sprite.fallThruPower);
            this.sprite.fallThru = true;
            this.fallThruTimer = this.sprite.fallThruTimer;
        } else {
            this.sprite.fallThru = false;
        }

        this.sprite.anims.play('misty_fall', true);
    }

    exit() {
        this.sprite.fallThru = false;
    }

    update(delta: number, controls: KeyMap): StateReturn|void {

        if (this.fallThruTimer > 0) {
            this.fallThruTimer -= delta;
            if (this.fallThruTimer <= 0) {
                this.sprite.fallThru = false;
            }
        }

        if (this.graceJumpTimer > 0) {
            this.graceJumpTimer -= delta;
        }

        if (controls.jumpJustPressed) {
            if (this.graceJumpTimer > 0) {
                return { type: JumpState };
            } else if (this.hasDouble) {
                return { type: JumpState, params: { isDouble: true }};
            }
        }

        if (this.sprite.touchingWire) {
            return { type: SlideState }
        } else if (!this.sprite.fallThru && this.sprite.body.onFloor()) {
            this.playSound('landing', 0.25)
            // this.sprite.particles.poofs.emitParticle();
            return { type: IdleState };
        } else {
            if (controls.left) {
                this.sprite.setFlip(true, false);
                this.sprite.updateVelocityX(Direction.Left);
            } else if (controls.right) {
                this.sprite.setFlip(false, false);
                this.sprite.updateVelocityX(Direction.Right);
            } else {
                this.sprite.body.velocity.x *= this.sprite.dampenVelocity.air;
            }
        }
    }
}