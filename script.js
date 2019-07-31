var w = innerWidth, h = innerHeight;
var cvs, ctx;

onload = function() {
  cvs = document.querySelector("canvas");
  cvs.width = w; cvs.height = h;
  ctx = cvs.getContext("2d");
  
  init();
  mainloop();
}

var atoms, atoms_row = 12;
var atoms_amount = atoms_row * atoms_row;
var k = 2000, p = 1, r = 1;

var i, j, x, y, a, b, dx, dy, d, fx, fy, f;

function init() {
  atoms = [];
  
  for(i = 0; i < atoms_row; i++)
  for(j = 0; j < atoms_row; j++) {
    x = (0.2 + 0.6 * i / (atoms_row - 1)) * w;
    y = (0.2 + 0.6 * j / (atoms_row - 1)) * h;
    
    atoms.push(new Atom(x, y));
  }
}

function mainloop() {
  ctx.fillStyle = "rgba(0,0,0,0.02)";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "white";
  
  for(i = 0; i < atoms_amount; i++) {
    a = atoms[i];
    
    // add boundary forces
    fx = 2*k * (Math.pow(a.x/p, -2)
              - Math.pow((w-a.x)/p, -2));
    fy = 2*k * (Math.pow(a.y/p, -2)
              - Math.pow((h-a.y)/p, -2));
    
    // add electric forces
    for(j = 0; j < atoms_amount; j++)
    if(i != j) {
      b = atoms[j];
      
      dx = (a.x - b.x)/p;
      dy = (a.y - b.y)/p;
      d = Math.sqrt(dx*dx + dy*dy);
      
      f = k / d / d;
      fx += f * dx / d;
      fy += f * dy / d;
    }
    
    a.update(fx, fy, 1/60);
    a.render();
  }
  
  requestAnimationFrame(mainloop);
}

function Atom(x, y) {
  this.x = x; this.y = y;
  this.vx = 0; this.vy = 0;
  
  this.render = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, 2*Math.PI);
    ctx.fill();
  }
  this.update = function(fx, fy, dt) {
    this.x += (this.vx += fx * dt) * dt;
    this.y += (this.vy += fy * dt) * dt;
  }
}