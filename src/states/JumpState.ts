import BaseState, { StateReturn } from './BaseState';
import { Direction } from '../Objects/Misty';
import IdleState from './IdleState';
import FallState from './FallState';

export default class JumpState extends BaseState {

    name = 'jump';

    isDouble: boolean = false;
    jumpTimer: number = 0;

    enter(params: { isDouble: boolean }) {

        if (params.isDouble) {
            this.isDouble = true;
        }
        if (this.isDouble) {
            // console.log('double jump');
            this.sprite.anims.play('misty_double_jump', true);
            this.sprite.body.setVelocityY(-this.sprite.jumpPower);
            this.sprite.hasDoubleJump = false;
            this.playSound('doublejump', 0.5);

            // this.sprite.particles.stars.emitters.getByName('jump')!.emitParticle();
            this.sprite.particles.sparkles.emitters.first.start();

        } else {
            this.sprite.anims.play('misty_jump', true);
            this.sprite.body.setVelocityY(-this.sprite.jumpPower);
            this.playSound('jump', 0.5);
        }
    }

    exit() {
        this.sprite.particles.sparkles.emitters.first.stop();
    }

    update(): StateReturn|void {

        const controls = this.getControls();

        this.jumpTimer++;

        if (!this.isDouble && this.sprite.jumpJustPressed && this.jumpTimer > 3) {
            return { type: JumpState, params: { isDouble: true }};
        } else if (this.sprite.body.velocity.y > 0) {
            return { type: FallState };
        } else if (this.sprite.body.onFloor() && this.jumpTimer > 3) {
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



    }
}