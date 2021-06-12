import BaseState from './BaseState';
import IdleState from './IdleState';
import Misty from '../objects/Misty';
import JumpState from "./JumpState";
import FallState from './FallState';

export enum Direction {
    Left,
    Right
}

export default class RunState implements BaseState {

    sprite: Misty;
    direction: Direction = Direction.Right;

    constructor(sprite: Misty, direction: Direction) {
        this.sprite = sprite;
        this.direction = direction;
        this.sprite.anims.play('misty_run', true);
        if (direction == Direction.Left) {
            this.sprite.body.setVelocityX(sprite.runSpeed * -1);
            this.sprite.setFlip(true, false);
        } else {
            this.sprite.body.setVelocityX(sprite.runSpeed);
            this.sprite.setFlip(false, false);
        }
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): BaseState|void {
        if (!this.sprite.body.onFloor()) {
            return new FallState(this.sprite, cursors);
        } else if (!cursors.right.isDown && this.direction == Direction.Right) {
            return new IdleState(this.sprite);
        } else if (!cursors.left.isDown && this.direction == Direction.Left) {
            return new IdleState(this.sprite);
        } else if (cursors.space.isDown) {
            return new JumpState(this.sprite, cursors);
        }
    }
}