import BaseState from './BaseState';
import IdleState from './IdleState';
import Misty from '../objects/Misty';

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
        if (direction == Direction.Left) {
            this.sprite.body.setVelocityX(sprite.runSpeed * -1);
            this.sprite.setFlip(true, false);
            this.sprite.anims.play('left', true);
        } else {
            this.sprite.body.setVelocityX(sprite.runSpeed);
            this.sprite.setFlip(false, false);
            this.sprite.anims.play('right', true);
        }
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): BaseState|void {

        if (!cursors.right.isDown && this.direction == Direction.Right) {
            return new IdleState(this.sprite);
        } else if (!cursors.left.isDown && this.direction == Direction.Left) {
            return new IdleState(this.sprite);
        }
        // if (cursors.up.isDown && this.sprite.body.touching.down) {
        //     this.sprite.body.setVelocityY(-330);
        // }
    }

}