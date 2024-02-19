const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let initialState = {
    cols: 40,
    rows: 18,
    score: 0,
    tail: [],
    static: 20,
    snakeX: 0,
    snakeY: 0,
    eatX: null,
    eatY: null,
    velX: 0,
    velY: 0,
    gameOver: false
}

canvas.width = initialState.static * initialState.cols;
canvas.height = initialState.static * initialState.rows;

class Square {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Text {
    constructor(text, x, y, textAlign, fontSize) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.textAlign = textAlign;
        this.fontSize = fontSize;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.font = `${this.fontSize}px Roboto Mono`;
        ctx.textAlign = this.textAlign;
        ctx.fillText(this.text, this.x, this.y);
    }
}

// Lyssna på tangentbordsnedtryckningar för att ändra riktning
addEventListener('keydown', ({ key }) => {
    switch (key) {
        case "w":
        case "ArrowUp":
            initialState.velX = 0;
            initialState.velY = -1;
            break;
        case "s":
        case "ArrowDown":
            initialState.velX = 0;
            initialState.velY = 1;
            break;
        case "a":
        case "ArrowLeft":
            initialState.velX = -1;
            initialState.velY = 0;
            break;
        case "d":
        case "ArrowRight":
            initialState.velX = 1;
            initialState.velY = 0;
            break;
        default:
            break;
    }
    updateScore();
});

const generateEat = () => {
    initialState.eatX = Math.floor(Math.random() * initialState.cols) * initialState.static;
    initialState.eatY = Math.floor(Math.random() * initialState.rows) * initialState.static;
}

generateEat();

const loop = () => {
    setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        new Square(0, 0, canvas.width, canvas.height, 'black').draw();
        new Square(initialState.snakeX, initialState.snakeY, initialState.static, initialState.static, 'green').draw();
        new Square(initialState.eatX, initialState.eatY, initialState.static, initialState.static, 'red').draw();

        initialState.snakeX += initialState.velX * initialState.static;
        initialState.snakeY += initialState.velY * initialState.static;

        if (initialState.snakeX == initialState.eatX && initialState.snakeY == initialState.eatY) {
            initialState.tail.push([initialState.eatX, initialState.eatY]);
            initialState.score += 1;
            generateEat();
        }

        for (let i = initialState.tail.length - 1; i >= 1; i--) {
            initialState.tail[i] = initialState.tail[i - 1];
        }

        if (initialState.tail.length) {
            initialState.tail[0] = [initialState.snakeX, initialState.snakeY];
        }

        for (let i = 0; i < initialState.tail.length; i++) {
            new Square(initialState.tail[i][0], initialState.tail[i][1], initialState.static, initialState.static, "green").draw();
        }

        if (initialState.snakeX < 0 || initialState.snakeX > initialState.cols * initialState.static || initialState.snakeY < 0 || initialState.snakeY > initialState.rows * initialState.static) {
            gameOverFunc();
        }

        if (initialState.gameOver) {
            new Text('Game over', canvas.width / 2, canvas.height / 2 - 25, 'center', 70).draw();
            new Text('Start again', canvas.width / 2, canvas.height / 2 + 25, 'center', 40).draw();
        }
    }, 3000 / 10);
};

const gameOverFunc = () => {
    initialState.score = 0;
    initialState.tail = [];
    initialState.static = 0;
    initialState.snakeX = 0;
    initialState.snakeY = 0;
    initialState.velX = 0;
    initialState.velY = 0;
    initialState.gameOver = true;
}

// Funktion för att ändra ormens riktning baserat på knapptryckningar
const changeDirection = (velX, velY) => {
    initialState.velX = velX;
    initialState.velY = velY;
    updateScore();
}

const updateScore = () => {
    document.getElementById('score').innerText = initialState.score;
}

document.getElementById('left').addEventListener('click', () => {
    changeDirection(-1, 0); 
});

document.getElementById('right').addEventListener('click', () => {
    changeDirection(1, 0); 
});

document.getElementById('up').addEventListener('click', () => {
    changeDirection(0, -1);
});

document.getElementById('down').addEventListener('click', () => {
    changeDirection(0, 1);
});

loop();
