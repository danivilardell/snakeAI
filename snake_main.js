var canvas;
var canvasContext;

let surround = 5;
var BOARD_SIZE = 600;
var GAME_SIZE = 30;
var MOVE_X = [-1, 1, 0, 0];
var MOVE_Y = [0, 0, -1, 1];

var currBoard;
var lastClick = -1;
var currDirection = 3;
var snakePosition = new Queue();
var snakeLength = 2;
var counter = 0;

var bestResult = 168;

window.onload = async function() {
	initialize();

	setInterval(function() {
        if(lastClick != -1) {
            getNextMoveAI(function() {
                drawEverything();
                updateSnakePosition();
            });
        }
        else {
            if(counter == 300) initialize();
            counter++;
        }

	}, 10);
}

function initialize() {
    lastClick = 3;
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    currDirection = 3;
    snakePosition = new Queue();
    snakeLength = 2;

    currBoard = Array(GAME_SIZE).fill().map(()=>Array(GAME_SIZE).fill())
    for(var i = 0; i < currBoard.length; i++) {
        for(var j = 0; j < currBoard[0].length; j++) {
            currBoard[i][j] = 0;
        }
    }

    spawnApple();
    snakePosition.enqueue([5, 3]);
    snakePosition.enqueue([5, 4]);
    snakePosition.enqueue([5, 5]);
    currBoard[5][3] = 1;
    currBoard[5][4] = 1;
    currBoard[5][5] = 1;

    drawInitialBoard();
}

function updateSnakePosition() {
    
    var currHead = snakePosition.head();
    var nextHead = [currHead[0] + MOVE_X[lastClick], currHead[1] + MOVE_Y[lastClick]];
    snakePosition.enqueue(nextHead);
    if(nextHead[0] >= GAME_SIZE || nextHead[1] >= GAME_SIZE || 
            nextHead[0] < 0 || nextHead[1] < 0 ||
            currBoard[nextHead[0]][nextHead[1]] == 1) {
        canvasContext.font = '50px serif';
        canvasContext.fillStyle = 'white';
        canvasContext.fillText("HAS MORT",180,300)
        lastClick = -1;
        counter = 0;
        if(snakeLength > bestResult) bestResult = snakeLength;
        return;
    }
    else if(currBoard[nextHead[0]][nextHead[1]] == 2) {
        currBoard[nextHead[0]][nextHead[1]] = 1;
        currDirection = lastClick;
        snakeLength++;
        spawnApple();
    }
    else {
        currBoard[nextHead[0]][nextHead[1]] = 1;
        currDirection = lastClick;
        var tail = snakePosition.dequeue();
        currBoard[tail[0]][tail[1]] = 0;
    }
    
}

function drawInitialBoard() {
    canvasContext.fillStyle = 'blue';
    canvasContext.fillRect(0,0, canvas.width, canvas.height);
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(surround,surround, canvas.width  - 2*surround, canvas.height - 2*surround);

    drawSnake();
}

function drawEverything() {
    
    canvasContext.fillStyle = 'blue';
    canvasContext.fillRect(0,0, canvas.width, canvas.height);
	canvasContext.fillStyle = 'black';
	canvasContext.fillRect(surround,surround, canvas.width  - 2*surround, canvas.height - 2*surround);
    
    drawSnake();

    canvasContext.font = '20px serif';
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("Length: " + snakeLength,420,50)
    canvasContext.fillText("Personal best: " + bestResult,420,70)
    
}

function drawSnake() {
    var squareSize = BOARD_SIZE/currBoard.length;
    for(var i = 0; i < currBoard.length; i++) {
        for(var j = 0; j < currBoard[0].length; j++) {
            if(currBoard[i][j] == 1) colorRect(surround + i*squareSize, surround + j*squareSize, squareSize - 1, squareSize - 1, '#18d921');
            else if(currBoard[i][j] == 2) colorRect(surround + i*squareSize, surround + j*squareSize, squareSize, squareSize, 'red');
        }
    }
    var currHead = snakePosition.head();
    if(currDirection == 3 || currDirection == 1) colorRect(surround + currHead[0]*squareSize + squareSize*0.6, surround + currHead[1]*squareSize + squareSize*0.6, squareSize/4, squareSize/4, 'black');
    if(currDirection == 3 || currDirection == 0) colorRect(surround + currHead[0]*squareSize + squareSize*0.15, surround + currHead[1]*squareSize + squareSize*0.6, squareSize/4, squareSize/4, 'black');
    if(currDirection == 2 || currDirection == 0) colorRect(surround + currHead[0]*squareSize + squareSize*0.15, surround + currHead[1]*squareSize + squareSize*0.15, squareSize/4, squareSize/4, 'black');
    if(currDirection == 2 || currDirection == 1) colorRect(surround + currHead[0]*squareSize + squareSize*0.6, surround + currHead[1]*squareSize + squareSize*0.15, squareSize/4, squareSize/4, 'black')
}

function drawCircle(centerX, centerY, radius, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function colorRect(posX, posY, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(posY, posX, width, height);
}

function spawnApple() {
    let M = GAME_SIZE*GAME_SIZE - snakeLength;
    let pos = Math.floor(Math.random() * (M - 10)) + 1;

    let aux = 0;
    console.log(pos, snakeLength);
    for(var i = 0; i < currBoard.length; i++) {
        for(var j = 0; j < currBoard[0].length; j++) {

            aux += 1 - currBoard[i][j];

            //console.log(aux, pos)
            if(aux == pos) {
                currBoard[i][j] = 2;
                break;
            }
            
        }
        if(aux == pos) break;
    }
}

