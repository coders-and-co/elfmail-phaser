import BaseState, { StateReturn } from './BaseState'
import IdleState from './IdleState';

export default class FallState extends BaseState {

    name = 'fall';

    enter() {
        this.sprite.anims.play('misty_fall', true);
    }

    update(): StateReturn|void {
        if (this.sprite.body.onFloor()) {
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