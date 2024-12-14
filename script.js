const bulletActionHint = document.querySelector(".fixed-chamber-hint");
const chamber = document.querySelector(".chamber-container");
const userOnMobile = window.navigator.userAgentData.mobile;
const gameOverScreen = document.querySelector(".game-over-screen");
const scoreDisplay = document.querySelector("#score");
const highscoreDisplay = document.querySelector("#highscore");
const dryfireAudio = document.querySelector("#dryfire-audio");
const fireAudio = document.querySelector("#fire-audio");
const spinAudio = document.querySelector("#spin-audio");

spinAudio.playbackRate = 0.5;

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
    spinAudio.play();
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
        fire();
    } else {
        dryfire();
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

function fire() {
    fireAudio.play();
    checkForAchievements();
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
};

function dryfire() {
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

function checkForAchievements() {
    if (score === 0) {
        grantAchievement("unlucky bastard", "Your first spin and you directly died...you must be very unlucky, bro...");
    } else if (score === 5) {
        grantAchievement("unlucky lucky", "Your sixth spin and it perfectly stopped at the bullet...");
    } else if (score === 20) {
        grantAchievement("lucky gambler", "Okay, you survived 20 spins...it was time for you to die.");
    } else if (score >= 25) {
        grantAchievement("deal with the devil", "You are suspiciously lucky...I guess I have to ask the devil if you made a deal with him...")
    } else if (score > 30) {
        grantAchievement("did you manipulate the chamber?", "Okay, be honest...did you manipulate the chamber? Or how do you want to explain that you survived more than 30 spins???");
    } else if (score > 40) {
        grantAchievement("that's my revolver", "Okay, you brought your own revolver with you. Very funny, cheater 😑");
    };
};

function grantAchievement(title, description) {
    alert(`${title.toUpperCase()}\n\n${description}`);
};

if (!window.innerWidth >= 384) {
    alert("YOUR SCREEN IS TOO SMALL");
    window.close();
} else {
    start(); 
};
