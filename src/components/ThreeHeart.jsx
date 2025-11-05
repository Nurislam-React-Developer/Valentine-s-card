import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

function createHeartShape() {
  const x = 0, y = 0;
  const heartShape = new THREE.Shape();
  heartShape.moveTo(x + 5, y + 5);
  heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
  heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
  heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
  heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
  heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
  heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);
  return heartShape;
}

const ThreeHeart = ({ accent = '#ff69b4', analyser, analyserData }) => {
  const containerRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return () => {};

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.6, 9);

    // Environment for realistic reflections
    const pmrem = new THREE.PMREMGenerator(renderer);
    let envTex = null;
    try {
      const equirect = makeStudioEquirect(256, 128);
      envTex = pmrem.fromEquirectangular(equirect).texture;
      equirect.dispose();
    } catch (e) {
      envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    }
    scene.environment = envTex;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const dir = new THREE.DirectionalLight(0xffffff, 1.35);
    dir.position.set(4, 8, 6);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    dir.shadow.radius = 4;
    scene.add(dir);
    const rim = new THREE.PointLight(0xffe0e0, 0.6, 40);
    rim.position.set(-6, -2, 6);
    scene.add(rim);

    // Heart mesh
    const shape = createHeartShape();
    const extrudeSettings = {
      depth: 2.2,
      bevelEnabled: true,
      bevelSegments: 16,
      steps: 2,
      bevelSize: 0.6,
      bevelThickness: 0.6,
      curveSegments: 64,
    };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    geometry.scale(0.1, 0.1, 0.1);

    // Procedural micro-stripe normal map (for marble-like anisotropy)
    const normalTex = makeMarbleNormalTexture(128, 128, { frequency: 2.2, turbulence: 3.0, strength: 1.0 });
    normalTex.wrapS = THREE.RepeatWrapping;
    normalTex.wrapT = THREE.RepeatWrapping;
    normalTex.repeat.set(3, 3);
    normalTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(accent), // base red
      metalness: 0.1,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      sheen: 0.7,
      sheenColor: new THREE.Color('#ffffff'),
      reflectivity: 0.7,
      transmission: 0.08, // slight subsurface/translucency feel
      thickness: 0.25,
      attenuationColor: new THREE.Color('#ff2a2a'),
      attenuationDistance: 0.6,
      envMapIntensity: 1.0,
      normalMap: normalTex,
      clearcoatNormalMap: normalTex,
    });
    material.normalScale.set(0.45, 0.25);
    material.clearcoatNormalScale = new THREE.Vector2(0.25, 0.2);

    const mesh = new THREE.Mesh(geometry, material);
    const baseTilt = 0.32;
    mesh.castShadow = true;
    scene.add(mesh);

    // Additive Fresnel highlight overlay (for stronger rim light)
    const fresnelMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color('#ffffff') },
        uPower: { value: 2.5 },
        uIntensity: { value: 0.25 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main(){
          vNormal = normalize(normalMatrix * normal);
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uPower;
        uniform float uIntensity;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main(){
          vec3 N = normalize(vNormal);
          vec3 V = normalize(cameraPosition - vWorldPos);
          float fres = pow(1.0 - max(dot(N, V), 0.0), uPower);
          vec3 col = uColor * fres * uIntensity;
          gl_FragColor = vec4(col, fres * 0.9);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const fresnelMesh = new THREE.Mesh(geometry.clone(), fresnelMat);
    fresnelMesh.scale.setScalar(1.002);
    scene.add(fresnelMesh);

    // Ground to receive soft shadow
    const groundGeo = new THREE.PlaneGeometry(20, 20);
    const groundMat = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.25 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.3;
    ground.receiveShadow = true;
    scene.add(ground);

    // Postprocessing (subtle bloom)
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.75, 0.6, 0.2);
    composer.addPass(renderPass);
    composer.addPass(bloom);

    const resize = () => {
      const size = Math.min(520, Math.max(320, Math.floor(window.innerWidth * 0.55)));
      renderer.setSize(size, size);
      composer.setSize(size, size);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    const start = performance.now();
    const tick = (t) => {
      const elapsed = (t - start) / 1000;
      // Audio reactive amplitude [0..1]
      let amp = 0.0;
      if (analyser && analyserData) {
        try {
          analyser.getByteFrequencyData(analyserData);
          let sum = 0;
          const len = analyserData.length;
          // Emphasize low/mid bands for a nice pulse
          const maxIdx = Math.floor(len * 0.4);
          for (let i = 2; i < maxIdx; i++) sum += analyserData[i];
          const avg = sum / Math.max(1, (maxIdx - 2));
          amp = Math.min(1, avg / 180);
        } catch {}
      }

      // Intro scale ease-out-back
      const intro = Math.min(1, elapsed * 1.2);
      const overshoot = 1.70158;
      const eased = 1 + overshoot * Math.pow(intro - 1, 3) + overshoot * (intro - 1) * Math.pow(intro - 1, 2);

      mesh.rotation.y = Math.sin(elapsed * 0.8 + amp) * 0.28;
      mesh.rotation.x = baseTilt + Math.cos(elapsed * 0.6 + amp * 0.5) * 0.045;
      const s = 0.7 + eased * 0.35 + Math.sin(elapsed * 2) * 0.01 + amp * 0.07;
      mesh.scale.setScalar(s);
      fresnelMesh.rotation.copy(mesh.rotation);
      fresnelMesh.scale.copy(mesh.scale);
      bloom.strength = 0.6 + amp * 0.8;
      composer.render();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      geometry.dispose();
      material.dispose();
      fresnelMat.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      composer.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [accent]);

  return <div className="three-heart" ref={containerRef} />;
};

export default ThreeHeart;

// --- helpers ---
function makeStripedNormalTexture(size = 64, freq = 8) {
  const w = size, h = size;
  const data = new Uint8Array(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const stripe = Math.sin((u * Math.PI * 2.0) * freq) * 0.5 + 0.5; // 0..1
      // Height map gradient dH/du approximate
      const du = Math.cos((u * Math.PI * 2.0) * freq) * (freq * Math.PI);
      const scale = 0.4; // strength
      const nx = du * scale;
      const ny = 0.0;
      const nz = 1.0;
      // normalize
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1.0;
      const N = [nx / len, ny / len, nz / len];
      const i = (y * w + x) * 3;
      data[i + 0] = Math.round((N[0] * 0.5 + 0.5) * 255);
      data[i + 1] = Math.round((N[1] * 0.5 + 0.5) * 255);
      data[i + 2] = Math.round((N[2] * 0.5 + 0.5) * 255);
    }
  }
  const tex = new THREE.DataTexture(data, w, h, THREE.RGBFormat);
  tex.needsUpdate = true;
  tex.flipY = false;
  return tex;
}

function makeMarbleNormalTexture(w = 128, h = 128, { frequency = 2.0, turbulence = 3.0, strength = 1.0 } = {}) {
  // Generate height field using marble function on top of value-noise turbulence
  const height = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const v = y / h;
      const p = marble(u, v, frequency, turbulence);
      height[y * w + x] = p;
    }
  }
  // Convert to normals via sobel/finite differences
  const data = new Uint8Array(w * h * 3);
  const sx = 1 / w, sy = 1 / h;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x);
      const hL = height[y * w + ((x - 1 + w) % w)];
      const hR = height[y * w + ((x + 1) % w)];
      const hD = height[((y - 1 + h) % h) * w + x];
      const hU = height[((y + 1) % h) * w + x];
      const dx = (hR - hL) / (2 * sx);
      const dy = (hU - hD) / (2 * sy);
      let nx = -dx * strength, ny = -dy * strength, nz = 1.0;
      const invLen = 1.0 / Math.sqrt(nx * nx + ny * ny + nz * nz);
      nx *= invLen; ny *= invLen; nz *= invLen;
      const o = idx * 3;
      data[o + 0] = Math.round((nx * 0.5 + 0.5) * 255);
      data[o + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      data[o + 2] = Math.round((nz * 0.5 + 0.5) * 255);
    }
  }
  const tex = new THREE.DataTexture(data, w, h, THREE.RGBFormat);
  tex.needsUpdate = true;
  tex.flipY = false;
  return tex;
}

function marble(u, v, freq, turb) {
  // base coordinates with scale
  const x = u * freq;
  const y = v * freq;
  const t = turbulenceFBM(x, y, 5) * turb;
  // classic marble: sin(x + noise)
  const m = Math.sin((x + t) * Math.PI * 2.0) * 0.5 + 0.5;
  // subtle veins
  const veins = Math.pow(Math.abs(Math.sin((x * 3.0 + y * 1.7 + t * 2.0) * Math.PI)), 16.0);
  return Math.min(1.0, m * 0.85 + veins * 0.35);
}

function turbulenceFBM(x, y, octaves = 4) {
  let sum = 0, amp = 1.0, freq = 1.0;
  for (let i = 0; i < octaves; i++) {
    sum += Math.abs(noise2(x * freq, y * freq)) * amp;
    amp *= 0.5;
    freq *= 2.0;
  }
  return sum;
}

// Simple value-noise 2D with smooth interpolation
function noise2(x, y) {
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const x1 = x0 + 1, y1 = y0 + 1;
  const sx = smooth(x - x0), sy = smooth(y - y0);
  const n00 = hash2(x0, y0);
  const n10 = hash2(x1, y0);
  const n01 = hash2(x0, y1);
  const n11 = hash2(x1, y1);
  const ix0 = lerp(n00, n10, sx);
  const ix1 = lerp(n01, n11, sx);
  return lerp(ix0, ix1, sy);
}
function smooth(t) { return t * t * (3 - 2 * t); }
function lerp(a, b, t) { return a + (b - a) * t; }
function hash2(x, y) {
  let n = x * 127.1 + y * 311.7;
  return fract(Math.sin(n) * 43758.5453) * 2 - 1; // -1..1
}
function fract(x) { return x - Math.floor(x); }

function makeStudioEquirect(w = 256, h = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  // base neutral gray
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, w, h);
  // softboxes: vertical gradients left/right
  const gradL = ctx.createLinearGradient(0, 0, w * 0.4, 0);
  gradL.addColorStop(0, 'rgba(255,255,255,0.95)');
  gradL.addColorStop(1, 'rgba(255,255,255,0.0)');
  ctx.fillStyle = gradL;
  ctx.fillRect(0, h * 0.2, w * 0.35, h * 0.6);

  const gradR = ctx.createLinearGradient(w, 0, w * 0.6, 0);
  gradR.addColorStop(0, 'rgba(255,255,255,0.95)');
  gradR.addColorStop(1, 'rgba(255,255,255,0.0)');
  ctx.fillStyle = gradR;
  ctx.fillRect(w * 0.65, h * 0.1, w * 0.35, h * 0.8);

  // top strip light
  const gradT = ctx.createLinearGradient(0, 0, 0, h * 0.25);
  gradT.addColorStop(0, 'rgba(255,255,255,0.6)');
  gradT.addColorStop(1, 'rgba(255,255,255,0.0)');
  ctx.fillStyle = gradT;
  ctx.fillRect(0, 0, w, h * 0.22);

  const tex = new THREE.CanvasTexture(canvas);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
