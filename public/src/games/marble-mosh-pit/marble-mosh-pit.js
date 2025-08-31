class MarbleMoshPit extends Phaser.Scene {
    constructor() {
        super('MarbleMoshPit');
    }

    preload() {
        // Load ball sprites and music from existing assets
        this.load.image('player', 'assets/sprites/shinyball.png');
        this.load.image('enemyRed', 'assets/sprites/red_ball.png');
        this.load.image('enemyBlue', 'assets/sprites/blue_ball.png');
        this.load.audio('wizball', [
            'assets/audio/oedipus_wizball_highscore.mp3',
            'assets/audio/oedipus_wizball_highscore.ogg'
        ]);
    }

    create() {
        const width = 800;
        const height = 600;

        // Platform background
        this.add.rectangle(width / 2, height / 2, width, height, 0x1d1d1d);

        // Music
        this.sound.play('wizball');

        // Player marble
        this.player = this.physics.add.image(width / 2, height / 2, 'player');
        this.player.setCircle(this.player.width / 2);
        this.player.setBounce(1);
        this.player.setDrag(50, 50);
        this.player.setCollideWorldBounds(false);

        // Enemy marbles group
        this.enemies = this.physics.add.group();

        // Initial enemies
        for (let i = 0; i < 5; i++) {
            this.spawnEnemy();
        }

        // Collisions
        this.physics.add.collider(this.player, this.enemies, this.handleHit, null, this);
        this.physics.add.collider(this.enemies, this.enemies);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Level progression
        this.level = 1;
        this.time.addEvent({ delay: 20000, callback: this.increaseDifficulty, callbackScope: this, loop: true });
    }

    spawnEnemy() {
        const x = Phaser.Math.Between(50, 750);
        const y = Phaser.Math.Between(50, 550);
        const tex = Phaser.Math.Between(0, 1) ? 'enemyRed' : 'enemyBlue';
        const enemy = this.enemies.create(x, y, tex);
        enemy.setCircle(enemy.width / 2);
        enemy.setBounce(1);
        enemy.setCollideWorldBounds(false);
        const speed = 100 + this.level * 50;
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        enemy.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    }

    handleHit(player, enemy) {
        // Slight speed boost to enemies on hit to make mosh pit lively
        enemy.body.velocity.scale(1.05);
    }

    increaseDifficulty() {
        if (this.level < 3) {
            this.level++;
        }
        this.spawnEnemy();
    }

    update() {
        // Control player
        const speed = 200 + this.level * 50;
        if (this.cursors.left.isDown) {
            this.player.setAccelerationX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setAccelerationX(speed);
        } else {
            this.player.setAccelerationX(0);
        }

        if (this.cursors.up.isDown) {
            this.player.setAccelerationY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.setAccelerationY(speed);
        } else {
            this.player.setAccelerationY(0);
        }

        // Rotate marbles based on velocity
        this.player.rotation += this.player.body.speed * 0.01;
        this.enemies.children.iterate(function (enemy) {
            enemy.rotation += enemy.body.speed * 0.01;
        });

        // Check if player falls off stage
        if (!Phaser.Geom.Rectangle.Contains(this.physics.world.bounds, this.player.x, this.player.y)) {
            this.scene.restart();
        }

        // Remove enemies that fall off
        this.enemies.children.each(function (enemy) {
            if (!Phaser.Geom.Rectangle.Contains(this.physics.world.bounds, enemy.x, enemy.y)) {
                enemy.destroy();
            }
        }, this);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1d1d1d',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
            checkCollision: { up: false, down: false, left: false, right: false }
        }
    },
    scene: MarbleMoshPit
};

new Phaser.Game(config);

