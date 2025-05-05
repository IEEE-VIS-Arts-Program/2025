let canvasDiv = document.getElementById('canvasContainer');
let slimCanvas = false;
let cW, cH;
let gs = 80;
let cols, rows;
let gridArr = [];
let tileArr = [];
let rotArr = [0, 0.5, 1, 1.5];
let rotStateArr = [0, 1, 2, 3];
//let tileA, tileB, tileAA, tileBB, tileAB, tileAAB;
let t = 600;

function preload() {
  
  tileArr = [
    loadImage("assets/tile1-a-a.png"),
    loadImage("assets/tile1-a.png"),
    loadImage("assets/tile1-aa-b.png"),
    loadImage("assets/tile1-aa.png"),
    loadImage("assets/tile1-aaaa.png"),
    loadImage("assets/tile1-aab.png"),
    loadImage("assets/tile1-ab.png"),
    loadImage("assets/tile1-aba.png"),
    loadImage("assets/tile1-b.png"),
    loadImage("assets/tile1-ba.png"),
    loadImage("assets/tile1-bb.png")
  ];
}

function setup() {
  setupCanvas();
}

function setupCanvas() {
  cW = canvasDiv.offsetWidth;
  cH = canvasDiv.offsetHeight;
  let sketchCanvas = createCanvas(cW, cH);

  sketchCanvas.parent("canvasContainer");
  sketchCanvas.id('myCanvas');

  if(canvasDiv.classList.contains("slim")) {
    slimCanvas = true;
  }

  cols = ceil(width/gs);
  rows = floor(height/gs);

  gridArr = [];

  for(let i=0; i<rows; i++) {
    if(!slimCanvas && i == rows-1) {
      let r = randomInt(2, cols-2);
      gridArr.push(new GridBox(r*gs, i*gs, i, r));
    }else {
      for(let k=0; k<cols; k++) {
        gridArr.push(new GridBox(k*gs, i*gs, i, k));
      }
    }
  }
}

function draw() {
  background("#EAECF5");
  
  for(let i=0; i<gridArr.length; i++) {
    gridArr[i].render();
  }

}

class GridBox {
  constructor(_x, _y, _r, _c) {
    this.x = _x;
    this.y = _y;
    this.cx = this.x + gs/2;
    this.cy = this.y + gs/2;
    //this.rotState = random(rotStateArr);
    //this.r = rotArr[this.rotState];
    this.rs = random(rotArr);
    this.r = PI * this.rs;
    this.tor = this.r;
    this.active = false;
    this.tile = random(tileArr);
    this.row = _r;
    this.col = _c;
    this.wait = this.row*20 + this.col*2;
    this.c = t;
  }
  
  update() {
    
    let xd = mouseX - this.cx;
    let yd = mouseY - this.cy;
    let d = abs(sqrt(xd*xd + yd*yd));
    
    if(d < gs*1.5) {
      if(!this.active) {
        this.rs = getNewRot(this.rs);
        this.tor = PI*this.rs;
        this.active = true;
      }
    }else {
      if(this.active) {
        this.active = false;
      }
    }
    
    if(this.wait > 0) this.wait--;
    
    if(this.wait <= 0) {
      this.c--;
      if(this.c <= 0) {
        this.rs = getNewRot(this.rs);
        this.tor = PI*this.rs;
        this.c = t;
      } 
    }
    
    this.r += (this.tor-this.r)/40;
  }
  
  render() {
    this.update();
    
    push()
    translate(this.cx, this.cy);
    rotate(this.r);
    //rotate(PI*this.tilerot);
    //stroke(255);
    //noFill();
    //rect(-gs/2, -gs/2, gs, gs);
    image(this.tile, -gs/2, -gs/2, gs, gs);
    
    pop();
  }
  
}

function getNewRot(_cr) {
  let nr = _cr;
  while(nr === _cr) {
    nr = random(rotArr);
  }
  //print(_cr + "/" + nr);
  return nr;
}


function keyTyped() {
  if (key === 's') {
    //saveCanvas('visap-loops.png');
  }
  
  // uncomment to prevent any default behavior
  return false;
}

function randomInt(min, max) {
  if(min == max) {
    return max;
  }else{
    return Math.floor(random(max - min + 1)) + min;
  }
}

function windowResized() {
  let vW = window.innerHeight;
  let vH = window.innerWidth;

  if (vW !== cW && vH !== cH) {
    setupCanvas();
  }
}
