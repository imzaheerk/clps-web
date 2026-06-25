import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { useDeferredTheme } from "@/hooks/useDeferredTheme";

const EARTH_RADIUS = 2.05;

const TEXTURES = {
  day: "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg",
  bump: "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png",
  night: "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg",
  clouds: "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-clouds.png",
};

const NEON_DARK = [0x22d3ee, 0x3b82f6, 0xa855f7, 0xec4899, 0x10b981, 0xf97316];
const NEON_LIGHT = [0xff6000, 0xf97316, 0xfbbf24, 0xfb923c, 0x38bdf8, 0x34d399];

const HUBS: { lat: number; lng: number }[] = [
  { lat: 40.7128, lng: -74.006 },
  { lat: 51.5074, lng: -0.1278 },
  { lat: 35.6762, lng: 139.6503 },
  { lat: -33.8688, lng: 151.2093 },
  { lat: 19.076, lng: 72.8777 },
  { lat: -23.5505, lng: -46.6333 },
  { lat: 30.0444, lng: 31.2357 },
  { lat: 1.3521, lng: 103.8198 },
  { lat: 25.2048, lng: 55.2708 },
  { lat: 48.8566, lng: 2.3522 },
  { lat: 52.52, lng: 13.405 },
  { lat: 34.0522, lng: -118.2437 },
  { lat: 37.7749, lng: -122.4194 },
  { lat: 43.6532, lng: -79.3832 },
  { lat: 37.5665, lng: 126.978 },
  { lat: 39.9042, lng: 116.4074 },
  { lat: -26.2041, lng: 28.0473 },
  { lat: 19.4326, lng: -99.1332 },
  { lat: 13.7563, lng: 100.5018 },
  { lat: 41.0082, lng: 28.9784 },
  { lat: 55.7558, lng: 37.6173 },
  { lat: -34.6037, lng: -58.3816 },
  { lat: 59.3293, lng: 18.0686 },
  { lat: 28.6139, lng: 77.209 },
];

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function arcPoints(
  start: THREE.Vector3,
  end: THREE.Vector3,
  segments: number,
  lift = 0.42
): THREE.Vector3[] {
  const s = start.clone().normalize();
  const e = end.clone().normalize();
  const mid = s.clone().add(e).normalize();
  const altitude = start.length() * (1 + lift * (0.55 + 0.45 * (1 - s.dot(e))));
  mid.multiplyScalar(altitude);
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  return curve.getPoints(segments);
}

type Connection = {
  line: THREE.Line;
  particles: THREE.Mesh[];
  curve: THREE.QuadraticBezierCurve3;
  color: number;
  speed: number;
  offsets: number[];
  life: number;
  maxLife: number;
  fading: boolean;
};

type NodeMarker = {
  group: THREE.Group;
  ring: THREE.Mesh;
  core: THREE.Mesh;
  halo: THREE.Mesh;
  baseScale: number;
  phase: number;
};

function pickConnections(count: number): [number, number][] {
  const pairs: [number, number][] = [];
  const used = new Set<string>();
  let guard = 0;
  while (pairs.length < count && guard < 800) {
    guard += 1;
    const a = Math.floor(Math.random() * HUBS.length);
    let b = Math.floor(Math.random() * HUBS.length);
    if (a === b) continue;
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (used.has(key)) continue;
    used.add(key);
    pairs.push([a, b]);
  }
  return pairs;
}

/**
 * Cinematic 3D Earth with neon connection arcs, particles, and bloom.
 */
export default function HeroGlobeModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { renderTheme, opacity } = useDeferredTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isLight = renderTheme === "light";
    const NEON = isLight ? NEON_LIGHT : NEON_DARK;
    const skyColor = isLight ? 0xfafaf9 : 0x02040c;
    const atmosphereA = isLight ? 0xff8a3d : 0x22d3ee;
    const atmosphereB = isLight ? 0xfbbf24 : 0xa855f7;
    const outerGlowColor = isLight ? 0xffb347 : 0x6366f1;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    const connectionCount = isMobile ? 36 : reducedMotion ? 24 : 58;
    const particlePerArc = isMobile ? 2 : 4;

    let frameId = 0;
    let disposed = false;

    const scene = new THREE.Scene();
    if (isLight) {
      scene.background = null;
      scene.fog = new THREE.FogExp2(skyColor, 0.012);
    } else {
      scene.background = new THREE.Color(skyColor);
      scene.fog = new THREE.FogExp2(skyColor, 0.045);
    }

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
    camera.position.set(0.35, 0.55, 5.85);
    camera.lookAt(0, 0.05, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: isLight,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLight ? 1.24 : 1.15;
    if (isLight) {
      renderer.setClearColor(0x000000, 0);
    }
    container.appendChild(renderer.domElement);

    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(1, 1),
      isLight ? 0.48 : 0.62,
      isLight ? 0.38 : 0.38,
      isLight ? 0.32 : 0.18
    );
    composer.addPass(bloom);

    scene.add(new THREE.AmbientLight(isLight ? 0xfff7ed : 0x1a2a44, isLight ? 0.72 : 0.35));

    const sun = new THREE.DirectionalLight(isLight ? 0xffffff : 0xfff4e6, isLight ? 1.55 : 1.35);
    sun.position.set(-4.5, 2.2, 5.5);
    scene.add(sun);

    const rim = new THREE.DirectionalLight(isLight ? 0xffedd5 : 0x38bdf8, isLight ? 0.35 : 0.55);
    rim.position.set(5, 1.5, -3);
    scene.add(rim);

    const fill = new THREE.PointLight(isLight ? 0xff6000 : 0xa855f7, isLight ? 0.48 : 0.45, 30);
    fill.position.set(-2, -1.5, 4);
    scene.add(fill);

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const loader = new THREE.TextureLoader();
    const texDay = loader.load(TEXTURES.day);
    const texBump = loader.load(TEXTURES.bump);
    const texNight = loader.load(TEXTURES.night);
    const texClouds = loader.load(TEXTURES.clouds);
    [texDay, texBump, texNight, texClouds].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    });

    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 96, 96);
    const earthMat = new THREE.MeshPhysicalMaterial({
      map: texDay,
      bumpMap: texBump,
      bumpScale: isLight ? 0.035 : 0.045,
      emissive: new THREE.Color(isLight ? 0x1c1917 : 0x0a1628),
      emissiveMap: texNight,
      emissiveIntensity: isLight ? 0.58 : 1.35,
      roughness: isLight ? 0.78 : 0.82,
      metalness: isLight ? 0.04 : 0.08,
      clearcoat: isLight ? 0.22 : 0.12,
      clearcoatRoughness: isLight ? 0.35 : 0.4,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earth);

    const cloudGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.012, 72, 72);
    const cloudMat = new THREE.MeshPhongMaterial({
      map: texClouds,
      transparent: true,
      opacity: isLight ? 0.38 : 0.38,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(clouds);

    const atmosphereGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.14, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 glowColor;
        uniform float glowStrength;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(glowColor, 1.0) * intensity * glowStrength;
        }
      `,
      uniforms: {
        glowColor: { value: new THREE.Color(atmosphereA) },
        glowStrength: { value: isLight ? 1.85 : 1.0 },
      },
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    earthGroup.add(atmosphere);

    const outerGlowGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.22, 48, 48);
    const outerGlowMat = new THREE.ShaderMaterial({
      vertexShader: atmosphereMat.vertexShader,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 glowColor;
        uniform float glowStrength;
        void main() {
          float intensity = pow(0.52 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.2);
          gl_FragColor = vec4(glowColor, 1.0) * intensity * 0.35 * glowStrength;
        }
      `,
      uniforms: {
        glowColor: { value: new THREE.Color(outerGlowColor) },
        glowStrength: { value: isLight ? 1.6 : 1.0 },
      },
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    earthGroup.add(new THREE.Mesh(outerGlowGeo, outerGlowMat));

    const starCount = isLight ? (isMobile ? 500 : 900) : isMobile ? 1200 : 2800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      const r = 28 + Math.random() * 42;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: isLight ? 0xa8a29e : 0xffffff,
        size: isLight ? 0.04 : 0.055,
        transparent: true,
        opacity: isLight ? 0.42 : 0.75,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(stars);

    const orbitParticleCount = isLight ? (isMobile ? 280 : 520) : isMobile ? 400 : 900;
    const orbitPos = new Float32Array(orbitParticleCount * 3);
    for (let i = 0; i < orbitParticleCount; i += 1) {
      const r = EARTH_RADIUS * (1.18 + Math.random() * 0.55);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      orbitPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      orbitPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      orbitPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const orbitGeo = new THREE.BufferGeometry();
    orbitGeo.setAttribute("position", new THREE.BufferAttribute(orbitPos, 3));
    const orbitParticles = new THREE.Points(
      orbitGeo,
      new THREE.PointsMaterial({
        color: isLight ? 0xff8c42 : 0x67e8f9,
        size: isLight ? 0.03 : 0.028,
        transparent: true,
        opacity: isLight ? 0.48 : 0.45,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    earthGroup.add(orbitParticles);

    const hubPositions = HUBS.map((h) => latLngToVec3(h.lat, h.lng, EARTH_RADIUS * 1.002));

    const nodeMarkers: NodeMarker[] = hubPositions.map((pos, i) => {
      const group = new THREE.Group();
      group.position.copy(pos);
      group.lookAt(pos.clone().multiplyScalar(2));

      const ringGeo = new THREE.TorusGeometry(0.055, 0.008, 8, 24);
      const color = NEON[i % NEON.length];
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: isLight ? 0.95 : 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      group.add(ring);

      const coreGeo = new THREE.OctahedronGeometry(0.032, 0);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);

      const haloGeo = new THREE.SphereGeometry(0.078, 12, 12);
      const haloMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: isLight ? 0.38 : 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      group.add(halo);

      earthGroup.add(group);
      return { group, ring, core, halo, baseScale: 1, phase: Math.random() * Math.PI * 2 };
    });

    const particleGeo = new THREE.SphereGeometry(0.014, 6, 6);
    const connections: Connection[] = [];

    function spawnConnection(pair: [number, number], initialLife = 1): Connection {
      const [ai, bi] = pair;
      const start = hubPositions[ai].clone();
      const end = hubPositions[bi].clone();
      const pts = arcPoints(start, end, 64);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const color = NEON[Math.floor(Math.random() * NEON.length)];
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: isLight ? 0.62 : 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      earthGroup.add(line);

      const curve = new THREE.QuadraticBezierCurve3(
        start,
        pts[32] ?? start.clone().lerp(end, 0.5),
        end
      );

      const particles: THREE.Mesh[] = [];
      const offsets: number[] = [];
      for (let p = 0; p < particlePerArc; p += 1) {
        const pMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(particleGeo, pMat);
        earthGroup.add(mesh);
        particles.push(mesh);
        offsets.push(Math.random());
      }

      return {
        line,
        particles,
        curve,
        color,
        speed: 0.12 + Math.random() * 0.18,
        offsets,
        life: initialLife,
        maxLife: 4 + Math.random() * 5,
        fading: false,
      };
    }

    pickConnections(connectionCount).forEach((pair, i) => {
      connections.push(spawnConnection(pair, 0.4 + (i / connectionCount) * 0.6));
    });

    const microLineMat = new THREE.LineBasicMaterial({
      color: isLight ? 0xff8c42 : 0x38bdf8,
      transparent: true,
      opacity: isLight ? 0.1 : 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const microLines: THREE.Line[] = [];
    for (let i = 0; i < (isMobile ? 80 : 160); i += 1) {
      const a = Math.floor(Math.random() * HUBS.length);
      let b = Math.floor(Math.random() * HUBS.length);
      if (a === b) b = (b + 1) % HUBS.length;
      const pts = arcPoints(hubPositions[a], hubPositions[b], 24, 0.28);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, microLineMat.clone());
      (line.material as THREE.LineBasicMaterial).opacity = 0.03 + Math.random() * 0.07;
      earthGroup.add(line);
      microLines.push(line);
    }

    const resize = () => {
      if (!container) return;
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloom.setSize(w, h);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const clock = new THREE.Clock();
    let parallaxX = 0;
    let parallaxY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      parallaxX = nx * 0.18;
      parallaxY = ny * 0.1;
    };

    if (!reducedMotion) {
      container.addEventListener("pointermove", onPointerMove);
    }

    const animate = () => {
      if (disposed) return;
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!reducedMotion) {
        earthGroup.rotation.y = t * 0.045;
        clouds.rotation.y = t * 0.052;
        orbitParticles.rotation.y = t * 0.018;
        stars.rotation.y = t * 0.002;
      }

      camera.position.x = 0.35 + parallaxX;
      camera.position.y = 0.55 - parallaxY;
      camera.lookAt(0, 0.05, 0);

      nodeMarkers.forEach((node, i) => {
        const pulse = 1 + Math.sin(t * 2.4 + node.phase) * 0.22;
        node.ring.scale.setScalar(pulse);
        node.halo.scale.setScalar(0.9 + Math.sin(t * 1.8 + node.phase) * 0.15);
        const color = new THREE.Color(NEON[(i + Math.floor(t * 0.5)) % NEON.length]);
        (node.ring.material as THREE.MeshBasicMaterial).color.copy(color);
        (node.halo.material as THREE.MeshBasicMaterial).color.copy(color);
        node.core.rotation.y = t * 1.6;
        node.core.rotation.z = t * 0.9;
      });

      connections.forEach((conn) => {
        if (!reducedMotion) {
          conn.life += 0.016 / conn.maxLife;
          if (conn.life >= 1 && !conn.fading) conn.fading = true;
          if (conn.fading) {
            conn.life -= 0.02 / conn.maxLife;
            if (conn.life <= 0) {
              earthGroup.remove(conn.line);
              conn.line.geometry.dispose();
              (conn.line.material as THREE.Material).dispose();
              conn.particles.forEach((p) => {
                earthGroup.remove(p);
                (p.material as THREE.Material).dispose();
              });
              const newPair = pickConnections(1)[0];
              const next = spawnConnection(newPair, 0);
              Object.assign(conn, next);
            }
          }
        }

        const lm = conn.line.material as THREE.LineBasicMaterial;
        const fade = conn.fading ? Math.max(0, conn.life) : Math.min(1, conn.life * 1.4);
        lm.opacity = isLight ? 0.28 + fade * 0.55 : 0.12 + fade * 0.55;

        conn.particles.forEach((particle, idx) => {
          if (reducedMotion) return;
          conn.offsets[idx] = (conn.offsets[idx] + conn.speed * 0.016) % 1;
          const pt = conn.curve.getPoint(conn.offsets[idx]);
          particle.position.copy(pt);
          const pm = particle.material as THREE.MeshBasicMaterial;
          pm.color.setHex(conn.color);
          pm.opacity = 0.5 + fade * 0.5;
        });
      });

      microLines.forEach((line, i) => {
        const mat = line.material as THREE.LineBasicMaterial;
        mat.opacity = 0.04 + Math.sin(t * 0.8 + i * 0.3) * 0.03;
      });

      (atmosphereMat.uniforms.glowColor.value as THREE.Color).lerpColors(
        new THREE.Color(atmosphereA),
        new THREE.Color(atmosphereB),
        0.5 + Math.sin(t * 0.35) * 0.5
      );

      composer.render();
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      ro.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeChild(canvas);

      connections.forEach((c) => {
        c.line.geometry.dispose();
        (c.line.material as THREE.Material).dispose();
        c.particles.forEach((p) => (p.material as THREE.Material).dispose());
      });
      microLines.forEach((l) => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      });
      particleGeo.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      outerGlowGeo.dispose();
      outerGlowMat.dispose();
      starGeo.dispose();
      (stars.material as THREE.Material).dispose();
      orbitGeo.dispose();
      (orbitParticles.material as THREE.Material).dispose();
      nodeMarkers.forEach((n) => {
        n.ring.geometry.dispose();
        (n.ring.material as THREE.Material).dispose();
        n.core.geometry.dispose();
        (n.core.material as THREE.Material).dispose();
        n.halo.geometry.dispose();
        (n.halo.material as THREE.Material).dispose();
      });
      texDay.dispose();
      texBump.dispose();
      texNight.dispose();
      texClouds.dispose();
      composer.dispose();
      renderer.dispose();
    };
  }, [renderTheme]);

  return (
    <div
      ref={containerRef}
      className="hero-globe-canvas"
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
