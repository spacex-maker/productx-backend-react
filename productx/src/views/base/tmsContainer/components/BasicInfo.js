import React, { useEffect, useRef, useState } from 'react';
import { Card, Descriptions, Row, Col, Button, Space } from 'antd';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useTranslation } from 'react-i18next';
import { CompressOutlined, ExpandOutlined } from '@ant-design/icons';

const BasicInfo = ({ container }) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const frameIdRef = useRef(null);
  const [showInternal, setShowInternal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 清理函数
  const cleanup = () => {
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    }
    if (controlsRef.current) {
      controlsRef.current.dispose();
      controlsRef.current = null;
    }
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current.forceContextLoss();
      if (rendererRef.current.domElement && rendererRef.current.domElement.parentNode) {
        rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current = null;
    }
    if (sceneRef.current) {
      disposeScene(sceneRef.current);
      sceneRef.current = null;
    }
  };

  const disposeScene = (scene) => {
    scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => {
            if (material.map) material.map.dispose();
            material.dispose();
          });
        } else {
          if (object.material.map) object.material.map.dispose();
          object.material.dispose();
        }
      }
      if (object.dispose) {
        object.dispose();
      }
    });
  };

  // 创建详细的集装箱模型
  const createContainerModel = (scene) => {
    // 清除现有的模型
    scene.children = scene.children.filter(child => 
      child instanceof THREE.AmbientLight || 
      child instanceof THREE.DirectionalLight ||
      child instanceof THREE.GridHelper ||
      child instanceof THREE.AxesHelper
    );

    // 创建 PROTX 文字纹理
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 2048;
    canvas.height = 2048;

    // 设置背景色
    context.fillStyle = '#0a192f';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 设置文字样式
    context.fillStyle = '#1e3a8a';  // 深蓝色
    context.font = 'bold 500px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // 绘制 PROTX 文字
    context.fillText('PROTX', canvas.width/2, canvas.height/2);

    // 添加网格线
    context.strokeStyle = '#004a77';
    context.lineWidth = 1;
    const gridSize = 64;
    
    for (let i = 0; i < canvas.width; i += gridSize) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, canvas.height);
      context.stroke();
    }
    
    for (let i = 0; i < canvas.height; i += gridSize) {
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(canvas.width, i);
      context.stroke();
    }

    // 创建地面纹理
    const groundTexture = new THREE.CanvasTexture(canvas);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(1, 1);

    // 设置科技感地面
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshPhongMaterial({ 
      map: groundTexture,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -container.externalHeight * 0.001 / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 添加发光网格
    const gridHelper = new THREE.GridHelper(50, 100, 0x00a8ff, 0x004a77);
    gridHelper.position.y = ground.position.y + 0.002;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    scene.add(gridHelper);

    // 检查一下实际使用的高度值
    console.log('External Height:', container.externalHeight * 0.001);
    console.log('Internal Height:', container.internalHeight * 0.001);

    // 确保使用外部尺寸渲染外部集装箱
    const containerGeometry = new THREE.BoxGeometry(
      container.externalLength * 0.001,
      container.externalHeight * 0.001,
      container.externalWidth * 0.001,
      1, 1, 1  // 减少分段数
    );
    
    // 使用共享材质
    const containerMaterial = new THREE.MeshPhongMaterial({
      color: 0x2c5282,
      transparent: true,
      opacity: 0.7,
      shininess: 100,
      side: THREE.FrontSide, // 只渲染正面
      depthWrite: true
    });

    // 优化内存使用
    containerGeometry.attributes.position.needsUpdate = false;
    containerGeometry.attributes.normal.needsUpdate = false;
    
    const containerMesh = new THREE.Mesh(containerGeometry, containerMaterial);
    containerMesh.matrixAutoUpdate = false; // 禁用自动矩阵更新
    containerMesh.updateMatrix();
    scene.add(containerMesh);

    // 添加边框发光效果
    const edges = new THREE.EdgesGeometry(containerGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00a8ff,  // 亮蓝色
      linewidth: 2
    });
    const edgesMesh = new THREE.LineSegments(edges, edgesMaterial);
    containerMesh.add(edgesMesh);

    // 使用内部尺寸渲染内部空间
    const internalGeometry = new THREE.BoxGeometry(
      container.internalLength * 0.001,
      container.internalHeight * 0.001,  // 内部高度 2.393
      container.internalWidth * 0.001
    );
    const internalMaterial = new THREE.MeshPhongMaterial({
      color: 0x60a5fa,  // 亮蓝色
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const internalMesh = new THREE.Mesh(internalGeometry, internalMaterial);
    internalMesh.position.y = 0;  // 确保位置正确
    internalMesh.castShadow = true;
    scene.add(internalMesh);

    // 添加内部边框发光效果
    const internalEdges = new THREE.EdgesGeometry(internalGeometry);
    const internalEdgesMaterial = new THREE.LineBasicMaterial({ 
      color: 0x93c5fd,  // 浅蓝色
      linewidth: 1
    });
    const internalEdgesMesh = new THREE.LineSegments(internalEdges, internalEdgesMaterial);
    internalMesh.add(internalEdgesMesh);

    // 添加集装箱类型标记
    const textureCanvas = createContainerTexture();
    const containerTexture = new THREE.CanvasTexture(textureCanvas);
    containerMaterial.map = containerTexture;
    containerMaterial.needsUpdate = true;

    // 修改光照设置
    scene.remove(...scene.children.filter(child => 
      child instanceof THREE.AmbientLight || 
      child instanceof THREE.DirectionalLight
    ));

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0x4a5568, 0.6);
    scene.add(ambientLight);

    // 添加主光源
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(10, 10, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    // 添加辅助光源（蓝色调）
    const blueLight = new THREE.DirectionalLight(0x00a8ff, 0.3);
    blueLight.position.set(-5, 5, -5);
    scene.add(blueLight);

    // 添加标注线
    addDimensionLines(scene);
    addWarningMarks(scene);
  };

  // 修改createContainerTexture函数，增加科技感
  const createContainerTexture = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 2048;
    canvas.height = 2048;
    
    // 绘制科技感背景
    context.fillStyle = '#1a365d';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // 添加网格线
    context.strokeStyle = '#2c5282';
    context.lineWidth = 2;
    const gridSize = 64;
    for (let i = 0; i < canvas.width; i += gridSize) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, canvas.height);
      context.stroke();
    }
    for (let i = 0; i < canvas.height; i += gridSize) {
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(canvas.width, i);
      context.stroke();
    }
    
    // 绘制集装箱类型
    context.font = 'bold 300px Arial';
    context.fillStyle = '#60a5fa';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.shadowColor = '#60a5fa';
    context.shadowBlur = 30;
    context.fillText(container.containerType, canvas.width/2, canvas.height/2);
    
    return canvas;
  };

  // 修改标注线函数
  const addDimensionLines = (scene) => {
    // 使用完全相同的尺寸进行标注
    const externalLength = container.externalLength * 0.001;
    const externalWidth = container.externalWidth * 0.001;
    const externalHeight = container.externalHeight * 0.001;
    
    const internalLength = container.internalLength * 0.001;
    const internalWidth = container.internalWidth * 0.001;
    const internalHeight = container.internalHeight * 0.001;
    
    // 创建发光材质
    const externalLineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00a8ff,  // 亮蓝色
      linewidth: 2
    });
    
    const internalLineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x60a5fa,  // 浅蓝色
      linewidth: 1
    });
    
    // 外部尺寸标注 - 长度（底部前方）
    createDimensionLine(
      scene,
      new THREE.Vector3(-externalLength/2, -externalHeight/2, externalWidth/2 + 0.5),
      new THREE.Vector3(externalLength/2, -externalHeight/2, externalWidth/2 + 0.5),
      `${container.externalLength}mm`,
      '#00a8ff',
      externalLineMaterial,
      0.3
    );
    
    // 外部尺寸标注 - 宽度（底部右侧）
    createDimensionLine(
      scene,
      new THREE.Vector3(externalLength/2 + 0.5, -externalHeight/2, -externalWidth/2),
      new THREE.Vector3(externalLength/2 + 0.5, -externalHeight/2, externalWidth/2),
      `${container.externalWidth}mm`,
      '#00a8ff',
      externalLineMaterial,
      0.3
    );
    
    // 修改外部尺寸标注 - 高度（右前方）
    createDimensionLine(
      scene,
      new THREE.Vector3(externalLength/2 + 0.5, -externalHeight/2, externalWidth/2 + 0.5),
      new THREE.Vector3(externalLength/2 + 0.5, externalHeight/2, externalWidth/2 + 0.5),
      `${container.externalHeight}mm`,
      '#00a8ff',
      externalLineMaterial,
      0.3
    );

    // 内部尺寸标注 - 长度（中部前方）
    createDimensionLine(
      scene,
      new THREE.Vector3(-internalLength/2, 0, internalWidth/2 + 0.3),
      new THREE.Vector3(internalLength/2, 0, internalWidth/2 + 0.3),
      `${container.internalLength}mm`,
      '#60a5fa',
      internalLineMaterial,
      0.2
    );
    
    // 内部尺寸标注 - 宽度（中部右侧）
    createDimensionLine(
      scene,
      new THREE.Vector3(internalLength/2 + 0.3, 0, -internalWidth/2),
      new THREE.Vector3(internalLength/2 + 0.3, 0, internalWidth/2),
      `${container.internalWidth}mm`,
      '#60a5fa',
      internalLineMaterial,
      0.2
    );
    
    // 修改内部尺寸标注 - 高度（右前方内侧）
    createDimensionLine(
      scene,
      new THREE.Vector3(internalLength/2 + 0.3, -internalHeight/2, internalWidth/2 + 0.3),
      new THREE.Vector3(internalLength/2 + 0.3, internalHeight/2, internalWidth/2 + 0.3),
      `${container.internalHeight}mm`,
      '#60a5fa',
      internalLineMaterial,
      0.2
    );
  };

  // 修改标注线创建函数，添加高度标注的支持
  const createDimensionLine = (scene, start, end, text, textColor, material, offset = 0.2) => {
    // 判断是否是高度标注（通过检查起点和终点的y值是否不同）
    const isHeight = start.y !== end.y;
    
    if (isHeight) {
        // 创建从容器边缘到标识线的连接线
        const startExtension = new THREE.BufferGeometry().setFromPoints([
            start,
            new THREE.Vector3(start.x + offset, start.y, start.z + offset)
        ]);
        const startLine = new THREE.Line(startExtension, material);
        scene.add(startLine);

        const endExtension = new THREE.BufferGeometry().setFromPoints([
            end,
            new THREE.Vector3(end.x + offset, end.y, end.z + offset)
        ]);
        const endLine = new THREE.Line(endExtension, material);
        scene.add(endLine);

        // 创建偏移后的主标注线
        const mainLine = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(start.x + offset, start.y, start.z + offset),
            new THREE.Vector3(end.x + offset, end.y, end.z + offset)
        ]);
        const line = new THREE.Line(mainLine, material);
        scene.add(line);

        // 添加箭头
        createArrow(scene, 
            new THREE.Vector3(start.x + offset, start.y, start.z + offset),
            new THREE.Vector3(0, -1, 0),
            0.08, Math.PI / 6, material);
        createArrow(scene, 
            new THREE.Vector3(end.x + offset, end.y, end.z + offset),
            new THREE.Vector3(0, 1, 0),
            0.08, Math.PI / 6, material);

        // 添加文字标注
        const midPoint = new THREE.Vector3(
            start.x + offset,
            (start.y + end.y) / 2,
            start.z + offset
        );
        createTextLabel(scene, midPoint, text, textColor);
    } else {
        // 原有的长度和宽度标注逻辑保持不变
        const direction = end.clone().sub(start).normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const offsetDir = direction.clone().cross(up).normalize();
        
        const offsetStart = start.clone().add(offsetDir.clone().multiplyScalar(offset));
        const offsetEnd = end.clone().add(offsetDir.clone().multiplyScalar(offset));
        
        const extensionGeometry1 = new THREE.BufferGeometry().setFromPoints([
            start,
            offsetStart
        ]);
        const extensionLine1 = new THREE.Line(extensionGeometry1, material);
        scene.add(extensionLine1);
        
        const extensionGeometry2 = new THREE.BufferGeometry().setFromPoints([
            end,
            offsetEnd
        ]);
        const extensionLine2 = new THREE.Line(extensionGeometry2, material);
        scene.add(extensionLine2);
        
        const points = [offsetStart, offsetEnd];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        
        createArrow(scene, offsetStart, direction.clone().negate(), 0.08, Math.PI / 6, material);
        createArrow(scene, offsetEnd, direction, 0.08, Math.PI / 6, material);
        
        const midPoint = offsetStart.clone().add(offsetEnd).multiplyScalar(0.5);
        createTextLabel(scene, midPoint, text, textColor);
    }
  };

  // 修改箭头创建函数，使其更小巧
  const createArrow = (scene, position, direction, length, angle, material) => {
    const leftDir = direction.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    const rightDir = direction.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -angle);
    
    const points = [
      position.clone().add(leftDir.multiplyScalar(length)),
      position,
      position.clone().add(rightDir.multiplyScalar(length))
    ];
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const arrow = new THREE.Line(geometry, material);
    scene.add(arrow);
  };

  // 修改文字标注函数，使其更清晰
  const createTextLabel = (scene, position, text, color) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    // 绘制背景
    context.fillStyle = 'rgba(10, 25, 47, 0.85)';  // 深蓝色半透明背景
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // 添加边框
    context.strokeStyle = '#00a8ff';  // 蓝色边框
    context.lineWidth = 2;
    context.strokeRect(2, 2, canvas.width-4, canvas.height-4);
    
    // 设置文字样式
    context.font = 'bold 64px Arial';
    context.fillStyle = '#ffffff';  // 白色文字
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.shadowColor = '#00a8ff';  // 文字发光效果
    context.shadowBlur = 10;
    
    // 绘制文字
    context.fillText(text, canvas.width/2, canvas.height/2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true
    });
    
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(position);
    sprite.scale.set(1, 0.25, 1);  // 调整标签大小
    
    scene.add(sprite);
  };

  // 添加警示标记函数
  const addWarningMarks = (scene) => {
    const length = container.externalLength * 0.001;
    const width = container.externalWidth * 0.001;
    const height = container.externalHeight * 0.001;
    
    // 添加角件标记
    const cornerPositions = [
      new THREE.Vector3(-length/2, -height/2, -width/2),
      new THREE.Vector3(length/2, -height/2, -width/2),
      new THREE.Vector3(-length/2, -height/2, width/2),
      new THREE.Vector3(length/2, -height/2, width/2),
      new THREE.Vector3(-length/2, height/2, -width/2),
      new THREE.Vector3(length/2, height/2, -width/2),
      new THREE.Vector3(-length/2, height/2, width/2),
      new THREE.Vector3(length/2, height/2, width/2)
    ];
    
    cornerPositions.forEach(position => {
      createCornerMark(scene, position);
    });
  };

  // 创建角件标记辅助函数
  const createCornerMark = (scene, position) => {
    const geometry = new THREE.BoxGeometry(0.178, 0.118, 0.162);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x808080,
      transparent: true,
      opacity: 0.8
    });
    const cornerMesh = new THREE.Mesh(geometry, material);
    cornerMesh.position.copy(position);
    scene.add(cornerMesh);
  };

  // 初始化3D场景
  const initScene = () => {
    if (!container || !containerRef.current) return;

    cleanup();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(8, 8, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance', // 优先使用高性能GPU
      logarithmicDepthBuffer: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制最大像素比
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8; // 调整旋转速度
    controls.zoomSpeed = 0.8;   // 调整缩放速度
    controls.panSpeed = 0.8;    // 调整平移速度
    controls.minDistance = 2;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // 创建集装箱模型
    createContainerModel(scene);

    let lastFrameTime = performance.now();
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime;

      if (deltaTime >= frameInterval) {
        controls.update();
        renderer.render(scene, camera);
        lastFrameTime = currentTime - (deltaTime % frameInterval);
      }

      frameIdRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  // 监听容器尺寸变化
  useEffect(() => {
    let resizeTimeout;
    
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      
      resizeTimeout = setTimeout(() => {
        if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
        
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }, 100); // 防抖处理
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, []);

  // 初始化场景
  useEffect(() => {
    initScene();
    return cleanup;
  }, [container]);

  // 处理进入全屏
  const enterFullscreen = async (element) => {
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
    } catch (err) {
      console.error('Failed to enter fullscreen:', err);
    }
  };

  // 处理退出全屏
  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    } catch (err) {
      console.error('Failed to exit fullscreen:', err);
    }
  };

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // 触发 resize 以更新渲染
      window.dispatchEvent(new Event('resize'));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      enterFullscreen(containerRef.current);
    } else {
      exitFullscreen();
    }
  };

  return (
    <Row gutter={[16, 16]}>
      {/* 上方：3D模型展示 */}
      <Col span={24}>
        <Card 
          title={t('3dModel')} 
          bordered={false}
          bodyStyle={{ padding: '12px' }}
          extra={
            <Button 
              type="primary" 
              icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />} 
              onClick={toggleFullscreen}
            />
          }
        >
          <div 
            ref={containerRef} 
            style={{ 
              width: '100%',
              height: '360px',
              borderRadius: '8px',
              backgroundColor: '#f5f5f5'
            }} 
          />
        </Card>
      </Col>

      {/* 下方：集装箱信息 */}
      <Col span={24}>
        <Card bordered={false}>
          <Row gutter={[16, 16]}>
            {/* 左侧：集装箱规格 */}
            <Col span={16}>
              <Card 
                title={t('specifications')} 
                bordered={false}
                bodyStyle={{ padding: '12px' }}
                size="small"
              >
                <Row gutter={[16, 0]}>
                  <Col span={12}>
                    <Descriptions column={1} bordered size="small">
                      <Descriptions.Item label={t('type')}>
                        {container.containerType}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('externalDimensions')}>
                        {`${container.externalLength} × ${container.externalWidth} × ${container.externalHeight} mm`}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('internalDimensions')}>
                        {`${container.internalLength} × ${container.internalWidth} × ${container.internalHeight} mm`}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('doorDimensions')}>
                        {`${container.doorWidth} × ${container.doorHeight} mm`}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                  <Col span={12}>
                    <Descriptions column={1} bordered size="small">
                      <Descriptions.Item label={t('nominalVolume')}>
                        {`${container.volume} m³`}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('maxPayload')}>
                        {`${container.maxPayload} kg / ${(container.maxPayload/1000).toFixed(1)} T`}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('tareWeight')}>
                        {`${container.tareWeight} kg / ${(container.tareWeight/1000).toFixed(1)} T`}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('grossWeight')}>
                        {`${container.maxPayload + container.tareWeight} kg / ${((container.maxPayload + container.tareWeight)/1000).toFixed(1)} T`}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* 右侧：ISO标准 */}
            <Col span={8}>
              <Card 
                title={t('isoStandards')} 
                bordered={false}
                bodyStyle={{ padding: '12px' }}
                size="small"
              >
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label={t('applicableStandards')}>
                    ISO 668 / 1496 / 6346
                  </Descriptions.Item>
                  <Descriptions.Item label={t('cornerFittings')}>
                    178 × 162 × 118 mm
                  </Descriptions.Item>
                  {container.containerType.startsWith('20') && (
                    <Descriptions.Item label={t('forkliftPockets')}>
                      352 × 115 mm, {t('distanceFromEnd')} 2050±50 mm
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default BasicInfo; 