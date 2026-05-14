import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroNetworkModel() {
  const modelContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = modelContainerRef.current;
    if (!container) return;

    let frameId = 0;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x0ea5e9, 1.05, 100);
    keyLight.position.set(6, 4, 10);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x22c55e, 0.65, 100);
    fillLight.position.set(-6, -4, 6);
    scene.add(fillLight);

    const globeGeometry = new THREE.SphereGeometry(3.4, 48, 48);
    const globeMaterial = new THREE.MeshStandardMaterial({
      color: 0x0b1220,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.22,
      metalness: 0.5,
      roughness: 0.4,
      transparent: true,
      opacity: 0.9,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);

    const wireGeometry = new THREE.WireframeGeometry(
      new THREE.SphereGeometry(3.55, 24, 24)
    );
    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    });
    const wireGlobe = new THREE.LineSegments(wireGeometry, wireMaterial);

    const nodeGeometry = new THREE.SphereGeometry(0.16, 16, 16);
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 0.45,
      metalness: 0.55,
      roughness: 0.35,
    });
    const linkMaterial = new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.35,
    });

    const nodeGroup = new THREE.Group();
    const linkGroup = new THREE.Group();
    const modelGroup = new THREE.Group();
    modelGroup.scale.setScalar(1.05);
    scene.add(modelGroup);
    modelGroup.add(globe);
    modelGroup.add(wireGlobe);
    modelGroup.add(linkGroup);
    modelGroup.add(nodeGroup);

    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < 26; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 26);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 3.65;
      const pos = new THREE.Vector3(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi)
      );
      nodes.push(pos);

      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.copy(pos);
      nodeGroup.add(node);
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 2.4) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            nodes[i],
            nodes[j],
          ]);
          const line = new THREE.Line(lineGeometry, linkMaterial);
          linkGroup.add(line);
        }
      }
    }

    const ringGroup = new THREE.Group();
    modelGroup.add(ringGroup);
    [4.4, 5].forEach((radius, i) => {
      const ringGeometry = new THREE.TorusGeometry(radius, 0.035, 10, 180);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: i === 0 ? 0x0ea5e9 : 0x22c55e,
        transparent: true,
        opacity: 0.35,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = i === 0 ? Math.PI / 2.8 : Math.PI / 1.9;
      ring.rotation.y = i === 0 ? Math.PI / 6 : Math.PI / 3.8;
      ringGroup.add(ring);
    });

    const onResize = () => {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };

    onResize();
    window.addEventListener("resize", onResize);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      globe.rotation.y = t * 0.22;
      globe.rotation.x = Math.sin(t * 0.25) * 0.08;
      wireGlobe.rotation.y = -t * 0.16;
      nodeGroup.rotation.y = t * 0.28;
      linkGroup.rotation.y = t * 0.28;
      ringGroup.rotation.y = -t * 0.16;

      camera.position.x = Math.sin(t * 0.2) * 0.28;
      camera.position.y = Math.cos(t * 0.14) * 0.2;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameId);
      globeGeometry.dispose();
      globeMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      linkMaterial.dispose();
      ringGroup.children.forEach((child) => {
        const ringMesh = child as THREE.Mesh;
        ringMesh.geometry.dispose();
        (ringMesh.material as THREE.Material).dispose();
      });
      linkGroup.children.forEach((child) => {
        const line = child as THREE.Line;
        line.geometry.dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={modelContainerRef} className="w-full h-full" />;
}
