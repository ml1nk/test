define(['client/lib/phaser'], function (Phaser) {

    function Game() {
        console.log('Making the Game');
    }

    Game.prototype = {
        constructor: Game,

        start: function() {
            this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'test', {
                preload: this.preload,
                create: this.create
            });
        },

        preload: function() {
            this.game.load.image('logo', 'assets/phaser.png');
            var game = this.game;
            window.addEventListener("resize", function(){
              game.scale.setGameSize(window.innerWidth, window.innerHeight);
            });
        },

        create: function() {
            var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
            logo.anchor.setTo(0.5, 0.5);
        }
    };

    var test = new Game();
    test.start();
});
