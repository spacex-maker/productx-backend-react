import React, { useEffect, useRef, useState } from 'react';
import { Card, Descriptions, Row, Col, Button } from 'antd';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const BasicInfo = ({ container }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const frameIdRef = useRef(null);
  const [showInternal, setShowInternal] = useState(false);

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
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
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
      side: THREE.DoubleSide,  // 双面渲染
      depthWrite: false  // 防止透明物体的渲染问题
    });
    const containerMesh = new THREE.Mesh(containerGeometry, containerMaterial);
    containerMesh.castShadow = true;  // 投射阴影
    containerMesh.receiveShadow = true;  // 接收阴影
    scene.add(containerMesh);

    // 添加外部边框
    const edges = new THREE.EdgesGeometry(containerGeometry);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ 
        color: 0x000000,
        linewidth: 2  // 注意：由于WebGL限制，线宽可能在某些浏览器中不起作用
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
    internalMesh.castShadow = true;
    internalMesh.receiveShadow = true;
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

    // 添加标注线
    addDimensionLines(scene);
    // 添加警示标记
    addWarningMarks(scene);
  };

  // 修改标注线函数
  const addDimensionLines = (scene) => {
    // 外部尺寸标注
    const externalLength = container.externalLength * 0.001;
    const externalWidth = container.externalWidth * 0.001;
    const externalHeight = container.externalHeight * 0.001;
    
    // 内部尺寸标注
    const internalLength = container.internalLength * 0.001;
    const internalWidth = container.internalWidth * 0.001;
    const internalHeight = container.internalHeight * 0.001;
    
    const externalLineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const internalLineMaterial = new THREE.LineBasicMaterial({ color: 0x3498db });
    
    // 外部尺寸标注 - 长度（前面）
    createDimensionLine(
      scene,
      new THREE.Vector3(-externalLength/2, -externalHeight/2, externalWidth/2),
      new THREE.Vector3(externalLength/2, -externalHeight/2, externalWidth/2),
      `${container.externalLength}mm`,
      '#000000',
      externalLineMaterial,
      0.2  // 标注线偏移距离
    );
    
    // 外部尺寸标注 - 宽度（右侧）
    createDimensionLine(
      scene,
      new THREE.Vector3(externalLength/2, -externalHeight/2, -externalWidth/2),
      new THREE.Vector3(externalLength/2, -externalHeight/2, externalWidth/2),
      `${container.externalWidth}mm`,
      '#000000',
      externalLineMaterial,
      0.2
    );
    
    // 外部尺寸标注 - 高度（右侧）
    createDimensionLine(
      scene,
      new THREE.Vector3(externalLength/2, -externalHeight/2, -externalWidth/2),
      new THREE.Vector3(externalLength/2, externalHeight/2, -externalWidth/2),
      `${container.externalHeight}mm`,
      '#000000',
      externalLineMaterial,
      0.2
    );

    // 内部尺寸标注 - 长度（前面）
    createDimensionLine(
      scene,
      new THREE.Vector3(-internalLength/2, 0, internalWidth/2),
      new THREE.Vector3(internalLength/2, 0, internalWidth/2),
      `${container.internalLength}mm`,
      '#3498db',
      internalLineMaterial,
      0.4  // 内部尺寸标注线偏移距离略大
    );
    
    // 内部尺寸标注 - 宽度（右侧）
    createDimensionLine(
      scene,
      new THREE.Vector3(internalLength/2, 0, -internalWidth/2),
      new THREE.Vector3(internalLength/2, 0, internalWidth/2),
      `${container.internalWidth}mm`,
      '#3498db',
      internalLineMaterial,
      0.4
    );
    
    // 内部尺寸标注 - 高度（右侧）
    createDimensionLine(
      scene,
      new THREE.Vector3(internalLength/2, -internalHeight/2, -internalWidth/2),
      new THREE.Vector3(internalLength/2, internalHeight/2, -internalWidth/2),
      `${container.internalHeight}mm`,
      '#3498db',
      internalLineMaterial,
      0.4
    );
  };

  // 修改标注线创建函数，添加偏移参数
  const createDimensionLine = (scene, start, end, text, textColor, material, offset = 0.2) => {
    // 计算偏移方向（假设标注线总是垂直于测量方向）
    const direction = end.clone().sub(start).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const offsetDir = direction.clone().cross(up).normalize();
    
    // 创建偏移的起点和终点
    const offsetStart = start.clone().add(offsetDir.clone().multiplyScalar(offset));
    const offsetEnd = end.clone().add(offsetDir.clone().multiplyScalar(offset));
    
    // 创建延伸线（从测量点到标注线）
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
    
    // 创建主标注线
    const points = [offsetStart, offsetEnd];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    
    // 创建箭头
    const arrowLength = 0.1;  // 减小箭头大小
    const arrowAngle = Math.PI / 6;
    
    // 起点箭头
    createArrow(scene, offsetStart, direction.clone().negate(), arrowLength, arrowAngle, material);
    // 终点箭头
    createArrow(scene, offsetEnd, direction, arrowLength, arrowAngle, material);
    
    // 添加文字标注
    const midPoint = offsetStart.clone().add(offsetEnd).multiplyScalar(0.5);
    createTextLabel(scene, midPoint, text, textColor);
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
    canvas.width = 256;
    canvas.height = 64;
    
    context.font = 'bold 36px Arial';  // 调整字体大小
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width/2, canvas.height/2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(position);
    sprite.scale.set(1.5, 0.4, 1);  // 调整文字大小
    
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
      logarithmicDepthBuffer: true  // 添加对数深度缓冲，提高渲染精度
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // 设置像素比
    renderer.shadowMap.enabled = true;  // 启用阴影
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // 使用柔和阴影
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;  // 设置最小缩放距离
    controls.maxDistance = 20;  // 设置最大缩放距离
    controls.maxPolarAngle = Math.PI / 2;  // 限制相机垂直旋转角度，防止看到地面以下
    controlsRef.current = controls;

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // 添加平行光（模拟太阳光）
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;  // 启用阴影投射
    directionalLight.shadow.mapSize.width = 2048;  // 提高阴影质量
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -15;
    directionalLight.shadow.camera.right = 15;
    directionalLight.shadow.camera.top = 15;
    directionalLight.shadow.camera.bottom = -15;
    scene.add(directionalLight);

    // 添加地面
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -container.externalHeight * 0.001 / 2;  // 将地面放在集装箱底部
    ground.receiveShadow = true;  // 接收阴影
    scene.add(ground);

    // 添加地面网格
    const gridHelper = new THREE.GridHelper(30, 60, 0x888888, 0xcccccc);
    gridHelper.position.y = ground.position.y + 0.001;  // 略微抬高网格，防止z-fighting
    scene.add(gridHelper);

    // 添加坐标轴辅助
    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.y = ground.position.y + 0.001;
    scene.add(axesHelper);

    // 创建集装箱模型
    createContainerModel(scene);

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
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
  useEffect(() => {
    initScene();
    return cleanup;
  }, [container]);

  return (
    <Row gutter={[16, 16]}>
      <Col span={14}>
        <Card title="3D模型展示" bordered={false}>
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
        <Card title="集装箱规格" bordered={false}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="集装箱类型">
              {container.containerType}
            </Descriptions.Item>
            <Descriptions.Item label="外部尺寸">
              {`${container.externalLength} × ${container.externalWidth} × ${container.externalHeight} mm`}
            </Descriptions.Item>
            <Descriptions.Item label="内部尺寸">
              {`${container.internalLength} × ${container.internalWidth} × ${container.internalHeight} mm`}
            </Descriptions.Item>
            <Descriptions.Item label="门尺寸">
              {`${container.doorWidth} × ${container.doorHeight} mm`}
            </Descriptions.Item>
            <Descriptions.Item label="标称体积">
              {`${container.volume} m³`}
            </Descriptions.Item>
            <Descriptions.Item label="最大载重">
              {`${container.maxPayload} kg / ${(container.maxPayload/1000).toFixed(1)} T`}
            </Descriptions.Item>
            <Descriptions.Item label="自重">
              {`${container.tareWeight} kg / ${(container.tareWeight/1000).toFixed(1)} T`}
            </Descriptions.Item>
            <Descriptions.Item label="总重">
              {`${container.maxPayload + container.tareWeight} kg / ${((container.maxPayload + container.tareWeight)/1000).toFixed(1)} T`}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card 
          title="ISO标准" 
          style={{ marginTop: '16px' }} 
          bordered={false}
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="适用标准">
              ISO 668 / 1496 / 6346
            </Descriptions.Item>
            <Descriptions.Item label="角件规格">
              178 × 162 × 118 mm
            </Descriptions.Item>
            {container.containerType.startsWith('20') && (
              <Descriptions.Item label="叉车口规格">
                352 × 115 mm，距端部 2050±50 mm
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );
};

export default BasicInfo; 