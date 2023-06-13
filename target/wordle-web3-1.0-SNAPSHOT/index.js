import { WORDS } from "./wordsBase.js"

        let keyboardMatrice = [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ç"],
            ["Backspace", "Z", "X", "C", "V", "B", "N", "M", "Enter"]
        ];
let nextLetter = 0;
let guessesRemaining = 6;
let guessArr = [];
let gameEndend = false;
let answer;
let session = window.sessionStorage.getItem("word");

// changes the value of the answer depending of the existence of a session
if (session === null) {
    answer = WORDS[Math.floor(Math.random() * WORDS.length)];
} else {
    answer = window.sessionStorage.getItem("word").toString();
}


function initializeBoard() {
    let board = document.querySelector(".game-board");

    for (let i = 0; i < 6; i++) {
        let row = document.createElement("div");
        row.className = `square-row-${i}`;

        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div");
            box.className = `square-box-${j}`;
            row.appendChild(box);
        }

        board.appendChild(row);
    }
}

function initializeKeyboard() {
    let keyboardRow0 = document.querySelector(".first-row");
    let keyboardRow1 = document.querySelector(".second-row");
    let keyboardRow2 = document.querySelector(".third-row");
    let btn;


    for (let i = 0; i < keyboardMatrice.length; i++) {
        let key = keyboardMatrice[i];
        for (let j = 0; j < key.length; j++) {
            if (i === 0) {
                btn = document.createElement("button");
                btn.innerHTML = key[j];
                btn.name = key[j];
                btn.className = "keyboard-btn";
                btn.addEventListener("click", function () {
                    keyboardClick(this);
                });
                keyboardRow0.appendChild(btn);
            } else if (i === 1) {
                btn = document.createElement("button");
                btn.innerHTML = key[j];
                btn.name = key[j];
                btn.className = "keyboard-btn";
                btn.addEventListener("click", function () {
                    keyboardClick(this);
                });
                keyboardRow1.appendChild(btn);
            } else {
                btn = document.createElement("button");
                btn.innerHTML = key[j];
                btn.name = key[j];
                btn.className = "keyboard-btn";
                btn.addEventListener("click", function () {
                    keyboardClick(this);
                });
                keyboardRow2.appendChild(btn);
            }
        }
    }

}

function insertLetter(key) {
    if (key === "Backspace" && nextLetter !== 0) {
        removeLetter();
    }

    if (key === "Enter") {
        doGuess();
    }

    if (key !== "Backspace" && key !== "Enter") {
        key = key.toLowerCase();
        let rowSelect = 6 - guessesRemaining;
        let row = document.querySelector(`.square-row-${rowSelect}`);
        let box = row.children[nextLetter];
        box.textContent = key;
        box.classList.add("filled-box");
        guessArr.push(key);
        nextLetter += 1;
    }
}

function removeLetter() {
    let rowSelect = 6 - guessesRemaining;
    let row = document.querySelector(`.square-row-${rowSelect}`);
    let box = row.children[nextLetter - 1];
    box.textContent = "";
    box.classList.remove("filled-box");
    guessArr.pop();
    nextLetter -= 1;
}

function doGuess() {
    // Base Case
    if (nextLetter < 5) {
        return;
    }

    let guess = guessArr.join("");
    let xhr = new XMLHttpRequest();
    let keyboardList = document.querySelectorAll(".keyboard-btn");

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            let obj = JSON.parse(xhr.responseText);
            let rowSelect = 6 - guessesRemaining;
            let row = document.querySelector(`.square-row-${rowSelect}`);
            let endgameMsg = document.querySelector(".endgame-msg > p");
            let arr = [];

            for (let key in obj) {
                arr.push(obj[key]);
            }


            for (let i = 0; i < guess.length; i++) {
                let box = row.children[i];
                box.classList.add("flip");
                box.style.animationDelay = `${i * 100}ms`;
                box.style.backgroundColor = arr[i];

                // add color to the keyboard
                for (let j = 0; j < keyboardList.length; j++) {
                    if (keyboardList[j].textContent.toString().toLowerCase() === box.textContent) {
                        keyboardList[j].classList.add("flip");
                        keyboardList[j].style.animationDelay = `${i * 100}ms`;
                        keyboardList[j].style.backgroundColor = box.style.backgroundColor;
                    }
                }
            }

            // EndGame
            if (guess === answer) {
                endgameMsg.textContent = "Você venceu! \uD83C\uDFC6";
                guessesRemaining = 0;
                gameEndend = true;
                return;
            }

            if (guessesRemaining <= 1) {
                endgameMsg.textContent = `Acabaram suas tentativas! A palavra
                                          certa era: ${answer}`;
                gameEndend = true;
                return;
            }

            nextLetter = 0;
            guessesRemaining -= 1;
            guessArr = [];
        }
    };
    // persists the answer
    window.sessionStorage.setItem("word", answer);
    
    xhr.open("post", "WordleServlet");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(`guess=${guess}&answer=${answer}`);
}

function keyboardClick(button) {
    insertLetter(button.textContent);
}

document.addEventListener("keyup", (e) => {
    if (e.key === "Backspace") {
        removeLetter();
    }

    if (e.key === "Enter") {
        doGuess();
    }

    let found = e.key.toString().match(/[a-z-ç]/gi);
    if (!found || e.key.toString().length > 1) {
        return;
    } else {
        insertLetter(e.key);
    }
});

initializeBoard();
initializeKeyboard();