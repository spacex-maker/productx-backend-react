// 装箱算法 Worker

// 确保在 Worker 环境中
self.onmessage = function(e) {
  console.log('Worker received message:', e.data);
  
  try {
    const { box, boxPositions, container } = e.data;
    
    // 验证输入数据
    if (!box || !box.carton || !container) {
      throw new Error('缺少必要的输入数据');
    }

    console.log('Processing box:', box);
    console.log('Current positions:', boxPositions);
    console.log('Container:', container);

    // 计算内部尺寸
    const containerDimensions = {
      internalLength: container.length - (container.wallThickness || 100) * 2,
      internalWidth: container.width - (container.wallThickness || 100) * 2,
      internalHeight: container.height - (container.wallThickness || 100) * 2,
      wallThickness: container.wallThickness || 100
    };

    console.log('Container dimensions:', containerDimensions);

    // 计算最佳位置
    const bestPosition = findSimplePosition(box.carton, boxPositions || [], containerDimensions);
    console.log('Calculated position:', bestPosition);

    if (!bestPosition) {
      throw new Error('无法找到合适的放置位置');
    }

    // 验证计算出的位置
    if (!isValidPosition(bestPosition, box.carton, boxPositions || [], containerDimensions)) {
      throw new Error('计算出的位置无效');
    }

    // 发送结果回主线程
    self.postMessage({
      success: true,
      bestPosition,
      boxId: box.id
    });
  } catch (error) {
    console.error('Worker error:', error);
    self.postMessage({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
};

// 检查两个箱子是否重叠
function checkOverlap(box1Pos, box1Dim, box2Pos, box2Dim, gap = 2) {
  // 检查X轴
  const overlapX = Math.abs(box1Pos.x - box2Pos.x) < (box1Dim.length + box2Dim.length)/2 + gap;
  // 检查Y轴
  const overlapY = Math.abs(box1Pos.y - box2Pos.y) < (box1Dim.height + box2Dim.height)/2 + gap;
  // 检查Z轴
  const overlapZ = Math.abs(box1Pos.z - box2Pos.z) < (box1Dim.width + box2Dim.width)/2 + gap;
  
  return overlapX && overlapY && overlapZ;
}

// 查找指定位置下方的支撑高度
function findSupportHeight(x, z, boxDimensions, placedBoxes) {
  let maxY = -Infinity;
  
  for (const placedBox of placedBoxes) {
    // 检查箱子是否在当前位置的正下方
    const dx = Math.abs(x - placedBox.position.x);
    const dz = Math.abs(z - placedBox.position.z);
    
    // 只考虑正下方的箱子
    if (dx < (boxDimensions.length + placedBox.carton.length)/2 &&
        dz < (boxDimensions.width + placedBox.carton.width)/2) {
      const topY = placedBox.position.y + placedBox.carton.height/2;
      maxY = Math.max(maxY, topY);
    }
  }
  
  return maxY;
}

// 检查位置是否有效
function isValidPosition(position, boxDimensions, placedBoxes, containerDimensions) {
  const BOX_GAP = 2;
  const WALL_GAP = 5;

  // 检查是否超出容器边界
  if (position.x - boxDimensions.length/2 < -containerDimensions.internalLength/2 + containerDimensions.wallThickness + WALL_GAP ||
      position.x + boxDimensions.length/2 > containerDimensions.internalLength/2 - containerDimensions.wallThickness - WALL_GAP ||
      position.y - boxDimensions.height/2 < -containerDimensions.internalHeight/2 + containerDimensions.wallThickness + WALL_GAP ||
      position.y + boxDimensions.height/2 > containerDimensions.internalHeight/2 - containerDimensions.wallThickness - WALL_GAP ||
      position.z - boxDimensions.width/2 < -containerDimensions.internalWidth/2 + containerDimensions.wallThickness + WALL_GAP ||
      position.z + boxDimensions.width/2 > containerDimensions.internalWidth/2 - containerDimensions.wallThickness - WALL_GAP) {
    console.log('Position out of bounds:', position);
    return false;
  }

  // 检查与其他箱子的碰撞
  for (const placedBox of placedBoxes) {
    if (checkOverlap(position, boxDimensions, placedBox.position, placedBox.carton, BOX_GAP)) {
      console.log('Overlap detected with:', placedBox);
      return false;
    }
  }

  return true;
}

class SpaceIndex {
  constructor(containerDimensions) {
    this.dimensions = containerDimensions;
    // 使用更大的网格单元来减少内存使用和计算量
    this.resolution = 10; // 10厘米的精度
    this.grid = new Set();
  }

  // 获取网格坐标
  getGridKey(x, y, z) {
    const gridX = Math.floor(x / this.resolution);
    const gridY = Math.floor(y / this.resolution);
    const gridZ = Math.floor(z / this.resolution);
    return `${gridX},${gridY},${gridZ}`;
  }

  // 检查一个点是否被占用
  isOccupied(x, y, z) {
    return this.grid.has(this.getGridKey(x, y, z));
  }

  // 标记一个区域为已占用
  occupySpace(box, position) {
    const startX = Math.floor(position.x - box.length/2);
    const endX = Math.floor(position.x + box.length/2);
    const startY = Math.floor(position.y - box.height/2);
    const endY = Math.floor(position.y + box.height/2);
    const startZ = Math.floor(position.z - box.width/2);
    const endZ = Math.floor(position.z + box.width/2);

    // 只在网格边界点检查
    for (let x = startX; x <= endX; x += this.resolution) {
      for (let y = startY; y <= endY; y += this.resolution) {
        for (let z = startZ; z <= endZ; z += this.resolution) {
          this.grid.add(this.getGridKey(x, y, z));
        }
      }
    }
  }

  // 检查一个区域是否可用
  isSpaceAvailable(box, position, gap = 2) {
    const startX = Math.floor(position.x - box.length/2 - gap);
    const endX = Math.floor(position.x + box.length/2 + gap);
    const startY = Math.floor(position.y - box.height/2 - gap);
    const endY = Math.floor(position.y + box.height/2 + gap);
    const startZ = Math.floor(position.z - box.width/2 - gap);
    const endZ = Math.floor(position.z + box.width/2 + gap);

    // 检查边界
    if (startX < -this.dimensions.internalLength/2 + this.dimensions.wallThickness ||
        endX > this.dimensions.internalLength/2 - this.dimensions.wallThickness ||
        startY < -this.dimensions.internalHeight/2 + this.dimensions.wallThickness ||
        endY > this.dimensions.internalHeight/2 - this.dimensions.wallThickness ||
        startZ < -this.dimensions.internalWidth/2 + this.dimensions.wallThickness ||
        endZ > this.dimensions.internalWidth/2 - this.dimensions.wallThickness) {
      return false;
    }

    // 只在网格边界点检查
    for (let x = startX; x <= endX; x += this.resolution) {
      for (let y = startY; y <= endY; y += this.resolution) {
        for (let z = startZ; z <= endZ; z += this.resolution) {
          if (this.isOccupied(x, y, z)) {
            return false;
          }
        }
      }
    }

    return true;
  }
}

class ExtremePointSet {
  constructor(containerDimensions) {
    this.points = new Set();
    // 从集装箱底部前端开始，使用毫米为单位
    this.addPoint({
      x: 0, // 从0开始，而不是负值
      y: 0,
      z: 0
    });
  }

  addPoint(point) {
    const key = `${Math.round(point.x)},${Math.round(point.y)},${Math.round(point.z)}`;
    this.points.add(key);
  }

  removePoint(point) {
    const key = `${Math.round(point.x)},${Math.round(point.y)},${Math.round(point.z)}`;
    this.points.delete(key);
  }

  getPoints() {
    return Array.from(this.points).map(key => {
      const [x, y, z] = key.split(',').map(Number);
      return {x, y, z};
    });
  }

  // 更新极点集合
  updatePoints(box, position, containerDimensions) {
    // 移除被箱子覆盖的点
    this.getPoints().forEach(point => {
      if (this.isPointCovered(point, box, position)) {
        this.removePoint(point);
      }
    });

    // 添加新的极点
    const newPoints = this.generateNewPoints(box, position, containerDimensions);
    newPoints.forEach(point => this.addPoint(point));
  }

  // 检查点是否被箱子覆盖
  isPointCovered(point, box, position) {
    return point.x >= position.x - box.length/2 && point.x <= position.x + box.length/2 &&
           point.y >= position.y - box.height/2 && point.y <= position.y + box.height/2 &&
           point.z >= position.z - box.width/2 && point.z <= position.z + box.width/2;
  }

  // 生成新的极点
  generateNewPoints(box, position, containerDimensions) {
    const points = [];
    const BOX_GAP = 2;

    // 添加箱子顶部的点
    points.push({
      x: position.x - box.length/2,
      y: position.y + box.height/2 + BOX_GAP,
      z: position.z - box.width/2
    });

    // 添加箱子右侧的点
    points.push({
      x: position.x + box.length/2 + BOX_GAP,
      y: position.y - box.height/2,
      z: position.z - box.width/2
    });

    // 添加箱子前方的点
    points.push({
      x: position.x - box.length/2,
      y: position.y - box.height/2,
      z: position.z + box.width/2 + BOX_GAP
    });

    // 过滤掉超出容器边界的点
    return points.filter(point => 
      point.x <= containerDimensions.internalLength/2 - containerDimensions.wallThickness &&
      point.y <= containerDimensions.internalHeight/2 - containerDimensions.wallThickness &&
      point.z <= containerDimensions.internalWidth/2 - containerDimensions.wallThickness
    );
  }
}

// 简单的位置查找算法
function findSimplePosition(boxDimensions, placedBoxes, containerDimensions) {
  console.log('Finding position for box:', boxDimensions);
  console.log('Placed boxes:', placedBoxes);

  const BOX_GAP = 2;
  const WALL_GAP = 5;

  // 将容器尺寸转换为正值系统
  const containerBounds = {
    length: containerDimensions.internalLength,
    width: containerDimensions.internalWidth,
    height: containerDimensions.internalHeight,
    wallThickness: containerDimensions.wallThickness
  };

  console.log('Container bounds:', containerBounds);

  // 如果是第一个箱子
  if (!placedBoxes || placedBoxes.length === 0) {
    return {
      x: WALL_GAP + boxDimensions.length/2,
      y: WALL_GAP + boxDimensions.height/2,
      z: WALL_GAP + boxDimensions.width/2
    };
  }

  // 初始化极点集合
  const epSet = new ExtremePointSet(containerBounds);
  console.log('Initialized EP set');

  // 更新已放置箱子的极点
  placedBoxes.forEach((box, index) => {
    console.log(`Updating EP set for box ${index}:`, box);
    // 确保所有已放置箱子的坐标都是正值
    const adjustedPosition = {
      x: Math.max(0, box.position.x),
      y: Math.max(0, box.position.y),
      z: Math.max(0, box.position.z)
    };
    epSet.updatePoints(box.carton, adjustedPosition, containerBounds);
  });

  // 获取所有极点
  const points = epSet.getPoints();
  console.log('Available extreme points:', points);

  // 遍历所有极点，找到最佳放置位置
  let bestPosition = null;
  let minZ = Infinity;
  let minY = Infinity;
  let minX = Infinity;

  points.forEach((point, index) => {
    console.log(`Checking point ${index}:`, point);
    
    const position = {
      x: point.x + boxDimensions.length/2,
      y: point.y + boxDimensions.height/2,
      z: point.z + boxDimensions.width/2
    };

    console.log('Trying position:', position);

    // 检查位置是否在容器范围内
    if (position.x + boxDimensions.length/2 <= containerBounds.length - WALL_GAP &&
        position.y + boxDimensions.height/2 <= containerBounds.height - WALL_GAP &&
        position.z + boxDimensions.width/2 <= containerBounds.width - WALL_GAP) {
      
      if (isValidPosition(position, boxDimensions, placedBoxes, containerBounds)) {
        console.log('Position is valid');
        // 选择最靠前、最低、最左的位置
        if (position.z < minZ || 
           (position.z === minZ && position.y < minY) ||
           (position.z === minZ && position.y === minY && position.x < minX)) {
          bestPosition = position;
          minZ = position.z;
          minY = position.y;
          minX = position.x;
          console.log('New best position found:', bestPosition);
        }
      }
    }
  });

  console.log('Final best position:', bestPosition);
  return bestPosition;
}

// 检查位置是否有效
function isValidPosition(position, boxDimensions, placedBoxes, containerBounds) {
  const BOX_GAP = 2;
  const WALL_GAP = 5;

  // 检查是否在容器范围内
  if (position.x - boxDimensions.length/2 < WALL_GAP ||
      position.x + boxDimensions.length/2 > containerBounds.length - WALL_GAP ||
      position.y - boxDimensions.height/2 < WALL_GAP ||
      position.y + boxDimensions.height/2 > containerBounds.height - WALL_GAP ||
      position.z - boxDimensions.width/2 < WALL_GAP ||
      position.z + boxDimensions.width/2 > containerBounds.width - WALL_GAP) {
    console.log('Position out of bounds:', position);
    return false;
  }

  // 检查与其他箱子的碰撞
  for (const placedBox of placedBoxes) {
    if (checkOverlap(position, boxDimensions, placedBox.position, placedBox.carton, BOX_GAP)) {
      console.log('Overlap detected with:', placedBox);
      return false;
    }
  }

  return true;
}

// 找到下一个有效位置
function findNextValidPosition(boxDimensions, placedBoxes, containerDimensions) {
  if (!boxDimensions || !containerDimensions) {
    throw new Error('缺少必要的尺寸信息');
  }

  const BOX_GAP = 2;
  const WALL_GAP = 5;

  // 计算起始位置（从左后下角开始）
  const startX = -containerDimensions.internalLength/2 + containerDimensions.wallThickness + WALL_GAP;
  const startY = -containerDimensions.internalHeight/2 + containerDimensions.wallThickness + WALL_GAP;
  const startZ = -containerDimensions.internalWidth/2 + containerDimensions.wallThickness + WALL_GAP;

  // 计算容器内可用空间范围
  const endX = containerDimensions.internalLength/2 - containerDimensions.wallThickness - WALL_GAP - boxDimensions.length/2;
  const endY = containerDimensions.internalHeight/2 - containerDimensions.wallThickness - WALL_GAP - boxDimensions.height/2;
  const endZ = containerDimensions.internalWidth/2 - containerDimensions.wallThickness - WALL_GAP - boxDimensions.width/2;

  // 如果是第一个箱子
  if (!placedBoxes || placedBoxes.length === 0) {
    return {
      x: startX + boxDimensions.length/2,
      y: startY + boxDimensions.height/2,
      z: startZ + boxDimensions.width/2
    };
  }

  // 创建可能的放置方向
  const orientations = [
    { l: boxDimensions.length, w: boxDimensions.width, h: boxDimensions.height },
    { l: boxDimensions.width, w: boxDimensions.length, h: boxDimensions.height },
    { l: boxDimensions.length, w: boxDimensions.height, h: boxDimensions.width }
  ];

  // 搜索所有可能的位置
  const potentialPositions = [];

  // 从底部开始，逐层搜索
  for (let y = startY; y <= endY; y += BOX_GAP) {
    // 对每一层，从前到后搜索
    for (let z = startZ; z <= endZ; z += BOX_GAP) {
      // 从左到右搜索
      for (let x = startX; x <= endX; x += BOX_GAP) {
        // 尝试每个方向
        for (const orientation of orientations) {
          const position = {
            x: x + orientation.l/2,
            y: y + orientation.h/2,
            z: z + orientation.w/2
          };

          // 检查位置是否有效
          if (isValidPosition(position, orientation, placedBoxes, containerDimensions)) {
            // 计算与其他箱子和墙壁的接触面积
            const score = calculatePositionScore(position, orientation, placedBoxes, containerDimensions);
            potentialPositions.push({ position, score });
          }
        }
      }
    }
  }

  // 如果找到了可用位置，返回得分最高的
  if (potentialPositions.length > 0) {
    potentialPositions.sort((a, b) => b.score - a.score);
    return potentialPositions[0].position;
  }

  return null;
}

// 计算位置得分（优先选择靠近其他箱子和墙壁的位置）
function calculatePositionScore(position, boxDimensions, placedBoxes, containerDimensions) {
  let score = 0;
  const BOX_GAP = 2;

  // 检查与墙壁的接触
  if (Math.abs(position.x - (-containerDimensions.internalLength/2)) <= BOX_GAP) score += 2;
  if (Math.abs(position.x - (containerDimensions.internalLength/2)) <= BOX_GAP) score += 2;
  if (Math.abs(position.z - (-containerDimensions.internalWidth/2)) <= BOX_GAP) score += 2;
  if (Math.abs(position.z - (containerDimensions.internalWidth/2)) <= BOX_GAP) score += 2;
  if (Math.abs(position.y - (-containerDimensions.internalHeight/2)) <= BOX_GAP) score += 3;

  // 检查与其他箱子的接触
  for (const placedBox of placedBoxes) {
    const dx = Math.abs(position.x - placedBox.position.x);
    const dy = Math.abs(position.y - placedBox.position.y);
    const dz = Math.abs(position.z - placedBox.position.z);

    if (dx <= boxDimensions.l/2 + placedBox.carton.length/2 + BOX_GAP) score += 1;
    if (dy <= boxDimensions.h/2 + placedBox.carton.height/2 + BOX_GAP) score += 1;
    if (dz <= boxDimensions.w/2 + placedBox.carton.width/2 + BOX_GAP) score += 1;
  }

  return score;
}

function findBestPositionEP(boxDimensions, placedBoxes, containerDimensions) {
  try {
    const { length: boxLength, width: boxWidth, height: boxHeight } = boxDimensions;
    const { 
      internalLength: containerLength, 
      internalWidth: containerWidth, 
      internalHeight: containerHeight,
      wallThickness 
    } = containerDimensions;

    const WALL_GAP = 5;
    const BOX_GAP = 2;
    const STEP_SIZE = Math.min(BOX_GAP * 2, Math.min(boxLength, boxWidth, boxHeight) / 8);

    // 计算容器的起始点（左后下角）
    const startX = -containerLength/2 + wallThickness + WALL_GAP;
    const startY = -containerHeight/2 + wallThickness + WALL_GAP;
    const startZ = -containerWidth/2 + wallThickness + WALL_GAP;

    // 增加更多的放置方向选项
    const orientations = [
      { l: boxLength, w: boxWidth, h: boxHeight },
      { l: boxWidth, w: boxLength, h: boxHeight },
      { l: boxLength, w: boxHeight, h: boxWidth },
      { l: boxHeight, w: boxLength, h: boxWidth },
      { l: boxWidth, w: boxHeight, h: boxLength },
      { l: boxHeight, w: boxWidth, h: boxLength }
    ];

    // 创建空间索引
    const occupiedSpaces = new Map();
    placedBoxes.forEach(box => {
      const { position: pos, carton } = box;
      for (let x = pos.x - carton.length/2; x <= pos.x + carton.length/2; x += STEP_SIZE) {
        for (let y = pos.y - carton.height/2; y <= pos.y + carton.height/2; y += STEP_SIZE) {
          for (let z = pos.z - carton.width/2; z <= pos.z + carton.width/2; z += STEP_SIZE) {
            const key = `${Math.floor(x/STEP_SIZE)},${Math.floor(y/STEP_SIZE)},${Math.floor(z/STEP_SIZE)}`;
            occupiedSpaces.set(key, box);
          }
        }
      }
    });

    const potentialPoints = [];
    
    // 从底部开始逐层查找
    for (let y = startY; y <= containerHeight/2 - wallThickness - WALL_GAP - boxHeight; y += STEP_SIZE) {
      // 对每一层，从前到后搜索
      for (let z = startZ; z <= containerWidth/2 - wallThickness - WALL_GAP - boxWidth; z += STEP_SIZE) {
        // 从左到右搜索
        for (let x = startX; x <= containerLength/2 - wallThickness - WALL_GAP - boxLength; x += STEP_SIZE) {
          // 尝试每个方向
          for (const orientation of orientations) {
            const position = {
              x: x + orientation.l/2,
              y: y + orientation.h/2,
              z: z + orientation.w/2
            };

            let isValid = true;
            // 检查与已放置箱子的碰撞
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
              // 计算位置得分
              let score = 0;
              
              // 优先选择靠近底部的位置
              score += (containerHeight - position.y) * 2;
              
              // 优先选择靠近其他箱子的位置
              for (const placedBox of placedBoxes) {
                const { position: pos } = placedBox;
                const distance = Math.sqrt(
                  Math.pow(position.x - pos.x, 2) +
                  Math.pow(position.y - pos.y, 2) +
                  Math.pow(position.z - pos.z, 2)
                );
                if (distance < boxLength + boxWidth + boxHeight) {
                  score += 10 / (distance + 1);
                }
              }
              
              // 优先选择靠近墙壁的位置
              if (Math.abs(position.x - startX) < STEP_SIZE) score += 5;
              if (Math.abs(position.z - startZ) < STEP_SIZE) score += 5;
              if (Math.abs(position.y - startY) < STEP_SIZE) score += 5;

              potentialPoints.push({
                position,
                score
              });
            }
          }
        }
      }
    }

    // 如果找到了可用位置，返回得分最高的
    if (potentialPoints.length > 0) {
      potentialPoints.sort((a, b) => b.score - a.score);
      return potentialPoints[0].position;
    }

    // 如果是第一个箱子，返回起始位置
    if (placedBoxes.length === 0) {
      return {
        x: startX + boxLength/2,
        y: startY + boxHeight/2,
        z: startZ + boxWidth/2
      };
    }

    return null;
  } catch (error) {
    console.error('Error in findBestPositionEP:', error);
    throw error;
  }
}

// 添加错误处理
self.onerror = function(error) {
  console.error('Worker global error:', error);
  self.postMessage({ error: error.message });
}; 