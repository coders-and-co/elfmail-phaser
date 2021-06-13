import BaseState, { StateReturn } from './BaseState'
import IdleState from './IdleState';
import FallState from './FallState';

export default class JumpState extends BaseState {

    name = 'jump';

    isDouble: boolean = false;

    enter(params: { isDouble: boolean }) {

        if (params.isDouble) {
            this.isDouble = true;
        }
        if (this.isDouble) {
            this.sprite.anims.play('misty_jump', true);
            this.sprite.body.setVelocityY(-this.sprite.jumpPower);
            this.sprite.hasDoubleJump = false;
        } else {
            this.sprite.anims.play('misty_jump', true);
            this.sprite.body.setVelocityY(-this.sprite.jumpPower);
        }

    }

    update(): StateReturn|void {

        if (!this.isDouble && this.sprite.jumpJustPressed) {
            return { type: JumpState, params: { isDouble: true }};
        } else if (this.sprite.body.velocity.y > 0) {
            return { type: FallState };
        } else if (this.sprite.body.onFloor()) {
            // Keep this state in case you jump directly to a platform and never attain + velocity
            return { type: IdleState };
        } else {

            if (!this.cursors.space.isDown) {
                // decay jump when space released
                this.sprite.body.velocity.y *= 0.90;
            }

            if (this.cursors.left.isDown) {
                this.sprite.setFlip(true, false);
                this.sprite.body.setVelocityX(-this.sprite.runSpeed);
            } else if (this.cursors.right.isDown) {
                this.sprite.setFlip(false, false);
                this.sprite.body.setVelocityX(this.sprite.runSpeed);
            } else {
                this.sprite.body.velocity.x *= 0.90;
            }
        }
    }
}