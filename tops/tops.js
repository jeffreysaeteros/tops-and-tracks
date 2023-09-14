window.onload = () => {
  const anchors = document.querySelectorAll("a");
  const transition_el = document.querySelector(".transition");

  setTimeout(() => {
    transition_el.classList.remove("is-active");
  }, 500);

  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i];

    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      let target = e.target.href;

      console.log(transition_el);

      transition_el.classList.add("is-active");

      console.log(transition_el);

      setInterval(() => {
        window.location.href = target;
      }, 500);
    });
  }
};

let canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let particlesArray = [];
const numberOfParticles = 100;

const mouse = {
  x: null,
  y: null,
};

setInterval(() => {
  mouse.x = undefined;
  mouse.y = undefined;
}, 200);

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

class Particle {
  constructor(x, y, size, color, weight) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.weight = weight;
  }

  // for Third Design

  // draw() {
  //   context.beginPath();
  //   context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
  //   context.fillStyle = this.color;
  //   context.fill();
  // }

  // show(){

  // }

  update() {
    this.size -= 0.8;

    if (this.size < 0) {
      this.x = mouse.x + (Math.random() * 20 - 10);
      this.y = mouse.y + (Math.random() * 20 - 10);
      this.size = Math.random() * 15 + 30;
      this.weight = Math.random() * 2 - 0.5;
    }

    this.y += this.weight;
    this.weight += 0.02;

    if (this.y > canvas.height - this.size) {
      this.weight *= -1;
    }
  }
}

function init() {
  particlesArray = [];

  for (let i = 0; i < numberOfParticles; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 15 + 10;
    const color = "white";
    const weight = 2;
    particlesArray.push(new Particle(x, y, size, color, weight));
  }
}

// Pythagoras Theorem
// (x1 - x2)(x1 - x2) + (y1 - y2)(y1 - y2)

function connect() {
  let opacity = 1;

  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      const distance =
        (particlesArray[a].x - particlesArray[b].x) *
          (particlesArray[a].x - particlesArray[b].x) +
        (particlesArray[a].y - particlesArray[b].y) *
          (particlesArray[a].y - particlesArray[b].y);

      if (distance < 2800) {
        opacity = 1 - distance / 10000;
        context.strokeStyle = `rgba(255, 255, 255, ${opacity})`;

        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(particlesArray[a].x, particlesArray[a].y);
        context.lineTo(particlesArray[b].x, particlesArray[b].y);
        context.stroke();
      }
    }
  }
}

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  // context.fillStyle = "rgba(0, 0, 0, 0.3)";
  // context.fillRect(0, 0, canvas.height, canvas.width);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    // particlesArray[i].draw();
  }
  connect();

  requestAnimationFrame(animate);
}

init();
animate();
