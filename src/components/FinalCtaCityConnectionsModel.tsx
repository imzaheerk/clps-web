import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useDeferredTheme } from "@/hooks/useDeferredTheme";

function readCssHexVar(name: string, fallback: string): number {
  if (typeof document === "undefined") {
    return parseInt(fallback.replace("#", ""), 16);
  }
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const hex = raw.startsWith("#") ? raw : fallback;
  const n = parseInt(hex.replace("#", ""), 16);
  return Number.isNaN(n) ? parseInt(fallback.replace("#", ""), 16) : n;
}

type BuildingSpec = { x: number; z: number; w: number; d: number; h: number; seed: number; rotY: number };

/**
 * Final CTA: stylized 3D city with people + connection arcs.
 * Polished view: soft fog, shadows, hemisphere fill, slow camera orbit, plaza grid.
 */
export default function FinalCtaCityConnectionsModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { renderTheme, opacity } = useDeferredTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isDark = renderTheme === "dark";
    const primary = readCssHexVar("--color-primary", "#0ea5e9");
    const primaryLight = readCssHexVar("--color-primary-light", "#38bdf8");
    const primaryDark = readCssHexVar("--color-primary-dark", "#0284c7");
    const success = readCssHexVar("--color-success", "#10b981");

    const fogColor = isDark ? 0x020617 : 0xe8f4fc;
    const groundTint = isDark ? 0x0f172a : 0xf1f5f9;

    let frameId = 0;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(fogColor, 14, 38);

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 1000);
    const lookTarget = new THREE.Vector3(0, 1.05, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.06 : 1.02;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, isDark ? 0.38 : 0.55));

    const hemi = new THREE.HemisphereLight(
      isDark ? 0x38bdf8 : 0x7dd3fc,
      isDark ? 0x0f172a : 0xcbd5e1,
      isDark ? 0.42 : 0.5
    );
    hemi.position.set(0, 12, 0);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffffff, isDark ? 0.85 : 0.72);
    sun.position.set(-10, 18, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 2;
    sun.shadow.camera.far = 32;
    sun.shadow.camera.left = -9;
    sun.shadow.camera.right = 9;
    sun.shadow.camera.top = 9;
    sun.shadow.camera.bottom = -9;
    sun.shadow.bias = -0.00025;
    sun.shadow.normalBias = 0.02;
    scene.add(sun);
    scene.add(sun.target);
    sun.target.position.copy(lookTarget);

    const fill = new THREE.PointLight(primaryLight, isDark ? 0.75 : 0.55, 75);
    fill.position.set(6, 7, 5);
    scene.add(fill);

    const accent = new THREE.PointLight(success, isDark ? 0.55 : 0.45, 60);
    accent.position.set(-5, 3, -5);
    scene.add(accent);

    const root = new THREE.Group();
    root.position.y = -0.02;
    scene.add(root);

    const groundGeo = new THREE.CircleGeometry(6.8, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: groundTint,
      metalness: 0.08,
      roughness: 0.92,
      transparent: true,
      opacity: isDark ? 0.92 : 0.88,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    root.add(ground);

    const gridGroup = new THREE.Group();
    gridGroup.position.y = 0.018;
    [2.2, 3.6, 5.2].forEach((radius, gi) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
      const pts = curve.getPoints(72).map((p) => new THREE.Vector3(p.x, 0, p.y));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: primary,
        transparent: true,
        opacity: isDark ? 0.12 - gi * 0.02 : 0.08 - gi * 0.015,
      });
      gridGroup.add(new THREE.LineLoop(geo, mat));
    });
    root.add(gridGroup);

    const seeded = (s: number) => {
      let x = Math.sin(s * 127.1) * 43758.5453;
      x -= Math.floor(x);
      return x;
    };

    const buildings: BuildingSpec[] = [];
    const n = 18;
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2 + i * 0.12;
      const rad = 1.05 + seeded(i * 3) * 2.28;
      const x = Math.cos(t) * rad + (seeded(i * 7) - 0.5) * 0.32;
      const z = Math.sin(t) * rad + (seeded(i * 11) - 0.5) * 0.32;
      const w = 0.36 + seeded(i * 13) * 0.2;
      const d = 0.34 + seeded(i * 17) * 0.18;
      const h = 0.5 + seeded(i * 19) * 1.95;
      const rotY = (seeded(i * 23) - 0.5) * 0.35;
      buildings.push({ x, z, w, d, h, seed: i * 0.71, rotY });
    }

    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const buildingMaterials: THREE.MeshStandardMaterial[] = [];
    const buildingMeshes: THREE.Mesh[] = [];

    buildings.forEach((b) => {
      const tint = seeded(b.seed * 41);
      const base = isDark ? 0x172a42 : 0xb8c5d4;
      const mix = 0.15 + tint * 0.2;
      const c = new THREE.Color(base).lerp(new THREE.Color(primaryDark), mix);
      const mat = new THREE.MeshStandardMaterial({
        color: c,
        metalness: isDark ? 0.38 : 0.28,
        roughness: isDark ? 0.48 : 0.52,
        emissive: new THREE.Color(primary),
        emissiveIntensity: isDark ? 0.08 + seeded(b.seed) * 0.09 : 0.04 + seeded(b.seed) * 0.05,
      });
      buildingMaterials.push(mat);
      const mesh = new THREE.Mesh(boxGeo, mat);
      mesh.position.set(b.x, b.h / 2, b.z);
      mesh.scale.set(b.w, b.h, b.d);
      mesh.rotation.y = b.rotY;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      root.add(mesh);
      buildingMeshes.push(mesh);
    });

    const personGeo = new THREE.SphereGeometry(0.125, 20, 20);
    const personMat = new THREE.MeshStandardMaterial({
      color: primaryLight,
      emissive: success,
      emissiveIntensity: isDark ? 0.58 : 0.48,
      metalness: 0.4,
      roughness: 0.22,
    });

    const peoplePositions: THREE.Vector3[] = [];
    buildings.forEach((b) => {
      const y = b.h + 0.16;
      const jitter = 0.07;
      peoplePositions.push(
        new THREE.Vector3(
          b.x + (seeded(b.seed * 5) - 0.5) * jitter * 2,
          y,
          b.z + (seeded(b.seed * 9) - 0.5) * jitter * 2
        )
      );
    });

    for (let k = 0; k < 6; k++) {
      const ang = seeded(20 + k) * Math.PI * 2;
      const rr = 0.45 + seeded(30 + k) * 1.75;
      peoplePositions.push(
        new THREE.Vector3(Math.cos(ang) * rr, 0.2, Math.sin(ang) * rr)
      );
    }

    const peopleMeshes: THREE.Mesh[] = [];
    peoplePositions.forEach((pos) => {
      const m = new THREE.Mesh(personGeo, personMat);
      m.position.copy(pos);
      m.castShadow = true;
      root.add(m);
      peopleMeshes.push(m);
    });

    const linkGeometries: THREE.BufferGeometry[] = [];
    const linkLines: THREE.Line[] = [];
    const linkBaseMat = new THREE.LineBasicMaterial({
      color: primaryLight,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
    });

    const segments = 28;
    const pairs: [number, number][] = [];
    const maxDist = 2.45;
    for (let i = 0; i < peoplePositions.length; i++) {
      for (let j = i + 1; j < peoplePositions.length; j++) {
        if (peoplePositions[i].distanceTo(peoplePositions[j]) < maxDist) {
          pairs.push([i, j]);
        }
      }
    }
    const ringExtra: [number, number][] = [];
    for (let i = 0; i < peoplePositions.length; i++) {
      ringExtra.push([i, (i + 2) % peoplePositions.length]);
    }
    ringExtra.forEach((p) => {
      const [i, j] = p;
      if (peoplePositions[i].distanceTo(peoplePositions[j]) > maxDist * 1.32) return;
      if (!pairs.some(([a, b]) => (a === p[0] && b === p[1]) || (a === p[1] && b === p[0]))) {
        pairs.push(p);
      }
    });
    pairs.splice(40);

    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    );
    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vMid = new THREE.Vector3();

    pairs.forEach(() => {
      const pos = new Float32Array((segments + 1) * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const line = new THREE.Line(geo, linkBaseMat.clone() as THREE.LineBasicMaterial);
      line.frustumCulled = false;
      root.add(line);
      linkGeometries.push(geo);
      linkLines.push(line);
    });

    const starGeo = new THREE.BufferGeometry();
    const starCount = 90;
    const starPos = new Float32Array(starCount * 3);
    for (let s = 0; s < starCount; s++) {
      const u = seeded(s * 1.7) * Math.PI * 2;
      const v = seeded(s * 2.3) * 0.35 + 0.5;
      const R = 22 + seeded(s * 3.1) * 12;
      starPos[s * 3] = Math.cos(u) * Math.cos(v) * R;
      starPos[s * 3 + 1] = Math.sin(v) * R + 8;
      starPos[s * 3 + 2] = Math.sin(u) * Math.cos(v) * R;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: primaryLight,
      size: isDark ? 0.045 : 0.032,
      transparent: true,
      opacity: isDark ? 0.35 : 0.18,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const onResize = () => {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };

    onResize();
    window.addEventListener("resize", onResize);

    const camRadius = 12.4;
    const camHeight = 5.85;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      root.rotation.y = t * 0.014;

      buildingMeshes.forEach((_, i) => {
        const b = buildings[i];
        const w = Math.sin(t * 1.45 + b.seed * 4);
        const mat = buildingMaterials[i];
        mat.emissiveIntensity =
          (isDark ? 0.08 : 0.04) + w * 0.07 + seeded(b.seed) * 0.07;
      });

      peopleMeshes.forEach((m, i) => {
        const bob = Math.sin(t * 2.2 + i * 0.31) * 0.035;
        const base = peoplePositions[i];
        m.position.set(base.x, base.y + bob, base.z);
      });

      pairs.forEach(([ia, ib], idx) => {
        if (idx >= linkLines.length) return;
        vA.copy(peopleMeshes[ia].position);
        vB.copy(peopleMeshes[ib].position);
        vMid.copy(vA).lerp(vB, 0.5);
        vMid.y += 0.62 + Math.sin(t * 1.65 + idx * 0.35) * 0.1;
        curve.v0.copy(vA);
        curve.v1.copy(vMid);
        curve.v2.copy(vB);
        const pts = curve.getPoints(segments);
        const arr = linkGeometries[idx].attributes.position.array as Float32Array;
        for (let p = 0; p <= segments; p++) {
          const pt = pts[p] ?? pts[pts.length - 1];
          arr[p * 3] = pt.x;
          arr[p * 3 + 1] = pt.y;
          arr[p * 3 + 2] = pt.z;
        }
        linkGeometries[idx].attributes.position.needsUpdate = true;
        const lm = linkLines[idx].material as THREE.LineBasicMaterial;
        lm.opacity = (isDark ? 0.26 : 0.18) + Math.sin(t * 2.05 + idx * 0.38) * 0.11;
      });

      const orbit = t * 0.031;
      camera.position.x = Math.sin(orbit) * camRadius;
      camera.position.z = Math.cos(orbit) * camRadius;
      camera.position.y = camHeight + Math.sin(t * 0.06) * 0.22;
      camera.lookAt(lookTarget);

      stars.rotation.y = t * 0.008;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameId);
      scene.fog = null;
      boxGeo.dispose();
      buildingMaterials.forEach((m) => m.dispose());
      personGeo.dispose();
      personMat.dispose();
      linkGeometries.forEach((g) => g.dispose());
      linkLines.forEach((line) => (line.material as THREE.Material).dispose());
      groundGeo.dispose();
      groundMat.dispose();
      gridGroup.children.forEach((ch) => {
        const line = ch as THREE.LineLoop;
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [renderTheme]);

  return (
    <div
      ref={containerRef}
      className="cta-city-canvas h-full w-full min-h-[220px]"
      style={{ opacity }}
    />
  );
}
