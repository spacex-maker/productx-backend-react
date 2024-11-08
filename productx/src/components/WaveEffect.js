import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const WaveCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: all;
  z-index: 0;
`;

const WaveEffect = ({ onDoubleClick }) => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // 波浪点数组
    const points = [];
    const waves = [];
    const spacing = 6; // 点之间的间距
    let tick = 0;

    class Wave {
      constructor(mouseX, mouseY) {
        this.x = mouseX;
        this.y = mouseY;
        this.radius = 0;
        this.intensity = 2500; // 波浪强度
        this.phase = 0;
        this.maxRadius = 250; // 最大影响半径
      }

      update() {
        this.radius += 4;
        this.intensity *= 0.985; // 波浪逐渐减弱
        return this.radius < this.maxRadius;
      }
    }

    class Point {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseY = y;
        this.speed = 0.08;
        this.offset = Math.random() * Math.PI * 2;
        this.dy = 0;
        this.force = 0;
      }

      update(waves) {
        this.dy = 0;

        // 计算所有波浪的影响
        waves.forEach(wave => {
          const dx = this.x - wave.x;
          const dy = this.baseY - wave.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < wave.radius) {
            const amplitude = (1 - distance / wave.radius) * wave.intensity;
            const phase = distance * 0.03;
            this.dy += Math.sin(wave.phase + phase) * amplitude * 0.0015;
          }
        });

        // 添加基础波动
        this.dy += Math.sin(tick * this.speed + this.offset) * 0.4;

        this.y = this.baseY + this.dy;
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // 创建点阵
      points.length = 0;
      for (let x = 0; x < canvas.width; x += spacing) {
        points.push(new Point(x, canvas.height * 0.5));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;

      // 更新波浪
      for (let i = waves.length - 1; i >= 0; i--) {
        if (!waves[i].update()) {
          waves.splice(i, 1);
        }
      }

      // 更新并绘制点
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(points[0].x, points[0].y);

      points.forEach((point, index) => {
        point.update(waves);

        if (index > 0) {
          const xc = (points[index].x + points[index - 1].x) / 2;
          const yc = (points[index].y + points[index - 1].y) / 2;
          ctx.quadraticCurveTo(points[index - 1].x, points[index - 1].y, xc, yc);
        }
      });

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);

      // 创建渐变
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0.05)');

      ctx.fillStyle = gradient;
      ctx.fill();

      // 添加描边
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // 只在鼠标移动足够距离时创建新波浪
      const dx = x - mouse.current.x;
      const dy = y - mouse.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 25) {
        waves.push(new Wave(x, y));
        mouse.current = { x, y };
      }
    };

    const handleResize = () => {
      init();
    };

    const handleDoubleClick = (e) => {
      onDoubleClick && onDoubleClick(e);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('dblclick', handleDoubleClick);
    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [onDoubleClick]);

  return <WaveCanvas ref={canvasRef} />;
};

export default WaveEffect;
