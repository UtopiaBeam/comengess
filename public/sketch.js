
const birds = [];
const pipes = [];
const camSpeed = 6;
const img_birds = []
const WIDTH = 1200;
const HEIGHT = 800;
const NUM_SKINS = 7;
const IP = "https://us-central1-comengess.cloudfunctions.net/highscore";
const buttonStart = "x";
const button1 = "w";
const button2 = "o";

let disableKey = false;
let camX = 0;
let inGame = 0;
let tickCount = 0;
let countDownText = "" 
let hasSetup = false;
let highScore = 0;
let flag = 0;

let img_pipe, img_pipeRepeat, img_background, sound_die, sound_hit, sound_point, sound_swooshing, sound_wing;

function preload(){
    for (let i=0; i<NUM_SKINS; i++){
        img_birds.push( loadImage(`assets/bird${i}.png`));
    }
    img_pipe = loadImage("assets/pipe.png");
    img_pipeRepeat = loadImage("assets/pipe_repeat.png");
    img_background = loadImage("assets/bg.png");
    sound_die = loadSound("assets/sfx/die.wav");
    sound_hit = loadSound("assets/sfx/hit.wav");
    sound_point = loadSound("assets/sfx/point.wav");
    sound_swooshing = loadSound("assets/sfx/swooshing.wav");
    sound_wing = loadSound("assets/sfx/wing.wav");
    
    
    font = loadFont("assets/font.ttf");
}

function setup() {
    hasSetup = true;
    imageMode(CORNERS)
    createCanvas(WIDTH, HEIGHT*75/64);
    textFont(font);
    reset();
    birds.push(new Bird(0, 0), new Bird(1, 1));
}

function reset() {
    birds.forEach(b => b.reset())
    pipes.splice(0);
    inGame = 0;
    tickCount = 0;
    pipes.push();
    camX = 0;
}

function draw() {
    drawBg(camX);
    if (inGame == 1) {
        camX += camSpeed;
    } 
    for (var i = pipes.length - 1; i >= 0; i--) {
        pipes[i].show();
        if (inGame == 1) pipes[i].update();
        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
        }
    }
    pipes.forEach(pipe => {
        birds.forEach(bird => {
            if (pipe.hits(bird)) {
                bird.die();
            }
            pipe.pass(bird)
        })
    })

    textAlign(CENTER, CENTER);
    if (inGame == 0) {
        textSize(30);
        text("Press your button to change skin" ,WIDTH/2, HEIGHT/4);
        text("Hold both button to start game " ,WIDTH/2, 3*HEIGHT/4);
        textSize(40)
        text(countDownText ,WIDTH/2, 2*HEIGHT/4);
    }
    else if (inGame == 2){
        textSize(60);
        text("Press any key to reset" ,WIDTH/2, HEIGHT/2);
    }


    birds.forEach(b => {
        if (inGame == 1) b.update();
        b.show();
    })

    if (inGame == 1) {
        if (tickCount%100 == 0){
            pipes.push(new Pipe(tickCount / 100 + 1));
        }
        tickCount++;
    }
    highScore =  max(birds[0].score, max(birds[1].score, highScore));
    if (birds.every(b => b.dead)) {
        inGame = 2;
        disableKey = true;
        setTimeout(() => {disableKey = false;}, 1000);
    }
    birds.forEach((bird, idx) => {
        textSize(30);
        fill(255, 255, 0)
        stroke("red")
        strokeWeight(4);
        textAlign(CENTER, CENTER);
        text(`player ${idx+1}\n${bird.score}\n${bird.dead ? "DEAD" : ""}`, WIDTH/2-300+600*idx, 100)
    })
    textSize(50);
    text(`Highscore\n${highScore}`, WIDTH/2, 70)
    
}

function keyPressed() {
    handleKey(key);
}

function handleKey(key){
    if (disableKey) return ;
    if (flag < 3) {
        flag += 1;
        return;
    }
    if (!hasSetup) setup();
    key = key.toString();
    if (inGame == 0) {
        if (key == button1) {
            if (birds[0].ready == true){
                birds[0].cycle();
            }
            birds[0].ready = true;
        }
        if (key ==  button2) {
            if (birds[1].ready == true){
                birds[1].cycle();
            }
            birds[1].ready = true;
        }
        if (birds.every(b => b.ready) && key == buttonStart){
            countDownText = "3"
            disableKey = true;
            setTimeout(() => {countDownText = "2"}, 800)
            setTimeout(() => {countDownText = "1"}, 1600)
            setTimeout(() => {inGame = 1; countDownText = ""; sound_swooshing.play(); disableKey = false}, 2400)
            // inGame = 1;
        }
    }
    else if (inGame == 2){
         
            fetch("https://us-central1-comengess.cloudfunctions.net/highscore?score=" + max(birds[0].score, max(birds[1].score, highScore)),
            {
                mode: "no-cors",
            })
        .catch(err => console.error(err));
        reset();
    }
    else if (inGame == 1){
        if (key ==  button1) {
            birds[0].up();
        }
        if (key == button2) {
            birds[1].up();
        }
    }
}


let BG_WIDTH = 621;
function drawBg(pos){
    imageMode(CORNERS);
    for (let i=((-pos)%BG_WIDTH)-BG_WIDTH; i<=WIDTH; i+=BG_WIDTH){
        image(img_background, i, 0, i+BG_WIDTH, HEIGHT*75/64);
    }
}