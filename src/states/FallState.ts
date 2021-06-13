import BaseState, { StateReturn } from './BaseState'
import IdleState from './IdleState';
import {Direction} from "./RunState";
import JumpState from "./JumpState";

export default class FallState extends BaseState {

    name = 'fall';
    graceFrames = 0;

    enter(params: { graceFrames: number }) {
        this.sprite.anims.play('misty_fall', true);
        this.graceFrames = params.graceFrames;
    }

    update(): StateReturn|void {
        if (this.graceFrames > 0 && this.cursors.space.isDown) {
            return { type: JumpState };
        }
        this.graceFrames = this.graceFrames - 1;
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