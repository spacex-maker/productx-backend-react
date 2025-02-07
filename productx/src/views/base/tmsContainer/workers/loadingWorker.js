// 装箱算法 Worker

// 确保在 Worker 环境中
self.onmessage = function(e) {
  try {
    const { boxes, placedBoxes, currentBoxIndex, container } = e.data;
    console.log('Processing box:', currentBoxIndex, 'Total boxes:', boxes.length);
    
    if (!boxes || !boxes[currentBoxIndex] || !container) {
      throw new Error('输入数据无效');
    }

    const box = boxes[currentBoxIndex];
    
    // 计算容器内部尺寸（毫米）
    const internalDimensions = {
      length: container.length - (container.wallThickness || 0) * 2,
      width: container.width - (container.wallThickness || 0) * 2,
      height: container.height - (container.wallThickness || 0) * 2
    };

    // 定义间距
    const BOX_GAP = 10;  // 箱子间距10mm
    const WALL_GAP = 20; // 墙面间距20mm

    // 容器的左后下角坐标（考虑墙厚和间距）
    const containerStart = {
      x: -internalDimensions.length/2 + WALL_GAP,
      y: -internalDimensions.height/2 + WALL_GAP,
      z: -internalDimensions.width/2 + WALL_GAP
    };

    let bestPosition;

    if (!placedBoxes || placedBoxes.length === 0) {
      // 第一个箱子放在左后下角
      bestPosition = {
        x: containerStart.x + box.carton.length/2,
        y: containerStart.y + box.carton.height/2,
        z: containerStart.z + box.carton.width/2
      };
    } else {
      // 找到所有可能的放置点
      const points = findPlacementPoints(containerStart, placedBoxes, BOX_GAP);
      
      // 对每个点进行评估
      let bestScore = Infinity;
      
      for (const point of points) {
        if (canPlaceBox(point, box.carton, placedBoxes, containerStart, internalDimensions, BOX_GAP, WALL_GAP)) {
          const score = calculateScore(point, containerStart);
          if (score < bestScore) {
            bestScore = score;
            bestPosition = {
              x: point.x + box.carton.length/2,
              y: point.y + box.carton.height/2,
              z: point.z + box.carton.width/2
            };
          }
        }
      }
    }

    if (!bestPosition) {
      throw new Error('找不到合适的放置位置');
    }

    console.log('Found position:', bestPosition);
    self.postMessage({
      success: true,
      bestPosition: bestPosition
    });

  } catch (error) {
    console.error('Worker error:', error);
    self.postMessage({
      success: false,
      error: error.message
    });
  }
};

function findPlacementPoints(containerStart, placedBoxes, gap) {
  const points = new Set();
  
  // 添加容器起始点
  points.add(containerStart);
  
  // 为每个已放置的箱子添加关键点
  placedBoxes.forEach(placedBox => {
    const box = placedBox.carton;
    const pos = placedBox.position;
    
    // 箱子右侧点
    points.add({
      x: pos.x + box.length/2 + gap,
      y: pos.y - box.height/2,
      z: pos.z - box.width/2
    });
    
    // 箱子顶部点
    points.add({
      x: pos.x - box.length/2,
      y: pos.y + box.height/2 + gap,
      z: pos.z - box.width/2
    });
    
    // 箱子前方点
    points.add({
      x: pos.x - box.length/2,
      y: pos.y - box.height/2,
      z: pos.z + box.width/2 + gap
    });
  });
  
  return Array.from(points);
}

function canPlaceBox(point, box, placedBoxes, containerStart, containerDim, boxGap, wallGap) {
  // 检查是否超出容器边界
  if (point.x + box.length > containerStart.x + containerDim.length - wallGap ||
      point.y + box.height > containerStart.y + containerDim.height - wallGap ||
      point.z + box.width > containerStart.z + containerDim.width - wallGap) {
    return false;
  }
  
  // 检查与已放置箱子的碰撞
  for (const placedBox of placedBoxes) {
    if (checkCollision(
      point, box,
      {
        x: placedBox.position.x - placedBox.carton.length/2,
        y: placedBox.position.y - placedBox.carton.height/2,
        z: placedBox.position.z - placedBox.carton.width/2
      },
      placedBox.carton,
      boxGap
    )) {
      return false;
    }
  }
  
  return true;
}

function checkCollision(point1, box1, point2, box2, gap) {
  return !(
    point1.x + box1.length + gap <= point2.x ||
    point1.x >= point2.x + box2.length + gap ||
    point1.y + box1.height + gap <= point2.y ||
    point1.y >= point2.y + box2.height + gap ||
    point1.z + box1.width + gap <= point2.z ||
    point1.z >= point2.z + box2.width + gap
  );
}

function calculateScore(point, containerStart) {
  // 优先选择靠近左后下角的位置
  return Math.sqrt(
    Math.pow(point.x - containerStart.x, 2) +
    Math.pow(point.y - containerStart.y, 2) +
    Math.pow(point.z - containerStart.z, 2)
  );
}

// 在同一层寻找位置
function findPositionInSameLayer(box, lastBox, placedBoxes, container, gap) {
  // 尝试在最后一个箱子右侧放置
  const rightPosition = {
    x: lastBox.position.x + lastBox.carton.length/2 + gap + box.length/2,
    y: lastBox.position.y,
    z: lastBox.position.z
  };

  if (isValidPosition(rightPosition, box, placedBoxes, container, gap)) {
    return rightPosition;
  }

  // 尝试在最后一个箱子前方放置
  const frontPosition = {
    x: lastBox.position.x,
    y: lastBox.position.y,
    z: lastBox.position.z + lastBox.carton.width/2 + gap + box.width/2
  };

  if (isValidPosition(frontPosition, box, placedBoxes, container, gap)) {
    return frontPosition;
  }

  return null;
}

// 在新的一层寻找位置
function findPositionInNewLayer(box, placedBoxes, container, gap) {
  // 找到当前最高的箱子
  const maxHeight = Math.max(...placedBoxes.map(b => 
    b.position.y + b.carton.height/2
  ));

  // 在新的一层的起始位置
  const newLayerPosition = {
    x: container.startX + box.length/2,
    y: maxHeight + gap + box.height/2,
    z: container.startZ + box.width/2
  };

  if (isValidPosition(newLayerPosition, box, placedBoxes, container, gap)) {
    return newLayerPosition;
  }

  return null;
}

// 寻找最佳放置位置
function findBestPosition(box, placedBoxes, containerSpace, gap) {
  const potentialPoints = generatePotentialPoints(placedBoxes, containerSpace, gap);
  let bestPosition = null;
  let bestScore = -Infinity;

  for (const point of potentialPoints) {
    // 尝试六个方向的放置
    const orientations = [
      { l: box.length, w: box.width, h: box.height },
      { l: box.width, w: box.length, h: box.height },
      { l: box.length, w: box.height, h: box.width },
      { l: box.height, w: box.length, h: box.width },
      { l: box.width, w: box.height, h: box.length },
      { l: box.height, w: box.width, h: box.length }
    ];

    for (const orientation of orientations) {
      const position = {
        x: point.x + orientation.l/2,
        y: point.y + orientation.h/2,
        z: point.z + orientation.w/2
      };

      if (isValidPosition(position, orientation, placedBoxes, containerSpace, gap)) {
        const score = evaluatePosition(position, orientation, placedBoxes, containerSpace);
        if (score > bestScore) {
          bestScore = score;
          bestPosition = position;
        }
      }
    }
  }

  return bestPosition;
}

// 生成潜在的放置点
function generatePotentialPoints(placedBoxes, containerSpace, gap) {
  const points = new Set();
  
  // 添加容器左后下角作为初始点
  points.add({
    x: containerSpace.startX,
    y: containerSpace.startY,
    z: containerSpace.startZ
  });

  // 为每个已放置的箱子生成潜在点
  placedBoxes.forEach(placedBox => {
    // 上表面中心点
    points.add({
      x: placedBox.position.x,
      y: placedBox.position.y + placedBox.carton.height/2 + gap,
      z: placedBox.position.z
    });

    // 右侧表面中心点
    points.add({
      x: placedBox.position.x + placedBox.carton.length/2 + gap,
      y: placedBox.position.y,
      z: placedBox.position.z
    });

    // 前表面中心点
    points.add({
      x: placedBox.position.x,
      y: placedBox.position.y,
      z: placedBox.position.z + placedBox.carton.width/2 + gap
    });
  });

  return Array.from(points);
}

// 检查底部支撑是否足够
function hasAdequateSupport(position, boxDimensions, placedBoxes, gap) {
  const SUPPORT_THRESHOLD = 0.7; // 要求70%的底面积有支撑
  let supportedArea = 0;
  const boxArea = boxDimensions.length * boxDimensions.width;

  for (const placedBox of placedBoxes) {
    if (Math.abs((placedBox.position.y + placedBox.carton.height/2) - (position.y - boxDimensions.height/2)) <= gap) {
      const overlapArea = calculateOverlapArea(
        position, boxDimensions,
        placedBox.position, placedBox.carton
      );
      supportedArea += overlapArea;
    }
  }

  return supportedArea >= boxArea * SUPPORT_THRESHOLD;
}

// 计算重叠面积
function calculateOverlapArea(pos1, dim1, pos2, dim2) {
  const xOverlap = Math.max(0,
    Math.min(pos1.x + dim1.length/2, pos2.x + dim2.length/2) -
    Math.max(pos1.x - dim1.length/2, pos2.x - dim2.length/2)
  );

  const zOverlap = Math.max(0,
    Math.min(pos1.z + dim1.width/2, pos2.z + dim2.width/2) -
    Math.max(pos1.z - dim1.width/2, pos2.z - dim2.width/2)
  );

  return xOverlap * zOverlap;
}

// 评估位置得分
function evaluatePosition(position, boxDimensions, placedBoxes, containerSpace) {
  let score = 0;
  
  // 优先选择较低的位置
  score -= position.y * 2;
  
  // 优先靠近已放置的箱子
  placedBoxes.forEach(placedBox => {
    const distance = calculateDistance(position, placedBox.position);
    score -= distance * 0.1;
  });
  
  // 优先靠近容器边缘
  score -= Math.min(
    Math.abs(position.x - containerSpace.startX),
    Math.abs(position.z - containerSpace.startZ)
  ) * 0.5;

  return score;
}

// 计算两点之间的距离
function calculateDistance(pos1, pos2) {
  return Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) +
    Math.pow(pos1.y - pos2.y, 2) +
    Math.pow(pos1.z - pos2.z, 2)
  );
}

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
  const BOX_GAP = 5;  // 增加箱子之间的间距
  const WALL_GAP = 10; // 增加与墙壁的间距

  // 计算当前箱子的边界
  const boxMinX = position.x - boxDimensions.length/2;
  const boxMaxX = position.x + boxDimensions.length/2;
  const boxMinY = position.y - boxDimensions.height/2;
  const boxMaxY = position.y + boxDimensions.height/2;
  const boxMinZ = position.z - boxDimensions.width/2;
  const boxMaxZ = position.z + boxDimensions.width/2;

  // 计算容器的边界（考虑墙壁厚度和间距）
  const containerMinX = -containerDimensions.internalLength/2 + containerDimensions.wallThickness + WALL_GAP;
  const containerMaxX = containerDimensions.internalLength/2 - containerDimensions.wallThickness - WALL_GAP;
  const containerMinY = -containerDimensions.internalHeight/2 + containerDimensions.wallThickness + WALL_GAP;
  const containerMaxY = containerDimensions.internalHeight/2 - containerDimensions.wallThickness - WALL_GAP;
  const containerMinZ = -containerDimensions.internalWidth/2 + containerDimensions.wallThickness + WALL_GAP;
  const containerMaxZ = containerDimensions.internalWidth/2 - containerDimensions.wallThickness - WALL_GAP;

  // 检查是否超出容器边界
  if (boxMinX < containerMinX || boxMaxX > containerMaxX ||
      boxMinY < containerMinY || boxMaxY > containerMaxY ||
      boxMinZ < containerMinZ || boxMaxZ > containerMaxZ) {
    return false;
  }

  // 检查与已放置箱子的碰撞（包括间距）
  for (const placedBox of placedBoxes) {
    const placedMinX = placedBox.position.x - placedBox.carton.length/2;
    const placedMaxX = placedBox.position.x + placedBox.carton.length/2;
    const placedMinY = placedBox.position.y - placedBox.carton.height/2;
    const placedMaxY = placedBox.position.y + placedBox.carton.height/2;
    const placedMinZ = placedBox.position.z - placedBox.carton.width/2;
    const placedMaxZ = placedBox.position.z + placedBox.carton.width/2;

    // 检查是否有重叠（考虑间距）
    if (!(boxMaxX + BOX_GAP <= placedMinX - BOX_GAP || 
          boxMinX - BOX_GAP >= placedMaxX + BOX_GAP ||
          boxMaxY + BOX_GAP <= placedMinY - BOX_GAP || 
          boxMinY - BOX_GAP >= placedMaxY + BOX_GAP ||
          boxMaxZ + BOX_GAP <= placedMinZ - BOX_GAP || 
          boxMinZ - BOX_GAP >= placedMaxZ + BOX_GAP)) {
      return false;
    }
  }

  // 检查底部支撑（除了第一层的箱子）
  if (boxMinY > containerMinY + BOX_GAP) {
    let hasSupport = false;
    for (const placedBox of placedBoxes) {
      const placedMaxY = placedBox.position.y + placedBox.carton.height/2;
      
      // 检查是否有箱子在正下方提供支撑
      if (Math.abs(placedMaxY - boxMinY) <= BOX_GAP) {
        // 检查水平方向的重叠
        const overlapX = !(boxMaxX <= placedBox.position.x - placedBox.carton.length/2 ||
                          boxMinX >= placedBox.position.x + placedBox.carton.length/2);
        const overlapZ = !(boxMaxZ <= placedBox.position.z - placedBox.carton.width/2 ||
                          boxMinZ >= placedBox.position.z + placedBox.carton.width/2);
        
        if (overlapX && overlapZ) {
          hasSupport = true;
          break;
        }
      }
    }
    if (!hasSupport) return false;
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

// 修改简单的位置查找算法
function findSimplePosition(boxDimensions, placedBoxes, containerDimensions) {
  console.log('Finding position for box:', boxDimensions);
  console.log('Placed boxes:', placedBoxes);

  const BOX_GAP = 2;
  const WALL_GAP = 5;

  // 计算容器边界（使用中心点坐标系）
  const containerMinX = -containerDimensions.internalLength/2 + containerDimensions.wallThickness + WALL_GAP;
  const containerMaxX = containerDimensions.internalLength/2 - containerDimensions.wallThickness - WALL_GAP;
  const containerMinY = -containerDimensions.internalHeight/2 + containerDimensions.wallThickness + WALL_GAP;
  const containerMaxY = containerDimensions.internalHeight/2 - containerDimensions.wallThickness - WALL_GAP;
  const containerMinZ = -containerDimensions.internalWidth/2 + containerDimensions.wallThickness + WALL_GAP;
  const containerMaxZ = containerDimensions.internalWidth/2 - containerDimensions.wallThickness - WALL_GAP;

  // 如果是第一个箱子，放在左后下角
  if (!placedBoxes || placedBoxes.length === 0) {
    return {
      x: containerMinX + boxDimensions.length/2,
      y: containerMinY + boxDimensions.height/2,
      z: containerMinZ + boxDimensions.width/2
    };
  }

  // 遍历所有可能的位置
  let bestPosition = null;
  let minY = Infinity;  // 优先选择底部
  let minZ = Infinity;  // 其次选择后部
  let minX = Infinity;  // 最后选择左侧

  // 从底部开始逐层搜索
  for (let y = containerMinY; y <= containerMaxY - boxDimensions.height; y += BOX_GAP) {
    // 从后向前搜索
    for (let z = containerMinZ; z <= containerMaxZ - boxDimensions.width; z += BOX_GAP) {
      // 从左向右搜索
      for (let x = containerMinX; x <= containerMaxX - boxDimensions.length; x += BOX_GAP) {
        const position = {
          x: x + boxDimensions.length/2,
          y: y + boxDimensions.height/2,
          z: z + boxDimensions.width/2
        };

        // 检查位置是否有效
        if (isValidPosition(position, boxDimensions, placedBoxes, containerDimensions)) {
          // 找到最低、最后、最左的有效位置
          if (y < minY || 
             (y === minY && z < minZ) ||
             (y === minY && z === minZ && x < minX)) {
            bestPosition = position;
            minY = y;
            minZ = z;
            minX = x;
          }
        }
      }
    }
  }

  return bestPosition;
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

    if (dx <= boxDimensions.length/2 + placedBox.carton.length/2 + BOX_GAP) score += 1;
    if (dy <= boxDimensions.height/2 + placedBox.carton.height/2 + BOX_GAP) score += 1;
    if (dz <= boxDimensions.width/2 + placedBox.carton.width/2 + BOX_GAP) score += 1;
  }

  return score;
}

// 修改装箱算法，使用改进的极点算法（Extreme Point Algorithm）
function findBestPositionEP(boxDimensions, placedBoxes, containerDimensions) {
  const { length: boxLength, width: boxWidth, height: boxHeight } = boxDimensions;
  const { 
    internalLength: containerLength, 
    internalWidth: containerWidth, 
    internalHeight: containerHeight,
    wallThickness 
  } = containerDimensions;

  const WALL_GAP = 5;
  const BOX_GAP = 2;

  // 计算容器的起始点（左后下角）
  const startX = -containerLength/2 + wallThickness + WALL_GAP;
  const startY = -containerHeight/2 + wallThickness + WALL_GAP;
  const startZ = -containerWidth/2 + wallThickness + WALL_GAP;

  // 增加所有可能的放置方向
  const orientations = [
    { l: boxLength, w: boxWidth, h: boxHeight },
    { l: boxWidth, w: boxLength, h: boxHeight },
    { l: boxLength, w: boxHeight, h: boxWidth },
    { l: boxHeight, w: boxLength, h: boxWidth },
    { l: boxWidth, w: boxHeight, h: boxLength },
    { l: boxHeight, w: boxWidth, h: boxLength }
  ];

  let bestPosition = null;
  let bestScore = -Infinity;

  // 对每个方向尝试放置
  for (const orientation of orientations) {
    // 生成极点集
    const extremePoints = generateExtremePoints(placedBoxes, containerDimensions);
    
    // 对每个极点尝试放置
    for (const point of extremePoints) {
      const position = {
        x: point.x + orientation.l/2,
        y: point.y + orientation.h/2,
        z: point.z + orientation.w/2
      };

      // 验证位置是否有效（包括间距检查）
      if (isValidPosition(position, orientation, placedBoxes, containerDimensions)) {
        // 计算位置得分
        const score = calculatePositionScore(position, orientation, placedBoxes, containerDimensions);
        
        if (score > bestScore) {
          bestScore = score;
          bestPosition = position;
        }
      }
    }
  }

  return bestPosition;
}

// 添加错误处理
self.onerror = function(error) {
  console.error('Worker global error:', error);
  self.postMessage({ error: error.message });
};

// 按层对已放置的箱子进行分组
function groupBoxesByLayers(placedBoxes) {
  const layers = [];
  const tolerance = 5; // 允许的高度误差

  placedBoxes.forEach(box => {
    const boxBottomY = box.position.y - box.carton.height/2;
    
    // 查找box所属的层
    let layerFound = false;
    for (const layer of layers) {
      const layerBottomY = layer[0].position.y - layer[0].carton.height/2;
      
      if (Math.abs(boxBottomY - layerBottomY) <= tolerance) {
        layer.push(box);
        layerFound = true;
        break;
      }
    }
    
    if (!layerFound) {
      layers.push([box]);
    }
  });

  // 按Y坐标排序
  return layers.sort((a, b) => {
    const aY = a[0].position.y - a[0].carton.height/2;
    const bY = b[0].position.y - b[0].carton.height/2;
    return aY - bY;
  });
}

// 计算层的高度
function calculateLayerHeight(layer) {
  if (!layer || layer.length === 0) return 0;
  
  return Math.max(...layer.map(box => 
    box.position.y + box.carton.height/2
  )) - Math.min(...layer.map(box => 
    box.position.y - box.carton.height/2
  ));
}

// 在当前层寻找合适的位置
function findPositionInCurrentLayer(box, currentLayer, bounds, placedBoxes, BOX_GAP) {
  const { startX, startZ, usableLength, usableWidth } = bounds;
  
  if (!currentLayer || currentLayer.length === 0) return null;

  // 获取当前层的Y坐标
  const layerY = currentLayer[0].position.y - currentLayer[0].carton.height/2;
  
  // 在当前层找到最右边的箱子
  const rightmostBox = currentLayer.reduce((rightmost, current) => {
    const currentRight = current.position.x + current.carton.length/2;
    const rightmostRight = rightmost ? rightmost.position.x + rightmost.carton.length/2 : -Infinity;
    return currentRight > rightmostRight ? current : rightmost;
  }, null);

  // 计算新位置
  const newX = rightmostBox.position.x + rightmostBox.carton.length/2 + BOX_GAP + box.carton.length/2;
  
  // 检查是否超出容器边界
  if (newX + box.carton.length/2 > startX + usableLength) {
    // 尝试开始新的一行
    const newRowZ = Math.max(...currentLayer.map(b => b.position.z + b.carton.width/2)) + BOX_GAP;
    
    if (newRowZ + box.carton.width <= startZ + usableWidth) {
      const position = {
        x: startX + box.carton.length/2,
        y: layerY + box.carton.height/2,
        z: newRowZ + box.carton.width/2
      };
      
      // 验证位置是否有效
      if (isValidPosition(position, box.carton, placedBoxes, bounds)) {
        return position;
      }
    }
    return null;
  }

  const position = {
    x: newX,
    y: layerY + box.carton.height/2,
    z: rightmostBox.position.z
  };

  // 验证位置是否有效
  return isValidPosition(position, box.carton, placedBoxes, bounds) ? position : null;
} 