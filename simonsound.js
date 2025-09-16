let gameseq = [];
let userseq = [];

let btns = ["yellow", "red", "purple", "green"];

let started = false;
let level = 0;

let h2 = document.querySelector("h2");

document.addEventListener("keypress", function () {
    if (!started) {
        started = true;
        levelup();
    }
});

function playSound(color) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Different frequencies for each button
    let freqs = {
        yellow: 440,  // A4
        red: 550,
        purple: 660,
        green: 770,
        wrong: 150    // low buzz for wrong
    };

    oscillator.frequency.value = freqs[color] || 400;
    oscillator.type = "sine"; // can be "sine", "square", "triangle", "sawtooth"

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime); // volume
    oscillator.stop(ctx.currentTime + 0.4); // play for 0.4 sec
}


function gameflash(btn) {
    btn.classList.add("flash");
    playSound(btn.id);  // 🔊 play sound for this button
    setTimeout(() => btn.classList.remove("flash"), 400);
}

function userflash(btn) {
    btn.classList.add("userflash");
    playSound(btn.id);  // 🔊 play sound for this button
    setTimeout(() => btn.classList.remove("userflash"), 400);
}

// function levelup() {
//     userseq = [];
//     level++;
//     h2.innerText = `Level ${level}`;

//     let randomindex = Math.floor(Math.random() * btns.length);
//     let randomcolor = btns[randomindex];
//     let randombtn = document.querySelector(`.${randomcolor}`);
//     gameseq.push(randomcolor);
//     gameflash(randombtn);
// }

function levelup() {
    userseq = [];
    level++;
    h2.innerText = `Level ${level}`;

    let randomindex = Math.floor(Math.random() * btns.length);
    let randomcolor = btns[randomindex];
    gameseq.push(randomcolor);

    // 🔥 Instead of flashing just the new button, replay the full sequence
    playSequence();
}

function playSequence() {
    let i = 0;

    let interval = setInterval(() => {
        let color = gameseq[i];
        let btn = document.querySelector(`.${color}`);
        gameflash(btn);
        i++;

        if (i >= gameseq.length) {
            clearInterval(interval); // stop after full sequence
        }
    }, 600); // gap between flashes
}


function checkans(idx) {
    if (userseq[idx] === gameseq[idx]) {
        if (userseq.length === gameseq.length) {
            setTimeout(levelup, 1000);
        }
    } 
    else {
    playSound("wrong");  

    h2.innerHTML = `Game over! Your score was <b>${level}</b> <br>Press any key to continue`;

    document.body.classList.add("game-over");

    setTimeout(() => {
        document.body.classList.remove("game-over");
    }, 1500);

    reset();
}

}

let allbtns = document.querySelectorAll(".btn");
for (let btn of allbtns) {
    btn.addEventListener("click", btnpress);
}

function btnpress() {
    let btn = this;
    userflash(btn);

    let usercolor = btn.getAttribute("id");
    userseq.push(usercolor);

    checkans(userseq.length - 1);
}

function reset() {
    started = false;
    gameseq = [];
    userseq = [];
    level = 0;
}
