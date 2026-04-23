const canvas = document.getElementById("sakura-canvas");

if (canvas) {
  const ctx = canvas.getContext("2d");
  let sakuras = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Sakura {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 10 + 8;
      this.speedX = (Math.random() - 0.5) * 4;
      this.speedY = Math.random() * 2 + 1.5;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.08;
      this.alpha = 1;
      this.fade = Math.random() * 0.015 + 0.008;
      this.swing = Math.random() * 0.6 + 0.3;
      this.offset = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.speedX + Math.sin(Date.now() * 0.005 + this.offset) * this.swing;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.alpha -= this.fade;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.alpha;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -this.size / 2,
        -this.size / 2,
        -this.size,
        this.size / 3,
        0,
        this.size
      );
      ctx.bezierCurveTo(
        this.size,
        this.size / 3,
        this.size / 2,
        -this.size / 2,
        0,
        0
      );
      ctx.fillStyle = "#ffc0cb";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, this.size * 0.35, this.size * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = "#ffd700";
      ctx.fill();

      ctx.restore();
    }
  }

  document.addEventListener("click", function (e) {
    for (let i = 0; i < 12; i++) {
      sakuras.push(new Sakura(e.clientX, e.clientY));
    }
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = sakuras.length - 1; i >= 0; i--) {
      sakuras[i].update();
      sakuras[i].draw();

      if (sakuras[i].alpha <= 0 || sakuras[i].y > canvas.height + 40) {
        sakuras.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}