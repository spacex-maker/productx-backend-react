import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const RippleCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const RippleEffect = () => {
  const canvasRef = useRef(null);
  const ripples = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let lastTime = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 1;
        this.maxRadius = 50;
        this.speed = 5;
        this.alpha = 1;
        this.lineWidth = 2;
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99, 102, 241, ${this.alpha})`;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        ctx.closePath();
      }

      update() {
        if (this.radius < this.maxRadius) {
          this.radius += this.speed;
          this.alpha = 1 - (this.radius / this.maxRadius);
          this.lineWidth = 2 * (1 - (this.radius / this.maxRadius));
          return true;
        }
        return false;
      }
    }

    const createRipple = (x, y) => {
      ripples.current.push(new Ripple(x, y));
    };

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (deltaTime < 160) { // 限制帧率
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 创建鼠标移动轨迹的涟漪
        const dx = mouse.current.x - lastMouse.current.x;
        const dy = mouse.current.y - lastMouse.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 20) { // 只在移动距离足够大时创建新的涟漪
          createRipple(mouse.current.x, mouse.current.y);
          lastMouse.current = { ...mouse.current };
        }

        // 更新和绘制所有涟漪
        ripples.current = ripples.current.filter(ripple => {
          ripple.draw(ctx);
          return ripple.update();
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    animate(0);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <RippleCanvas ref={canvasRef} />;
};

export default RippleEffect;
