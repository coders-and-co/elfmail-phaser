import BaseState, { StateReturn, Direction } from './BaseState'
import FallState from './FallState';
import JumpState from './JumpState';

export default class SlideState extends BaseState {

    name = 'slide';

    wire!: Phaser.GameObjects.Line|null;
    // emitter!: Phaser.GameObjects.Particles.ParticleEmitter|null;
    // particles!: Phaser.GameObjects.Particles.ParticleEmitterManager;

    enter(params: {}) {
        this.wire = this.sprite.touchingWire;

        this.sprite.anims.play('misty_slide', true);
        this.sprite.body.allowGravity = false;
        this.sprite.body.stop();
        // emit sparks
        this.sprite.particles.sparks.emitters.first.start();
        this.sprite.hasDoubleJump = true;

    }

    exit() {
        this.sprite.body.allowGravity = true;
        this.sprite.touchingWire = null;
        // stop emitting sparks
        this.sprite.particles.sparks.emitters.first.stop();
    }

    update(): StateReturn|void {

        if (this.sprite.jumpJustPressed) {
            if (this.cursors.down.isDown) {
                this.sprite.body.setVelocityY(500);
                return { type: FallState, params: { fallThru: true }};
            } else {
                return { type: JumpState };
            }
        } else if (this.wire) {
            let wireGeom = this.wire.geom as Phaser.Geom.Line;

            let x1 = this.wire.x + wireGeom.x1;
            let x2 = this.wire.x + wireGeom.x2;
            let y1 = this.wire.y + wireGeom.y1;
            let y2 = this.wire.y + wireGeom.y2;

            let slope = y2 - y1 / this.wire.width;
            let factor = (this.sprite.body.x - this.wire.x) / (this.wire.width);

            if (factor < -0.05 || factor > 1.05) {
                return { type: FallState }
            }

            // // interpolate
            let y = y1 + ((y2-y1) * factor);
            this.sprite.setY(y - this.sprite.height/2 - 10);

            let target = null;
            if (y1 > y2) {
                target = new Phaser.Math.Vector2(x2, y2);
            } else {
                target = new Phaser.Math.Vector2(x1, y1);
            }

            let a = this.sprite.body.position.clone().subtract(target).normalize();

            if (Math.abs(this.sprite.body.velocity.x) < this.sprite.runSpeed * 2.0) {
                this.sprite.body.velocity.x += a.x * 50;
            }

        }
    }
}