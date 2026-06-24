import { useEffect, useRef } from "react";
import * as THREE from "three";

const NODE_COUNT = 10;
const ORANGE = 0xff6000;
const CYAN = 0x22d3ee;
const VIOLET = 0xa855f7;

/**
 * Abstract orbital network for the final CTA — glowing nodes, arcs, and a pulsing core.
 */
export default function FinalCtaNetworkModel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frameId = 0;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.35, 4.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const root = new THREE.Group();
    scene.add(root);

    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    const key = new THREE.PointLight(0xffffff, 0.9, 20);
    key.position.set(2, 3, 4);
    scene.add(key);

    const accent = new THREE.PointLight(ORANGE, 0.65, 16);
    accent.position.set(-2, -1, 3);
    scene.add(accent);

    const coreGeo = new THREE.IcosahedronGeometry(0.32, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xff8a3d,
      emissive: new THREE.Color(ORANGE),
      emissiveIntensity: 1.2,
      metalness: 0.35,
      roughness: 0.25,
      transparent: true,
      opacity: 0.95,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    root.add(core);

    const coreGlowGeo = new THREE.SphereGeometry(0.52, 24, 24);
    const coreGlowMat = new THREE.MeshBasicMaterial({
      color: ORANGE,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    root.add(new THREE.Mesh(coreGlowGeo, coreGlowMat));

    const ringGeo = new THREE.TorusGeometry(1.35, 0.012, 8, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: CYAN,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ringA = new THREE.Mesh(ringGeo, ringMat);
    ringA.rotation.x = Math.PI / 2.4;
    root.add(ringA);

    const ringBGeo = ringGeo.clone();
    const ringBMat = ringMat.clone();
    const ringBMesh = new THREE.Mesh(ringBGeo, ringBMat);
    ringBMesh.rotation.x = Math.PI / 3.2;
    ringBMesh.rotation.z = Math.PI / 5;
    root.add(ringBMesh);

    const nodeMeshes: THREE.Mesh[] = [];
    const haloMeshes: THREE.Mesh[] = [];
    const nodeBase: THREE.Vector3[] = [];
    const nodeColors = [CYAN, ORANGE, VIOLET, 0x34d399, 0xf472b6];

    for (let i = 0; i < NODE_COUNT; i += 1) {
      const angle = (i / NODE_COUNT) * Math.PI * 2;
      const radius = 1.28 + (i % 3) * 0.08;
      const y = Math.sin(angle * 2.1) * 0.35;
      const pos = new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      nodeBase.push(pos);

      const color = nodeColors[i % nodeColors.length];
      const geo = new THREE.SphereGeometry(0.07 + (i % 2) * 0.02, 16, 16);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: new THREE.Color(color),
        emissiveIntensity: 1.1,
        metalness: 0.2,
        roughness: 0.15,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      root.add(mesh);
      nodeMeshes.push(mesh);

      const haloGeo = new THREE.SphereGeometry(0.14, 12, 12);
      const haloMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(pos);
      root.add(halo);
      haloMeshes.push(halo);
    }

    const linkGeometries: THREE.BufferGeometry[] = [];
    const linkLines: THREE.Line[] = [];
    const segments = 24;
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    );

    const pairs: [number, number][] = [];
    for (let i = 0; i < NODE_COUNT; i += 1) {
      pairs.push([i, (i + 1) % NODE_COUNT]);
      if (i % 2 === 0) pairs.push([i, (i + 4) % NODE_COUNT]);
    }

    pairs.forEach((_, idx) => {
      const pos = new Float32Array((segments + 1) * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const color = idx % 3 === 0 ? CYAN : idx % 3 === 1 ? ORANGE : VIOLET;
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      line.frustumCulled = false;
      root.add(line);
      linkGeometries.push(geo);
      linkLines.push(line);
    });

    const particleCount = 120;
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const r = 1.6 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
      particlePos[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({
        color: CYAN,
        size: 0.028,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    root.add(particles);

    const resize = () => {
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vMid = new THREE.Vector3();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      if (!reducedMotion) {
        root.rotation.y = t * 0.22;
        ringA.rotation.z = t * 0.15;
        ringBMesh.rotation.y = -t * 0.12;
        particles.rotation.y = t * 0.05;
        core.rotation.x = t * 0.35;
        core.rotation.y = t * 0.5;
        coreMat.emissiveIntensity = 1 + Math.sin(t * 2.2) * 0.25;
      }

      nodeMeshes.forEach((mesh, i) => {
        const base = nodeBase[i];
        const pulse = reducedMotion ? 0 : Math.sin(t * 2 + i * 0.5) * 0.04;
        mesh.position.set(base.x, base.y + pulse, base.z);
        haloMeshes[i]?.position.copy(mesh.position);
      });

      pairs.forEach(([ia, ib], idx) => {
        if (idx >= linkLines.length) return;
        vA.copy(nodeMeshes[ia].position);
        vB.copy(nodeMeshes[ib].position);
        vMid.copy(vA).lerp(vB, 0.5);
        vMid.y += 0.35 + Math.sin(t * 1.8 + idx) * 0.08;
        curve.v0.copy(vA);
        curve.v1.copy(vMid);
        curve.v2.copy(vB);
        const pts = curve.getPoints(segments);
        const arr = linkGeometries[idx].attributes.position.array as Float32Array;
        for (let p = 0; p <= segments; p += 1) {
          const pt = pts[p] ?? pts[pts.length - 1];
          arr[p * 3] = pt.x;
          arr[p * 3 + 1] = pt.y;
          arr[p * 3 + 2] = pt.z;
        }
        linkGeometries[idx].attributes.position.needsUpdate = true;
        const lm = linkLines[idx].material as THREE.LineBasicMaterial;
        lm.opacity = 0.22 + Math.sin(t * 2 + idx * 0.4) * 0.18;
      });

      if (!reducedMotion) {
        camera.position.x = Math.sin(t * 0.25) * 0.15;
        camera.position.y = 0.35 + Math.cos(t * 0.2) * 0.08;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      coreGeo.dispose();
      coreMat.dispose();
      coreGlowGeo.dispose();
      coreGlowMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ringBMat.dispose();
      ringBGeo.dispose();
      nodeMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      haloMeshes.forEach((h) => {
        h.geometry.dispose();
        (h.material as THREE.Material).dispose();
      });
      linkGeometries.forEach((g) => g.dispose());
      linkLines.forEach((l) => (l.material as THREE.Material).dispose());
      particleGeo.dispose();
      (particles.material as THREE.Material).dispose();
      renderer.dispose();
      if (container.contains(canvas)) container.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} className="cta-network-canvas" aria-hidden="true" />;
}
