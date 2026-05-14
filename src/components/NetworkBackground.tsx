import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Node3D {
  mesh: THREE.Mesh;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
}

export default function NetworkBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const nodesRef = useRef<Node3D[]>([]);
  const connectionsRef = useRef<THREE.Line[]>([]);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initScene = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width === 0 || height === 0) {
        setTimeout(initScene, 100);
        return;
      }

      try {
        // Scene setup
        const scene = new THREE.Scene();
        scene.background = null; // Transparent background to avoid white flash in light theme
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
        camera.position.set(0, 0, 500);
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const canvas = renderer.domElement;
        canvas.style.cssText =
          "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0.4;z-index:0;outline:none;";
        container.appendChild(canvas);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x0ea5e9, 0.5, 1000);
        pointLight1.position.set(200, 200, 200);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x22c55e, 0.35, 1000);
        pointLight2.position.set(-200, -200, 200);
        scene.add(pointLight2);

        // Create 3D network nodes
        const nodeCount = 80;
        const nodes: Node3D[] = [];
        const nodeGeometry = new THREE.SphereGeometry(3, 16, 16);
        const nodeMaterial = new THREE.MeshStandardMaterial({
          color: 0x0ea5e9,
          emissive: 0x0284c7,
          emissiveIntensity: 0.4,
          metalness: 0.5,
          roughness: 0.3,
        });

        for (let i = 0; i < nodeCount; i++) {
          const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
          const x = (Math.random() - 0.5) * 1000;
          const y = (Math.random() - 0.5) * 1000;
          const z = (Math.random() - 0.5) * 1000;
          node.position.set(x, y, z);

          nodes.push({
            mesh: node,
            position: new THREE.Vector3(x, y, z),
            velocity: new THREE.Vector3(
              (Math.random() - 0.5) * 0.5,
              (Math.random() - 0.5) * 0.5,
              (Math.random() - 0.5) * 0.5
            ),
          });
          scene.add(node);
        }
        nodesRef.current = nodes;

        // Create connection lines
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x0ea5e9,
          transparent: true,
          opacity: 0.18,
        });
        const connections: THREE.Line[] = [];
        const maxConnectionDistance = 150;

        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const distance = nodes[i].position.distanceTo(nodes[j].position);
            if (distance < maxConnectionDistance && Math.random() > 0.7) {
              const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                nodes[i].position,
                nodes[j].position,
              ]);
              const line = new THREE.Line(lineGeometry, lineMaterial);
              scene.add(line);
              connections.push(line);
            }
          }
        }
        connectionsRef.current = connections;

        // Add subtle particles in background
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        const particlesPositions = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
          particlesPositions[i] = (Math.random() - 0.5) * 2000;
        }
        particlesGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(particlesPositions, 3)
        );
        const particles = new THREE.Points(
          particlesGeometry,
          new THREE.PointsMaterial({
            color: 0x38bdf8,
            size: 0.45,
            transparent: true,
            opacity: 0.28,
          })
        );
        scene.add(particles);

        // Animation loop
        const animate = () => {
          animationFrameRef.current = requestAnimationFrame(animate);

          const elapsed = (Date.now() - startTimeRef.current) / 1000;

          // Update node positions with smooth floating motion
          nodesRef.current.forEach((node) => {
            // Update position
            node.position.add(node.velocity);

            // Boundary check and bounce
            const boundary = 500;
            if (Math.abs(node.position.x) > boundary) node.velocity.x *= -1;
            if (Math.abs(node.position.y) > boundary) node.velocity.y *= -1;
            if (Math.abs(node.position.z) > boundary) node.velocity.z *= -1;

            // Keep within bounds
            node.position.x = Math.max(-boundary, Math.min(boundary, node.position.x));
            node.position.y = Math.max(-boundary, Math.min(boundary, node.position.y));
            node.position.z = Math.max(-boundary, Math.min(boundary, node.position.z));

            // Update mesh position
            node.mesh.position.copy(node.position);

            // Subtle rotation
            node.mesh.rotation.x += 0.01;
            node.mesh.rotation.y += 0.015;
          });

          // Update connection lines dynamically
          let connectionIndex = 0;
          const maxDist = maxConnectionDistance;
          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const distance = nodes[i].position.distanceTo(nodes[j].position);
              if (distance < maxDist && connectionIndex < connections.length) {
                if (connections[connectionIndex]) {
                  connections[connectionIndex].geometry.setFromPoints([
                    nodes[i].position,
                    nodes[j].position,
                  ]);
                  const opacity = (1 - distance / maxDist) * 0.22;
                  if (connections[connectionIndex].material && "opacity" in connections[connectionIndex].material) {
                    (connections[connectionIndex].material as THREE.LineBasicMaterial).opacity = opacity;
                  }
                  connectionIndex++;
                }
              }
            }
          }

          // Rotate camera slightly for dynamic view
          camera.position.x = Math.sin(elapsed * 0.1) * 50;
          camera.position.y = Math.cos(elapsed * 0.15) * 30;
          camera.lookAt(0, 0, 0);

          // Rotate particles
          particles.rotation.y += 0.0005;

          renderer.render(scene, camera);
        };

        animate();

        // Handle window resize
        const handleResize = () => {
          if (!camera || !renderer) return;
          const newWidth = window.innerWidth;
          const newHeight = window.innerHeight;

          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
          window.removeEventListener("resize", handleResize);

          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }

          if (renderer) {
            renderer.dispose();
            if (container && canvas && container.contains(canvas)) {
              container.removeChild(canvas);
            }
          }

          // Dispose geometries and materials
          nodeGeometry.dispose();
          nodeMaterial.dispose();
          lineMaterial.dispose();
          particlesGeometry.dispose();
        };
      } catch (error) {
        console.error("Error initializing NetworkBackground 3D scene:", error);
      }
    };

    const timeoutId = setTimeout(initScene, 50);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none" />;
}
