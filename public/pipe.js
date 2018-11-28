PIPE_WIDTH = 110;
SPACING = 350;
PIPE_M_H = 43;
PIPE_R_H = 32;
function Pipe(score) {
    this.top = random(HEIGHT / 6, 2 / 4 * HEIGHT);
    this.bottom = this.top + SPACING;
    this.x = camX + WIDTH;
    this.w = PIPE_WIDTH;
    this.speed = 0;
    this.score = score;

    this.highlight = false;

    this.hits = function (bird) {
        // if (bird.y > this.bottom) {
            if (bird.y < this.top || bird.y > this.bottom) {
            if (bird.x > this.x && bird.x < this.x + this.w) {
                return true;
            }
        }
        return false;
    }

    this.pass = function (bird) {
        if (this.hits(bird)) return;
        if (bird.x > this.x && bird.x < this.x + this.w) {
            if (this.score != bird.score){
                sound_point.play();
            }
            bird.score = this.score;
        }
    }

    this.show = function () {
        if (this.offscreen()) return;
        imageMode(CORNERS)
        for (let i = this.top - PIPE_M_H - PIPE_R_H; i >= -PIPE_R_H; i -= PIPE_R_H) {
            image(img_pipeRepeat, this.x - camX, i, this.x - camX + PIPE_WIDTH, i + PIPE_R_H);
        }
        image(img_pipe, this.x - camX, this.top-PIPE_M_H, this.x - camX+PIPE_WIDTH, this.top);


        for (let i = this.bottom + PIPE_M_H; i <= HEIGHT; i += PIPE_R_H) {
            image(img_pipeRepeat, this.x - camX, min(i, HEIGHT-PIPE_R_H), this.x - camX + PIPE_WIDTH, min(i + PIPE_R_H, HEIGHT));
        }
        image(img_pipe, this.x - camX, this.bottom, this.x - camX + PIPE_WIDTH, this.bottom+PIPE_M_H);
    }

    this.update = function () {
        this.x -= this.speed;
    }

    this.offscreen = function () {
        if (this.x-this.camX < -this.w+10) {
            return true;
        } else {
            return false;
        }
    }


}