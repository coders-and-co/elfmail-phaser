import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#33A5E7',
  input: {
    gamepad: true
  },
  scale: {
    width: 1920,
    height: 1080,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
        tileBias: 100, // 16
        // overlapBias: 100, // 4
        gravity: { y: 2000 },
        debug: false,
    },
  },

};
