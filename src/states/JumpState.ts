import BaseState, { StateReturn } from './BaseState';
import { Direction } from '../Objects/Misty';
import IdleState from './IdleState';
import FallState from './FallState';
import { KeyDict, KeyMap } from '../types';

export default class JumpState extends BaseState {

    name = 'jump';
    hasDouble = false;
    isDouble: boolean = false;
    jumpTimer: number = 0;
    jumpCooldown = 50;

    enter(params: { isDouble: boolean }) {

        if ('isDouble' in params) {
            this.isDouble = params.isDouble;
        }

        if (this.isDouble) {
            this.hasDouble = false;
            this.sprite.anims.play('misty_double_jump', true);
            this.sprite.body.setVelocityY(-this.sprite.jumpPower);
            this.playSound('doublejump', 0.5);
            this.sprite.particles.sparkles.emitters.first.start();

        } else {
            this.hasDouble = true;
            this.sprite.anims.play('misty_jump', true);
            this.sprite.body.setVelocityY(-this.sprite.jumpPower);
            this.playSound('jump', 0.5);
        }
    }

    exit() {
        this.sprite.particles.sparkles.emitters.first.stop();
    }

    update(delta: number, controls: KeyMap): StateReturn|void {

        if (this.hasDouble && controls.jumpJustPressed && this.jumpTimer > this.jumpCooldown) {
            return { type: JumpState, params: { isDouble: true }};
        } else if (this.sprite.body.velocity.y > 0) {
            return { type: FallState, params: { hasDouble: this.hasDouble } };
        } else if (this.sprite.body.onFloor() && this.jumpTimer > this.jumpCooldown) {
            // Keep this state in case you jump directly to a platform and never attain + velocity
            this.playSound('landing', 0.25);
            return { type: IdleState };
        } else {

            if (!controls.jump) {
                // decay jump when space released
                this.sprite.body.velocity.y *= this.sprite.jumpDecay;
            }

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

        // increment jump timer
        this.jumpTimer += delta;
    }
}