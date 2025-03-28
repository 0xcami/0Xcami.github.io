function toggleMenu() {
  document.querySelector('.mobile-menu').classList.toggle('show');
  document.querySelector('.overlay').classList.toggle('show');
}

const canvas = document.getElementById("bg-art");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let particles = [];
const maxParticles = 100;
for (let i = 0; i < maxParticles; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speedX: (Math.random() - 0.5) * 2,
    speedY: (Math.random() - 0.5) * 2,
    bit: Math.round(Math.random()),
    color: `hsl(${Math.random() * 360}, 100%, 75%)`
  });
}

function updateParticles() {
  particles.forEach(p => {
    p.x += Math.round(p.speedX);
    p.y += Math.round(p.speedY);
    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
    if (Math.random() < 0.05) p.bit = 1 - p.bit;
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.font = '16px PT Mono';
    ctx.fillText(p.bit, p.x, p.y);
  });
}

function animate() {
  updateParticles();
  drawParticles();
  setTimeout(() => requestAnimationFrame(animate), 1000 / 12);
}
animate();
