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
        this.x = -200;
        this.win = false;
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
        this.blueGemCount = 0;
        this.greenGemCount = 0;
        this.orangeGemCount = 0;
        this.heartCount = 0;
        this.keyCount = 0;
        this.lives = 3;
    }

    update(dt) {
        this.checkCollisions();
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        this.displayGemCount();
        this.displayLivesCount();
        this.displayScoreCount();
        if(this.lives <= 0) {
            this.win = true;
            this.displayGameWin();
        } else {
            this.win = false;
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
                    break;

                case 'down':
                    this.y = ((this.y + 20) <= 400) ? (this.y + 20) : this.y;
                    break;
            }
        } else if (this.lives <=0 && keyCode === 'space') {
            this.reset();
        }
    }

    setGameWin() {
        this.x = 202;
        this.y = 395;
        this.win = true;
        this.score++;
    }

    reset() {
        this.win = false;
        this.x = 202;
        this.y = 395;
        this.blueGemCount = 0;
        this.greenGemCount = 0;
        this.orangeGemCount = 0;
        this.heartCount = 0;
        this.keyCount = 0;
        this.score = 0;
        this.lives = 3;
        this.render();
    }

    displayScoreCount() {
        document.getElementsByClassName("score").item(0).innerHTML = `Score : ${this.score}`;
    }

    displayGameWin() {
        ctx.font = "60px Georgia"
        ctx.fillStyle = 'black';
        ctx.fillText("Game Over !!!", 70, 280);
        ctx.font = "30px Georgia";
        ctx.fillText("Press Spacebar to continue", 70, 350);
        allGems.forEach(function(gem) {
            gem.win = true;
        });

        allKeys.forEach(function(key) {
            key.win = true;
        });

        allHearts.forEach(function(heart) {
            heart.win = true;
        });
    }

    displayGemCount() {
        document.getElementsByClassName("blue").item(0).innerHTML = `: ${this.blueGemCount}`;
        document.getElementsByClassName("green").item(0).innerHTML = `: ${this.greenGemCount}`;
        document.getElementsByClassName("orange").item(0).innerHTML = `: ${this.orangeGemCount}`;
    }

    displayLivesCount() {
        document.getElementsByClassName("lives").item(0).innerHTML = `Lives: ${this.lives}`;
    }

    checkCollisions() {
        let playerWidth = Resources.get(this.sprite).width - 30;
        let playerHeight = Resources.get(this.sprite).height - 130;

        if (this.checkItemCollisions(playerWidth, playerHeight, allEnemies)) {
            this.x = 202;
            this.y = 395;
            this.lives--;
        }

        if (this.checkItemCollisions(playerWidth, playerHeight, allKeys)) {
            for (let key of allKeys) {
                if(key.display) {
                    key.display = false;
                    this.blueGemCount += 1;
                    this.greenGemCount += 1;
                    this.orangeGemCount += 1;
                }
            }
        }

        if (this.checkItemCollisions(playerWidth, playerHeight, allHearts)) {
            for (let heart of allHearts) {
                if(heart.display) {
                    heart.display = false;
                    this.lives += 1;
                }
            }
        }

        this.checkGemCollisions(playerWidth, playerHeight);
    }

    checkItemCollisions(playerWidth, playerHeight, items) {
        for(let item of items) {
            let itemWidth = Resources.get(item.sprite).width - 25;
            let itemHeight = Resources.get(item.sprite).height - 130;
                if ((this.x < item.x + itemWidth) &&
                    (this.x + playerWidth > item.x) &&
                    (this.y < item.y + itemHeight) &&
                    (this.y + playerHeight > item.y)) {
                return true;
            }
        }
    }

    checkGemCollisions(playerWidth, playerHeight) {
        for(let gem of allGems) {
            let gemWidth = Resources.get(gem.sprite).width - 25;
            let gemHeight = Resources.get(gem.sprite).height - 130;
                if ((this.x < gem.x + gemWidth) &&
                    (this.x + playerWidth > gem.x) &&
                    (this.y < gem.y + gemHeight) &&
                    (this.y + playerHeight > gem.y)) {
                if (gem.display) {
                    gem.display = false;
                    if (gem.color === "blue") {
                        this.blueGemCount++;
                    } else if (gem.color === "green") {
                        this.greenGemCount++;
                    } else if (gem.color === "orange") {
                        this.orangeGemCount++;
                    }
                }
            }
        }
    }
}

class GameJewels {
    constructor(x, y, sprite, sleepTime) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.display = true;
        this.lastTime = Date.now();
        this.win = false;
        this.sleepTime = sleepTime;
        this.delta = 0;
    }

    update() {

    }

    render() {
        var now = Date.now();
        var x = Math.floor(Math.random() * 101);//290;//
        var y = Math.floor(Math.random() * 101);//300;//

        if (now - this.lastTime > this.sleepTime) {
            this.display = true;
            this.x = x + this.delta;
            this.y = y + this.delta;
            this.lastTime = now;
        }

        if(this.display && !this.win) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 100, 125);
        }
    }

    reset() {
        this.display = false;
        this.win = false;
    }
}

class Gem extends GameJewels {
    constructor(x, y, sprite, color, sleepTime) {
        super(x, y, sprite, sleepTime);
        this.color = color;
    }

    update() {
        super.update();
    }

    render() {
        var now = Date.now();
        var x = Math.floor(Math.random() * 101);//290;//
        var y = Math.floor(Math.random() * 101);//300;//
        var deltaX, deltaY;

        if (now - this.lastTime > this.sleepTime) {
            this.display = true;
            if (this.color === "blue") {
                deltaX = 105;
                deltaY = 50;
            }

            if (this.color === "green") {
                deltaX = 50;
                deltaY = 200;
            }

            if (this.color === "orange") {
                deltaX = 220;
                deltaY = 250;
            }
            this.x = x + deltaX;
            this.y = y + deltaY;
            this.lastTime = now;
        }

        if(this.display && !this.win) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 100, 125);
        }
    }

    reset() {
        this.display = false;
        this.win = false;
        this.x = -100;
        this.y = -100;
    }
}

class Key extends GameJewels {
    constructor(x, y, sprite, sleepTime) {
        super(x, y, sprite, sleepTime);
        this.delta = 70;
    }

    update() {
        super.update();
    }

    render() {
        super.render();
    }

    reset() {
        super.reset();
    }
}

class Heart extends GameJewels{
    constructor(x, y, sprite, sleepTime) {
        super(x, y, sprite, sleepTime);
        this.delta = 20;
    }

    update() {
        super.update();
    }

    render() {
        super.render();
    }

    reset() {
        super.reset();
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let enemy1 = new Enemy(0, 65, 50);
let enemy2 = new Enemy(0, 145, 20);
let enemy3 = new Enemy(0, 225, 150);
let enemy4 = new Enemy(0, 310, 70);

let allEnemies = [enemy1, enemy2, enemy3, enemy4];

// Place the player object in a variable called player
let player = new Player(202, 395);

// Place the gems
let gem1 = new Gem(-100, -100, "images/Gem Blue.png","blue", 6000);
let gem2 = new Gem(-100, -100, "images/Gem Green.png","green", 15000);
let gem3 = new Gem(-100, -100, "images/Gem Orange.png","orange", 25000);
let allGems = [gem1, gem2, gem3];

let key1 = new Key(-100, -100, "images/Key.png", 30000);
let allKeys = [key1];

let heart1 = new Heart(-100, -100, "images/Heart.png", 40000);
let allHearts = [heart1];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
