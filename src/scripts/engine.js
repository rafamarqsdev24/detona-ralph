const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector(".menu-lives h2")
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lives: 3
    },
    actions:{
        timerId: setInterval(randomSquare, 1000),
        countDownTimerId: setInterval(countDown, 1000),
        isGameActive: true
    },
};

function playSound(audioName){
    let audio = new Audio(`./src/sounds/${audioName}.mp3`);
    audio.volume = 0.5;
    audio.play();
}

function randomSquare(){
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function checkGameOver(){
    if (state.values.currentTime <= 0 || state.values.lives <= 0){
        playSound("over");
        resetGame();
        updateLivesDisplay();
        clearInterval(state.actions.countDownTimerId);
        clearInterval(state.actions.timerId);
        clearInterval(state.actions.lives);
      
        setTimeout(() => {
            alert("Game Over! O seu resultado foi: " + state.values.result);
            state.view.score.textContent = state.values.result;
            state.view.timeLeft.textContent = state.values.currentTime;
            state.actions.isGameActive = true;
            resetGame();
            updateLivesDisplay();
        }, 100);
    }
}

function resetGame(){
    state.values.lives = 3;
    state.values.result = 0; 
    state.values.currentTime = 60;
    startTimers();
}

function startTimers() {
    state.actions.timerId = setInterval(randomSquare, 1000); 
    state.actions.countDownTimerId = setInterval(countDown, 60000); 
}

function updateLivesDisplay(){
    state.view.lives.textContent = `x${state.values.lives}`;
}

function countDown(){
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;
    checkGameOver();
}

function addListenerHitBox(){
    state.view.squares.forEach((square) => {
        if (!state.isGameActive) return;
        square.addEventListener("mousedown", () => {
            if(square.id === state.values.hitPosition){
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");
            } else{
                state.values.lives--;
                playSound("error");
                updateLivesDisplay();
                checkGameOver();
            }
        })
    });
}

function main(){
    state.isGameActive = true;
    addListenerHitBox();
    updateLivesDisplay();
    startTimers();
}

main();
