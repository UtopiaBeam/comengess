const V_MIN = -10;
const V_MAX = 10;
function Bird(skinId, id){
    this.id = id;
    this.x = WIDTH*(0.35)
    this.y = HEIGHT*(0.5+0.05*this.id);
    this.vx = camSpeed;
    this.vy = 0;
    this.dead = false;
    this.skinId = skinId;
    this.grav = 0.6; // down
    this.acc = -12; // up
    this.ready = false;
    this.score = 0;
    this.lastPressedTick = 0;

    this.reset = function(){
        this.x = WIDTH*(0.35);
        this.y = HEIGHT*(0.5+0.05*this.id);
        this.vx = camSpeed;
        this.vy = 0;
        this.dead = false;
        this.ready = false;
        this.score = 0;
        this.lastPressedTick = 0;
    }

    this.cycle = function(){
        this.skinId += 1;
        this.skinId %= NUM_SKINS;
        if (birds.filter(b => b.id != this.id && b.skinId == this.skinId).length > 0){
            this.skinId += 1;
            this.skinId %= NUM_SKINS;    
        }
    }

    this.show = function(){;
        imageMode(CENTER)
        let rot = tickCount - this.lastPressedTick;
        image(img_birds[this.skinId], this.x-camX, this.y);
        if (!inGame) {
            text(`${this.ready ? "Ready":""}`, this.x-camX - 120, this.y);
        }
    }
    this.die = function(){
        if (this.dead) return;
        sound_hit.play();
        setTimeout(() => {sound_die.play()}, 200);
        this.dead = true;
        this.vx = 0;
    }

    this.up = function (){
        if (this.dead) return;
        sound_wing.play();
        this.vy += this.acc;
    }

    this.update = function (){
        this.vy += this.grav;
        this.vy = min(max(this.vy, V_MIN), V_MAX);
        this.y += this.vy;   
        this.x += this.vx;

        // clamp
        if (this.y < 0){
            this.y = 0;
            this.vy = 0;
        }
        if (this.y > HEIGHT){
            this.die();
            this.y = HEIGHT
            this.vy = 0;
        }

    }

}