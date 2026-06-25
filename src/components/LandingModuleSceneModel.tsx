import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useDeferredTheme } from "@/hooks/useDeferredTheme";

export type LandingModuleId =
  | "analytics"
  | "discovery"
  | "feed"
  | "saved-searches"
  | "chat-safety"
  | "announcements"
  | "events"
  | "community";

interface LandingModuleSceneModelProps {
  moduleId: LandingModuleId;
}

const ORANGE = 0xff6000;
const GOLD = 0xfbbf24;
const CYAN = 0x22d3ee;
const VIOLET = 0xa855f7;
const EMERALD = 0x34d399;
const ROSE = 0xf472b6;

function buildModuleContent(
  root: THREE.Group,
  id: LandingModuleId,
  isLight: boolean,
  disposables: { geos: THREE.BufferGeometry[]; mats: THREE.Material[]; meshes: THREE.Mesh[] }
) {
  const track = (geo: THREE.BufferGeometry, mat: THREE.Material, mesh: THREE.Mesh) => {
    disposables.geos.push(geo);
    disposables.mats.push(mat);
    disposables.meshes.push(mesh);
    root.add(mesh);
  };

  if (id === "analytics") {
    const heights = [0.55, 0.95, 0.72];
    const colors = [CYAN, ORANGE, GOLD];
    heights.forEach((h, i) => {
      const geo = new THREE.BoxGeometry(0.42, h, 0.42);
      const mat = new THREE.MeshPhysicalMaterial({
        color: colors[i],
        emissive: new THREE.Color(colors[i]),
        emissiveIntensity: isLight ? 0.38 : 0.45,
        metalness: 0.25,
        roughness: 0.35,
      });
      const bar = new THREE.Mesh(geo, mat);
      bar.position.set((i - 1) * 0.72, h / 2 - 0.35, 0);
      bar.userData.baseY = bar.position.y;
      bar.userData.isBar = true;
      track(geo, mat, bar);
    });
    const sparkGeo = new THREE.OctahedronGeometry(0.14, 0);
    const sparkMat = new THREE.MeshStandardMaterial({
      color: GOLD,
      emissive: GOLD,
      emissiveIntensity: isLight ? 0.85 : 1.2,
    });
    const spark = new THREE.Mesh(sparkGeo, sparkMat);
    spark.position.set(0, 1.15, 0.35);
    track(sparkGeo, sparkMat, spark);
  } else if (id === "discovery") {
    [0.55, 0.85, 1.15].forEach((r, i) => {
      const geo = new THREE.TorusGeometry(r, 0.028, 8, 64);
      const mat = new THREE.MeshStandardMaterial({
        color: i === 1 ? ORANGE : CYAN,
        emissive: new THREE.Color(i === 1 ? ORANGE : CYAN),
        emissiveIntensity: isLight ? 0.52 : 0.55,
        transparent: true,
        opacity: isLight ? 0.92 : 0.85 - i * 0.12,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.05 + i * 0.04;
      track(geo, mat, ring);
    });
    const pinGeo = new THREE.ConeGeometry(0.12, 0.28, 4);
    const pinMat = new THREE.MeshStandardMaterial({
      color: ORANGE,
      emissive: ORANGE,
      emissiveIntensity: isLight ? 0.72 : 0.6,
    });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.set(0, 0.35, 0);
    track(pinGeo, pinMat, pin);
  } else if (id === "feed") {
    const colors = [ORANGE, EMERALD, CYAN, VIOLET];
    colors.forEach((c, i) => {
      const geo = new THREE.BoxGeometry(1.35, 0.14, 0.72);
      const mat = new THREE.MeshPhysicalMaterial({
        color: c,
        emissive: new THREE.Color(c),
        emissiveIntensity: isLight ? 0.28 : 0.28,
        metalness: 0.15,
        roughness: 0.4,
        transparent: true,
        opacity: 0.92,
      });
      const card = new THREE.Mesh(geo, mat);
      card.position.set(0, 0.15 + i * 0.22, -i * 0.08);
      card.rotation.x = -0.12;
      track(geo, mat, card);
    });
  } else if (id === "saved-searches") {
    const bookGeo = new THREE.BoxGeometry(0.55, 0.72, 0.1);
    const bookMat = new THREE.MeshStandardMaterial({
      color: VIOLET,
      emissive: VIOLET,
      emissiveIntensity: isLight ? 0.38 : 0.25,
    });
    const book = new THREE.Mesh(bookGeo, bookMat);
    book.position.set(-0.25, 0.2, 0);
    book.rotation.z = 0.12;
    track(bookGeo, bookMat, book);

    const markGeo = new THREE.BoxGeometry(0.18, 0.28, 0.06);
    const markMat = new THREE.MeshStandardMaterial({
      color: GOLD,
      emissive: GOLD,
      emissiveIntensity: isLight ? 0.62 : 0.5,
    });
    const mark = new THREE.Mesh(markGeo, markMat);
    mark.position.set(0.35, 0.45, 0.1);
    mark.rotation.z = -0.35;
    track(markGeo, markMat, mark);
  } else if (id === "chat-safety") {
    const shieldGeo = new THREE.IcosahedronGeometry(0.62, 1);
    const shieldMat = new THREE.MeshPhysicalMaterial({
      color: CYAN,
      emissive: CYAN,
      emissiveIntensity: isLight ? 0.42 : 0.45,
      metalness: 0.35,
      roughness: 0.25,
      transparent: true,
      opacity: 0.88,
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.position.y = 0.35;
    track(shieldGeo, shieldMat, shield);
  } else if (id === "announcements") {
    [
      { c: ORANGE, x: -0.5 },
      { c: EMERALD, x: 0 },
      { c: ROSE, x: 0.5 },
    ].forEach(({ c, x }) => {
      const geo = new THREE.BoxGeometry(0.55, 0.18, 0.32);
      const mat = new THREE.MeshStandardMaterial({
        color: c,
        emissive: new THREE.Color(c),
        emissiveIntensity: isLight ? 0.48 : 0.35,
      });
      const tag = new THREE.Mesh(geo, mat);
      tag.position.set(x, 0.25 + Math.abs(x) * 0.15, 0);
      tag.rotation.y = x * 0.35;
      track(geo, mat, tag);
    });
  } else if (id === "events") {
    const calGeo = new THREE.BoxGeometry(0.95, 0.72, 0.12);
    const calMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xfafaf9 : 0x27272a,
      metalness: 0.1,
      roughness: isLight ? 0.55 : 0.6,
    });
    const cal = new THREE.Mesh(calGeo, calMat);
    cal.position.y = 0.2;
    track(calGeo, calMat, cal);

    [-0.28, 0, 0.28].forEach((x) => {
      const dotGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const dotMat = new THREE.MeshStandardMaterial({
        color: ORANGE,
        emissive: ORANGE,
        emissiveIntensity: isLight ? 0.95 : 0.8,
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(x, 0.42, 0.1);
      track(dotGeo, dotMat, dot);
    });
  } else {
    for (let i = 0; i < 7; i++) {
      const ang = (i / 7) * Math.PI * 2;
      const r = 0.65 + (i % 2) * 0.2;
      const color = [CYAN, ORANGE, VIOLET, EMERALD][i % 4];
      const nodeGeo = new THREE.SphereGeometry(0.11, 16, 16);
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: new THREE.Color(color),
        emissiveIntensity: isLight ? 0.68 : 0.55,
      });
      const node = new THREE.Mesh(nodeGeo, mat);
      node.position.set(Math.cos(ang) * r, 0.25 + (i % 3) * 0.18, Math.sin(ang) * r);
      track(nodeGeo, mat, node);
    }
    const coreGeo = new THREE.SphereGeometry(0.16, 20, 20);
    const coreMat = new THREE.MeshStandardMaterial({
      color: ORANGE,
      emissive: ORANGE,
      emissiveIntensity: isLight ? 1.05 : 0.9,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.45;
    track(coreGeo, coreMat, core);
  }
}

export default function LandingModuleSceneModel({ moduleId }: LandingModuleSceneModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const moduleRef = useRef(moduleId);
  const { renderTheme, opacity } = useDeferredTheme();

  useEffect(() => {
    moduleRef.current = moduleId;
  }, [moduleId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isLight = renderTheme === "light";
    let frameId = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 1.1, 4.4);
    camera.lookAt(0, 0.35, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLight ? 1.28 : 1.05;
    container.appendChild(renderer.domElement);

    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    scene.add(new THREE.AmbientLight(0xffffff, isLight ? 0.62 : 0.38));
    const hemi = new THREE.HemisphereLight(
      isLight ? 0xfff7ed : 0xffffff,
      isLight ? 0xe7e5e4 : 0x111118,
      isLight ? 0.55 : 0.35
    );
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, isLight ? 0.88 : 0.85);
    key.position.set(3, 6, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(isLight ? 0xffedd5 : 0xffffff, isLight ? 0.35 : 0.25);
    fill.position.set(-4, 2, -3);
    scene.add(fill);
    const accent = new THREE.PointLight(ORANGE, isLight ? 0.82 : 0.8, 22);
    accent.position.set(-2, 2, 3);
    scene.add(accent);

    const root = new THREE.Group();
    scene.add(root);

    const groundGeo = new THREE.CircleGeometry(2.4, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xfff7ed : 0x111118,
      metalness: 0.08,
      roughness: isLight ? 0.78 : 0.85,
      transparent: true,
      opacity: isLight ? 0.72 : 0.35,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.55;
    ground.receiveShadow = false;
    root.add(ground);

    const shadowGeo = new THREE.CircleGeometry(1.85, 48);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: isLight ? 0x78716c : 0x000000,
      transparent: true,
      opacity: isLight ? 0.14 : 0.22,
      depthWrite: false,
    });
    const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = -0.54;
    root.add(shadowDisc);

    const disposables = {
      geos: [groundGeo, shadowGeo] as THREE.BufferGeometry[],
      mats: [groundMat, shadowMat] as THREE.Material[],
      meshes: [] as THREE.Mesh[],
    };

    const rebuild = (id: LandingModuleId) => {
      disposables.meshes.forEach((m) => root.remove(m));
      disposables.meshes.forEach((m) => {
        if (m.geometry !== groundGeo) m.geometry.dispose();
        if (m.material !== groundMat) {
          const mat = m.material;
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat.dispose();
        }
      });
      disposables.geos = [groundGeo, shadowGeo];
      disposables.mats = [groundMat, shadowMat];
      disposables.meshes = [];
      buildModuleContent(root, id, isLight, disposables);
    };

    rebuild(moduleId);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 1 || h < 1) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      root.rotation.y = t * 0.28;
      disposables.meshes.forEach((mesh, i) => {
        if (mesh.userData.isBar) {
          mesh.scale.y = 0.85 + Math.sin(t * 2 + i) * 0.15;
          mesh.position.y = (mesh.userData.baseY as number) * mesh.scale.y;
        }
      });
      canvas.style.opacity = String(opacity);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      disposables.geos.forEach((g) => g.dispose());
      disposables.mats.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [renderTheme, opacity, moduleId]);

  return <div ref={containerRef} className="landing-module-scene-canvas" aria-hidden="true" />;
}
