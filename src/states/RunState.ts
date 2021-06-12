import BaseState, { StateReturn } from './BaseState'
import IdleState from './IdleState';
import JumpState from "./JumpState";
import FallState from './FallState';

export enum Direction {
    Left,
    Right
}

export default class RunState extends BaseState {

    name = 'run';
    direction: Direction|null = null;

    enter(params: { direction: Direction }) {

        // console.log('params:', params);
        // this.direction = ;

        this.sprite.anims.play('misty_run', true);
        if (params.direction === Direction.Left) {
            // console.log('left', this.direction);
            this.direction = Direction.Left;
            this.sprite.body.setVelocityX(this.sprite.runSpeed * -1);
            this.sprite.setFlip(true, false);
        } else if (params.direction === Direction.Right) {
            // console.log('right', this.direction);
            this.direction = Direction.Right;
            this.sprite.body.setVelocityX(this.sprite.runSpeed);
            this.sprite.setFlip(false, false);
        }

    }

    update(): StateReturn|void {
        // console.log('update: direction:', this.direction);
        if (!this.sprite.body.onFloor()) {
            return { type: FallState };
        } else if (this.cursors.space.isDown) {
            return { type: JumpState };
        } else if (!this.cursors.right.isDown && !this.cursors.left.isDown) {
            return { type: IdleState };
        } else if (this.cursors.right.isDown && this.direction !== Direction.Right) {
            return { type: RunState, params: { direction: Direction.Right }};
        } else if (this.cursors.left.isDown && this.direction !== Direction.Left) {
            return {type: RunState, params: { direction: Direction.Left }};
        }
    }
}