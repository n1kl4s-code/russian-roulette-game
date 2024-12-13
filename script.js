const bulletActionHint = document.querySelector(".fixed-chamber-hint");
const chamber = document.querySelector(".chamber-container");
const userOnMobile = window.navigator.userAgentData.mobile;
const gameOverScreen = document.querySelector(".game-over-screen");
const scoreDisplay = document.querySelector("#score");
const highscoreDisplay = document.querySelector("#highscore");
const dryfireAudio = document.querySelector("#dryfire-audio");
const fireAudio = document.querySelector("#fire-audio");

fireAudio.volume = 0.5;

let score, highscore;

let timeBeforeReload = 5;
const timeElement = document.querySelector("#time-until-restart");
timeElement.textContent = timeBeforeReload;

let chamberArray = ["empty", "empty", "empty", "empty", "empty", "empty"];

function start() {
    score = 0;
    if (localStorage.getItem("highscore")) {
        highscore = localStorage.getItem("highscore");
    } else {
        highscore = 0;
    };

    scoreDisplay.textContent = score;
    highscoreDisplay.textContent = highscore;

    bulletActionHint.textContent = "LOAD CHAMBER";
    if (!userOnMobile) {
        bulletActionHint.addEventListener("click", load_chamber);
    } else {
        bulletActionHint.addEventListener("touchstart", load_chamber);
    };
};

function load_chamber() {
    let randomNumber = Math.floor(Math.random() * (chamberArray.length - 1));
    chamberArray[randomNumber] = "loaded";
    spin_the_chamber();
};

function spin_the_chamber() {
    bulletActionHint.textContent = "SPIN CHAMBER";
    if (!userOnMobile) {
        bulletActionHint.removeEventListener("click", load_chamber);
        bulletActionHint.addEventListener("click", spin_chamber);
    } else {
        bulletActionHint.removeEventListener("touchstart", load_chamber);
        bulletActionHint.addEventListener("touchstart", spin_chamber);
    };
};

function spin_chamber() {
    chamber.style.animation = "spin-chamber 0.75s ease-out forwards";
    setTimeout(able_to_shoot, 750);
};

function able_to_shoot() {
    bulletActionHint.textContent = "PULL TRIGGER";
    if (!userOnMobile) {
        bulletActionHint.removeEventListener("click", spin_chamber);
        bulletActionHint.addEventListener("click", pull_trigger);
    } else {
        bulletActionHint.removeEventListener("touchstart", spin_chamber);
        bulletActionHint.addEventListener("touchstart", pull_trigger);
    };
};

function pull_trigger() {
    let currentChamber = Math.floor(Math.random() * (chamberArray.length - 1));
    if (currentChamber === chamberArray.indexOf("loaded")) {
        fireAudio.play();
        if (!userOnMobile) {
            bulletActionHint.removeEventListener("click", pull_trigger);
        } else {
            bulletActionHint.removeEventListener("touchstart", pull_trigger);
        };
        if (highscore === 0 || score > highscore) {
            localStorage.setItem("highscore", score)
        };
        bulletActionHint.textContent = "YOU DIED!";
        gameOverScreen.style.transform = "translateY(0%)";
        setInterval(countdown_restart, 1000);
    } else {
        dryfireAudio.play();
        score++;
        if (highscore === 0 || score > highscore) {
            highscoreDisplay.textContent = score;
        };
        scoreDisplay.textContent = score;
        if (!userOnMobile) {
            bulletActionHint.removeEventListener("click", pull_trigger);
        } else {
            bulletActionHint.removeEventListener("touchstart", pull_trigger);
        };
        chamber.style.animation = "";
        spin_the_chamber();
    };
};

function countdown_restart() {
    if (timeBeforeReload > 0) {
        timeBeforeReload--;
        timeElement.style.animation = "restart 1s linear infinite forwards";
        timeElement.textContent = timeBeforeReload;
    } else {
        timeElement.style.animation = "";
        gameOverScreen.style.transform = "translateY(-100%)";
        window.location.reload();
    };
};

if (!window.innerWidth >= 320) {
    alert("YOUR SCREEN IS TOO SMALL:");
    window.close();
} else {
    start(); 
};