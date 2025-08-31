class GuitarHeroLite extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'guitar-hero-lite' });

        this.notes;
        this.hitZoneY = 550;
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

        this.add.rectangle(400, this.hitZoneY, 200, 10, 0xff0000, 0.5);

        const scoreText = this.add.text(10, 10, 'Score: 0', { font: '20px Arial', fill: '#ffffff' });

        this.input.keyboard.on('keydown-SPACE', () =>
        {
            const hit = this.notes.getChildren().find(note => Math.abs(note.y - this.hitZoneY) < 20);

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
                    const note = this.add.sprite(400, 0, 'note');
                    this.notes.add(note);
                }
            });
        });

        this.music = this.sound.add('track');
        this.music.play();
    }

    update (time, delta)
    {
        Phaser.Actions.IncY(this.notes.getChildren(), 200 * delta / 1000);

        this.notes.getChildren().forEach(note =>
        {
            if (note.y > 600)
            {
                note.destroy();
            }
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ GuitarHeroLite ],
    physics: {
        default: 'arcade'
    }
};

const game = new Phaser.Game(config);
