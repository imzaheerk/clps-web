import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useDeferredTheme } from "@/hooks/useDeferredTheme";

const ORANGE = 0xff6000;
const SKY = 0x38bdf8;
const CYAN = 0x22d3ee;

function readCssHexVar(name: string, fallback: string): number {
  if (typeof document === "undefined") {
    return parseInt(fallback.replace("#", ""), 16);
  }
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const hex = raw.startsWith("#") ? raw : fallback;
  const n = parseInt(hex.replace("#", ""), 16);
  return Number.isNaN(n) ? parseInt(fallback.replace("#", ""), 16) : n;
}

type PersonRig = {
  group: THREE.Group;
  head: THREE.Mesh;
  phone: THREE.Mesh;
};

/**
 * Final CTA — 3D Checknown mark: two neighbors linked inside a local discovery ring.
 */
export default function FinalCtaNetworkModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { renderTheme, opacity } = useDeferredTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isLight = renderTheme === "light";
    const primary = readCssHexVar("--color-primary", "#0ea5e9");
    const primaryLight = readCssHexVar("--color-primary-light", "#38bdf8");

    let frameId = 0;
    let visible = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    camera.position.set(0, 0.72, 3.35);
    camera.lookAt(0, 0.48, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLight ? 1.16 : 1.02;
    container.appendChild(renderer.domElement);

    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    scene.add(new THREE.AmbientLight(0xffffff, isLight ? 0.62 : 0.4));
    scene.add(
      new THREE.HemisphereLight(
        isLight ? 0xfff7ed : 0x7dd3fc,
        isLight ? 0xe7e5e4 : 0x0f172a,
        isLight ? 0.45 : 0.28
      )
    );

    const key = new THREE.DirectionalLight(0xffffff, isLight ? 0.88 : 0.72);
    key.position.set(2, 5, 4);
    scene.add(key);

    const warm = new THREE.PointLight(ORANGE, isLight ? 0.55 : 0.48, 10);
    warm.position.set(-1.2, 1.2, 2.5);
    scene.add(warm);

    const cool = new THREE.PointLight(primaryLight, isLight ? 0.45 : 0.38, 10);
    cool.position.set(1.4, 0.8, 2);
    scene.add(cool);

    const root = new THREE.Group();
    scene.add(root);

    const disposables: {
      geos: THREE.BufferGeometry[];
      mats: THREE.Material[];
      meshes: THREE.Mesh[];
    } = { geos: [], mats: [], meshes: [] };

    const track = (geo: THREE.BufferGeometry, mat: THREE.Material, mesh: THREE.Mesh) => {
      disposables.geos.push(geo);
      disposables.mats.push(mat);
      disposables.meshes.push(mesh);
      return mesh;
    };

    const groundGeo = new THREE.CircleGeometry(1.35, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xf5f5f4 : 0x18181b,
      metalness: 0.05,
      roughness: 0.86,
      transparent: true,
      opacity: isLight ? 0.9 : 0.78,
    });
    const ground = track(groundGeo, groundMat, new THREE.Mesh(groundGeo, groundMat));
    ground.rotation.x = -Math.PI / 2;
    root.add(ground);

    const radiusGeo = new THREE.TorusGeometry(1.05, 0.018, 8, 64);
    const radiusMat = new THREE.MeshStandardMaterial({
      color: ORANGE,
      emissive: new THREE.Color(ORANGE),
      emissiveIntensity: isLight ? 0.48 : 0.55,
      transparent: true,
      opacity: 0.85,
    });
    const radiusRing = track(radiusGeo, radiusMat, new THREE.Mesh(radiusGeo, radiusMat));
    radiusRing.rotation.x = Math.PI / 2;
    radiusRing.position.y = 0.015;
    root.add(radiusRing);

    const logoRingGeo = new THREE.TorusGeometry(0.82, 0.034, 12, 72);
    const logoRingMat = new THREE.MeshStandardMaterial({
      color: primaryLight,
      emissive: new THREE.Color(primary),
      emissiveIntensity: isLight ? 0.35 : 0.42,
      metalness: 0.25,
      roughness: 0.35,
      transparent: true,
      opacity: 0.92,
    });
    const logoRing = track(logoRingGeo, logoRingMat, new THREE.Mesh(logoRingGeo, logoRingMat));
    logoRing.rotation.x = Math.PI / 2.15;
    logoRing.position.y = 0.52;
    root.add(logoRing);

    const linkGeo = new THREE.BoxGeometry(0.42, 0.07, 0.07);
    const linkMat = new THREE.MeshStandardMaterial({
      color: ORANGE,
      emissive: new THREE.Color(ORANGE),
      emissiveIntensity: isLight ? 0.72 : 0.85,
      metalness: 0.2,
      roughness: 0.32,
    });
    const linkBar = track(linkGeo, linkMat, new THREE.Mesh(linkGeo, linkMat));
    linkBar.position.set(0, 0.58, 0.06);
    linkBar.userData.isPulse = true;
    root.add(linkBar);

    const pinGeo = new THREE.ConeGeometry(0.11, 0.26, 5);
    const pinMat = new THREE.MeshStandardMaterial({
      color: ORANGE,
      emissive: new THREE.Color(ORANGE),
      emissiveIntensity: isLight ? 0.65 : 0.75,
      metalness: 0.15,
      roughness: 0.4,
    });
    const pin = track(pinGeo, pinMat, new THREE.Mesh(pinGeo, pinMat));
    pin.position.set(0, 0.16, 0.22);
    root.add(pin);

    const pinDotGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const pinDotMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: new THREE.Color(CYAN),
      emissiveIntensity: isLight ? 0.55 : 0.65,
    });
    const pinDot = track(pinDotGeo, pinDotMat, new THREE.Mesh(pinDotGeo, pinDotMat));
    pinDot.position.set(0, 0.3, 0.22);
    root.add(pinDot);

    const unit = new THREE.BoxGeometry(1, 1, 1);
    const headGeo = new THREE.SphereGeometry(0.16, 20, 20);
    const phoneGeo = new THREE.BoxGeometry(0.1, 0.16, 0.018);
    const phoneScreenGeo = new THREE.BoxGeometry(0.084, 0.13, 0.01);

    function createPerson(side: -1 | 1, shirtColor: number): PersonRig {
      const group = new THREE.Group();
      group.position.set(side * 0.52, 0, side * 0.08);
      group.rotation.y = side * -0.22;
      root.add(group);

      const skinMat = new THREE.MeshStandardMaterial({
        color: isLight ? 0xffe4cc : 0xf3d4b4,
        roughness: 0.62,
        metalness: 0.04,
      });
      const shirtMat = new THREE.MeshStandardMaterial({
        color: shirtColor,
        emissive: new THREE.Color(shirtColor),
        emissiveIntensity: isLight ? 0.22 : 0.32,
        metalness: 0.18,
        roughness: 0.42,
      });
      const pantsMat = new THREE.MeshStandardMaterial({
        color: isLight ? 0x475569 : 0x1e293b,
        roughness: 0.55,
        metalness: 0.15,
      });
      const phoneBodyMat = new THREE.MeshStandardMaterial({
        color: isLight ? 0x292524 : 0xe7e5e4,
        metalness: 0.35,
        roughness: 0.35,
      });
      const phoneScreenMat = new THREE.MeshStandardMaterial({
        color: 0x020617,
        emissive: new THREE.Color(primaryLight),
        emissiveIntensity: isLight ? 0.75 : 0.9,
      });

      const leg = track(unit, pantsMat, new THREE.Mesh(unit, pantsMat));
      leg.scale.set(0.11, 0.22, 0.1);
      leg.position.set(0, 0.12, 0);
      group.add(leg);

      const torso = track(unit, shirtMat, new THREE.Mesh(unit, shirtMat));
      torso.scale.set(0.22, 0.24, 0.12);
      torso.position.set(0, 0.36, 0);
      group.add(torso);

      const head = track(headGeo, skinMat, new THREE.Mesh(headGeo, skinMat));
      head.position.set(0, 0.58, 0.02);
      group.add(head);

      const phone = track(phoneGeo, phoneBodyMat, new THREE.Mesh(phoneGeo, phoneBodyMat));
      phone.position.set(side * 0.14, 0.34, 0.12);
      phone.rotation.set(-0.45, side * 0.35, 0.08);
      group.add(phone);

      const screen = track(phoneScreenGeo, phoneScreenMat, new THREE.Mesh(phoneScreenGeo, phoneScreenMat));
      screen.position.set(side * 0.14, 0.34, 0.13);
      screen.rotation.copy(phone.rotation);
      screen.userData.isPhoneScreen = true;
      group.add(screen);

      return { group, head, phone: screen };
    }

    const personA = createPerson(-1, primary);
    const personB = createPerson(1, ORANGE);

    const chatGeo = new THREE.BoxGeometry(0.28, 0.14, 0.06);
    const chatMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xffffff : 0x27272a,
      emissive: new THREE.Color(CYAN),
      emissiveIntensity: isLight ? 0.12 : 0.2,
      metalness: 0.08,
      roughness: 0.45,
    });
    const chatBubble = track(chatGeo, chatMat, new THREE.Mesh(chatGeo, chatMat));
    chatBubble.position.set(0, 0.74, 0.12);
    root.add(chatBubble);

    const chatTailGeo = new THREE.ConeGeometry(0.05, 0.08, 4);
    const chatTail = track(chatTailGeo, chatMat, new THREE.Mesh(chatTailGeo, chatMat));
    chatTail.position.set(0, 0.66, 0.12);
    chatTail.rotation.z = Math.PI;
    root.add(chatTail);

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

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
      },
      { threshold: 0.08, rootMargin: "80px 0px" }
    );
    io.observe(container);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sharedGeos = new Set([groundGeo, radiusGeo, logoRingGeo, linkGeo, pinGeo, pinDotGeo, unit, headGeo, phoneGeo, phoneScreenGeo, chatGeo, chatTailGeo]);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!visible) return;

      const t = performance.now() * 0.001;

      if (!reducedMotion) {
        root.rotation.y = Math.sin(t * 0.35) * 0.12;

        personA.head.position.y = 0.58 + Math.sin(t * 1.8) * 0.015;
        personB.head.position.y = 0.58 + Math.sin(t * 1.8 + 0.8) * 0.015;

        if (linkBar.userData.isPulse) {
          linkBar.scale.x = 1 + Math.sin(t * 2.2) * 0.06;
        }

        disposables.meshes.forEach((mesh) => {
          if (mesh.userData.isPhoneScreen) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.emissiveIntensity = (isLight ? 0.72 : 0.88) + Math.sin(t * 2.6) * 0.12;
          }
        });

        chatBubble.position.y = 0.74 + Math.sin(t * 1.5) * 0.012;
        chatTail.position.y = 0.66 + Math.sin(t * 1.5) * 0.012;
      }

      canvas.style.opacity = String(opacity);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      io.disconnect();
      disposables.geos.forEach((g) => {
        if (!sharedGeos.has(g)) g.dispose();
      });
      sharedGeos.forEach((g) => g.dispose());
      new Set(disposables.mats).forEach((m) => m.dispose());
      renderer.dispose();
      if (container.contains(canvas)) container.removeChild(canvas);
    };
  }, [renderTheme, opacity]);

  return (
    <div
      ref={containerRef}
      className="cta-network-canvas"
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
