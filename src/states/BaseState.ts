import Phaser, { GameObjects, Scene } from 'phaser';
import Misty from '../Objects/Misty';
// import { Direction } from './RunState';


export enum Direction {
    Left,
    Right
}

export interface StateReturn {
    type: typeof BaseState;
    params?: any
}

export default class BaseState {

    name = 'basestate';
    sprite!: Misty;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(sprite: Misty, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this.sprite = sprite;
        this.cursors = cursors;
    }

    enter(params: any): void {

    }

    exit(): void {

    }

    update(delta: number): StateReturn|void {

    }

    playSound(name: string, volume?: number){
        var soundEffect = this.sprite.scene.sound.add(name);
        soundEffect.play({
            loop: false,
            volume: volume? volume : 1
        });
    }

    updateVelocityX(direction: Direction) {

        if (direction == Direction.Left){
            if (this.sprite.body.velocity.x > -this.sprite.maxSpeed.run) {
                this.sprite.body.velocity.x -= this.sprite.acceleration.run;
            } else if (this.sprite.body.velocity.x < -this.sprite.maxSpeed.run) {
                this.sprite.body.velocity.x *= this.sprite.dampenVelocity.overMax;
            }
        } else if (direction == Direction.Right) {
            if (this.sprite.body.velocity.x < this.sprite.maxSpeed.run) {
                this.sprite.body.velocity.x += this.sprite.acceleration.run;
            } else if (this.sprite.body.velocity.x > this.sprite.maxSpeed.run) {
                this.sprite.body.velocity.x *= this.sprite.dampenVelocity.overMax;
            }
        }

    }

}