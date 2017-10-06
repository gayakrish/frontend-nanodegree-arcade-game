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
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.

        //console.log("dt " + dt);
        let distance = this.speed * dt;
        this.x += distance;
        //this.y += distance;

        if(this.x >= 402) {
            this.x = 0;
        }
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        //this.speed = speed;
        this.sprite = "images/char-boy.png";       
    }

    update(dt) {
        checkCollisions();
    }

    render() {
        //this.x = ctx.canvas.clientWidth/2.5;
        //this.y = ctx.canvas.clientHeight/1.5;
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(keyCode) {
        console.log("inside handleInput " + keyCode);
        if (keyCode === 'left') {
            console.log("left is pressed");
            this.x = ((this.x - 24) >= 0) ? (this.x - 24) : this.x;
           
            console.log("x " + this.x);
            //update(10);
        }

        if (keyCode === 'up') {
            console.log("up is pressed");
            this.y = ((this.y - 24) >= -16) ? (this.y - 24) : this.y;
            console.log("y " + this.y);

        }

        if (keyCode === 'right') {
            console.log("right is pressed");
            this.x = ((this.x + 24) <= 402) ? (this.x + 24) : this.x;
            console.log("x " + this.x);
        }

        if (keyCode === 'down') {
            console.log("down is pressed");
            this.y = ((this.y + 24) <= 404) ? (this.y + 24) : this.y;
            console.log("y " + this.y);
        }
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let enemy1 = new Enemy(0, 65, 50);
let enemy2 = new Enemy(0, 145, 170);
let enemy3 = new Enemy(0, 145, 20);
let enemy4 = new Enemy(0, 225, 300);
let enemy5 = new Enemy(0, 225, 100);
let allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5];

// Place the player object in a variable called player
let player = new Player(202, 404);

function checkCollisions() {

let playerWidth = Resources.get(player.sprite).width;
let playerHeight = Resources.get(player.sprite).height;

    console.log("player width " + playerWidth);
    console.log("player height " + playerHeight);

    
    for(enemy of allEnemies) {
        let enemyWidth = enemy.clientWidth;
        let enemyHeight = enemy.clientHeight;

        if ((player.x + playerWidth - 1) < enemy.x || 
            (enemy.x + enemyWidth - 1) < player.x || 
            (player.y + playerHeight - 1) < enemy.y ||
            (enemy.y + enemyHeight - 1) < player.y) {

            console.log("collision!!!!");
            player.x = 202;
            player.y = 404;
        }
    }
}

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
