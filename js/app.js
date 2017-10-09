// Enemies our player must avoid
class Enemy {
    constructor(x, y, speed) {
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started

        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.sprite = 'images/enemy-bug.png';
        this.win = false;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.

        let distance = this.speed * dt;
        this.x += distance;
        if(this.x >= 402) {
            this.x = 0;
        }
    }

    // Draw the enemy on the screen, required method for game
    render() {
        if(!this.win) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    }

    reset() {
        this.x = -100;
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = "images/char-boy.png";
        this.score = 0;
        this.win = false;
    }

    update(dt) {
        this.checkCollisions();
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        if(this.win) {
            this.displayGameWin();
        }
    }

    handleInput(keyCode) {
        if(!this.win) {
            switch (keyCode) {
                case 'left':
                    this.x = ((this.x - 20 ) >= -12) ? (this.x - 20) : this.x;
                    break;

                case 'up':
                    this.y = ((this.y - 20) >= -5) ? (this.y - 20) : this.y;
                    if (this.y === -5) {
                        this.setGameWin();
                    }
                    break;

                case 'right':
                    this.x = ((this.x + 20) <= 410) ? (this.x + 20) : this.x;

                case 'down':
                    this.y = ((this.y + 20) <= 400) ? (this.y + 20) : this.y;
            }
        } else {
            this.reset();
        }
    }

    setGameWin() {
        this.win = true;
        this.score++;
        document.getElementsByTagName("p").item(0).innerHTML = `Score : ${this.score}`;
    }

    reset() {
        this.win = false;
        this.x = 202;
        this.y = 395;
        this.render();
    }

    displayGameWin() {
        ctx.font = "70px Georgia"
        ctx.fillStyle = 'black';
        ctx.fillText("You won !!!", 80, 250);
        ctx.font = "35px Georgia";
        ctx.fillText("Press any key to continue", 60, 350);
    }

    checkCollisions() {
        let playerWidth = Resources.get(this.sprite).width - 30;
        let playerHeight = Resources.get(this.sprite).height - 130;

        for(let enemy of allEnemies) {
            let enemyWidth = Resources.get(enemy.sprite).width - 25;
            let enemyHeight = Resources.get(enemy.sprite).height - 130;
                if ((this.x < enemy.x + enemyWidth) &&
                    (this.x + playerWidth > enemy.x) &&
                    (this.y < enemy.y + enemyHeight) &&
                    (this.y + playerHeight > enemy.y)) {
                this.x = 202;
                this.y = 395;
            }
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let enemy1 = new Enemy(0, 65, 50);
let enemy2 = new Enemy(0, 145, 20);
let enemy3 = new Enemy(0, 225, 150);
let allEnemies = [enemy1, enemy2, enemy3];
//let allEnemies = [enemy1];

let winCounter = 0;

// Place the player object in a variable called player
let player = new Player(202, 395);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
