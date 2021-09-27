//declaring variables
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
musicSound.loop = true;
let sc = 0; //score
let speed = 10;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }]; //snake body traces
let food = { x: 3, y: 5 }; //trace of food
let inputDir = { x: 0, y: 0 }; //dir which snake will move

function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(sArr) {
    // console.log(sArr[0].x)
    if (sArr[0].x < 1 || sArr[0].x > 18 || sArr[0].y < 1 || sArr[0].y > 18) {
        return true;
    }
    for (let i = 1; i < sArr.length; i++) {
        if (sArr[i].x === sArr[0].x && sArr[i].y === sArr[0].y) {
            return true;
        }
    }
    return false;
}

function gameEngine() {
    //updating snake and food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert('Game Over!!! Press any key to play again');
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.currentTime = 0;
        musicSound.play();
        sc = 0;
        scoreBox.innerHTML = sc;
    }

    // incrementing the score and re-displaying the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        sc += 1; //incrementing score by 1
        if (sc > hiScoreVal) {
            hiScoreVal = sc;
            localStorage.setItem('hiScore', JSON.stringify(hiScoreVal));
            highScoreBox.innerHTML = hiScoreVal;
        }
        scoreBox.innerHTML = sc;
        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y,
        });
        let a = 1,
            b = 18;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random()),
        };
    }
    //moving the snake(individual body parts)
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    board.innerHTML = '';
    //displaying snake
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index == 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('tail');
        }
        board.appendChild(snakeElement);
    });
    //displaying food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

setTimeout(() => {
    musicSound.play();
}, 1000);
let hiScoreVal,
    hiScore = localStorage.getItem('hiScore');
if (hiScore === null) {
    hiScoreVal = 0;
    localStorage.setItem('hiScore', JSON.stringify(hiScoreVal));
} else {
    hiScoreVal = JSON.parse(hiScore);
    highScoreBox.innerHTML = hiScoreVal;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    moveSound.play();
    inputDir = { x: 0, y: 1 };
    switch (e.key) {
        case 'ArrowUp':
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case 'ArrowDown':
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case 'ArrowLeft':
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case 'ArrowRight':
            inputDir.x = 1;
            inputDir.y = 0;
            break;

        default:
            break;
    }
});
