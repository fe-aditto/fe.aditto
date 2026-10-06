import * as THREE from "./vendor/three.module.js";
// Interactive network geometry. No remote models or textures are required.
const host = document.querySelector("#network"),
  motionButton = document.querySelector("#motion"),
  rotateButton = document.querySelector("#rotate");
let paused = matchMedia("(prefers-reduced-motion: reduce)").matches,
  drag = false,
  lastX = 0,
  lastY = 0,
  targetX = 0.18,
  targetY = 0.1,
  visible = true;
function motionLabel() {
  motionButton.textContent = paused ? "Play motion" : "Pause motion";
  motionButton.setAttribute("aria-pressed", String(!paused));
}
motionLabel();
try {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0, 0);
  host.append(renderer.domElement);
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 8.8);
  const root = new THREE.Group();
  scene.add(root);
  root.rotation.set(0.18, 0.1, -0.13);
  const geo = new THREE.IcosahedronGeometry(2.02, 2);
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(geo),
    new THREE.LineBasicMaterial({
      color: 0x76af63,
      transparent: true,
      opacity: 0.24,
    }),
  );
  root.add(wire);
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.65, 1),
    new THREE.MeshBasicMaterial({
      color: 0x0a2015,
      transparent: true,
      opacity: 0.82,
      side: THREE.FrontSide,
    }),
  );
  root.add(core);
  const innerWire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.65, 1)),
    new THREE.LineBasicMaterial({
      color: 0xa2ef65,
      transparent: true,
      opacity: 0.46,
    }),
  );
  root.add(innerWire);
  const pos = geo.attributes.position,
    unique = [],
    seen = new Set();
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i);
    const key = v
      .toArray()
      .map((x) => x.toFixed(3))
      .join(",");
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(v);
    }
  }
  const dotGeometry = new THREE.BufferGeometry().setFromPoints(unique);
  root.add(
    new THREE.Points(
      dotGeometry,
      new THREE.PointsMaterial({
        size: 0.028,
        color: 0xc6ff90,
        sizeAttenuation: true,
      }),
    ),
  );
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 64;
  const ctx = glowCanvas.getContext("2d"),
    gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "#efffd7");
  gradient.addColorStop(0.12, "#baff68");
  gradient.addColorStop(0.35, "#73cc6666");
  gradient.addColorStop(1, "#52ff5500");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const glow = new THREE.CanvasTexture(glowCanvas);
  const beaconMaterial = new THREE.SpriteMaterial({
    map: glow,
    color: 0xbdff78,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const beacons = [];
  unique.forEach((p, i) => {
    if (i % 13 === 0) {
      const sprite = new THREE.Sprite(beaconMaterial);
      sprite.position.copy(p);
      sprite.scale.set(0.26, 0.26, 1);
      root.add(sprite);
      beacons.push(sprite);
    }
  });
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const points = [];
    const radius = 2.38 + i * 0.14;
    for (let j = 0; j <= 200; j++) {
      const a = (j / 200) * Math.PI * 2;
      points.push(
        new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0),
      );
    }
    const group = new THREE.Group();
    const ring = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({
        color: i === 1 ? 0xbaff68 : 0x477d59,
        transparent: true,
        opacity: i === 1 ? 0.46 : 0.3,
      }),
    );
    group.add(ring);
    group.rotation.set(0.8 + i * 0.5, 0.4 + i * 0.65, 0.1);
    root.add(group);
    const particle = new THREE.Sprite(beaconMaterial);
    particle.scale.set(0.2, 0.2, 1);
    group.add(particle);
    rings.push({ group, particle, radius, phase: i * 2 });
  }
  const axisPoints = [];
  for (let i = 0; i < 46; i++) {
    const a = (i / 46) * Math.PI * 2;
    const r = i % 5 === 0 ? 2.98 : 2.94;
    axisPoints.push(
      new THREE.Vector3(Math.cos(a) * 2.88, Math.sin(a) * 2.88, 0),
      new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0),
    );
  }
  const ticks = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(axisPoints),
    new THREE.LineBasicMaterial({
      color: 0x599069,
      transparent: true,
      opacity: 0.32,
    }),
  );
  scene.add(ticks);
  const stars = [];
  for (let i = 0; i < 100; i++)
    stars.push(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 8,
      -2 - Math.random() * 3,
    );
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(stars, 3));
  scene.add(
    new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0x97c48e,
        size: 0.012,
        transparent: true,
        opacity: 0.5,
      }),
    ),
  );
  function resize() {
    const w = Math.max(1, host.clientWidth),
      h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = camera.aspect < 0.8 ? 10.7 : 8.8;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host);
  resize();
  host.addEventListener("pointerdown", (e) => {
    drag = true;
    lastX = e.clientX;
    lastY = e.clientY;
    host.setPointerCapture(e.pointerId);
  });
  host.addEventListener("pointermove", (e) => {
    if (!drag) return;
    targetY += (e.clientX - lastX) * 0.008;
    targetX = Math.max(
      -1.2,
      Math.min(1.2, targetX + (e.clientY - lastY) * 0.008),
    );
    lastX = e.clientX;
    lastY = e.clientY;
  });
  ["pointerup", "pointercancel"].forEach((name) =>
    host.addEventListener(name, () => (drag = false)),
  );
  rotateButton.addEventListener("click", () => (targetY += Math.PI / 4));
  document.querySelector("#reset-view").addEventListener("click", () => {
    targetX = 0.18;
    targetY = 0.1;
  });
  host.addEventListener("keydown", (e) => {
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(
        e.key,
      )
    )
      return;
    e.preventDefault();
    if (e.key === "ArrowLeft") targetY -= 0.2;
    if (e.key === "ArrowRight") targetY += 0.2;
    if (e.key === "ArrowUp") targetX = Math.max(-1.2, targetX - 0.15);
    if (e.key === "ArrowDown") targetX = Math.min(1.2, targetX + 0.15);
    if (e.key === "Home") {
      targetX = 0.18;
      targetY = 0.1;
    }
  });
  motionButton.addEventListener("click", () => {
    paused = !paused;
    motionLabel();
  });
  new IntersectionObserver(
    (entries) => (visible = entries[0].isIntersecting),
  ).observe(host);
  let previous = 0,
    time = 0,
    lastRender = 0;
  function render(now) {
    requestAnimationFrame(render);
    const dt = Math.min((now - previous) / 1000, 0.05);
    previous = now;
    if (!visible || document.hidden) return;
    const unsettled =
      Math.abs(targetX - root.rotation.x) +
        Math.abs(targetY - root.rotation.y) >
      0.0001;
    if (paused && !unsettled && now - lastRender < 200) return;
    if (now - lastRender < 1000 / 45) return;
    lastRender = now;
    if (!paused && !drag) {
      targetY += dt * 0.065;
      time += dt;
    }
    root.rotation.x += (targetX - root.rotation.x) * 0.08;
    root.rotation.y += (targetY - root.rotation.y) * 0.08;
    root.position.y = paused ? 0 : Math.sin(time * 0.6) * 0.045;
    rings.forEach(({ particle, radius, phase }) =>
      particle.position.set(
        Math.cos(time * 0.32 + phase) * radius,
        Math.sin(time * 0.32 + phase) * radius,
        0,
      ),
    );
    beacons.forEach((s, i) => {
      const scale = 0.2 + Math.sin(time * 1.5 + i) * 0.05;
      s.scale.set(scale, scale, 1);
    });
    document.querySelector("#coord").textContent = root.rotation.y.toFixed(3);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(render);
} catch (error) {
  console.warn("3D visualization unavailable", error);
  host.classList.add("network-unavailable");
  host.textContent = "Explore the profile, skills, and labs below.";
  motionButton.disabled = true;
  rotateButton.disabled = true;
  document.querySelector("#reset-view").disabled = true;
}
