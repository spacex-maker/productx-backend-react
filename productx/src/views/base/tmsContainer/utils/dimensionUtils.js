import * as THREE from 'three';

// 创建尺寸标注线
export const createDimensionLine = (scene, start, end, text, textColor, material, offset = 0.2) => {
  const isHeight = start.y !== end.y;
  
  // 添加刻度线函数
  const addTicks = (startPoint, endPoint, material, tickCount = 10) => {
    const direction = endPoint.clone().sub(startPoint);
    const length = direction.length();
    const tickLength = 0.1;
    const normalizedDir = direction.clone().normalize();
    
    const up = new THREE.Vector3(0, 1, 0);
    const tickDir = isHeight ? 
      new THREE.Vector3(1, 0, 1).normalize() : 
      normalizedDir.clone().cross(up).normalize();

    for (let i = 0; i <= tickCount; i++) {
      const ratio = i / tickCount;
      const position = startPoint.clone().add(direction.clone().multiplyScalar(ratio));
      
      const tickStart = position.clone();
      const tickEnd = position.clone().add(tickDir.clone().multiplyScalar(tickLength));
      
      const tickGeometry = new THREE.BufferGeometry().setFromPoints([tickStart, tickEnd]);
      const tick = new THREE.Line(tickGeometry, material);
      scene.add(tick);

      if (i % 2 === 0) {
        const value = Math.round(length * ratio * 1000);
        createSmallLabel(scene, 
          tickEnd.clone().add(tickDir.clone().multiplyScalar(0.1)), 
          `${value}`, 
          textColor,
          0.3
        );
      }
    }
  };

  if (isHeight) {
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

    const mainLine = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(start.x + offset, start.y, start.z + offset),
      new THREE.Vector3(end.x + offset, end.y, end.z + offset)
    ]);
    const line = new THREE.Line(mainLine, material);
    scene.add(line);

    createArrow(scene, 
      new THREE.Vector3(start.x + offset, start.y, start.z + offset),
      new THREE.Vector3(0, -1, 0),
      0.08, Math.PI / 6, material);
    createArrow(scene, 
      new THREE.Vector3(end.x + offset, end.y, end.z + offset),
      new THREE.Vector3(0, 1, 0),
      0.08, Math.PI / 6, material);

    const midPoint = new THREE.Vector3(
      start.x + offset,
      (start.y + end.y) / 2,
      start.z + offset
    );
    createTextLabel(scene, midPoint, text, textColor);

    addTicks(
      new THREE.Vector3(start.x + offset, start.y, start.z + offset),
      new THREE.Vector3(end.x + offset, end.y, end.z + offset),
      material
    );
  } else {
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

    addTicks(offsetStart, offsetEnd, material);
  }
};

// 创建箭头
export const createArrow = (scene, position, direction, length, angle, material) => {
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

// 创建文本标签
export const createTextLabel = (scene, position, text, color) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 128;
  
  context.fillStyle = 'rgba(10, 25, 47, 0.85)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  context.strokeStyle = color;
  context.lineWidth = 2;
  context.strokeRect(2, 2, canvas.width-4, canvas.height-4);
  
  context.font = 'bold 64px Arial';
  context.fillStyle = '#ffffff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.shadowColor = color;
  context.shadowBlur = 10;
  
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
  sprite.scale.set(1, 0.25, 1);
  
  scene.add(sprite);
};

// 创建小标签
export const createSmallLabel = (scene, position, text, color, scale = 0.3) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 64;
  
  context.fillStyle = 'rgba(10, 25, 47, 0.85)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  context.font = 'bold 32px Arial';
  context.fillStyle = '#ffffff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  
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
  sprite.scale.set(scale, scale * 0.25, scale);
  
  scene.add(sprite);
  return sprite;
}; 