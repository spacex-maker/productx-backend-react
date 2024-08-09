// ThreeScene.js
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const ThreeScene = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return // 如果 mountRef.current 为 null，则无需继续执行

    // 场景、相机和渲染器
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    // 创建一个立方体
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    // 设置相机位置
    camera.position.z = 5

    // 初始化 OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)

    // 渲染循环
    const animate = () => {
      requestAnimationFrame(animate)

      // // 旋转立方体（可选）
      // cube.rotation.x += 0.01
      // cube.rotation.y += 0.01

      // 更新 OrbitControls
      controls.update()

      renderer.render(scene, camera)
    }

    animate()

    // 处理窗口大小变化
    const handleResize = () => {
      if (!mountRef.current) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // 清理函数
    return () => {
      if (!mountRef.current) return
      window.removeEventListener('resize', handleResize)
      mountRef.current.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} />
}

export default ThreeScene
