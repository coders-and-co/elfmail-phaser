import Phaser, { GameObjects, Scene } from 'phaser';
import Misty from '../Objects/Misty';

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

}