import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particlesArr;
    let animationFrameId = null;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    const makeParticles = () => {
      const count = window.innerWidth < 700 ? 22 : 45;
      particlesArr = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        speedY: Math.random() * 0.4 + 0.1,
        drift: Math.random() * 0.3 - 0.15,
        alpha: Math.random() * 0.5 + 0.15
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particlesArr.forEach(p => {
        p.y -= p.speedY;
        p.x += p.drift;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 199, 102, ${p.alpha})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      resize();
      makeParticles();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    resize();
    makeParticles();
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="particleCanvas" ref={canvasRef}></canvas>;
}
