import React, { useState, useRef, useEffect } from 'react';
import { Card, Row, Col, Select, InputNumber, Button, Table, Progress, Alert, Descriptions, Space, Statistic } from 'antd';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CARTON_SIZES } from '../constants/cartonSizes';
import { PALLET_SIZES } from '../constants/palletSizes';
import * as TWEEN from 'tween.js';
import { PlusOutlined, CalculatorOutlined, ReloadOutlined, ExperimentOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

// 定义极点类
class ExtremePoint {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

const LoadingSimulation = ({ container }) => {
  const { t } = useTranslation();

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

  // 修改计算装载方案函数
  const calculateLoadingPlan = async () => {
    try {
      setSimulationState(prev => ({ 
        ...prev, 
        isSimulating: true,
        progress: 0,
        currentStep: '初始化模拟...',
        error: null,
        needsReset: false 
      }));

      // 展开并预处理所有箱子
      const allBoxes = selectedBoxes.flatMap(box => 
        Array(box.quantity).fill({
          ...box,
          // 计算箱子的关键属性
          maxDimension: Math.max(box.carton.length, box.carton.width, box.carton.height),
          volume: box.carton.length * box.carton.width * box.carton.height,
          baseArea: box.carton.length * box.carton.width
        })
      );

      // 多重排序：
      // 1. 先按最大边长排序（大箱子优先）
      // 2. 然后按底面积排序（稳定性优先）
      // 3. 最后按体积排序（空间利用率优先）
      allBoxes.sort((a, b) => {
        // 先比较最大边长
        if (a.maxDimension !== b.maxDimension) {
          return b.maxDimension - a.maxDimension;
        }
        // 再比较底面积
        if (a.baseArea !== b.baseArea) {
          return b.baseArea - a.baseArea;
        }
        // 最后比较体积
        return b.volume - a.volume;
      });

      const totalBoxes = allBoxes.length;
      let processedBoxes = 0;
      const placedBoxes = [];

      const worker = new Worker(new URL('../workers/loadingWorker.js', import.meta.url));
      const boxPositions = [];

      const placeBoxes = () => {
        return new Promise((resolve, reject) => {
          worker.onmessage = (e) => {
            if (!e.data.success) {
              console.error('Worker error:', e.data.error);
              setSimulationState(prev => ({
                ...prev,
                isSimulating: false,
                error: e.data.error,
                needsReset: true
              }));
              worker.terminate();
              reject(new Error(e.data.error));
              return;
            }

            // 更新箱子位置
            boxPositions.push({
              ...allBoxes[boxPositions.length],
              position: e.data.bestPosition
            });

            // 更新进度
            const progress = Math.floor((boxPositions.length / totalBoxes) * 100);
            setSimulationState(prev => ({
              ...prev,
              progress: progress,
              currentStep: `正在放置第 ${boxPositions.length}/${totalBoxes} 个箱子...`,
              results: [...boxPositions]
            }));

            if (boxPositions.length >= totalBoxes) {
              worker.terminate();
              resolve(boxPositions);
              return;
            }

            // 处理下一个箱子
            setTimeout(() => {
              worker.postMessage({
                boxes: allBoxes,
                placedBoxes: boxPositions,
                currentBoxIndex: boxPositions.length,
                container: {
                  length: container.externalLength,
                  width: container.externalWidth,
                  height: container.externalHeight,
                  wallThickness: container.wallThickness || 100
                }
              });
            }, 10); // 添加小延迟确保UI更新
          };

          // 开始处理第一个箱子
          worker.postMessage({
            boxes: allBoxes,
            placedBoxes: [],
            currentBoxIndex: 0,
            container: {
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
        currentStep: '装载方案计算完成',
        needsReset: true
      }));

    } catch (error) {
      console.error('Calculation error:', error);
      setSimulationState(prev => ({
        ...prev,
        isSimulating: false,
        error: error.message,
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

  // 修改初始化场景函数
  const initScene = () => {
    if (!container || !containerRef.current) return;

    cleanup();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);  // 浅灰色背景
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
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.update();
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

    // 添加地面网格
    const gridHelper = new THREE.GridHelper(30, 60, 0x888888, 0xcccccc);
    gridHelper.position.y = -container.externalHeight * 0.001 / 2;
    scene.add(gridHelper);

    // 添加坐标轴辅助
    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.y = gridHelper.position.y + 0.001;
    scene.add(axesHelper);

    // 创建集装箱模型和装箱模型
    createContainerModel(scene);

    animate();
  };

  // 修改创建集装箱模型函数
  const createContainerModel = (scene) => {
    // 清除现有的模型
    scene.children = scene.children.filter(child => 
      child instanceof THREE.AmbientLight || 
      child instanceof THREE.DirectionalLight ||
      child instanceof THREE.GridHelper ||
      child instanceof THREE.AxesHelper
    );

    // 设置科技感地面
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x0a192f,  // 深蓝色
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
    scene.add(gridHelper);

    // 创建外部集装箱
    const containerGeometry = new THREE.BoxGeometry(
      container.externalLength * 0.001,
      container.externalHeight * 0.001,
      container.externalWidth * 0.001
    );
    
    // 调整外部集装箱材质的透明度
    const containerMaterial = new THREE.MeshPhongMaterial({
      color: 0x2c5282,  // 深蓝色
      transparent: true,
      opacity: 0.15,    // 降低透明度，使内部更容易观察
      shininess: 100,
      side: THREE.DoubleSide,
      depthWrite: false  // 确保透明度正确渲染
    });
    
    const containerMesh = new THREE.Mesh(containerGeometry, containerMaterial);
    containerMesh.position.y = 0;
    containerMesh.castShadow = true;
    containerMesh.receiveShadow = true;
    scene.add(containerMesh);

    // 增强边框的可见度
    const edges = new THREE.EdgesGeometry(containerGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00a8ff,  // 亮蓝色
      linewidth: 2,
      transparent: true,
      opacity: 0.8      // 保持边框较高的可见度
    });
    const edgesMesh = new THREE.LineSegments(edges, edgesMaterial);
    containerMesh.add(edgesMesh);

    // 调整内部空间的透明度
    const internalGeometry = new THREE.BoxGeometry(
      container.internalLength * 0.001,
      container.internalHeight * 0.001,
      container.internalWidth * 0.001
    );
    const internalMaterial = new THREE.MeshPhongMaterial({
      color: 0x60a5fa,  // 亮蓝色
      transparent: true,
      opacity: 0.1,     // 降低内部空间的透明度
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const internalMesh = new THREE.Mesh(internalGeometry, internalMaterial);
    internalMesh.position.y = 0;
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

    // 渲染装载的箱子
    if (simulationState.results && simulationState.results.length > 0) {
      simulationState.results.forEach(boxData => {
        const boxGeometry = new THREE.BoxGeometry(
          boxData.carton.length * 0.001,
          boxData.carton.height * 0.001,
          boxData.carton.width * 0.001
        );
        
        const boxMaterial = new THREE.MeshPhongMaterial({
          color: new THREE.Color(boxData.carton.color),
          transparent: true,
          opacity: boxData.carton.opacity || 0.85,
          shininess: 100,
          side: THREE.DoubleSide
        });
        
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        boxMesh.position.set(
          boxData.position.x * 0.001,
          boxData.position.y * 0.001,
          boxData.position.z * 0.001
        );
        boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        scene.add(boxMesh);

        // 添加箱子边框发光效果
        const boxEdges = new THREE.EdgesGeometry(boxGeometry);
        const boxEdgesMaterial = new THREE.LineBasicMaterial({ 
          color: new THREE.Color(boxData.carton.color).multiplyScalar(1.2),
          linewidth: 1
        });
        const boxEdgesMesh = new THREE.LineSegments(boxEdges, boxEdgesMaterial);
        boxMesh.add(boxEdgesMesh);
      });
    }
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

  // 定义表格列
  const columns = [
    {
      title: t('boxType'),
      dataIndex: 'carton',
      key: 'carton',
      render: (carton) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div 
            style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: carton.color || '#3498db',
              opacity: carton.opacity || 0.7,
              marginRight: '8px',
              border: '1px solid #d9d9d9',
              borderRadius: '2px'
            }} 
          />
          <span>{t(carton.name)} ({carton.length}×{carton.width}×{carton.height})</span>
        </div>
      )
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: t('pallet'),
      dataIndex: 'pallet',
      key: 'pallet',
      render: (pallet) => pallet ? t(pallet.name) : t('noPallet')
    },
    {
      title: t('actions'),
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => {
            setSelectedBoxes(selectedBoxes.filter(box => box.id !== record.id));
          }}
        >
          {t('delete')}
        </Button>
      )
    }
  ];

  // 修改进度显示组件
  const renderSimulationStatus = () => {
    return (
      <div style={{ marginTop: 16 }}>
        <Progress 
          percent={simulationState.progress} 
          status={
            simulationState.error ? 'exception' : 
            simulationState.progress === 100 ? 'success' : 
            'active'
          }
          style={{ marginBottom: 8 }}
        />
        <div style={{ 
          color: simulationState.error ? '#ff4d4f' : 'inherit',
          marginBottom: 8 
        }}>
          {simulationState.currentStep ? t(simulationState.currentStep) : t('waitingForSimulation')}
        </div>
        {simulationState.error && (
          <Alert
            message={t('error')}
            description={t(simulationState.error)}
            type="error"
            showIcon
          />
        )}
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

  // 修改动画渲染函数
  const createBoxAnimation = (boxMesh, finalPosition) => {
    // 设置初始位置（从上方降落）
    boxMesh.position.set(
      finalPosition.x,
      containerDimensions.internalHeight/2,
      finalPosition.z
    );
    
    // 创建动画
    new TWEEN.Tween(boxMesh.position)
      .to({
        x: finalPosition.x,
        y: finalPosition.y,
        z: finalPosition.z
      }, 1000)
      .easing(TWEEN.Easing.Bounce.Out)
      .start();

    // 添加旋转动画
    new TWEEN.Tween(boxMesh.rotation)
      .to({
        x: Math.PI * 2,
        y: Math.PI * 2,
        z: 0
      }, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();

    // 添加缩放动画
    boxMesh.scale.set(1.2, 1.2, 1.2);
    new TWEEN.Tween(boxMesh.scale)
      .to({ x: 1, y: 1, z: 1 }, 500)
      .easing(TWEEN.Easing.Back.Out)
      .start();
  };

  // 修改箱子渲染函数
  const renderBox = (scene, boxData, index) => {
    const { carton, position } = boxData;
    
    // 创建箱子几何体
    const boxGeometry = new THREE.BoxGeometry(
      carton.length * 0.001,
      carton.height * 0.001,
      carton.width * 0.001
    );

    // 创建材质（使用箱子预定义的颜色）
    const boxMaterial = new THREE.MeshPhongMaterial({
      color: carton.color || 0x3498db,
      transparent: true,
      opacity: 0.8,
      shininess: 30,
      specular: 0x444444
    });

    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    
    // 添加边框
    const edges = new THREE.EdgesGeometry(boxGeometry);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    boxMesh.add(line);

    // 添加动画
    createBoxAnimation(boxMesh, {
      x: position.x * 0.001,
      y: position.y * 0.001,
      z: position.z * 0.001
    });

    scene.add(boxMesh);
  };

  // 修改选择箱子的处理函数
  const handleAddBox = () => {
    if (!currentBox.cartonId) return;
    
    const cartonConfig = CARTON_SIZES.find(c => c.id === currentBox.cartonId);
    if (!cartonConfig) return;
    
    console.log('Adding box with config:', cartonConfig); // 调试日志
    
    setSelectedBoxes([
      ...selectedBoxes,
      {
        ...currentBox,
        id: Date.now(),
        carton: {
          type: cartonConfig.id,
          name: cartonConfig.name,
          length: cartonConfig.length,
          width: cartonConfig.width,
          height: cartonConfig.height,
          color: cartonConfig.color,
          opacity: cartonConfig.opacity
        },
        pallet: currentBox.palletId ? PALLET_SIZES.find(p => p.id === currentBox.palletId) : null
      }
    ]);
  };

  // 添加重置函数
  const handleReset = () => {
    setSelectedBoxes([]);
    setSimulationState({
      isSimulating: false,
      progress: 0,
      currentStep: '',
      error: null,
      results: null,
      needsReset: false
    });
    
    // 重新初始化场景
    if (sceneRef.current) {
      createContainerModel(sceneRef.current);
    }
  };

  // 添加测试数据函数
  const addTestData = () => {
    // 选择3种不同规格的箱子（A1, A3, B2）
    const testBoxes = [
      {
        id: Date.now(),
        cartonId: 'A1',
        quantity: 33,
        carton: {
          ...CARTON_SIZES.find(c => c.id === 'A1'),
          type: 'A1'
        }
      },
      {
        id: Date.now() + 1,
        cartonId: 'A3',
        quantity: 33,
        carton: {
          ...CARTON_SIZES.find(c => c.id === 'A3'),
          type: 'A3'
        }
      },
      {
        id: Date.now() + 2,
        cartonId: 'B2',
        quantity: 33,
        carton: {
          ...CARTON_SIZES.find(c => c.id === 'B2'),
          type: 'B2'
        }
      }
    ];

    // 更新选中的箱子列表
    setSelectedBoxes(testBoxes);
  };

  return (
    <Row gutter={[16, 16]}>
      {/* 上方：3D模型展示 */}
      <Col span={24}>
        <Card 
          title={t('3DLoadingSimulation')} 
          bordered={false}
          bodyStyle={{ padding: '12px' }}
        >
          <div 
            ref={containerRef} 
            style={{ 
              width: '100%', 
              height: '360px',  // 与 BasicInfo 保持一致
              borderRadius: '8px'
            }} 
          />
        </Card>
      </Col>

      {/* 下方：配置区域 */}
      <Col span={24}>
        <Card bordered={false}>
          <Row gutter={[16, 16]}>
            {/* 左侧：箱型选择和操作按钮 */}
            <Col span={16}>
              <Card 
                title={t('loadingConfiguration')} 
                bordered={false}
                bodyStyle={{ padding: '12px' }}
                size="small"
              >
                <Space direction="vertical" style={{ width: '100%' }} size={16}>
                  {/* 箱型选择区域 */}
                  <Space.Compact block>
                    <Select
                      placeholder={t('selectBoxType')}
                      value={currentBox.cartonId}
                      onChange={(value) => setCurrentBox({ ...currentBox, cartonId: value })}
                      style={{ width: '45%' }}
                      optionLabelProp="label"
                      dropdownMatchSelectWidth={false}
                    >
                      {CARTON_SIZES.map(box => (
                        <Select.Option 
                          key={box.id} 
                          value={box.id}
                          label={t(box.name)}
                        >
                          <Space>
                            <div 
                              style={{ 
                                width: '16px', 
                                height: '16px', 
                                backgroundColor: box.color || '#3498db',
                                opacity: box.opacity || 0.6,
                                border: '1px solid #d9d9d9',
                                borderRadius: '2px'
                              }} 
                            />
                            <span>{t(box.name)} ({box.length}×{box.width}×{box.height})</span>
                          </Space>
                        </Select.Option>
                      ))}
                    </Select>
                    <InputNumber
                      style={{ width: '15%' }}
                      min={1}
                      placeholder={t('quantity')}
                      value={currentBox.quantity}
                      onChange={(value) => setCurrentBox({ ...currentBox, quantity: value })}
                    />
                    <Select
                      style={{ width: '30%' }}
                      placeholder={t('selectPallet')}
                      allowClear
                      value={currentBox.palletId}
                      onChange={(value) => setCurrentBox({ ...currentBox, palletId: value })}
                    >
                      {PALLET_SIZES.map(pallet => (
                        <Select.Option key={pallet.id} value={pallet.id}>
                          {t(pallet.name)}
                        </Select.Option>
                      ))}
                    </Select>
                    <Button 
                      type="primary"
                      onClick={handleAddBox}
                      style={{ width: '10%' }}
                      icon={<PlusOutlined />}
                    />
                  </Space.Compact>

                  {/* 操作按钮组 */}
                  <Space>
                    <Button 
                      type="primary" 
                      onClick={handleCalculate}
                      disabled={selectedBoxes.length === 0 || simulationState.isSimulating}
                      icon={<CalculatorOutlined />}
                    >
                      {t('calculateLoadingPlan')}
                    </Button>
                    <Button 
                      onClick={handleReset}
                      disabled={simulationState.isSimulating}
                      icon={<ReloadOutlined />}
                    >
                      {t('reset')}
                    </Button>
                    <Button 
                      type="dashed"
                      onClick={addTestData}
                      disabled={simulationState.isSimulating || selectedBoxes.length > 0}
                      icon={<ExperimentOutlined />}
                    >
                      {t('testData')}
                    </Button>
                  </Space>

                  {/* 已选箱子列表 */}
                  {simulationState.isSimulating && renderSimulationStatus()}
                  <Table
                    columns={columns}
                    dataSource={selectedBoxes}
                    rowKey={record => record.id}
                    pagination={false}
                    size="small"
                    scroll={{ y: 200 }}
                  />
                </Space>
              </Card>
            </Col>

            {/* 右侧：装载统计 */}
            <Col span={8}>
              <Card 
                title={t('loadingStatistics')} 
                bordered={false}
                bodyStyle={{ padding: '12px' }}
                size="small"
              >
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label={t('selectedBoxCount')}>
                    {selectedBoxes.reduce((sum, box) => sum + box.quantity, 0)} 个
                  </Descriptions.Item>
                  <Descriptions.Item label={t('totalVolume')}>
                    {(selectedBoxes.reduce((sum, box) => {
                      const boxVolume = (box.carton.length * box.carton.width * box.carton.height) / 1000000000;
                      return sum + (boxVolume * box.quantity);
                    }, 0)).toFixed(3)} m³
                  </Descriptions.Item>
                  <Descriptions.Item label={t('spaceUtilization')}>
                    {(selectedBoxes.reduce((sum, box) => {
                      const boxVolume = (box.carton.length * box.carton.width * box.carton.height) / 1000000000;
                      return sum + (boxVolume * box.quantity);
                    }, 0) / (container.internalLength * container.internalWidth * container.internalHeight / 1000000000) * 100).toFixed(2)} %
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default LoadingSimulation; 