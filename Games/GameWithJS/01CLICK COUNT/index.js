var player = prompt("enter your name player");
console.log(player);
localStorage.setItem("playerName", player);
const namePlayer = localStorage.getItem("playerName");
alert("Welcome back, " + namePlayer);



var currentScore = document.querySelector('#currentScore');
var highScore = document.querySelector('#highScore');
var timer = document.querySelector('#timer');
var clickButton = document.querySelector('#clickButton');
var startButton = document.querySelector('#startButton');
var statusMessage = document.querySelector('#statusMessage');
var resetButton = document.querySelector('#resetButton');
var pauseButton = document.querySelector('#pauseButton');
var resumeButton = document.querySelector('#resumeButton');
var winVideo = document.querySelector('#winVideo');

var current = 0;
var high = 0;
var timeLeft = 10; 
var track = false;
var idTrack = null;
var pause = false;

function loadContent() {
    dataLoad();
    displayMessage();
}

function dataLoad() {
    var temp = localStorage.getItem('highScore');
    if (temp != null) {
        high = parseInt(temp);
    } else {
        high = 0;
    }
}

function displayMessage() {
    currentScore.textContent = current;
    highScore.textContent = high;
    timer.textContent = timeLeft; 
}

function statusMsg(msg) {
    statusMessage.textContent = msg;
}

function endGame() {
    clearInterval(idTrack);
    track = false;
    clickButton.disabled = true;
    startButton.disabled = false;
    pauseButton.disabled = true;

    let cps = (current / 10).toFixed(); 
    alert(`You clicked ${cps} times per second!`);

    startButton.innerText = "Play Again";

    clickButton.style.transform = 'scale(1.0)'

    if (current > high) {
        localStorage.setItem('highScore', current);
        high = current;
        displayMessage();
        statusMsg("You're current score is higher than previous one.");
        alert(player + ", congratulation you break your old high score 🎉🎉 and set new. ")
        
        winVideo.style.display = "block";
        setTimeout(() => winVideo.style.opacity = "1", 50);
        winVideo.play();

        setTimeout(() => {
          winVideo.style.opacity = "0";
          setTimeout(() => {
            winVideo.pause();
            winVideo.style.display = "none";
          }, 1000);
        }, 6000);
    } 
    else if(current < high){
        statusMsg("You're current score is less compared to previous one.")
    }
    else {
        statusMsg("you're current score is equal to you're high score.");
    }

    document.body.style.background = 'gold';
    setTimeout(() => {
        document.body.style.background = '';
    },1000);
}

function startGame() {
    track = true;
    current = 0;
    timeLeft = 10; 
    clickButton.disabled = false;
    startButton.disabled = true;
    pauseButton.disabled = false;
    statusMsg("Game has started!");
    displayMessage();

    statusMsg("Click Me!");
    setTimeout(() => {
        statusMsg();
    },1000);

    idTrack = setInterval(function() {
        timeLeft--;
        if (timeLeft <= 0) {
            endGame();
        }
        displayMessage();
    }, 1000);
}

function clickMe() {
    if (track) {
        current++;

        if(current > 20){
            currentScore.style.color = 'red';
        }

        clickButton.style.transform = 'scale(1.1)'
        // if(current > high){
        //     high++;
        // }
        displayMessage();
    }
}

function pauseGame(){
    if(!pause){
    clearInterval(idTrack);
    clickButton.disabled = true;
    resetButton.disabled = true;
    track=true;
    pause = true;
    displayMessage();
    statusMsg("game paused");
    pauseButton.textContent="Resume Game"
    }
    else{
    clickButton.disabled = false;
    resetButton.disabled = false;
    pause = false;
    displayMessage();
    statusMsg("game started");
    idTrack = setInterval(function() {
        timeLeft--;
        if (timeLeft <= 0) {
            endGame();
        }
        displayMessage();
    }, 1000);
    pauseButton.textContent = "Pause Game"
    }
}

function resetHighScore() {
    localStorage.removeItem('highScore');
    high = 0;
    current = 0;
    displayMessage();
    statusMsg("entrire game is reset so you good to go to new");
}

loadContent();

startButton.addEventListener('click', startGame);
clickButton.addEventListener('click', clickMe);
resetButton.addEventListener('click', resetHighScore);
pauseButton.addEventListener('click',pauseGame);
// resumeButton.addEventListener('click',resumeGame);