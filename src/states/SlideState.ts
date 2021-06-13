import BaseState, { StateReturn } from './BaseState'
import IdleState from './IdleState';
import {Direction} from "./RunState";
import JumpState from "./JumpState";

export default class FallState extends BaseState {

    name = 'slide';
    // graceFrames = 0;
    //  graceFrames: number

    enter(params: {}) {
        this.sprite.anims.play('misty_slide', true);
        this.sprite.body.allowGravity = false;
        this.sprite.body.stop();
        // this.graceFrames = params.graceFrames;
    }

    exit() {
        this.sprite.body.allowGravity = true;
    }

    update(): StateReturn|void {




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