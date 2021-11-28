//=======GLOBAL VARIABLES & DOM SELECTORS==========

let gameState = {
    grid: [],
    apple: [],
    size: 20,
    score: 0,
    interval: null,
    milliseconds: 500,
    snake: {
        body: [ [10, 10] , [10, 11], [10, 12] ],
        nextDirection: [1,0]
    }
}

const gridBody = document.getElementById("grid-container");
const grid = document.createElement("table");
const tableBody = document.createElement("tbody");
let easyButton = document.getElementById("easy");
let medButton = document.getElementById("med");
let hardButton = document.getElementById("hard");
let highScore = 0;
let scoreEl = document.getElementById("score");
let highScoreEl = document.getElementById("high-score");

//==========FUNCTIONS===========

//ESTABLISHING STATE OF GRID
function buildGrid() {
    for(let i = 0; i < gameState.size ; i ++){
        const row =[];
        for(let j = 0; j < gameState.size; j ++) {
            row.push("");
        }
        gameState.grid.push(row)
    }
}

//RANDOMIZING LOCATION OF APPLE ON GRID
function buildApple() {
    let appleRow = Math.floor(Math.random() * gameState.size);
    let appleCol = Math.floor(Math.random() * gameState.size);
    for(let i=0; i < gameState.snake.body.length; i++) {
        if(appleRow === gameState.snake.body[i][0] && appleRow === gameState.snake.body[i][1]){
            for(let j=0; j < gameState.snake.body.length; j++) {
                if(appleCol === gameState.snake.body[j][0] && appleCol === gameState.snake.body[j][1]){
                    let appleRow = Math.floor(Math.random() * gameState.size);
                    let appleCol = Math.floor(Math.random() * gameState.size);
                    gameState.apple = [appleRow, appleCol];
                } else {
                    gameState.apple = [appleRow, appleCol];
                }
            }
                
        }
    }
}

//MOVE SNAKE
function tick() {    
    const lastSegment = gameState.snake.body[gameState.snake.body.length - 1];
    const newSegment = [lastSegment[0], lastSegment[1]];
    newSegment[0] += gameState.snake.nextDirection[0];
    newSegment[1] += gameState.snake.nextDirection[1];
    
    //SNAKE EATS APPLE
    if(newSegment[0] === gameState.apple[0] && newSegment[1] === gameState.apple[1]) {
        buildApple();
        gameState.score++;
    } else {
        gameState.snake.body.shift();
    }

    //SNAKE HITS WALL
    if(newSegment[0] >= gameState.size || newSegment[1] >= gameState.size){
        clearInterval(interval);
        window.alert("Game Over!");
        return;
    }
    if(newSegment[0] < 0 || newSegment[1] < 0){
        clearInterval(interval);
        window.alert("Game Over!");
        return;
    }

    //SNAKE HITS ITSELF
    gameState.snake.body.forEach(e =>{
        if(e[0] === newSegment[0] && e[1] === newSegment[1]){
            clearInterval(interval);
            window.alert("Game Over!");
            return; 
        }
    })

    gameState.snake.body.push(newSegment);
    
    drawSnake();
    drawApple();
    renderGrid();
    updateScore();
    updateHighScore();
}

//UPDATE SCORE
function updateScore() {
    scoreEl.innerHTML = gameState.score;
}

//UPDATE HIGHEST SCORE
function updateHighScore() {
    localStorage.setItem('high-score', highScore);
    highScoreEl.innerHTML = highScore;
    if(gameState.score > highScore) {
        highScore = gameState.score; 
    }
}

//===========DOM MANIPULATION FUNCTIONS===========

function renderGrid() { 
    grid.innerHTML ="";
    for(let i = 0; i < gameState.size; i++){
        const row = document.createElement("tr")
        row.dataset.rowIndex = i;
        for(let j = 0; j < gameState.size; j++){
            const cell = document.createElement("td")
            cell.dataset.columnIndex = j;
            row.appendChild(cell);
            const tile = document.createElement("div");
            if(gameState.snake.body[gameState.snake.body.length - 1][0] === i && gameState.snake.body[gameState.snake.body.length - 1][1] === j) {
                tile.classList.add("snake-head");
            }
            if(gameState.grid[i][j] === "snake") {
                tile.classList.add("snake");
            } else if(gameState.grid[i][j] === "apple") {
                tile.classList.add("apple");
            }
            tile.classList.add("tile");
            cell.appendChild(tile);
    }
    grid.appendChild(row);
}
}
grid.appendChild(tableBody);
gridBody.appendChild(grid);

//DRAWING SNAKE ON GRID
function drawSnake() {
    for(let i = 0; i < gameState.grid.length; i++){
        for(let j =0; j < gameState.grid.length; j++){
            gameState.grid[i][j] = "";
        }
    }
    for(let i = 0; i < gameState.snake.body.length; i++){
        const currentSnake = gameState.snake.body[i];
        const snakeRow = currentSnake[0];
        const snakeCol = currentSnake[1];
        gameState.grid[snakeRow][snakeCol] = "snake";

    }
}

//DRAWING APPLE ON GRID
function drawApple() {
    const foodRow = gameState.apple[0];
    const foodCol = gameState.apple[1];
    gameState.grid[foodRow][foodCol] = "apple";
}

//BUTTONS

function startGame() {
    interval = setInterval(tick, gameState.milliseconds);
}

function easyGame() {
    easyButton.classList.add("active");
    medButton.classList.remove("active");
    hardButton.classList.remove("active");
    gameState.milliseconds = 500;

}

function medGame() {
    medButton.classList.add("active");
    easyButton.classList.remove("active");
    hardButton.classList.remove("active");
    gameState.milliseconds = 250;

}


function hardGame() {
    hardButton.classList.add("active");
    medButton.classList.remove("active");
    easyButton.classList.remove("active");
    gameState.milliseconds = 100;

}
function playAgain() {
    
    gameState = {
        grid: [],
        apple: [],
        size: 20,
        score: 0,
        interval: null,
        milliseconds: gameState.milliseconds,
        snake: {
            body: [ [10, 10] , [10, 11], [10, 12] ],
            nextDirection: [1,0]
        }
    }

    highScore = localStorage.getItem('high-score');

    updateScore();
    buildGrid();
    buildApple();
    drawSnake();
    drawApple();
    renderGrid();
}

//==========INVOKING FUNCTIONS=========

buildGrid();
buildApple();
drawSnake();
drawApple();
renderGrid();

//=================EVENT LISTENERS=====================

//KEYDOWN EVENTS
document.addEventListener('keydown', function(e) {
    switch (e.key) {
        case "ArrowLeft":
            //snake moves left
            if(gameState.snake.nextDirection[0] === 0
                && gameState.snake.nextDirection[1] === 1) {
                return;
            }
            gameState.snake.nextDirection = [0, -1];
            break;
        case "ArrowUp":
           //snake moves up;
           if(gameState.snake.nextDirection[0] === 1 
            &&  gameState.snake.nextDirection[1] === 0){
            return;
        }
           gameState.snake.nextDirection = [-1, 0];
            break;
        case "ArrowRight":
            //snake moves right;
            if(gameState.snake.nextDirection[0] === 0 &&
                gameState.snake.nextDirection[1] === -1){
                return;
            }
            gameState.snake.nextDirection = [0, 1];
            break;
        case "ArrowDown":
            //snake moves down;
            if(gameState.snake.nextDirection[0] === -1 
                && gameState.snake.nextDirection[1] === 0){
                return;
            }
            gameState.snake.nextDirection = [1, 0];
            break;
    }

});  
