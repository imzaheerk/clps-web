import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components";
import * as THREE from "three";

export default function FinalCtaSection() {
  const navigate = useNavigate();
  const modelContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = modelContainerRef.current;
    if (!container) return;

    let frameId = 0;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    const lightA = new THREE.PointLight(0x0ea5e9, 1.1, 100);
    lightA.position.set(7, 5, 9);
    scene.add(lightA);

    const lightB = new THREE.PointLight(0x22c55e, 0.9, 100);
    lightB.position.set(-8, -4, 8);
    scene.add(lightB);

    // Different style: floating "city/network" bars with orbital rings.
    const group = new THREE.Group();
    scene.add(group);

    const barGeometry = new THREE.CylinderGeometry(0.18, 0.18, 1, 12);
    const barMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      roughness: 0.35,
      metalness: 0.6,
    });

    const bars: THREE.Mesh[] = [];
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const radius = 2.5 + (i % 3) * 0.8;
      const bar = new THREE.Mesh(barGeometry, barMaterial);
      bar.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      bar.scale.y = 0.7 + (i % 5) * 0.35;
      bars.push(bar);
      group.add(bar);
    }

    const ringGroup = new THREE.Group();
    scene.add(ringGroup);
    [3.8, 5.2, 6.4].forEach((r, i) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.03, 10, 180),
        new THREE.MeshBasicMaterial({
          color: i === 1 ? 0x34d399 : 0x0ea5e9,
          transparent: true,
          opacity: 0.35,
        })
      );
      ring.rotation.x = i === 0 ? Math.PI / 2.4 : Math.PI / 1.8;
      ring.rotation.y = i === 2 ? Math.PI / 4 : Math.PI / 8;
      ringGroup.add(ring);
    });

    const connectionMaterial = new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.3,
    });
    const connections: THREE.Line[] = [];
    for (let i = 0; i < bars.length; i += 2) {
      const a = bars[i].position;
      const b = bars[(i + 5) % bars.length].position;
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([a, b]),
        connectionMaterial
      );
      group.add(line);
      connections.push(line);
    }

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

      group.rotation.z = t * 0.12;
      group.rotation.y = t * 0.18;
      ringGroup.rotation.z = -t * 0.14;
      ringGroup.rotation.x = t * 0.08;

      bars.forEach((bar, index) => {
        bar.scale.y = 0.9 + Math.sin(t * 2 + index * 0.4) * 0.35;
      });

      camera.position.x = Math.sin(t * 0.3) * 0.7;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameId);
      barGeometry.dispose();
      barMaterial.dispose();
      connectionMaterial.dispose();
      connections.forEach((line) => line.geometry.dispose());
      ringGroup.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="relative py-10 sm:py-12 lg:py-14">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-primary/15 via-cyan-500/10 to-emerald-500/10 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-2xl">
          <div ref={modelContainerRef} className="absolute inset-0 opacity-70 pointer-events-none" />
          <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-44 h-44 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
              Ready to Build Real Local Connections?
            </h2>
            <p className="text-text-secondary text-base sm:text-lg mb-6">
              Join Checknown to discover nearby people, share important updates, and
              grow your trusted local network.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                label="Create Free Account"
                icon="pi pi-user-plus"
                onClick={() => navigate("/signup")}
                variant="gradient"
                Size="large"
              />
              <Button
                label="Explore Features"
                icon="pi pi-compass"
                onClick={() => navigate("/login")}
                variant="outlined"
                Size="large"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
