import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, Sparkles, Eye } from 'lucide-react';

interface ThreeDessertViewerProps {
  customToppings?: string[];
  creamType?: string;
  containerType?: string;
  autoRotateSpeed?: number;
  interactive?: boolean;
}

export const ThreeDessertViewer: React.FC<ThreeDessertViewerProps> = ({
  customToppings = ['Chocolate Belga', 'Almendras Tostadas'],
  creamType = 'Crema Batida Tradicional',
  containerType = 'Copa Cristal Royale',
  autoRotateSpeed = 0.008,
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const dessertGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 420;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.5, 7.5);
    camera.lookAt(0, 0.8, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe11d48, 1.5);
    rimLight.position.set(-6, 4, -4);
    scene.add(rimLight);

    const warmFill = new THREE.PointLight(0xffd1b3, 1.0, 10);
    warmFill.position.set(0, 2, 3);
    scene.add(warmFill);

    // Dessert Master Group
    const dessertGroup = new THREE.Group();
    scene.add(dessertGroup);
    dessertGroupRef.current = dessertGroup;

    // 1. Crystal Coupe / Porcelain Bowl
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.5,
      thickness: 0.5,
      specularIntensity: 1.0,
    });

    // Coupe Bowl
    const bowlGeo = new THREE.SphereGeometry(2.2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const bowl = new THREE.Mesh(bowlGeo, glassMaterial);
    bowl.rotation.x = Math.PI;
    bowl.position.y = 1.5;
    dessertGroup.add(bowl);

    // Stem and Base
    const stemGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.6, 24);
    const stem = new THREE.Mesh(stemGeo, glassMaterial);
    stem.position.y = 0.5;
    dessertGroup.add(stem);

    const baseGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.15, 32);
    const base = new THREE.Mesh(baseGeo, glassMaterial);
    base.position.y = -0.3;
    dessertGroup.add(base);

    // Gold Rim detail
    const rimTorus = new THREE.TorusGeometry(2.2, 0.04, 16, 64);
    const goldRimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.2,
    });
    const rimMesh = new THREE.Mesh(rimTorus, goldRimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 1.5;
    dessertGroup.add(rimMesh);

    // 2. Artisanal Velvety Cream Base
    const creamColor = creamType.toLowerCase().includes('mascarpone') 
      ? 0xfef9e7 
      : creamType.toLowerCase().includes('sin azúcar') 
      ? 0xf8fafc 
      : 0xfffbee;

    const creamMat = new THREE.MeshStandardMaterial({
      color: creamColor,
      roughness: 0.45,
      metalness: 0.05,
    });

    // Swirls of whipped cream
    const creamBase = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.4),
      creamMat
    );
    creamBase.rotation.x = Math.PI;
    creamBase.position.y = 1.4;
    dessertGroup.add(creamBase);

    // Cream rosettes on top
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const radius = 1.1;
      const rosette = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.48, 2),
        creamMat
      );
      rosette.position.set(
        Math.cos(angle) * radius,
        1.55 + Math.sin(i) * 0.08,
        Math.sin(angle) * radius
      );
      rosette.scale.set(1, 0.85, 1);
      dessertGroup.add(rosette);
    }

    // Central majestic cream swirl
    const centerRosette = new THREE.Mesh(
      new THREE.ConeGeometry(0.7, 1.1, 16),
      creamMat
    );
    centerRosette.position.set(0, 1.9, 0);
    dessertGroup.add(centerRosette);

    // 3. Ripe Juicy Strawberries
    const createStrawberry = (x: number, y: number, z: number, scale = 1, rotY = 0, rotZ = 0) => {
      const berryGroup = new THREE.Group();

      // Strawberry body
      const berryMat = new THREE.MeshPhysicalMaterial({
        color: 0xbe123c, // Rich strawberry ruby red
        roughness: 0.28,
        metalness: 0.12,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
      });

      // Parametric strawberry-like mesh using cone with rounded tip
      const bodyGeo = new THREE.ConeGeometry(0.5, 1.0, 24);
      const body = new THREE.Mesh(bodyGeo, berryMat);
      body.rotation.x = Math.PI;
      berryGroup.add(body);

      // Strawberry Top cap
      const capGeo = new THREE.SphereGeometry(0.5, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
      const cap = new THREE.Mesh(capGeo, berryMat);
      cap.position.y = 0.5;
      berryGroup.add(cap);

      // Green Leaves / Calyx
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x15803d,
        roughness: 0.6,
      });

      for (let l = 0; l < 5; l++) {
        const leafAngle = (l / 5) * Math.PI * 2;
        const leafGeo = new THREE.ConeGeometry(0.16, 0.45, 8);
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.set(Math.cos(leafAngle) * 0.25, 0.52, Math.sin(leafAngle) * 0.25);
        leaf.rotation.z = Math.cos(leafAngle) * 0.6;
        leaf.rotation.x = Math.sin(leafAngle) * 0.6;
        berryGroup.add(leaf);
      }

      // Small stem
      const stemMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.05, 0.35, 8),
        leafMat
      );
      stemMesh.position.set(0, 0.7, 0);
      berryGroup.add(stemMesh);

      berryGroup.position.set(x, y, z);
      berryGroup.scale.set(scale, scale, scale);
      berryGroup.rotation.y = rotY;
      berryGroup.rotation.z = rotZ;

      return berryGroup;
    };

    // Place 5 succulent strawberries around the cream
    dessertGroup.add(createStrawberry(0.65, 1.8, 0.55, 0.85, 0.3, 0.2));
    dessertGroup.add(createStrawberry(-0.7, 1.75, 0.4, 0.9, 1.2, -0.25));
    dessertGroup.add(createStrawberry(0.1, 2.1, -0.6, 0.8, -0.5, 0.15));
    dessertGroup.add(createStrawberry(-0.55, 1.9, -0.5, 0.75, 2.1, -0.2));
    dessertGroup.add(createStrawberry(0.75, 1.65, -0.3, 0.8, 0.8, 0.3));

    // Top crown strawberry
    dessertGroup.add(createStrawberry(0, 2.45, 0.1, 0.95, 0.5, 0.08));

    // 4. Gourmet Toppings (Chocolate ribbons, Gold flakes, Almonds)
    const chocMat = new THREE.MeshStandardMaterial({
      color: 0x22110c, // Deep Belgian Dark Chocolate
      roughness: 0.3,
      metalness: 0.1,
    });

    // Drizzled chocolate ribbon
    const curvePoints = [
      new THREE.Vector3(-0.9, 2.2, 0.4),
      new THREE.Vector3(-0.3, 2.4, 0.6),
      new THREE.Vector3(0.4, 2.3, 0.2),
      new THREE.Vector3(0.8, 2.0, -0.4),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.065, 8, false);
    const chocolateDrizzle = new THREE.Mesh(tubeGeo, chocMat);
    dessertGroup.add(chocolateDrizzle);

    // Second chocolate ribbon
    const curvePoints2 = [
      new THREE.Vector3(0.8, 2.3, 0.3),
      new THREE.Vector3(0.1, 2.5, -0.2),
      new THREE.Vector3(-0.6, 2.1, -0.5),
    ];
    const curve2 = new THREE.CatmullRomCurve3(curvePoints2);
    const tubeGeo2 = new THREE.TubeGeometry(curve2, 32, 0.055, 8, false);
    const chocolateDrizzle2 = new THREE.Mesh(tubeGeo2, chocMat);
    dessertGroup.add(chocolateDrizzle2);

    // 24K Gold Leaf Flakes
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x332200,
    });

    for (let g = 0; g < 16; g++) {
      const flake = new THREE.Mesh(
        new THREE.PlaneGeometry(0.09, 0.09),
        goldMat
      );
      flake.position.set(
        (Math.random() - 0.5) * 1.6,
        1.7 + Math.random() * 0.9,
        (Math.random() - 0.5) * 1.6
      );
      flake.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      dessertGroup.add(flake);
    }

    // Toasted Sliced Almonds
    const almondMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      roughness: 0.7,
    });
    for (let a = 0; a < 8; a++) {
      const almond = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.035, 0.14),
        almondMat
      );
      almond.position.set(
        (Math.random() - 0.5) * 1.4,
        1.6 + Math.random() * 0.7,
        (Math.random() - 0.5) * 1.4
      );
      almond.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      dessertGroup.add(almond);
    }

    // Mouse & Touch Orbit Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !interactive) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      dessertGroup.rotation.y += deltaX * 0.008;
      dessertGroup.rotation.x = Math.max(-0.4, Math.min(0.6, dessertGroup.rotation.x + deltaY * 0.006));

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    container.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotating && !isDragging) {
        dessertGroup.rotation.y += autoRotateSpeed;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      renderer.dispose();
    };
  }, [creamType, containerType, autoRotateSpeed, interactive]);

  const toggleRotation = () => {
    setIsRotating(prev => !prev);
  };

  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    const newZoom = Math.max(0.7, Math.min(1.5, zoomLevel + delta));
    setZoomLevel(newZoom);
    cameraRef.current.position.z = 7.5 / newZoom;
    cameraRef.current.position.y = 3.5 / newZoom;
    cameraRef.current.updateProjectionMatrix();
  };

  const resetView = () => {
    if (dessertGroupRef.current && cameraRef.current) {
      dessertGroupRef.current.rotation.set(0, 0, 0);
      cameraRef.current.position.set(0, 3.5, 7.5);
      cameraRef.current.updateProjectionMatrix();
      setZoomLevel(1);
      setIsRotating(true);
    }
  };

  return (
    <div className="relative w-full h-[400px] md:h-[480px] rounded-2xl overflow-hidden bg-gradient-to-b from-stone-900/90 via-stone-950 to-stone-950 border border-stone-800/80 shadow-2xl flex items-center justify-center select-none">
      {/* 3D Canvas Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D HUD controls */}
      <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-medium text-stone-300 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-800">
        <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
        <span>Render 3D Interactivo · Sweet Berry</span>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-stone-900/85 backdrop-blur-md p-1.5 rounded-xl border border-stone-800 shadow-lg">
        <button
          onClick={toggleRotation}
          className={`p-2 rounded-lg text-xs font-medium transition-colors ${
            isRotating ? 'bg-rose-500/20 text-rose-300' : 'text-stone-400 hover:text-stone-200'
          }`}
          title={isRotating ? 'Pausar rotación' : 'Reanudar rotación'}
        >
          <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
        </button>
        <button
          onClick={() => handleZoom(0.15)}
          className="p-2 rounded-lg text-stone-400 hover:text-stone-200 transition-colors"
          title="Acercar"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          className="p-2 rounded-lg text-stone-400 hover:text-stone-200 transition-colors"
          title="Restablecer vista"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Hint prompt */}
      <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2 text-[11px] text-stone-400 pointer-events-none">
        <span>Arrastra para rotar 360° · Modelo en tiempo real</span>
      </div>
    </div>
  );
};
