import React, { useState, useRef, useEffect } from 'react';
import { Card, Row, Col, Select, InputNumber, Button, Table, Progress, Alert, Descriptions } from 'antd';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CARTON_SIZES } from '../constants/cartonSizes';
import { PALLET_SIZES } from '../constants/palletSizes';
import * as TWEEN from 'tween.js';

// 定义极点类
class ExtremePoint {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

const LoadingSimulation = ({ container }) => {
  // 状态管理
  const [selectedBoxes, setSelectedBoxes] = useState([]);
  const [currentBox, setCurrentBox] = useState({
    cartonId: '',
    quantity: 1,
    palletId: ''
  });
  const [simulationState, setSimulationState] = useState({
    isSimulating: false,
    progress: 0,
    processedCount: 0,
    totalCount: 0,
    currentStep: '',
    error: null,
    results: null,
    needsReset: false
  });

  // Three.js 相关的 refs
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const frameIdRef = useRef(null);

  // 修改 cleanup 函数，确保完全清理
  const cleanup = () => {
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    }

    if (controlsRef.current) {
      controlsRef.current.enabled = false;  // 禁用控制器
      controlsRef.current.dispose();        // 释放控制器
      controlsRef.current = null;
    }

    if (rendererRef.current) {
      rendererRef.current.dispose();
      if (rendererRef.current.domElement && rendererRef.current.domElement.parentNode) {
        rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current = null;
    }

    if (sceneRef.current) {
      // 清理场景中的所有对象
      while(sceneRef.current.children.length > 0) { 
        const object = sceneRef.current.children[0];
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
        sceneRef.current.remove(object);
      }
      sceneRef.current = null;
    }

    // 清理 DOM 引用
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // 手动触发垃圾回收
    if (window.gc) window.gc();
  };

  // 修改 useEffect 的依赖，确保在组件卸载时清理
  useEffect(() => {
    initScene();
    return () => {
      cleanup();
    };
  }, [container, selectedBoxes, simulationState.results]);

  // 添加组件卸载时的清理
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // 添加调试函数
  const debugLog = (message, data) => {
    console.log(`[Debug] ${message}:`, data);
  };

  // 修改装箱算法
  const findBestPositionEP = (boxDimensions, placedBoxes, containerDimensions) => {
    const { length: boxLength, width: boxWidth, height: boxHeight } = boxDimensions;
    const { 
      internalLength: containerLength, 
      internalWidth: containerWidth, 
      internalHeight: containerHeight,
      wallThickness 
    } = containerDimensions;

    const WALL_GAP = 5;
    const BOX_GAP = 2;
    const STEP_SIZE = Math.max(BOX_GAP * 2, Math.min(boxLength, boxWidth, boxHeight) / 4);

    // 计算容器的起始点（左后下角）
    const startX = -containerLength/2 + wallThickness + WALL_GAP;
    const startY = -containerHeight/2 + wallThickness + WALL_GAP;
    const startZ = -containerWidth/2 + wallThickness + WALL_GAP;

    // 优先使用默认方向
    const orientations = [
      { l: boxLength, w: boxWidth, h: boxHeight },
      { l: boxWidth, w: boxLength, h: boxHeight }
    ];

    // 创建空间索引
    const occupiedSpaces = new Set();
    placedBoxes.forEach(box => {
      const { position: pos, carton } = box;
      const key = `${Math.floor(pos.x/STEP_SIZE)},${Math.floor(pos.y/STEP_SIZE)},${Math.floor(pos.z/STEP_SIZE)}`;
      occupiedSpaces.add(key);
    });

    // 对每个方向尝试放置
    for (const orientation of orientations) {
      // 从底部开始，逐层尝试放置
      for (let y = startY; y <= containerHeight/2 - wallThickness - WALL_GAP - orientation.h; y += STEP_SIZE) {
        // 从左到右
        for (let x = startX; x <= containerLength/2 - wallThickness - WALL_GAP - orientation.l; x += STEP_SIZE) {
          // 从后到前
          for (let z = startZ; z <= containerWidth/2 - wallThickness - WALL_GAP - orientation.w; z += STEP_SIZE) {
            const position = {
              x: x + orientation.l/2,
              y: y + orientation.h/2,
              z: z + orientation.w/2
            };

            const key = `${Math.floor(x/STEP_SIZE)},${Math.floor(y/STEP_SIZE)},${Math.floor(z/STEP_SIZE)}`;
            if (occupiedSpaces.has(key)) continue;

            // 快速碰撞检测
            let isValid = true;
            for (const placedBox of placedBoxes) {
              const { position: pos, carton } = placedBox;
              const dx = Math.abs(position.x - pos.x);
              const dy = Math.abs(position.y - pos.y);
              const dz = Math.abs(position.z - pos.z);
              
              if (dx < (orientation.l + carton.length)/2 + BOX_GAP &&
                  dy < (orientation.h + carton.height)/2 + BOX_GAP &&
                  dz < (orientation.w + carton.width)/2 + BOX_GAP) {
                isValid = false;
                break;
              }
            }

            if (isValid) {
              return position;
            }
          }
        }
      }
    }

    return null;
  };

  // 修改位置验证逻辑
  const isValidPosition = (point, boxDimensions, placedBoxes, containerDimensions) => {
    const { length, width, height } = boxDimensions;
    const { 
      internalLength, 
      internalWidth, 
      internalHeight,
      wallThickness 
    } = containerDimensions;

    debugLog('Checking Position', { point, boxDimensions });

    // 计算箱子的边界
    const boxMinX = point.x;
    const boxMaxX = point.x + length;
    const boxMinY = point.y;
    const boxMaxY = point.y + height;
    const boxMinZ = point.z - width;
    const boxMaxZ = point.z;

    // 计算容器的内部边界
    const containerMinX = -internalLength/2 + wallThickness;
    const containerMaxX = internalLength/2 - wallThickness;
    const containerMinY = -internalHeight/2 + wallThickness;
    const containerMaxY = internalHeight/2 - wallThickness;
    const containerMinZ = -internalWidth/2 + wallThickness;
    const containerMaxZ = internalWidth/2 - wallThickness;

    debugLog('Box Boundaries', {
      x: [boxMinX, boxMaxX],
      y: [boxMinY, boxMaxY],
      z: [boxMinZ, boxMaxZ]
    });
    
    debugLog('Container Boundaries', {
      x: [containerMinX, containerMaxX],
      y: [containerMinY, containerMaxY],
      z: [containerMinZ, containerMaxZ]
    });

    // 检查是否在容器范围内
    if (boxMinX < containerMinX ||
        boxMaxX > containerMaxX ||
        boxMinY < containerMinY ||
        boxMaxY > containerMaxY ||
        boxMinZ < containerMinZ ||
        boxMaxZ > containerMaxZ) {
      debugLog('Position out of container bounds');
      return false;
    }

    // 检查与已放置箱子的碰撞
    for (const placedBox of placedBoxes) {
      const { position, carton } = placedBox;
      
      const placedMinX = position.x - carton.length/2;
      const placedMaxX = position.x + carton.length/2;
      const placedMinY = position.y - carton.height/2;
      const placedMaxY = position.y + carton.height/2;
      const placedMinZ = position.z - carton.width/2;
      const placedMaxZ = position.z + carton.width/2;

      if (!(boxMaxX <= placedMinX ||
            boxMinX >= placedMaxX ||
            boxMaxY <= placedMinY ||
            boxMinY >= placedMaxY ||
            boxMaxZ <= placedMinZ ||
            boxMinZ >= placedMaxZ)) {
        debugLog('Collision detected with placed box', placedBox);
        return false;
      }
    }

    debugLog('Position is valid');
    return true;
  };

  // 修改极点生成逻辑
  const generateExtremePoints = (placedBoxes, containerDimensions) => {
    const points = new Set();
    const { wallThickness } = containerDimensions;

    // 添加初始点（集装箱的左后下角）
    points.add(new ExtremePoint(
      -containerDimensions.internalLength/2 + wallThickness,
      -containerDimensions.internalHeight/2 + wallThickness,
      containerDimensions.internalWidth/2 - wallThickness
    ));

    // 为每个已放置的箱子生成新的极点
    for (const box of placedBoxes) {
      const { position, carton } = box;
      
      // 添加箱子周围的可能放置点
      // 右侧点
      points.add(new ExtremePoint(
        position.x + carton.length/2,
        position.y - carton.height/2,
        position.z
      ));
      
      // 顶部点
      points.add(new ExtremePoint(
        position.x - carton.length/2,
        position.y + carton.height/2,
        position.z
      ));
      
      // 前方点
      points.push(new ExtremePoint(
        position.x,
        position.y - carton.height/2,
        position.z - carton.width/2
      ));

      // 添加角点
      points.add(new ExtremePoint(
        position.x + carton.length/2,
        position.y - carton.height/2,
        position.z - carton.width/2
      ));
    }

    // 过滤掉无效的极点
    return Array.from(points).filter(point => {
      // 确保点在容器范围内
      return point.x >= -containerDimensions.internalLength/2 + wallThickness &&
             point.x <= containerDimensions.internalLength/2 - wallThickness &&
             point.y >= -containerDimensions.internalHeight/2 + wallThickness &&
             point.y <= containerDimensions.internalHeight/2 - wallThickness &&
             point.z >= -containerDimensions.internalWidth/2 + wallThickness &&
             point.z <= containerDimensions.internalWidth/2 - wallThickness;
    });
  };

  // 修改空间浪费计算
  const calculateWastedSpace = (point, boxDimensions, placedBoxes, containerDimensions) => {
    // 优先考虑靠近已放置箱子的位置
    let minDistance = Infinity;
    
    // 如果没有已放置的箱子，优先选择靠近起始点的位置
    if (placedBoxes.length === 0) {
      return Math.abs(point.x + containerDimensions.internalLength/2) +
             Math.abs(point.y + containerDimensions.internalHeight/2) +
             Math.abs(point.z - containerDimensions.internalWidth/2);
    }

    // 计算到最近已放置箱子的距离
    for (const placedBox of placedBoxes) {
      const { position } = placedBox;
      const distance = Math.abs(point.x - position.x) +
                      Math.abs(point.y - position.y) +
                      Math.abs(point.z - position.z);
      minDistance = Math.min(minDistance, distance);
    }

    return minDistance;
  };

  // 修改计算装载方案函数，使用 requestAnimationFrame 来处理动画
  const calculateLoadingPlan = async () => {
    try {
      console.log('Starting calculation...');
      
      setSimulationState(prev => ({
        ...prev,
        isSimulating: true,
        progress: 0,
        currentStep: '正在计算装载方案...',
        error: null,
        results: []
      }));

      const sortedBoxes = [...selectedBoxes].sort((a, b) => {
        const volumeA = a.carton.length * a.carton.width * a.carton.height;
        const volumeB = b.carton.length * b.carton.width * b.carton.height;
        return volumeB - volumeA;
      });

      const totalBoxes = sortedBoxes.reduce((sum, box) => sum + box.quantity, 0);
      let processedBoxes = 0;
      const boxPositions = [];

      // 创建 Worker 实例
      const worker = new Worker(new URL('../workers/loadingWorker.js', import.meta.url));

      const placeBoxes = () => {
        return new Promise((resolve, reject) => {
          let currentBoxIndex = 0;
          let currentQuantityIndex = 0;

          worker.onmessage = (e) => {
            console.log('Received worker response:', e.data);

            if (!e.data.success) {
              console.error('Worker error:', e.data.error);
              setSimulationState(prev => ({
                ...prev,
                isSimulating: false,
                error: e.data.error || '计算过程出错，请重试',
                needsReset: true
              }));
              worker.terminate();
              resolve();
              return;
            }

            const currentBox = sortedBoxes[currentBoxIndex];
            const newBox = {
              ...currentBox,
              position: e.data.bestPosition
            };
            
            boxPositions.push(newBox);
            processedBoxes++;

            setSimulationState(prev => ({
              ...prev,
              progress: Math.floor((processedBoxes / totalBoxes) * 100),
              currentStep: `正在放置第 ${processedBoxes}/${totalBoxes} 个箱子...`,
              results: [...boxPositions]
            }));

            currentQuantityIndex++;
            if (currentQuantityIndex >= currentBox.quantity) {
              currentBoxIndex++;
              currentQuantityIndex = 0;
            }

            if (currentBoxIndex >= sortedBoxes.length) {
              worker.terminate();
              resolve();
              return;
            }

            // 处理下一个箱子
            setTimeout(() => {
              worker.postMessage({
                box: sortedBoxes[currentBoxIndex],
                boxPositions,
                container: {
                  ...container,
                  length: container.externalLength,
                  width: container.externalWidth,
                  height: container.externalHeight,
                  wallThickness: container.wallThickness || 100
                }
              });
            }, 30);
          };

          // 开始处理第一个箱子
          worker.postMessage({
            box: sortedBoxes[0],
            boxPositions,
            container: {
              ...container,
              length: container.externalLength,
              width: container.externalWidth,
              height: container.externalHeight,
              wallThickness: container.wallThickness || 100
            }
          });
        });
      };

      await placeBoxes();

      setSimulationState(prev => ({
        ...prev,
        isSimulating: false,
        progress: 100,
        currentStep: '装载方案计算完成',
        results: boxPositions,
        needsReset: false
      }));

    } catch (error) {
      console.error('Loading failed:', error);
      setSimulationState(prev => ({
        ...prev,
        isSimulating: false,
        error: error.message || '计算过程出错，请重试',
        needsReset: true
      }));
    }
  };

  // 修改动画循环函数，确保动画和控制器更新同步
  const animate = () => {
    frameIdRef.current = requestAnimationFrame(animate);
    
    // 确保控制器始终更新
    if (controlsRef.current) {
      controlsRef.current.update();
    }
    
    // 更新 TWEEN 动画
    if (typeof TWEEN !== 'undefined') {
      TWEEN.update();
    }
    
    // 渲染场景
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  // 修改计算装载方案按钮的点击处理函数
  const handleCalculate = () => {
    console.log('Calculate button clicked');
    if (selectedBoxes.length === 0) {
      setSimulationState(prev => ({
        ...prev,
        error: '请先添加箱子',
        needsReset: true
      }));
      return;
    }
    calculateLoadingPlan();
  };

  // 创建集装箱模型
  const createContainerModel = (scene) => {
    // 清除现有的模型
    scene.children = scene.children.filter(child => 
      child instanceof THREE.AmbientLight || 
      child instanceof THREE.DirectionalLight ||
      child instanceof THREE.GridHelper ||
      child instanceof THREE.AxesHelper ||
      child instanceof THREE.Mesh && child.geometry instanceof THREE.PlaneGeometry
    );

    // 显示外部尺寸
    const containerGeometry = new THREE.BoxGeometry(
      container.externalLength * 0.001,
      container.externalHeight * 0.001,
      container.externalWidth * 0.001
    );
    const containerMaterial = new THREE.MeshPhongMaterial({
      color: 0x2c3e50,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const containerMesh = new THREE.Mesh(containerGeometry, containerMaterial);
    containerMesh.position.set(0, 0, 0);
    scene.add(containerMesh);

    // 添加外部边框
    const edges = new THREE.EdgesGeometry(containerGeometry);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ 
        color: 0x000000,
        linewidth: 2
      })
    );
    scene.add(line);

    // 显示内部尺寸
    const internalGeometry = new THREE.BoxGeometry(
      container.internalLength * 0.001,
      container.internalHeight * 0.001,
      container.internalWidth * 0.001
    );
    const internalMaterial = new THREE.MeshPhongMaterial({
      color: 0x3498db,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const internalMesh = new THREE.Mesh(internalGeometry, internalMaterial);
    scene.add(internalMesh);

    // 添加内部边框
    const internalEdges = new THREE.EdgesGeometry(internalGeometry);
    const internalLine = new THREE.LineSegments(
      internalEdges,
      new THREE.LineBasicMaterial({ 
        color: 0x3498db,
        linewidth: 2
      })
    );
    scene.add(internalLine);

    // 渲染装载的箱子
    if (simulationState.results && simulationState.results.length > 0) {
      simulationState.results.forEach((boxData, index) => {
        const carton = boxData.carton;
        const boxGeometry = new THREE.BoxGeometry(
          carton.length * 0.001,
          carton.height * 0.001,
          carton.width * 0.001
        );
        
        // 添加动画效果的材质
        const boxMaterial = new THREE.MeshPhongMaterial({
          color: carton.color || 0x3498db,
          transparent: true,
          opacity: simulationState.isSimulating ? 0.8 : 0.6,  // 正在模拟时略微提高透明度
          side: THREE.DoubleSide
        });
        
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        
        const { x, y, z } = boxData.position;
        boxMesh.position.set(
          x * 0.001,
          y * 0.001,
          z * 0.001
        );
        
        // 添加放置动画效果
        if (simulationState.isSimulating && index === simulationState.results.length - 1) {
          boxMesh.scale.set(1.1, 1.1, 1.1);  // 稍微放大新放置的箱子
          new TWEEN.Tween(boxMesh.scale)
            .to({ x: 1, y: 1, z: 1 }, 300)
            .easing(TWEEN.Easing.Elastic.Out)
            .start();
        }
        
        scene.add(boxMesh);

        // 箱子边框
        const boxEdges = new THREE.EdgesGeometry(boxGeometry);
        const boxLine = new THREE.LineSegments(
          boxEdges,
          new THREE.LineBasicMaterial({ 
            color: carton.color || 0x3498db,
            linewidth: 1
          })
        );
        boxLine.position.copy(boxMesh.position);
        scene.add(boxLine);
      });
    }

    // 添加地面
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -container.externalHeight * 0.001 / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 添加地面网格
    const gridHelper = new THREE.GridHelper(30, 60, 0x888888, 0xcccccc);
    gridHelper.position.y = ground.position.y + 0.001;
    scene.add(gridHelper);

    // 添加坐标轴辅助
    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.y = ground.position.y + 0.001;
    scene.add(axesHelper);
  };

  // 添加文字标注函数
  const createTextLabel = (scene, position, text, color) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    context.font = 'bold 36px Arial';
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width/2, canvas.height/2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(position);
    sprite.scale.set(1.5, 0.4, 1);
    
    scene.add(sprite);
    return sprite;
  };

  // 监听容器尺寸变化
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 初始化场景
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
      logarithmicDepthBuffer: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 修改 OrbitControls 配置
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableRotate = true;  // 确保旋转功能启用
    controls.enableZoom = true;    // 确保缩放功能启用
    controls.enablePan = true;     // 确保平移功能启用
    controls.rotateSpeed = 1.0;    // 调整旋转速度
    controls.zoomSpeed = 1.2;      // 调整缩放速度
    controls.panSpeed = 0.8;       // 调整平移速度
    controls.update();             // 初始更新控制器
    controlsRef.current = controls;

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -15;
    directionalLight.shadow.camera.right = 15;
    directionalLight.shadow.camera.top = 15;
    directionalLight.shadow.camera.bottom = -15;
    scene.add(directionalLight);

    // 创建集装箱模型和装箱模型
    createContainerModel(scene);

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      // 确保控制器始终更新
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // 更新 TWEEN 动画
      if (typeof TWEEN !== 'undefined') {
        TWEEN.update();
      }
      
      // 渲染场景
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();
  };

  // 表格列定义
  const columns = [
    {
      title: '箱型',
      dataIndex: ['carton', 'name'],
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div 
            style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: record.carton.color || '#3498db',
              opacity: record.carton.opacity || 0.6,
              marginRight: '8px',
              border: '1px solid #d9d9d9',
              borderRadius: '2px'
            }} 
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '托盘',
      dataIndex: ['pallet', 'name'],
      key: 'pallet',
      render: (text) => text || '不使用托盘'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => {
          setSelectedBoxes(selectedBoxes.filter(box => box.id !== record.id));
        }}>
          删除
        </Button>
      ),
    },
  ];

  // 渲染模拟状态
  const renderSimulationStatus = () => {
    if (!simulationState.isSimulating && !simulationState.needsReset) return null;

    return (
      <div style={{ marginTop: '8px' }}>
        <Alert
          message={
            <div>
              <div>{simulationState.currentStep}</div>
              {simulationState.error && (
                <div style={{ color: 'red' }}>{simulationState.error}</div>
              )}
              <Progress 
                percent={simulationState.progress} 
                size="small"
                status={simulationState.error ? "exception" : 
                        simulationState.isSimulating ? "active" : "success"}
              />
            </div>
          }
          type={simulationState.error ? "error" : "info"}
          showIcon
        />
      </div>
    );
  };

  // 在组件顶部添加调试日志
  useEffect(() => {
    console.log('LoadingSimulation mounted');
    return () => {
      console.log('LoadingSimulation unmounted');
    };
  }, []);

  return (
    <Row gutter={[16, 16]}>
      <Col span={14}>
        <Card title="3D装载模拟" bordered={false}>
          <div 
            ref={containerRef} 
            style={{ 
              width: '100%', 
              height: '600px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }} 
          />
        </Card>
      </Col>
      <Col span={10}>
        <Card title="装载配置" bordered={false}>
          <Row gutter={[16, 16]} align="middle">
            <Col span={9}>
              <Select
                placeholder="选择箱型"
                value={currentBox.cartonId}
                onChange={(value) => setCurrentBox({ ...currentBox, cartonId: value })}
                style={{ width: '100%' }}
                optionLabelProp="label"
                dropdownMatchSelectWidth={false}
                labelInValue={false}
                menuItemSelectedIcon={null}
                suffixIcon={null}
              >
                {CARTON_SIZES.map(box => (
                  <Select.Option 
                    key={box.id} 
                    value={box.id}
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div 
                          style={{ 
                            width: '16px', 
                            height: '16px', 
                            backgroundColor: box.color || '#3498db',
                            opacity: box.opacity || 0.6,
                            marginRight: '8px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '2px',
                            flexShrink: 0
                          }} 
                        />
                        <span>{box.name}</span>
                      </div>
                    }
                  >
                    <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                      <div 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: box.color || '#3498db',
                          opacity: box.opacity || 0.6,
                          marginRight: '8px',
                          border: '1px solid #d9d9d9',
                          borderRadius: '2px',
                          flexShrink: 0
                        }} 
                      />
                      <span>{box.name} ({box.length}×{box.width}×{box.height})</span>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                placeholder="数量"
                value={currentBox.quantity}
                onChange={(value) => setCurrentBox({ ...currentBox, quantity: value })}
              />
            </Col>
            <Col span={7}>
              <Select
                style={{ width: '100%' }}
                placeholder="选择托盘"
                allowClear
                value={currentBox.palletId}
                onChange={(value) => setCurrentBox({ ...currentBox, palletId: value })}
                dropdownMatchSelectWidth={false}
                optionLabelProp="label"
              >
                {PALLET_SIZES.map(pallet => (
                  <Select.Option 
                    key={pallet.id} 
                    value={pallet.id}
                    label={pallet.name}
                  >
                    <div style={{ whiteSpace: 'nowrap' }}>
                      {pallet.name} ({pallet.length}×{pallet.width}×{pallet.height})
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Button 
                type="primary" 
                style={{ width: '100%' }}
                onClick={() => {
                  if (!currentBox.cartonId) return;
                  const selectedCarton = CARTON_SIZES.find(c => c.id === currentBox.cartonId);
                  setSelectedBoxes([
                    ...selectedBoxes,
                    {
                      ...currentBox,
                      id: Date.now(),
                      carton: selectedCarton,
                      pallet: currentBox.palletId ? PALLET_SIZES.find(p => p.id === currentBox.palletId) : null
                    }
                  ]);
                }}
              >
                添加
              </Button>
            </Col>
          </Row>
          
          <div style={{ marginTop: '16px' }}>
            <Button 
              type="primary" 
              onClick={handleCalculate}
              disabled={selectedBoxes.length === 0 || simulationState.isSimulating}
              style={{ marginBottom: '16px' }}
            >
              计算装载方案
            </Button>

            {renderSimulationStatus()}
          </div>

          <Table
            columns={columns}
            dataSource={selectedBoxes}
            pagination={false}
            size="small"
          />
          
          <Card 
            title="装载统计" 
            style={{ marginTop: '16px' }} 
            bordered={false}
            size="small"
          >
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="已选箱数">
                {selectedBoxes.reduce((sum, box) => sum + box.quantity, 0)}
              </Descriptions.Item>
              <Descriptions.Item label="总体积">
                {(selectedBoxes.reduce((sum, box) => {
                  // 计算单个箱子的体积（mm³）并转换为 m³
                  const boxVolume = (box.carton.length * box.carton.width * box.carton.height) / 1000000000;
                  return sum + (boxVolume * box.quantity);
                }, 0)).toFixed(3)} m³
              </Descriptions.Item>
              <Descriptions.Item label="空间利用率">
                {(selectedBoxes.reduce((sum, box) => {
                  const boxVolume = (box.carton.length * box.carton.width * box.carton.height) / 1000000000;
                  return sum + (boxVolume * box.quantity);
                }, 0) / (container.internalLength * container.internalWidth * container.internalHeight / 1000000000) * 100).toFixed(2)}%
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Card>
      </Col>
    </Row>
  );
};

export default LoadingSimulation; 