import BaseState, { StateReturn } from './BaseState'
import RunState, { Direction } from './RunState'
import Misty from '../objects/Misty';
import JumpState from "./JumpState";

export default class IdleState extends BaseState {

    name = 'idle';

    enter(params: {}) {
        this.sprite.body.setVelocityX(0);
        this.sprite.anims.play('misty_idle', true);
    }

    update(): StateReturn|void {
        if (this.cursors.space.isDown && this.sprite.body.onFloor()) {
            return { type: JumpState };
        } else if (this.cursors.left.isDown) {
            return { type: RunState };
                // { direction: Direction.Left });
        } else if (this.cursors.right.isDown) {
            return { type: RunState };
            // (this.sprite, { direction: Direction.Right });
        }
    }
}