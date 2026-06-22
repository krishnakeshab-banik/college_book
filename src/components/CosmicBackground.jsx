import React, { useEffect, useRef } from 'react';

export default function CosmicBackground() {
  const canvasRef = useRef(null);

  // Parallax tracking
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse position
    const handleMouseMove = (e) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) - 0.5;
      targetMouse.current.y = (e.clientY / window.innerHeight) - 0.5;
    };

    // Track scroll position
    const handleScroll = () => {
      targetScroll.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    const mainContentEl = document.querySelector('.main-content-wrapper');
    const handleMainContentScroll = (e) => {
      targetScroll.current = e.target.scrollTop;
    };
    if (mainContentEl) {
      mainContentEl.addEventListener('scroll', handleMainContentScroll);
    }

    // Initialize subtle floating dust particles
    const particleCount = 50;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (window.innerWidth + 400) - 200,
        y: Math.random() * (window.innerHeight + 400) - 200,
        size: Math.random() * 1.3 + 0.2, // Tiny stardust
        speedX: (Math.random() - 0.5) * 0.16, // Accelerated drift
        speedY: (Math.random() - 0.5) * 0.16,
        opacity: Math.random() * 0.45 + 0.1,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.015 + 0.004,
        depth: Math.random() * 1.0 + 0.2
      });
    }

    // Soft out-of-focus bokeh bubbles (heavily blurred depth particles)
    const bokehCount = 8;
    const bokehs = [];
    for (let i = 0; i < bokehCount; i++) {
      bokehs.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 50 + 20,
        opacity: Math.random() * 0.015 + 0.003, // Extremely transparent
        speedX: (Math.random() - 0.5) * 0.06,
        speedY: (Math.random() - 0.5) * 0.06,
        depth: Math.random() * 0.3 + 0.1
      });
    }

    // Animation Loop
    const draw = () => {
      time += 0.006;
      
      // Clear canvas (transparency allows index.css cosmic_bg.png to show through)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth interpolation for parallax
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.035;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.035;
      currentScroll.current += (targetScroll.current - currentScroll.current) * 0.05;

      const parallaxX = currentMouse.current.x * 40;
      const parallaxY = currentMouse.current.y * 40;
      const scrollOffset = currentScroll.current * 0.12;

      // 1. Draw out-of-focus background bokeh circles (subtle violet/pink glow)
      bokehs.forEach(b => {
        b.x += b.speedX;
        b.y += b.speedY;

        // Wrap boundaries
        if (b.x < -100) b.x = canvas.width + 100;
        if (b.x > canvas.width + 100) b.x = -100;
        if (b.y < -100) b.y = canvas.height + 100;
        if (b.y > canvas.height + 100) b.y = -100;

        const bX = b.x + parallaxX * b.depth;
        const bY = (b.y + parallaxY * b.depth - scrollOffset * b.depth * 0.5) % (canvas.height + 200);
        const finalBY = bY < -100 ? canvas.height + bY + 100 : bY;

        const bGrad = ctx.createRadialGradient(bX, finalBY, 0, bX, finalBY, b.size);
        bGrad.addColorStop(0, `rgba(139, 92, 246, ${b.opacity * (1.0 + Math.sin(time + b.x) * 0.4)})`);
        bGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(bX, finalBY, b.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw tiny floating stardust particles
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        const pad = 100;
        if (p.x < -pad) p.x = canvas.width + pad;
        if (p.x > canvas.width + pad) p.x = -pad;
        if (p.y < -pad) p.y = canvas.height + pad;
        if (p.y > canvas.height + pad) p.y = -pad;

        const finalX = p.x + parallaxX * p.depth;
        const finalY = (p.y + parallaxY * p.depth - scrollOffset * p.depth * 0.6) % (canvas.height + pad * 2);
        const wrapY = finalY < -pad ? canvas.height + finalY + pad : finalY;

        p.twinklePhase += p.twinkleSpeed;
        const starOpacity = p.opacity * (0.35 + Math.sin(p.twinklePhase) * 0.65);

        ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity})`;
        ctx.beginPath();
        ctx.arc(finalX, wrapY, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (mainContentEl) {
        mainContentEl.removeEventListener('scroll', handleMainContentScroll);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        background: 'transparent'
      }}
    />
  );
}
