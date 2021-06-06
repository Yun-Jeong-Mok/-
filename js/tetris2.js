const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button");
const startButton = document.querySelector(".start");

const GAME_ROWS = 20;
const GAME_COLS = 15;

let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;


// 블럭 모양

const BLOCKS = {
    tree: [
        [[2, 1], [0, 1], [1, 0], [1, 1]],
        [[2, 1], [1, 2], [1, 0], [1, 1]],
        [[1, 2], [0, 1], [2, 1], [1, 1]],
        [[1, 2], [0, 1], [1, 0], [1, 1]],
    ],
    square: [
        [[0, 0], [0, 1], [1, 0], [1, 1]],
        [[0, 0], [0, 1], [1, 0], [1, 1]],
        [[0, 0], [0, 1], [1, 0], [1, 1]],
        [[0, 0], [0, 1], [1, 0], [1, 1]],
    ],
    bar: [
        [[0, 0], [1, 0], [2, 0], [3, 0]],
        [[2, 0], [2, 1], [2, 2], [2, 3]],
        [[0, 2], [1, 2], [2, 2], [3, 2]],
        [[1, 0], [1, 1], [1, 2], [1, 3]],
    ],
    Zleft: [
        [[0, 0], [1, 0], [1, 1], [2, 1]],
        [[0, 1], [1, 0], [1, 1], [0, 2]],
        [[0, 0], [1, 0], [1, 1], [2, 1]],
        [[0, 1], [1, 0], [1, 1], [0, 2]],
    ],
    Zright: [
        [[0, 1], [1, 0], [1, 1], [2, 0]],
        [[0, 0], [0, 1], [1, 1], [1, 2]],
        [[0, 1], [1, 0], [1, 1], [2, 0]],
        [[0, 0], [0, 1], [1, 1], [1, 2]],
    ],
    Lleft: [
        [[0, 0], [0, 1], [1, 1], [2, 1]],
        [[0, 0], [1, 0], [0, 1], [0, 2]],
        [[0, 0], [1, 0], [2, 0], [2, 1]],
        [[2, 0], [2, 1], [2, 2], [1, 2]],
    ],
    Lright: [
        [[0, 1], [1, 1], [2, 1], [2, 0]],
        [[0, 0], [0, 1], [0, 2], [1, 2]],
        [[0, 0], [1, 0], [2, 0], [0, 1]],
        [[1, 0], [2, 0], [2, 1], [2, 2]],
    ],
    plus: [
        [[1, 0], [1, 1], [1, 2], [0, 1], [2, 1]],
        [[1, 0], [1, 1], [1, 2], [0, 1], [2, 1]],
        [[1, 0], [1, 1], [1, 2], [0, 1], [2, 1]],
        [[1, 0], [1, 1], [1, 2], [0, 1], [2, 1]],
    ],
    dot: [
        [[1, 1]],
        [[1, 1]],
        [[1, 1]],
        [[1, 1]],
    ],
}

const movingItem = {
    type: "",
    direction: 3,
    top: 0,
    left: 0,
};

init()

// 함수

function init() {
    tempMovingItem = { ...movingItem };
    for (let i = 0; i < GAME_ROWS; i++) {
        prependNewLine()
    }
    generateNewBlock()
}

function prependNewLine() {
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for (let j = 0; j < GAME_COLS; j++) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul)
    playground.prepend(li)
}

function renderBlocks(moveType = "") {
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })
    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if (isAvailable) {
            target.classList.add(type, "moving")
        }
        else {
            tempMovingItem = { ...movingItem }
            if (moveType === 'retry') {
                clearInterval(downInterval)
                showGameoverText()
            }
            setTimeout(() => {
                renderBlocks('retry');
                if (moveType === "top") {
                    seizeBlock();
                }
            }, 0)
            return true;
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}

function seizeBlock() {
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch()
}

function checkMatch() {
    const childNodes = playground.childNodes;
    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.forEach(li => {
            if (!li.classList.contains("seized")) {
                matched = false;
            }
        })
        if (matched) {
            child.remove();
            prependNewLine()
            score += 100;
            scoreDisplay.innerText = score;
        }
    })
    generateNewBlock()
}

function generateNewBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock('top', 1)
    }, duration)
    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length)
    movingItem.type = blockArray[randomIndex][0]
    movingItem.top = 0;
    movingItem.left = 6;
    movingItem.direction = 0;
    tempMovingItem = { ...movingItem };
    renderBlocks();
}

function checkEmpty(target) {
    if (!target || target.classList.contains("seized")) {
        return false;
    }
    return true;
}

function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType)
}

function changeDirection() {
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks()
}

function dropBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1)
    }, 20)
}

function showGameoverText() {
    gameText.style.display = "flex"
}

// 이벤트

document.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 17:
            dropBlock();
            break;
        case 37:
            moveBlock("left", -1);
            break;
        case 38:
            changeDirection();
            break;
        case 39:
            moveBlock("left", 1);
            break;
        case 40:
            moveBlock("top", 1);
            break;
        default:
            break;
    }
    console.log(e)
})

restartButton.addEventListener("click", () => {
    playground.innerHTML = "";
    gameText.style.display = "none"
    scoreDisplay.innerText = 0;
    init();
})

// 배경음악


startButton.addEventListener("click", (e) => {
    audio1.play();
    audio1.volume = 0.5;
    audio2.pause();
    playbtn1.innerHTML = "Pause";
    playbtn2.innerHTML = "SoundTrack2";
})

var audio1 = document.getElementById("audio1");
var audio2 = document.getElementById("audio2");
var playbtn1 = document.getElementById("playbtn1");
var playbtn2 = document.getElementById("playbtn2");
var count = 0;

function playStop1() {
    if (count == 0) {
        count = 1;
        audio1.pause();
        playbtn1.innerHTML = "SoundTrack1";
    }
    else {
        count = 0;
        audio1.play();
        audio1.volume = 0.5;
        audio2.pause();
        playbtn1.innerHTML = "Pause";
        playbtn2.innerHTML = "SoundTrack2";
    }
}

function playStop2() {
    if (count == 0) {
        count = 1;
        audio2.play();
        audio2.volume = 0.5;
        audio1.pause();
        playbtn2.innerHTML = "Pause";
        playbtn1.innerHTML = "SoundTrack1";
    }
    else {

        count = 0;
        audio2.pause();
        playbtn2.innerHTML = "SoundTrack2";
    }
}