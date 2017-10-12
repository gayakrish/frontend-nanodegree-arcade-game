/*
 * This class represents the bugs, the player needs to avoid. These bugs
 * move across the tiles at different speeds
 */
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
        // Multipling any movement by the dt parameter
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

    //resets the position of the bug away from the display
    reset() {
        this.x = -200;
        this.win = false;
    }
}

/*
 * This class represents the player of the game. The player class detects collisions
 * with bugs or collides and collects the game jewels. Appropriate score is rendered
 * to the screen.
 */
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

    // this method is called when the user wishes to change the image of the player
    updateSprite(sprite) {
        this.sprite = sprite;
    }

    // this method checks for collisions with bugs and other game jewels
    update(dt) {
        this.checkCollisions();
    }

    // this method redraws the player's position on the canvas and also displays the
    // score count, lives and gems collected
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        this.displayGemCount();
        this.displayLivesCount();
        this.displayScoreCount();

        //if the game is over, game over message is displayed
        if(this.lives <= 0) {
            this.win = true;
            this.displayGameWin();
        } else {
            this.win = false;
        }
    }

    // this method handles the arrow key movements and moves the player according to
    // the key press. calculations ensure that the player does not move off the canvas
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
            //restart the game when the space bar is pressed
        } else if (this.lives <=0 && keyCode === 'space') {
            this.reset();
        }
    }

    // sets the attributes for game win, resets the player position to start position
    setGameWin() {
        this.x = 202;
        this.y = 395;
        this.win = true;
        this.score++;
    }

    // resets the position of the player, gem counts, lives, scores etc
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

    // displays the updated score count
    displayScoreCount() {
        document.getElementsByClassName("score").item(0).innerHTML = `Score ${this.score}`;
    }

    // displays "Game Over" message and sets the "win" attribute of game jewels to true to
    // avoid them being shown on the screen after the game is over
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

    // displays the gem count on the screen
    displayGemCount() {
        document.getElementsByClassName("blue").item(0).innerHTML = ` ${this.blueGemCount}`;
        document.getElementsByClassName("green").item(0).innerHTML = ` ${this.greenGemCount}`;
        document.getElementsByClassName("orange").item(0).innerHTML = ` ${this.orangeGemCount}`;
    }

    // displays the number of lives
    displayLivesCount() {
        document.getElementsByClassName("lives").item(0).innerHTML = `Lives ${this.lives}`;
    }

    // this method is the main collision detection method, it detects collisions with bugs,
    // game jewels and takes appropriate action
    checkCollisions() {

        //the numbers 30, 130 are subtracted to ensure that player's transparent area is
        // not used for collision detection. Otherwise, it will look as if the player
        // collided with the item much before he reached the item, due to the extra
        // transparent section in the image
        let playerWidth = Resources.get(this.sprite).width - 30;
        let playerHeight = Resources.get(this.sprite).height - 130;

        //check for bug/enemy collisions
        if (this.checkItemsCollisions(playerWidth, playerHeight, allEnemies)) {
            //resets the player position and lose a life
            this.x = 202;
            this.y = 395;
            this.lives--;
        }

        //check for picking keys. each picked key increments all the gem counters by 1
        if (this.checkItemsCollisions(playerWidth, playerHeight, allKeys)) {
            for (let key of allKeys) {
                if(key.display) {
                    key.display = false;
                    this.blueGemCount += 1;
                    this.greenGemCount += 1;
                    this.orangeGemCount += 1;
                }
            }
        }

        //check for picking up hearts. when the player picks the heart, one life is added
        if (this.checkItemsCollisions(playerWidth, playerHeight, allHearts)) {
            for (let heart of allHearts) {
                if(heart.display) {
                    heart.display = false;
                    this.lives += 1;
                }
            }
        }

        //check for picking gems
        this.checkItemCollisions(playerWidth, playerHeight);
    }

    // this method takes an array of items to be checked for collision with the player
    checkItemsCollisions(playerWidth, playerHeight, items) {
        for(let item of items) {
            // the number subtracted is used to exclude the image's transparent area
            // in collision detection
            let itemWidth = Resources.get(item.sprite).width - 50;
            let itemHeight = Resources.get(item.sprite).height - 130;
                if ((this.x < item.x + itemWidth) &&
                    (this.x + playerWidth > item.x) &&
                    (this.y < item.y + itemHeight) &&
                    (this.y + playerHeight > item.y)) {
                return true;
            }
        }
    }

    // this method takes a single item to be checked for collision with the player.
    // it is mainly to detect the gems collected
    checkItemCollisions(playerWidth, playerHeight) {
        for(let gem of allGems) {
            let gemWidth = Resources.get(gem.sprite).width - 50;
            let gemHeight = Resources.get(gem.sprite).height - 150;
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

/*
 * This is the parent class for the different game jewels - gems, heart, key. This can be
 * used to add any kind of jewels/obstacles for the game.
 */
class GameJewels {
    constructor(x, y, sprite, sleepTime, delta) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.display = true;
        this.lastTime = Date.now();
        this.win = false;
        this.sleepTime = sleepTime;
        this.delta = delta;
    }

    update() {

    }

    render() {
        //places the object in a random position after the specified sleeptime
        var now = Date.now();
        var x = Math.floor(Math.random() * 101);//290;//
        var y = Math.floor(Math.random() * 101);//300;//

        if (now - this.lastTime > this.sleepTime) {
            this.display = true;
            this.x = x + this.delta;
            this.y = y + this.delta;

            //this is to ensure that the objects are not off the canvas, if the calulations
            // tend to go beyond the canvas, reset the object to a set position
            if(this.x < 30 || this.x > 400 || this.y < 30 || this.y > 400) {
                this.x = 300;
                this.y = 200;
            }

            this.lastTime = now;
        }

        // display the object only if its display flag is set and game not over
        if(this.display && !this.win) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 50 , 90);
        }
    }

    // resets the display, win flags and the location off screen
    reset() {
        this.display = false;
        this.win = false;
        this.x = -100;
        this.y = -100;
    }
}

/*
 * This is to hold each of the Gems, these Gems hold an extra color property
 */
class Gem extends GameJewels {
    constructor(x, y, sprite, color, sleepTime, delta) {
        super(x, y, sprite, sleepTime, delta);
        this.color = color;
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

/*
 * This class is to represent the Key that is available for the player to collect
 */
class Key extends GameJewels {
    constructor(x, y, sprite, sleepTime, delta) {
        super(x, y, sprite, sleepTime, delta);
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

/*
 * This class is to represent the Heart that is available for the player to collect
 */
class Heart extends GameJewels{
    constructor(x, y, sprite, sleepTime, delta) {
        super(x, y, sprite, sleepTime, delta);
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
let enemy1 = new Enemy(-100, 65, 50);
let enemy2 = new Enemy(-100, 145, 20);
let enemy3 = new Enemy(-100, 225, 150);
let enemy4 = new Enemy(-100, 310, 70);
let allEnemies = [enemy1, enemy2, enemy3, enemy4];

// Place the player object in a variable called player
let player = new Player(202, 395);

// Place the gems
let gem1 = new Gem(-100, -100, "images/Gem Blue.png","blue", 8000, 300);
let gem2 = new Gem(-100, -100, "images/Gem Green.png","green", 15000, 85);
let gem3 = new Gem(-100, -100, "images/Gem Orange.png","orange", 25000, 275);
let allGems = [gem1, gem2, gem3];

// Place the key
let key1 = new Key(-100, -100, "images/Key.png", 30000, 40);
let allKeys = [key1];

// Place the heart
let heart1 = new Heart(-100, -100, "images/Heart.png", 40000, 175);
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


// this is to change the image to char-boy
document.getElementById("char-boy").addEventListener("click", function(event){
    console.log("boy event");
    player.updateSprite("images/char-boy.png");
});

// this is to change the image to char-princess-girl
document.getElementById("char-princess-girl").addEventListener("click", function(event){
    console.log("girl event");
    player.updateSprite("images/char-princess-girl.png");
});

