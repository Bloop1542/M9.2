// set up canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
const ballCountPara = document.querySelector("p");

// random number generator
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// random RGB color
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Shape class
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// Ball class
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= width) this.velX = -Math.abs(this.velX);
    if (this.x - this.size <= 0) this.velX = Math.abs(this.velX);
    if (this.y + this.size >= height) this.velY = -Math.abs(this.velY);
    if (this.y - this.size <= 0) this.velY = Math.abs(this.velY);

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

// EvilCircle class 
class EvilCircle extends Shape {
  constructor() {
    super(width/2, height/2, 0, 0); 
    this.color = "white";
    this.size = 20; 
    
    // Mouse move handler
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      this.x = e.clientX - rect.left;
      this.y = e.clientY - rect.top;
      this.checkBounds(); // Ensure stays within canvas
    });
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if (this.x + this.size >= width) this.x = width - this.size;
    if (this.x - this.size <= 0) this.x = this.size;
    if (this.y + this.size >= height) this.y = height - this.size;
    if (this.y - this.size <= 0) this.y = this.size;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + ball.size) {
          ball.exists = false;
        }
      }
    }
  }
}

// Initialize balls 
const balls = [];
while (balls.length < 25) {
  const size = random(10, 20);
  balls.push(
    new Ball(
      random(size, width - size),
      random(size, height - size),
      random(-7, 7),
      random(-7, 7),
      randomRGB(),
      size
    )
  );
}

// Initialize evil circle 
const evilCircle = new EvilCircle();

// Animation loop 
function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  balls.forEach(ball => {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  });

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  // Update ball count
  ballCountPara.textContent = `Ball count: ${
    balls.filter(ball => ball.exists).length
  }`;

  requestAnimationFrame(loop);
}

loop();