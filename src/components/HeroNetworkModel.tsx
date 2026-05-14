import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";

function readCssHexVar(name: string, fallback: string): number {
  if (typeof document === "undefined") {
    return parseInt(fallback.replace("#", ""), 16);
  }
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const hex = raw.startsWith("#") ? raw : fallback;
  const n = parseInt(hex.replace("#", ""), 16);
  return Number.isNaN(n) ? parseInt(fallback.replace("#", ""), 16) : n;
}

type LotKind = "office" | "home";

type Lot = {
  kind: LotKind;
  x: number;
  z: number;
  rotY: number;
  seed: number;
  roofY: number;
};

const PERSON_NODE_Y = 0.392;

/**
 * Hero: mini-city — homes, offices, cell towers, people with phones, props, network arcs.
 * Ground uses ShadowMaterial so only soft contact shadows show (no visible “floor box”).
 */
export default function HeroNetworkModel() {
  const modelContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = modelContainerRef.current;
    if (!container) return;

    const isDark = theme === "dark";
    const primary = readCssHexVar("--color-primary", "#0ea5e9");
    const primaryLight = readCssHexVar("--color-primary-light", "#38bdf8");
    const primaryDark = readCssHexVar("--color-primary-dark", "#0284c7");
    const success = readCssHexVar("--color-success", "#10b981");

    let frameId = 0;
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(40, 1, 0.12, 120);
    const lookTarget = new THREE.Vector3(0, 0.74, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.05 : 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    scene.add(new THREE.AmbientLight(0xffffff, isDark ? 0.44 : 0.52));

    const hemi = new THREE.HemisphereLight(
      isDark ? 0x6ec8ff : 0xa5d8ff,
      isDark ? 0x0a0f1a : 0xd4dce8,
      isDark ? 0.5 : 0.52
    );
    hemi.position.set(0, 10, 0);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff5eb, isDark ? 0.68 : 0.58);
    sun.position.set(-7, 14, 9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1536, 1536);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 40;
    sun.shadow.camera.left = -13;
    sun.shadow.camera.right = 13;
    sun.shadow.camera.top = 13;
    sun.shadow.camera.bottom = -13;
    sun.shadow.bias = -0.00016;
    sun.shadow.normalBias = 0.028;
    scene.add(sun);
    scene.add(sun.target);
    sun.target.position.copy(lookTarget);

    const rim = new THREE.DirectionalLight(primaryLight, isDark ? 0.34 : 0.26);
    rim.position.set(10, 6, -8);
    scene.add(rim);

    const fill = new THREE.PointLight(primaryLight, isDark ? 0.52 : 0.42, 55);
    fill.position.set(5, 5, 5);
    scene.add(fill);

    const accent = new THREE.PointLight(success, isDark ? 0.42 : 0.34, 48);
    accent.position.set(-4, 3, -4);
    scene.add(accent);

    const root = new THREE.Group();
    root.position.y = 0;
      root.scale.setScalar(1.0);
    scene.add(root);

    const groundGeo = new THREE.PlaneGeometry(64, 64, 1, 1);
    const groundMat = new THREE.ShadowMaterial({
      opacity: isDark ? 0.32 : 0.2,
      color: 0x0a1628,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.position.y = 0;
    root.add(ground);

    const seeded = (s: number) => {
      let x = Math.sin(s * 127.1) * 43758.5453;
      x -= Math.floor(x);
      return x;
    };

    const lots: Lot[] = [];
    const n = 26;
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2 + i * 0.11;
      const inner = i % 2 === 0;
      const rad =
        (inner ? 0.58 : 1.02) + seeded(i * 3) * (inner ? 0.48 : 1.42) + (seeded(i * 31) - 0.5) * 0.12;
      const x = Math.cos(t) * rad + (seeded(i * 7) - 0.5) * 0.22;
      const z = Math.sin(t) * rad + (seeded(i * 11) - 0.5) * 0.22;
      const rotY = (seeded(i * 23) - 0.5) * 0.55;
      const kind: LotKind = i % 2 === 0 ? "home" : "office";
      lots.push({ kind, x, z, rotY, seed: i * 0.73, roofY: 0 });
    }

    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const capGeo = new THREE.BoxGeometry(1, 0.07, 1);
    const coneGeo = new THREE.ConeGeometry(0.5, 0.34, 4, 1);

    const officeMaterials: THREE.MeshPhysicalMaterial[] = [];
    const homeMaterials: THREE.MeshPhysicalMaterial[] = [];
    const roofHomeMaterials: THREE.MeshPhysicalMaterial[] = [];
    const capMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(primaryDark).multiplyScalar(isDark ? 0.42 : 0.62),
      metalness: 0.52,
      roughness: 0.26,
      emissive: new THREE.Color(primary),
      emissiveIntensity: isDark ? 0.28 : 0.18,
      clearcoat: 0.5,
      clearcoatRoughness: 0.22,
    });

    lots.forEach((lot) => {
      if (lot.kind === "office") {
        const w = 0.26 + seeded(lot.seed * 13) * 0.14;
        const d = 0.25 + seeded(lot.seed * 17) * 0.12;
        const h = 0.62 + seeded(lot.seed * 19) * 1.35;
        const tint = seeded(lot.seed * 41);
        const base = isDark ? 0x132036 : 0x9aacbf;
        const mix = 0.12 + tint * 0.28;
        const c = new THREE.Color(base).lerp(new THREE.Color(primaryDark), mix);
        const mat = new THREE.MeshPhysicalMaterial({
          color: c,
          metalness: isDark ? 0.4 : 0.3,
          roughness: isDark ? 0.44 : 0.5,
          emissive: new THREE.Color(primary),
          emissiveIntensity: isDark ? 0.055 + seeded(lot.seed) * 0.06 : 0.028 + seeded(lot.seed) * 0.03,
          clearcoat: 0.2,
          clearcoatRoughness: 0.5,
        });
        officeMaterials.push(mat);
        const mesh = new THREE.Mesh(boxGeo, mat);
        mesh.position.set(lot.x, h / 2, lot.z);
        mesh.scale.set(w, h, d);
        mesh.rotation.y = lot.rotY;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        root.add(mesh);

        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.set(lot.x, h + 0.04, lot.z);
        cap.scale.set(w * 0.92, 1, d * 0.92);
        cap.rotation.y = lot.rotY;
        cap.castShadow = true;
        cap.receiveShadow = true;
        root.add(cap);

        lot.roofY = h + 0.1;
      } else {
        const w = 0.38 + seeded(lot.seed * 13) * 0.14;
        const d = 0.36 + seeded(lot.seed * 17) * 0.12;
        const h1 = 0.2 + seeded(lot.seed * 19) * 0.1;
        const h2 = 0.14 + seeded(lot.seed * 29) * 0.08;
        const wall = isDark ? 0x4a3728 : 0xc4a574;
        const trim = isDark ? 0x5c4435 : 0xd9bc90;
        const matLow = new THREE.MeshPhysicalMaterial({
          color: wall,
          metalness: 0.12,
          roughness: 0.62,
          emissive: new THREE.Color(success),
          emissiveIntensity: isDark ? 0.04 : 0.02,
          clearcoat: 0.08,
          clearcoatRoughness: 0.7,
        });
        const matUp = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(trim).lerp(new THREE.Color(wall), 0.35),
          metalness: 0.1,
          roughness: 0.58,
          emissive: new THREE.Color(success),
          emissiveIntensity: isDark ? 0.035 : 0.018,
          clearcoat: 0.1,
          clearcoatRoughness: 0.65,
        });
        const roofMat = new THREE.MeshPhysicalMaterial({
          color: isDark ? 0x7c2d12 : 0xb45309,
          metalness: 0.25,
          roughness: 0.55,
          emissive: new THREE.Color(0x451a03),
          emissiveIntensity: isDark ? 0.06 : 0.02,
          clearcoat: 0.15,
          clearcoatRoughness: 0.55,
        });
        homeMaterials.push(matLow, matUp);
        roofHomeMaterials.push(roofMat);

        const lower = new THREE.Mesh(boxGeo, matLow);
        lower.position.set(lot.x, h1 / 2, lot.z);
        lower.scale.set(w, h1, d);
        lower.rotation.y = lot.rotY;
        lower.castShadow = true;
        lower.receiveShadow = true;
        root.add(lower);

        const upper = new THREE.Mesh(boxGeo, matUp);
        upper.position.set(lot.x, h1 + h2 / 2, lot.z);
        upper.scale.set(w * 0.9, h2, d * 0.9);
        upper.rotation.y = lot.rotY;
        upper.castShadow = true;
        upper.receiveShadow = true;
        root.add(upper);

        const roof = new THREE.Mesh(coneGeo, roofMat);
        const roofScale = Math.max(w, d) * 1.05;
        roof.scale.set(roofScale, 1, roofScale);
        roof.position.set(lot.x, h1 + h2 + 0.17, lot.z);
        roof.rotation.y = lot.rotY + Math.PI / 4;
        roof.castShadow = true;
        roof.receiveShadow = true;
        root.add(roof);

        lot.roofY = h1 + h2 + 0.32;
      }
    });

    const mastGeo = new THREE.CylinderGeometry(0.065, 0.095, 1, 12);
    const armGeo = new THREE.BoxGeometry(0.46, 0.028, 0.048);
    const armGeoSmall = new THREE.BoxGeometry(0.32, 0.022, 0.04);
    const basePadGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.12, 16);
    const towerMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x3d4f66 : 0x8fa0b5,
      metalness: 0.6,
      roughness: 0.28,
      emissive: new THREE.Color(primaryDark),
      emissiveIntensity: isDark ? 0.09 : 0.045,
      clearcoat: 0.32,
      clearcoatRoughness: 0.36,
    });
    const armMat = new THREE.MeshPhysicalMaterial({
      color: primaryLight,
      metalness: 0.45,
      roughness: 0.22,
      emissive: new THREE.Color(primary),
      emissiveIntensity: isDark ? 0.2 : 0.11,
      clearcoat: 0.55,
      clearcoatRoughness: 0.2,
    });

    const towerTipLocal: THREE.Vector3[] = [];
    const beaconGeo = new THREE.SphereGeometry(0.055, 16, 16);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xff5555,
      emissive: 0xff3333,
      emissiveIntensity: isDark ? 0.9 : 0.65,
      transparent: true,
      opacity: 0.96,
    });

    const guyWireMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x64748b : 0x94a3b8,
      transparent: true,
      opacity: isDark ? 0.3 : 0.22,
    });
    const guyLines: THREE.Line[] = [];

    for (let ti = 0; ti < 3; ti++) {
      const ang = (ti / 3) * Math.PI * 2 + 0.32;
      const tr = 3.05;
      const tx = Math.cos(ang) * tr;
      const tz = Math.sin(ang) * tr;
      const mastH = 2.38 + seeded(ti * 17) * 0.4;

      const towerGroup = new THREE.Group();
      towerGroup.position.set(tx, 0, tz);
      root.add(towerGroup);

      const pad = new THREE.Mesh(basePadGeo, towerMat);
      pad.position.y = 0.06;
      pad.castShadow = true;
      pad.receiveShadow = true;
      towerGroup.add(pad);

      const mast = new THREE.Mesh(mastGeo, towerMat);
      mast.scale.set(1, mastH, 1);
      mast.position.y = mastH / 2 + 0.1;
      mast.castShadow = true;
      mast.receiveShadow = true;
      towerGroup.add(mast);

      const armY1 = mastH * 0.72 + 0.1;
      const armY2 = mastH - 0.18 + 0.1;
      for (let a = 0; a < 3; a++) {
        const arm = new THREE.Mesh(armGeo, armMat);
        arm.position.y = armY1;
        arm.rotation.y = (a / 3) * Math.PI;
        arm.castShadow = true;
        towerGroup.add(arm);
      }
      for (let a = 0; a < 3; a++) {
        const arm = new THREE.Mesh(armGeoSmall, armMat);
        arm.position.y = armY2;
        arm.rotation.y = (a / 3) * Math.PI + Math.PI / 6;
        arm.castShadow = true;
        towerGroup.add(arm);
      }

      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = mastH + 0.18;
      beacon.castShadow = true;
      towerGroup.add(beacon);

      towerTipLocal.push(new THREE.Vector3(tx, mastH + 0.22, tz));

      const attach = mastH * 0.52 + 0.1;
      const corners = [
        [0.22, 0.22],
        [-0.22, 0.22],
        [0.22, -0.22],
        [-0.22, -0.22],
      ] as const;
      corners.forEach(([ox, oz]) => {
        const g = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(tx + ox, 0.02, tz + oz),
          new THREE.Vector3(tx, attach, tz),
        ]);
        const line = new THREE.Line(g, guyWireMat);
        guyLines.push(line);
        root.add(line);
      });
    }

    const unitBox = new THREE.BoxGeometry(1, 1, 1);
    const headGeo = new THREE.SphereGeometry(0.095, 18, 18);
    const hairGeo = new THREE.SphereGeometry(0.1, 14, 12);
    const phoneChassisGeo = new THREE.BoxGeometry(0.092, 0.152, 0.014);
    const phoneScreenGeo = new THREE.BoxGeometry(0.078, 0.128, 0.009);
    const phoneCamGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.006, 8);

    const skinMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0xf3d4b4 : 0xffe4cc,
      roughness: 0.55,
      metalness: 0.05,
      clearcoat: 0.2,
      clearcoatRoughness: 0.4,
    });
    const shirtMat = new THREE.MeshPhysicalMaterial({
      color: primary,
      emissive: primaryDark,
      emissiveIntensity: isDark ? 0.12 : 0.07,
      metalness: 0.25,
      roughness: 0.38,
      clearcoat: 0.15,
      clearcoatRoughness: 0.45,
    });
    const pantsMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x1e3a5f : 0x334155,
      metalness: 0.35,
      roughness: 0.48,
      clearcoat: 0.1,
      clearcoatRoughness: 0.55,
    });
    const shoeMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x0f172a : 0x1e293b,
      metalness: 0.45,
      roughness: 0.42,
      clearcoat: 0.2,
      clearcoatRoughness: 0.45,
    });
    const hairMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x271a12 : 0x4a3728,
      roughness: 0.72,
      metalness: 0.05,
    });
    const phoneChassisMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x1c2536 : 0x334155,
      metalness: 0.55,
      roughness: 0.32,
      clearcoat: 0.55,
      clearcoatRoughness: 0.22,
    });
    const phoneScreenMat = new THREE.MeshPhysicalMaterial({
      color: 0x020617,
      emissive: primaryLight,
      emissiveIntensity: isDark ? 0.55 : 0.42,
      metalness: 0.15,
      roughness: 0.25,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
    });
    const phoneCamMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.6,
      roughness: 0.35,
    });
    const standMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x273549 : 0x94a3b8,
      metalness: 0.35,
      roughness: 0.55,
    });

    function createPhoneGroup(): THREE.Group {
      const pg = new THREE.Group();
      const body = new THREE.Mesh(phoneChassisGeo, phoneChassisMat);
      body.castShadow = true;
      body.receiveShadow = true;
      const screen = new THREE.Mesh(phoneScreenGeo, phoneScreenMat);
      screen.position.set(0, 0, 0.009);
      screen.castShadow = true;
      const cam = new THREE.Mesh(phoneCamGeo, phoneCamMat);
      cam.rotation.x = Math.PI / 2;
      cam.position.set(0.028, 0.064, -0.009);
      cam.castShadow = true;
      pg.add(body, screen, cam);
      return pg;
    }

    function createPersonGroup(opts: { phone?: boolean } = {}): THREE.Group {
      const g = new THREE.Group();
      const shoeL = new THREE.Mesh(unitBox, shoeMat);
      shoeL.scale.set(0.078, 0.038, 0.1);
      shoeL.position.set(-0.042, 0.019, 0.015);
      shoeL.castShadow = true;
      const shoeR = new THREE.Mesh(unitBox, shoeMat);
      shoeR.scale.set(0.078, 0.038, 0.1);
      shoeR.position.set(0.042, 0.019, 0.015);
      shoeR.castShadow = true;
      const legL = new THREE.Mesh(unitBox, pantsMat);
      legL.scale.set(0.068, 0.125, 0.068);
      legL.position.set(-0.042, 0.078, 0);
      legL.castShadow = true;
      const legR = new THREE.Mesh(unitBox, pantsMat);
      legR.scale.set(0.068, 0.125, 0.068);
      legR.position.set(0.042, 0.078, 0);
      legR.castShadow = true;
      const torso = new THREE.Mesh(unitBox, shirtMat);
      torso.scale.set(0.17, 0.21, 0.125);
      torso.position.set(0, 0.218, 0);
      torso.castShadow = true;
      const armL = new THREE.Mesh(unitBox, shirtMat);
      armL.scale.set(0.044, 0.135, 0.044);
      armL.position.set(-0.112, 0.24, 0);
      armL.rotation.z = 0.28;
      armL.castShadow = true;
      const armR = new THREE.Mesh(unitBox, shirtMat);
      armR.scale.set(0.044, 0.135, 0.044);
      armR.position.set(0.112, 0.24, 0);
      armR.rotation.z = -0.28;
      armR.castShadow = true;
      const head = new THREE.Mesh(headGeo, skinMat);
      head.position.set(0, PERSON_NODE_Y, 0);
      head.castShadow = true;
      const hair = new THREE.Mesh(hairGeo, hairMat);
      hair.scale.set(1.06, 0.52, 1.04);
      hair.position.set(0, PERSON_NODE_Y + 0.034, -0.02);
      hair.castShadow = true;
      g.add(shoeL, shoeR, legL, legR, torso, armL, armR, head, hair);

      if (opts.phone) {
        const phone = createPhoneGroup();
        phone.position.set(0.1, 0.22, 0.1);
        phone.rotation.set(-0.55, 0.38, 0.12);
        g.add(phone);
      }
      return g;
    }

    type UserRig = { group: THREE.Group; baseY: number; x: number; z: number };
    const userRigs: UserRig[] = [];

    const roofLots = lots.filter((l) => l.roofY > 0.35).sort((a, b) => seeded(a.seed) - seeded(b.seed));
    const onRoof = roofLots.slice(0, 14);
    onRoof.forEach((lot, idx) => {
      const jitter = 0.08;
      const ux = lot.x + (seeded(lot.seed * 5 + idx) - 0.5) * jitter * 2;
      const uz = lot.z + (seeded(lot.seed * 9 + idx) - 0.5) * jitter * 2;
      const y = lot.roofY + 0.02;
      const withPhone = seeded(idx * 17 + 3) > 0.35;
      const g = createPersonGroup({ phone: withPhone });
      g.position.set(ux, y, uz);
      g.rotation.y = lot.rotY + (seeded(idx * 3) - 0.5) * 0.6;
      root.add(g);
      userRigs.push({ group: g, baseY: y, x: ux, z: uz });
    });

    for (let k = 0; k < 9; k++) {
      const ang = seeded(40 + k) * Math.PI * 2;
      const rr = 0.45 + seeded(50 + k) * 1.35;
      const ux = Math.cos(ang) * rr;
      const uz = Math.sin(ang) * rr;
      const y = 0;
      const withPhone = seeded(70 + k) > 0.42;
      const g = createPersonGroup({ phone: withPhone });
      g.position.set(ux, y, uz);
      g.rotation.y = seeded(60 + k) * Math.PI * 2;
      root.add(g);
      userRigs.push({ group: g, baseY: y, x: ux, z: uz });
    }

    for (let pi = 0; pi < 10; pi++) {
      const ang = seeded(180 + pi) * Math.PI * 2;
      const rr = 0.72 + seeded(220 + pi) * 2.35;
      const px = Math.cos(ang) * rr;
      const pz = Math.sin(ang) * rr;
      const stand = new THREE.Group();
      stand.position.set(px, 0, pz);
      stand.rotation.y = seeded(240 + pi) * Math.PI * 2;
      const post = new THREE.Mesh(unitBox, standMat);
      post.scale.set(0.055, 0.09, 0.055);
      post.position.y = 0.045;
      post.castShadow = true;
      post.receiveShadow = true;
      const handset = createPhoneGroup();
      handset.position.set(0, 0.11, 0.02);
      handset.rotation.set(-0.42, 0.15, 0.08);
      stand.add(post, handset);
      root.add(stand);
    }

    const nTowerNodes = towerTipLocal.length;
    const nUserNodes = userRigs.length;
    const userNodeIndexStart = nTowerNodes;

    const pairs: { a: number; b: number; kind: "tower" | "peer" }[] = [];
    const maxUserDist = 2.45;
    const maxTowerDist = 4.5;
    const maxPairs = 58;

    for (let ui = 0; ui < nUserNodes; ui++) {
      const i = userNodeIndexStart + ui;
      let bestT = 0;
      let bestD = Infinity;
      for (let t = 0; t < nTowerNodes; t++) {
        const d = new THREE.Vector3(
          userRigs[ui]!.x,
          userRigs[ui]!.baseY + PERSON_NODE_Y,
          userRigs[ui]!.z
        ).distanceTo(towerTipLocal[t]!);
        if (d < bestD) {
          bestD = d;
          bestT = t;
        }
      }
      if (bestD < maxTowerDist) pairs.push({ a: bestT, b: i, kind: "tower" });
    }

    for (let i = 0; i < nUserNodes; i++) {
      for (let j = i + 1; j < nUserNodes; j++) {
        const ia = userNodeIndexStart + i;
        const ib = userNodeIndexStart + j;
        const ax = userRigs[i]!.x;
        const az = userRigs[i]!.z;
        const bx = userRigs[j]!.x;
        const bz = userRigs[j]!.z;
        const dx = ax - bx;
        const dz = az - bz;
        if (Math.sqrt(dx * dx + dz * dz) < maxUserDist) pairs.push({ a: ia, b: ib, kind: "peer" });
      }
    }

    if (pairs.length > maxPairs) pairs.length = maxPairs;

    const segments = 36;
    const linkGeometries: THREE.BufferGeometry[] = [];
    const linkLines: THREE.Line[] = [];
    const linkMatTower = new THREE.LineBasicMaterial({
      color: success,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const linkMatPeer = new THREE.LineBasicMaterial({
      color: primaryLight,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
    });

    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    );
    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vMid = new THREE.Vector3();

    pairs.forEach((pair) => {
      const pos = new Float32Array((segments + 1) * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const base = pair.kind === "tower" ? linkMatTower : linkMatPeer;
      const line = new THREE.Line(geo, base.clone());
      line.frustumCulled = false;
      line.renderOrder = 2;
      root.add(line);
      linkGeometries.push(geo);
      linkLines.push(line);
    });

    const nNodes = nTowerNodes + nUserNodes;
    const nodeLocalPos = Array.from({ length: nNodes }, () => new THREE.Vector3());

    const onResize = () => {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };

    onResize();
    window.addEventListener("resize", onResize);

    const camRadius = 9.75;
    const camHeight = 3.4;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      root.rotation.y = t * 0.012;

      officeMaterials.forEach((mat, i) => {
        const w = Math.sin(t * 1.4 + i * 0.4);
        mat.emissiveIntensity = (isDark ? 0.05 : 0.025) + w * 0.05 + seeded(i * 1.7) * 0.04;
      });
      homeMaterials.forEach((mat, i) => {
        const w = Math.sin(t * 1.2 + i * 0.31);
        mat.emissiveIntensity = (isDark ? 0.038 : 0.018) + w * 0.025;
      });
      roofHomeMaterials.forEach((mat, i) => {
        mat.emissiveIntensity = (isDark ? 0.065 : 0.025) + Math.sin(t * 1.5 + i) * 0.02;
      });

      capMat.emissiveIntensity = (isDark ? 0.28 : 0.17) + Math.sin(t * 1.7) * 0.05;

      phoneScreenMat.emissiveIntensity = (isDark ? 0.55 : 0.42) + Math.sin(t * 2.8) * 0.12;

      userRigs.forEach((u, i) => {
        const bob = Math.sin(t * 2 + i * 0.33) * 0.022;
        u.group.position.y = u.baseY + bob;
      });

      beaconMat.emissiveIntensity = (isDark ? 0.9 : 0.65) + Math.sin(t * 4) * 0.2;

      fill.position.x = 4 + Math.sin(t * 0.38) * 0.75;
      fill.position.z = 5 + Math.cos(t * 0.33) * 0.55;

      for (let ti = 0; ti < nTowerNodes; ti++) {
        nodeLocalPos[ti]!.copy(towerTipLocal[ti]!);
      }
      userRigs.forEach((u, i) => {
        const p = u.group.position;
        nodeLocalPos[userNodeIndexStart + i]!.set(p.x, p.y + PERSON_NODE_Y, p.z);
      });

      pairs.forEach((pair, idx) => {
        if (idx >= linkLines.length) return;
        const { a: ia, b: ib, kind } = pair;
        vA.copy(nodeLocalPos[ia]!);
        vB.copy(nodeLocalPos[ib]!);
        vMid.copy(vA).lerp(vB, 0.5);
        const lift = kind === "tower" ? 0.52 : 0.42;
        vMid.y += lift + Math.sin(t * 1.45 + idx * 0.29) * 0.065;
        curve.v0.copy(vA);
        curve.v1.copy(vMid);
        curve.v2.copy(vB);
        const pts = curve.getPoints(segments);
        const arr = linkGeometries[idx]!.attributes.position.array as Float32Array;
        for (let p = 0; p <= segments; p++) {
          const pt = pts[p] ?? pts[pts.length - 1];
          arr[p * 3] = pt.x;
          arr[p * 3 + 1] = pt.y;
          arr[p * 3 + 2] = pt.z;
        }
        linkGeometries[idx]!.attributes.position.needsUpdate = true;
        const lm = linkLines[idx]!.material as THREE.LineBasicMaterial;
        if (kind === "tower") {
          lm.opacity = (isDark ? 0.3 : 0.22) + Math.sin(t * 1.7 + idx * 0.3) * 0.09;
        } else {
          lm.opacity = (isDark ? 0.28 : 0.2) + Math.sin(t * 1.8 + idx * 0.31) * 0.085;
        }
      });

      const orbit = t * 0.032;
      camera.position.x = Math.sin(orbit) * camRadius;
      camera.position.z = Math.cos(orbit) * camRadius;
      camera.position.y = camHeight + Math.sin(t * 0.048) * 0.14;
      camera.lookAt(lookTarget);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameId);

      guyLines.forEach((line) => {
        line.geometry.dispose();
        root.remove(line);
      });
      guyWireMat.dispose();

      linkGeometries.forEach((g) => g.dispose());
      linkLines.forEach((line) => (line.material as THREE.Material).dispose());
      linkMatTower.dispose();
      linkMatPeer.dispose();

      officeMaterials.forEach((m) => m.dispose());
      homeMaterials.forEach((m) => m.dispose());
      roofHomeMaterials.forEach((m) => m.dispose());
      capMat.dispose();
      towerMat.dispose();
      armMat.dispose();
      beaconMat.dispose();
      skinMat.dispose();
      shirtMat.dispose();
      pantsMat.dispose();
      shoeMat.dispose();
      hairMat.dispose();
      phoneChassisMat.dispose();
      phoneScreenMat.dispose();
      phoneCamMat.dispose();
      standMat.dispose();
      groundMat.dispose();

      const sharedGeoms = new Set([
        boxGeo,
        capGeo,
        coneGeo,
        unitBox,
        headGeo,
        hairGeo,
        phoneChassisGeo,
        phoneScreenGeo,
        phoneCamGeo,
        mastGeo,
        armGeo,
        armGeoSmall,
        basePadGeo,
        groundGeo,
        beaconGeo,
      ]);
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          const g = obj.geometry;
          if (g && !sharedGeoms.has(g)) g.dispose();
        }
      });
      sharedGeoms.forEach((g) => g.dispose());

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return <div ref={modelContainerRef} className="relative h-full w-full min-h-0 bg-transparent" />;
}
