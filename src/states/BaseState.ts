import Phaser, { GameObjects } from 'phaser';
import Misty from '../objects/Misty';

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

    update(): StateReturn|void {

    }

}