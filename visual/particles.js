export class ParticleField {
  constructor() {
    this.items = [];
  }

  burst(x, y, count = 24, hue = 180) {
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 1.4 + Math.random() * 2.8;
      this.items.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: 2 + Math.random() * 5,
        hue: hue + Math.random() * 40
      });
    }
  }

  update() {
    this.items = this.items
      .map((particle) => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.015,
        life: particle.life - 0.018
      }))
      .filter((particle) => particle.life > 0);
  }

  draw(ctx) {
    for (const particle of this.items) {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${particle.hue}, 100%, 72%, ${particle.life})`;
      ctx.fill();
    }
  }
}

