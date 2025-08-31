class GuitarHeroLite extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'guitar-hero-lite' });

        this.notes;
        this.hitZoneY = 0;
        this.score = 0;
    }

    preload ()
    {
        // this.load.setBaseURL('https://cdn.phaserfiles.com/v355');
        this.load.audio('track', 'assets/audio/CatAstroPhi_shmup_normal.mp3');
        this.load.image('note', 'assets/sprites/block.png');
    }

    create ()
    {
        this.notes = this.add.group();

        const { width, height } = this.scale;
        this.hitZoneY = height - 160;

        this.add.rectangle(width / 2, this.hitZoneY, width, 20, 0xff0000, 0.5);

        const scoreText = this.add.text(10, 10, 'Score: 0', { font: '20px Arial', fill: '#ffffff' });

        this.input.on('pointerdown', () =>
        {
            const hit = this.notes.getChildren().find(note => Math.abs(note.y - this.hitZoneY) < 40);

            if (hit)
            {
                hit.destroy();
                this.score += 10;
                scoreText.setText('Score: ' + this.score);
            }
        });

        const map = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000];

        map.forEach(delay =>
        {
            this.time.addEvent({
                delay,
                callback: () =>
                {
                    const note = this.add.sprite(width / 2, 0, 'note');
                    this.notes.add(note);
                }
            });
        });

        this.music = this.sound.add('track');
        this.music.play();
    }

    update (time, delta)
    {
        Phaser.Actions.IncY(this.notes.getChildren(), 300 * delta / 1000);

        this.notes.getChildren().forEach(note =>
        {
            if (note.y > this.scale.height)
            {
                note.destroy();
            }
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 540,
    height: 960,
    parent: 'phaser-example',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [ GuitarHeroLite ],
    physics: {
        default: 'arcade'
    }
};

const game = new Phaser.Game(config);
