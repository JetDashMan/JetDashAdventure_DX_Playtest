import * as THREE from "three";

const canvas = document.querySelector("#game");
const dnaEl = document.querySelector("#dna");
const speedEl = document.querySelector("#speed");
const timeEl = document.querySelector("#time");
const scoreEl = document.querySelector("#score");
const progressEl = document.querySelector("#progress");
const heightEl = document.querySelector("#height");
const boostGaugeEl = document.querySelector("#boost-gauge");
const boostFillEl = document.querySelector("#boost-fill");
const finishEl = document.querySelector("#finish");
const finishKickerEl = document.querySelector("#finish-kicker");
const finishTimeEl = document.querySelector("#finish-time");
const finishScoreEl = document.querySelector("#finish-score");
const nextStageButton = document.querySelector("#next-stage");
const restartButton = document.querySelector("#restart");
const musicButton = document.querySelector("#music-toggle");
const graphicsButton = document.querySelector("#graphics-toggle");
const graphicsPanel = document.querySelector("#graphics-panel");
const debugButton = document.querySelector("#debug-toggle");
const debugPanel = document.querySelector("#debug-panel");
const mouseObjectLabelEl = document.querySelector("#mouse-object-label");
const helpButton = document.querySelector("#help-toggle");
const helpPanel = document.querySelector("#help-panel");
const menuButton = document.querySelector("#menu-toggle");
const menuPanel = document.querySelector("#menu-panel");
const pauseButton = document.querySelector("#pause-toggle");
const pauseMenu = document.querySelector("#pause-menu");
const resumeButton = document.querySelector("#resume-game");
const stageMenuToggle = document.querySelector("#stage-menu-toggle");
const stageMenu = document.querySelector("#stage-menu");
const stageSelectButtons = document.querySelectorAll("[data-stage-select]");
const tutorialPromptEl = document.querySelector("#tutorial-prompt");
const rotatePromptEl = document.querySelector("#rotate-prompt");
const touchControlsEl = document.querySelector("#touch-controls");
const touchControlButtons = document.querySelectorAll("[data-touch-control]");
const fullscreenButton = document.querySelector("#fullscreen-toggle");
const loadingScreenEl = document.querySelector("#loading-screen");
const loadingProgressEl = document.querySelector("#loading-progress");
const loadingStatusEl = document.querySelector("#loading-status");
const debugProgressButtons = document.querySelectorAll("[data-debug-progress]");
const graphicsControls = {
  preset: document.querySelector("#graphics-preset"),
  renderScale: document.querySelector("#graphics-render-scale"),
  mobileRenderScale: document.querySelector("#graphics-mobile-render-scale"),
  shadowQuality: document.querySelector("#graphics-shadow-quality"),
  shadowSoftness: document.querySelector("#graphics-shadow-softness"),
  shadowDistance: document.querySelector("#graphics-shadow-distance"),
  motionBlur: document.querySelector("#graphics-motion-blur"),
  textureQuality: document.querySelector("#graphics-texture-quality"),
  waterQuality: document.querySelector("#graphics-water-quality"),
  viewDistance: document.querySelector("#graphics-view-distance"),
  lighting: document.querySelector("#graphics-lighting"),
  frameCap: document.querySelector("#graphics-frame-cap"),
};
const debugControls = {
  superBoost: document.querySelector("#debug-super-boost"),
  infiniteJump: document.querySelector("#debug-infinite-jump"),
  mouseObject: document.querySelector("#debug-mouse-object"),
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x75cbef);
scene.fog = new THREE.Fog(0x75cbef, 140, 3050);

const camera = new THREE.PerspectiveCamera(71, 1, 0.1, 3400);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const graphicsStorageKey = "jetdash-graphics-settings";
const graphicsPresets = {
  low: {
    renderScale: "0.75",
    mobileRenderScale: "0.75",
    shadowQuality: "off",
    shadowSoftness: "hard",
    shadowDistance: "near",
    motionBlur: "off",
    textureQuality: "low",
    waterQuality: "low",
    viewDistance: "low",
    lighting: "standard",
    frameCap: "60",
  },
  medium: {
    renderScale: "1",
    mobileRenderScale: "1",
    shadowQuality: "medium",
    shadowSoftness: "hard",
    shadowDistance: "medium",
    motionBlur: "medium",
    textureQuality: "medium",
    waterQuality: "medium",
    viewDistance: "medium",
    lighting: "enhanced",
    frameCap: "60",
  },
  high: {
    renderScale: "1.25",
    mobileRenderScale: "1.5",
    shadowQuality: "high",
    shadowSoftness: "soft",
    shadowDistance: "far",
    motionBlur: "high",
    textureQuality: "high",
    waterQuality: "high",
    viewDistance: "high",
    lighting: "cinematic",
    frameCap: "unlimited",
  },
  ultra: {
    renderScale: "1.5",
    mobileRenderScale: "2",
    shadowQuality: "ultra",
    shadowSoftness: "soft",
    shadowDistance: "ultra",
    motionBlur: "ultra",
    textureQuality: "ultra",
    waterQuality: "ultra",
    viewDistance: "ultra",
    lighting: "cinematic",
    frameCap: "unlimited",
  },
};
const graphicsDefaults = { preset: "medium", ...graphicsPresets.medium };
const asphaltTextureQualityConfig = {
  low: {
    baseColor: "./assets/textures/asphalt/busan_coastal_asphalt_basecolor_256.jpg",
    normal: "./assets/textures/asphalt/busan_coastal_asphalt_normal_256.png",
    roughness: "./assets/textures/asphalt/busan_coastal_asphalt_roughness_256.jpg",
    ao: "./assets/textures/asphalt/busan_coastal_asphalt_ao_256.jpg",
  },
  medium: {
    baseColor: "./assets/textures/asphalt/busan_coastal_asphalt_basecolor_512.jpg",
    normal: "./assets/textures/asphalt/busan_coastal_asphalt_normal_512.png",
    roughness: "./assets/textures/asphalt/busan_coastal_asphalt_roughness_512.jpg",
    ao: "./assets/textures/asphalt/busan_coastal_asphalt_ao_512.jpg",
  },
  high: {
    baseColor: "./assets/textures/asphalt/busan_coastal_asphalt_basecolor_1024.jpg",
    normal: "./assets/textures/asphalt/busan_coastal_asphalt_normal_1024.png",
    roughness: "./assets/textures/asphalt/busan_coastal_asphalt_roughness_1024.jpg",
    ao: "./assets/textures/asphalt/busan_coastal_asphalt_ao_1024.jpg",
  },
  ultra: {
    baseColor: "./assets/textures/asphalt/busan_coastal_asphalt_basecolor.png",
    normal: "./assets/textures/asphalt/busan_coastal_asphalt_normal.png",
    roughness: "./assets/textures/asphalt/busan_coastal_asphalt_roughness.png",
    ao: "./assets/textures/asphalt/busan_coastal_asphalt_ao.png",
  },
};
const skyTextureQualityConfig = {
  low: "./assets/textures/sky/blue_cloud_sky_512x256.jpg",
  medium: "./assets/textures/sky/blue_cloud_sky_1024x512.jpg",
  high: "./assets/textures/sky/blue_cloud_sky_2048x1024.jpg",
  ultra: "./assets/textures/sky/blue_cloud_sky_4096x2048.jpg",
};
const shadowQualityConfig = {
  off: { enabled: false, size: 256 },
  low: { enabled: true, size: 512 },
  medium: { enabled: true, size: 1024 },
  high: { enabled: true, size: 2048 },
  ultra: { enabled: true, size: 4096 },
};
const shadowDistanceConfig = {
  near: { far: 150, bounds: 76, lead: 12 },
  medium: { far: 210, bounds: 104, lead: 18 },
  far: { far: 320, bounds: 150, lead: 30 },
  ultra: { far: 470, bounds: 215, lead: 46 },
};
const viewDistanceConfig = {
  low: { fogNear: 110, fogFar: 1750, cameraFar: 1900 },
  medium: { fogNear: 180, fogFar: 3050, cameraFar: 3400 },
  high: { fogNear: 260, fogFar: 4700, cameraFar: 5200 },
  ultra: { fogNear: 420, fogFar: 7600, cameraFar: 8200 },
};
const lightingConfig = {
  standard: { hemi: 0.9, sun: 1.85, exposure: 1.0, toneMapping: THREE.CineonToneMapping },
  enhanced: { hemi: 1.05, sun: 2.35, exposure: 1.05, toneMapping: THREE.ACESFilmicToneMapping },
  cinematic: { hemi: 1.18, sun: 2.75, exposure: 1.12, toneMapping: THREE.ACESFilmicToneMapping },
};
const motionBlurStrengthConfig = {
  off: 0,
  low: 0.42,
  medium: 1,
  high: 1.45,
  ultra: 1.8,
};
const waterQualityConfig = {
  low: {
    segments: 12,
    amplitude: 0.08,
    detail: 0.32,
    foam: 0,
    sparkle: 0.06,
    fresnel: 0.28,
    speed: 0.62,
  },
  medium: {
    segments: 48,
    amplitude: 0.18,
    detail: 0.55,
    foam: 0.16,
    sparkle: 0.16,
    fresnel: 0.44,
    speed: 0.78,
  },
  high: {
    segments: 96,
    amplitude: 0.34,
    detail: 0.82,
    foam: 0.34,
    sparkle: 0.3,
    fresnel: 0.62,
    speed: 0.92,
  },
  ultra: {
    segments: 176,
    amplitude: 0.58,
    detail: 1.18,
    foam: 0.58,
    sparkle: 0.52,
    fresnel: 0.86,
    speed: 1.08,
  },
};
const debugStorageKey = "jetdash-debug-settings";
const debugDefaults = {
  superBoost: false,
  infiniteJump: false,
  mouseObject: false,
};
let graphicsSettings = loadGraphicsSettings();
let debugSettings = loadDebugSettings();
let lastFrameTime = 0;

const sceneRenderTarget = new THREE.WebGLRenderTarget(1, 1, {
  depthBuffer: true,
  stencilBuffer: false,
  samples: renderer.capabilities.isWebGL2 ? 2 : 0,
});
sceneRenderTarget.texture.name = "BoostMotionBlurTarget";

const postScene = new THREE.Scene();
const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
const boostMotionBlurMaterial = new THREE.ShaderMaterial({
  name: "BoostMotionBlurMaterial",
  uniforms: {
    tDiffuse: { value: sceneRenderTarget.texture },
    uStrength: { value: 0 },
    uAspect: { value: 1 },
    uCenter: { value: new THREE.Vector2(0.5, 0.54) },
  },
  depthTest: false,
  depthWrite: false,
  toneMapped: false,
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uStrength;
    uniform float uAspect;
    uniform vec2 uCenter;

    varying vec2 vUv;

    void main() {
      vec4 baseColor = texture2D(tDiffuse, vUv);
      if (uStrength <= 0.001) {
        gl_FragColor = baseColor;
        #include <colorspace_fragment>
        return;
      }

      vec2 radial = vUv - uCenter;
      vec2 aspectRadial = vec2(radial.x * uAspect, radial.y);
      float edgeAmount = smoothstep(0.14, 0.78, length(aspectRadial));
      float blurAmount = uStrength * (0.0025 + edgeAmount * 0.02);

      vec4 blurredColor = vec4(0.0);
      blurredColor += baseColor * 0.22;
      blurredColor += texture2D(tDiffuse, vUv - radial * blurAmount * 0.35) * 0.18;
      blurredColor += texture2D(tDiffuse, vUv - radial * blurAmount * 0.75) * 0.17;
      blurredColor += texture2D(tDiffuse, vUv - radial * blurAmount * 1.15) * 0.14;
      blurredColor += texture2D(tDiffuse, vUv - radial * blurAmount * 1.65) * 0.11;
      blurredColor += texture2D(tDiffuse, vUv - radial * blurAmount * 2.25) * 0.08;
      blurredColor += texture2D(tDiffuse, vUv - radial * blurAmount * 2.95) * 0.06;
      blurredColor += texture2D(tDiffuse, vUv - radial * blurAmount * 3.75) * 0.04;

      float blurMix = edgeAmount * clamp(uStrength * 0.34, 0.0, 0.68);
      vec4 color = vec4(mix(baseColor.rgb, blurredColor.rgb, blurMix), baseColor.a);

      gl_FragColor = color;
      #include <colorspace_fragment>
    }
  `,
});
const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), boostMotionBlurMaterial);
postQuad.frustumCulled = false;
postScene.add(postQuad);

const clock = new THREE.Clock();
const mouseObjectRaycaster = new THREE.Raycaster();
const mouseObjectPointer = new THREE.Vector2();
const mouseObjectPointerState = {
  active: false,
  clientX: 0,
  clientY: 0,
  raf: 0,
};
const worldUp = new THREE.Vector3(0, 1, 0);
const sunFollowOffset = new THREE.Vector3(-28, 46, 24);
const playerStart = new THREE.Vector3(0, 2.2, 20);
const lanes = [-4.2, 0, 4.2];
const stageRoutes = ["1", "2"];
const defaultStageRoute = "1";
const stageCount = stageRoutes.length;
const urlParams = new URLSearchParams(window.location.search);
const requestedStageRoute = urlParams.get("stage") || defaultStageRoute;
const debugStartZParam = urlParams.get("debugStartZ");
const debugStartZ = debugStartZParam === null ? Number.NaN : Number(debugStartZParam);
const currentStageIndex = getStageIndex(requestedStageRoute);
const currentStage = createStageDefinition(currentStageIndex);
const goalZ = currentStage.goalZ;
const stageEndZ = getStageEndZ(currentStage);
const stageStartZ = currentStage.startZ ?? playerStart.z;
const stageStart = new THREE.Vector3(playerStart.x, playerStart.y, stageStartZ);
const stageLength = stageStartZ - stageEndZ;
const stageCurve = createStageCurve(currentStage.curvePoints);
const rollClearStartZ = currentStage.rollClearStartZ;
const rollClearEndZ = currentStage.rollClearEndZ;
const rollLiftHeight = currentStage.rollLiftHeight;
const quickStepDuration = 0.1;
const quickStepDistance = 4.2;
const quickStepCooldownDuration = 0.015;
const quickStepLaneSnapEpsilon = 0.05;
const speedDisplayScale = 3.2;
const debugSuperBoostSpeed = 2000 / speedDisplayScale;
const seaLevelY = -8.2;
const runTopSpeed = 46;
const reverseTopSpeed = 147 / speedDisplayScale;
const boostTopSpeed = 300 / speedDisplayScale;
const maxHorizontalSpeed = 400 / speedDisplayScale;
const boostGaugeMax = 100;
const boostDrainPerSecond = 10;
const dnaBoostGaugeGain = 5;
const dnaScoreValue = 100;
const obstacleScorePenalty = 1000;
const dashPadSpeedGain = 100 / speedDisplayScale;
const dashPadFadeDuration = 3;
const hitStunDuration = 1;
const groundSnapDistance = 1.35;
const dashPadPlacements = currentStage.dashPads;
const obstaclePlacements = currentStage.obstacles;
const storedStageScore = Number(window.sessionStorage.getItem("dx-speed-stage-score"));
const carriedStageScore = currentStageIndex > 0 && Number.isFinite(storedStageScore) ? storedStageScore : 0;
window.sessionStorage.removeItem("dx-speed-stage-score");

const trackSegments = [];
const dnaItems = [];
const dashPads = [];
const obstacles = [];
const looseDnaItems = [];
const trail = [];
const staticStageFrameCache = new Map();
const staticStageSceneryFrameCache = new Map();
let waterMesh;
let waterMaterial;
let waterTime = 0;
let collectedDna = 0;
let score = 0;
let startedAt = performance.now();
let finished = false;
let jumpQueued = false;
let jumpHoldRemaining = 0;
let jumpImpact = 0;
let hitCooldown = 0;
let hitStun = 0;
let runPhase = 0;
let quickStepQueued = 0;
let quickStepDirection = 0;
let quickStepTimer = 0;
let quickStepCooldown = 0;
let quickStepStartX = 0;
let quickStepTargetX = 0;
let quickStepFlash = 0;
let boostGauge = boostGaugeMax;
let boostMotionBlurTarget = 0;
let boostMotionBlurStrength = 0;
let playerBoostEffectActive = false;
let cameraYawOffset = 0;
let cameraPitchOffset = 0;
let dashPadBoostStartSpeed = 0;
let dashPadBoostRemaining = 0;
let debugSuperBoostActive = false;
const defaultStageMusicUrl = "./assets/audio/The_Final_Straightaway.mp3";
const stageMusicUrls = [
  "./assets/audio/Salt_and_Steel.mp3",
  defaultStageMusicUrl,
];
const stageMusicUrl = stageMusicUrls[currentStageIndex] || defaultStageMusicUrl;
const stageMusicVolume = 0.62;
let musicWanted = true;
let musicStarted = false;
let musicAudio;
let isPaused = false;
let pauseStartedAt = 0;
let musicWasPlayingBeforePause = false;
let hemiLight;
let sunLight;
let sunTarget;

const keys = new Set();
const touchControlsEnabled = Boolean(
  touchControlsEl
    && (
      window.matchMedia?.("(pointer: coarse)").matches
      || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    ),
);
const touchInput = {
  activePointers: new Map(),
  autoForward: false,
  runStarted: false,
  brake: false,
  boost: false,
  jump: false,
};
const player = {
  radius: 0.82,
  yaw: 0,
  grounded: false,
  position: stageStart.clone(),
  velocity: new THREE.Vector3(),
};

let loadingScreenHideScheduled = false;
const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (_url, loaded, total) => {
  const progress = total > 0 ? THREE.MathUtils.clamp(loaded / total, 0.08, 1) : 0.08;
  if (loadingProgressEl) loadingProgressEl.style.width = `${Math.round(progress * 100)}%`;
  if (loadingStatusEl) loadingStatusEl.textContent = `Loading road textures ${loaded}/${Math.max(total, loaded)}`;
  if (progress >= 1) {
    scheduleHideLoadingScreen();
  }
};
loadingManager.onError = () => {
  if (loadingStatusEl) loadingStatusEl.textContent = "Loading issue detected, continuing";
};
loadingManager.onLoad = scheduleHideLoadingScreen;
window.setTimeout(() => scheduleHideLoadingScreen(), 12000);

function scheduleHideLoadingScreen() {
  if (loadingScreenHideScheduled) return;
  loadingScreenHideScheduled = true;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => hideLoadingScreen());
  });
}

const textureLoader = new THREE.TextureLoader(loadingManager);
const textureAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
const roadTextureTileMeters = 10;
const materialTextureQualitySuffix = {
  low: "_256",
  medium: "_512",
  high: "_1024",
  ultra: "",
};
const realtimeMaterialTextureBindings = [];
const realtimeMaterialTextureCache = new Map();
let activeAsphaltTextureQuality = graphicsSettings.textureQuality;
let activeMaterialTextureQuality = graphicsSettings.textureQuality;
let activeSkyTextureQuality = graphicsSettings.textureQuality;
let asphaltRoadTextures = createAsphaltTextureSet(activeAsphaltTextureQuality);
let skyTexture = createSkyTexture(activeSkyTextureQuality);
let skyDomeMesh;

const materials = {
  track: new THREE.MeshStandardMaterial({
    color: 0x1fb36b,
    roughness: 0.64,
    metalness: 0.02,
  }),
  trackAlt: new THREE.MeshStandardMaterial({
    color: 0x42c878,
    roughness: 0.62,
    metalness: 0.02,
  }),
  side: new THREE.MeshStandardMaterial({
    color: 0x137a55,
    roughness: 0.8,
  }),
  rail: new THREE.MeshStandardMaterial({
    color: 0xf3f6ff,
    roughness: 0.52,
  }),
  railStripe: new THREE.MeshStandardMaterial({
    color: 0xef5b4d,
    roughness: 0.44,
  }),
  gwangalliRail: new THREE.MeshStandardMaterial({
    color: 0xf2f6f7,
    roughness: 0.42,
    metalness: 0.08,
  }),
  gwangalliRailStripe: new THREE.MeshStandardMaterial({
    color: 0xc5d1d6,
    roughness: 0.48,
    metalness: 0.08,
  }),
  harborRail: new THREE.MeshStandardMaterial({
    color: 0x707f82,
    roughness: 0.56,
    metalness: 0.18,
  }),
  harborRailStripe: new THREE.MeshStandardMaterial({
    color: 0xf0c238,
    roughness: 0.42,
    metalness: 0.04,
  }),
  dna: new THREE.MeshBasicMaterial({
    vertexColors: true,
  }),
  dashPad: new THREE.MeshStandardMaterial({
    color: 0x18e6ff,
    emissive: 0x0ba4ff,
    emissiveIntensity: 0.8,
    roughness: 0.2,
  }),
  dashArrow: new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xb9f7ff,
    emissiveIntensity: 0.5,
    roughness: 0.3,
  }),
  goal: new THREE.MeshStandardMaterial({
    color: 0xffdf50,
    emissive: 0x825300,
    emissiveIntensity: 0.35,
    roughness: 0.35,
    metalness: 0.2,
  }),
  obstacle: new THREE.MeshStandardMaterial({
    color: 0xd74136,
    emissive: 0x3d0703,
    emissiveIntensity: 0.2,
    roughness: 0.48,
    metalness: 0.08,
  }),
  obstacleDark: new THREE.MeshStandardMaterial({
    color: 0x252a32,
    roughness: 0.5,
    metalness: 0.15,
  }),
  obstacleStripe: new THREE.MeshStandardMaterial({
    color: 0xffe05a,
    emissive: 0x9a6500,
    emissiveIntensity: 0.25,
    roughness: 0.35,
  }),
  speedsterBlue: new THREE.MeshStandardMaterial({
    color: 0x126dff,
    emissive: 0x003d9b,
    emissiveIntensity: 0.2,
    roughness: 0.34,
    metalness: 0.03,
  }),
  speedsterSkin: new THREE.MeshStandardMaterial({
    color: 0xf3b477,
    roughness: 0.48,
  }),
  eyeWhite: new THREE.MeshStandardMaterial({
    color: 0xf7fbff,
    roughness: 0.25,
  }),
  pupil: new THREE.MeshStandardMaterial({
    color: 0x101820,
    roughness: 0.35,
  }),
  glove: new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.38,
  }),
  shoe: new THREE.MeshStandardMaterial({
    color: 0xe33134,
    roughness: 0.36,
  }),
  shoeSole: new THREE.MeshStandardMaterial({
    color: 0xf7f7ef,
    roughness: 0.42,
  }),
  jetHoodie: new THREE.MeshStandardMaterial({
    color: 0xf1f3f4,
    roughness: 0.54,
    metalness: 0.02,
  }),
  jetHoodieShadow: new THREE.MeshStandardMaterial({
    color: 0xc9cdd0,
    roughness: 0.6,
    metalness: 0.02,
  }),
  jetPants: new THREE.MeshStandardMaterial({
    color: 0xbb2024,
    roughness: 0.48,
    metalness: 0.02,
  }),
  jetPantsTrim: new THREE.MeshStandardMaterial({
    color: 0xf4f6f8,
    roughness: 0.45,
  }),
  jetHarness: new THREE.MeshStandardMaterial({
    color: 0x15191f,
    roughness: 0.42,
    metalness: 0.08,
  }),
  jetHarnessPlate: new THREE.MeshStandardMaterial({
    color: 0x4a525b,
    roughness: 0.34,
    metalness: 0.28,
  }),
  jetHair: new THREE.MeshStandardMaterial({
    color: 0x2b1f1a,
    roughness: 0.58,
  }),
  jetSkin: new THREE.MeshStandardMaterial({
    color: 0xf1b98f,
    roughness: 0.5,
  }),
  jetEyeBlue: new THREE.MeshStandardMaterial({
    color: 0x1163d8,
    emissive: 0x07245a,
    emissiveIntensity: 0.15,
    roughness: 0.28,
  }),
  jetShoeWhite: new THREE.MeshStandardMaterial({
    color: 0xf7f8f6,
    roughness: 0.38,
  }),
  jetShoeSole: new THREE.MeshStandardMaterial({
    color: 0x20252b,
    roughness: 0.5,
  }),
  jetAccentRed: new THREE.MeshStandardMaterial({
    color: 0xd0262c,
    roughness: 0.4,
  }),
  jetEnergy: new THREE.MeshBasicMaterial({
    color: 0x24d9ff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
  harborRoad: new THREE.MeshStandardMaterial({
    color: 0xe2ecef,
    map: asphaltRoadTextures.baseColor,
    normalMap: asphaltRoadTextures.normal,
    normalScale: new THREE.Vector2(0.55, 0.55),
    roughnessMap: asphaltRoadTextures.roughness,
    aoMap: asphaltRoadTextures.ao,
    aoMapIntensity: 0.45,
    roughness: 0.74,
    metalness: 0.03,
  }),
  harborRoadAlt: new THREE.MeshStandardMaterial({
    color: 0xd6e0e3,
    map: asphaltRoadTextures.baseColor,
    normalMap: asphaltRoadTextures.normal,
    normalScale: new THREE.Vector2(0.5, 0.5),
    roughnessMap: asphaltRoadTextures.roughness,
    aoMap: asphaltRoadTextures.ao,
    aoMapIntensity: 0.42,
    roughness: 0.78,
    metalness: 0.03,
  }),
  harborDock: new THREE.MeshStandardMaterial({
    color: 0x64757d,
    roughness: 0.78,
    metalness: 0.02,
  }),
  harborDockDark: new THREE.MeshStandardMaterial({
    color: 0x35484f,
    roughness: 0.84,
  }),
  gwangalliRoad: new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: asphaltRoadTextures.baseColor,
    normalMap: asphaltRoadTextures.normal,
    normalScale: new THREE.Vector2(0.58, 0.58),
    roughnessMap: asphaltRoadTextures.roughness,
    aoMap: asphaltRoadTextures.ao,
    aoMapIntensity: 0.5,
    roughness: 0.72,
    metalness: 0.04,
  }),
  gwangalliRoadAlt: new THREE.MeshStandardMaterial({
    color: 0xe6edf0,
    map: asphaltRoadTextures.baseColor,
    normalMap: asphaltRoadTextures.normal,
    normalScale: new THREE.Vector2(0.52, 0.52),
    roughnessMap: asphaltRoadTextures.roughness,
    aoMap: asphaltRoadTextures.ao,
    aoMapIntensity: 0.46,
    roughness: 0.76,
    metalness: 0.04,
  }),
  gwangalliTunnelRoad: new THREE.MeshStandardMaterial({
    color: 0xb7bbbc,
    map: asphaltRoadTextures.baseColor,
    normalMap: asphaltRoadTextures.normal,
    normalScale: new THREE.Vector2(0.42, 0.42),
    roughnessMap: asphaltRoadTextures.roughness,
    aoMap: asphaltRoadTextures.ao,
    aoMapIntensity: 0.34,
    roughness: 0.82,
    metalness: 0.03,
  }),
  gwangalliTunnelRoadAlt: new THREE.MeshStandardMaterial({
    color: 0xa8adaf,
    map: asphaltRoadTextures.baseColor,
    normalMap: asphaltRoadTextures.normal,
    normalScale: new THREE.Vector2(0.38, 0.38),
    roughnessMap: asphaltRoadTextures.roughness,
    aoMap: asphaltRoadTextures.ao,
    aoMapIntensity: 0.3,
    roughness: 0.84,
    metalness: 0.03,
  }),
  gwangalliBoardwalk: new THREE.MeshStandardMaterial({
    color: 0xc49058,
    roughness: 0.78,
  }),
  gwangalliBridge: new THREE.MeshStandardMaterial({
    color: 0xf5f8fb,
    roughness: 0.46,
    metalness: 0.12,
  }),
  gwangalliBridgeCable: new THREE.MeshStandardMaterial({
    color: 0xf1f6f7,
    roughness: 0.34,
    metalness: 0.08,
  }),
  gwangalliBuilding: new THREE.MeshStandardMaterial({
    color: 0x47616f,
    roughness: 0.56,
    metalness: 0.08,
  }),
  gwangalliBuildingLight: new THREE.MeshStandardMaterial({
    color: 0xd8f0ff,
    emissive: 0x75caff,
    emissiveIntensity: 0.18,
    roughness: 0.32,
  }),
  gwangalliWindow: new THREE.MeshStandardMaterial({
    color: 0x9ed9ff,
    emissive: 0x4ca4e8,
    emissiveIntensity: 0.22,
    roughness: 0.24,
  }),
  gwangalliIparkGlass: new THREE.MeshStandardMaterial({
    color: 0x86b6c7,
    roughness: 0.28,
    metalness: 0.26,
  }),
  gwangalliIparkDarkGlass: new THREE.MeshStandardMaterial({
    color: 0x2f5364,
    roughness: 0.32,
    metalness: 0.22,
  }),
  gwangalliIparkFacade: new THREE.MeshStandardMaterial({
    color: 0xd7e8ee,
    roughness: 0.42,
    metalness: 0.12,
  }),
  haeundaeExordiumGlass: new THREE.MeshStandardMaterial({
    color: 0x457a8d,
    roughness: 0.32,
    metalness: 0.18,
  }),
  haeundaeExordiumBalcony: new THREE.MeshStandardMaterial({
    color: 0xdce8ea,
    roughness: 0.48,
    metalness: 0.08,
  }),
  haeundaeExordiumCore: new THREE.MeshStandardMaterial({
    color: 0x244250,
    roughness: 0.38,
    metalness: 0.18,
  }),
  hyegangSchoolWall: new THREE.MeshStandardMaterial({
    color: 0xd8d7cf,
    roughness: 0.68,
    metalness: 0.02,
  }),
  hyegangSchoolTrim: new THREE.MeshStandardMaterial({
    color: 0x58636b,
    roughness: 0.58,
    metalness: 0.04,
  }),
  hyegangSchoolGlass: new THREE.MeshStandardMaterial({
    color: 0x86c1c5,
    emissive: 0x316f78,
    emissiveIntensity: 0.08,
    roughness: 0.3,
    metalness: 0.12,
  }),
  hyegangSchoolField: new THREE.MeshStandardMaterial({
    color: 0xb79878,
    roughness: 0.92,
    metalness: 0.0,
  }),
  hyegangSchoolLine: new THREE.MeshBasicMaterial({
    color: 0xf5f0e6,
    transparent: true,
    opacity: 0.82,
  }),
  noiseWallConcrete: new THREE.MeshStandardMaterial({
    color: 0x6d7370,
    roughness: 0.84,
    metalness: 0.03,
  }),
  noiseWallFrame: new THREE.MeshStandardMaterial({
    color: 0xa9b3b8,
    roughness: 0.46,
    metalness: 0.16,
  }),
  noiseWallGreen: new THREE.MeshStandardMaterial({
    color: 0x7a9078,
    roughness: 0.54,
    metalness: 0.02,
  }),
  noiseWallGlass: new THREE.MeshStandardMaterial({
    color: 0xbdd2cf,
    transparent: true,
    opacity: 0.58,
    roughness: 0.2,
    metalness: 0.02,
    side: THREE.DoubleSide,
  }),
  noiseWallBlue: new THREE.MeshStandardMaterial({
    color: 0x64b7d7,
    transparent: true,
    opacity: 0.68,
    roughness: 0.22,
    metalness: 0.02,
    side: THREE.DoubleSide,
  }),
  noiseWallOrange: new THREE.MeshStandardMaterial({
    color: 0xd47142,
    transparent: true,
    opacity: 0.72,
    roughness: 0.24,
    metalness: 0.02,
    side: THREE.DoubleSide,
  }),
  rightCityGlass: new THREE.MeshStandardMaterial({
    color: 0xa8ddea,
    emissive: 0x2e6b86,
    emissiveIntensity: 0.06,
    roughness: 0.18,
    metalness: 0.34,
  }),
  rightCityDarkGlass: new THREE.MeshStandardMaterial({
    color: 0x345f78,
    emissive: 0x123047,
    emissiveIntensity: 0.08,
    roughness: 0.2,
    metalness: 0.32,
  }),
  rightCityFacade: new THREE.MeshStandardMaterial({
    color: 0xd9eef0,
    roughness: 0.26,
    metalness: 0.22,
  }),
  bexcoWall: new THREE.MeshStandardMaterial({
    color: 0x3f464c,
    roughness: 0.66,
    metalness: 0.08,
  }),
  bexcoGlass: new THREE.MeshStandardMaterial({
    color: 0x5c9eae,
    roughness: 0.28,
    metalness: 0.18,
  }),
  marinaDock: new THREE.MeshStandardMaterial({
    color: 0x8499a1,
    roughness: 0.72,
    metalness: 0.04,
  }),
  marinaPost: new THREE.MeshStandardMaterial({
    color: 0xe9f1f2,
    roughness: 0.38,
    metalness: 0.1,
  }),
  beachLamp: new THREE.MeshStandardMaterial({
    color: 0xfff4c0,
    emissive: 0xffd86c,
    emissiveIntensity: 0.55,
    roughness: 0.32,
  }),
  tourBoatHull: new THREE.MeshStandardMaterial({
    color: 0xf5f7f8,
    roughness: 0.42,
    metalness: 0.04,
  }),
  tourBoatStripe: new THREE.MeshStandardMaterial({
    color: 0x2e82d6,
    roughness: 0.38,
    metalness: 0.06,
  }),
  tourBoatGlass: new THREE.MeshStandardMaterial({
    color: 0x8fd8ff,
    emissive: 0x2f8bd8,
    emissiveIntensity: 0.18,
    roughness: 0.2,
  }),
  tourBoatRed: new THREE.MeshStandardMaterial({
    color: 0xd94a3f,
    roughness: 0.44,
    metalness: 0.04,
  }),
  tourBoatYellow: new THREE.MeshStandardMaterial({
    color: 0xf3c247,
    roughness: 0.44,
    metalness: 0.04,
  }),
  tourBoatNavy: new THREE.MeshStandardMaterial({
    color: 0x244f74,
    roughness: 0.4,
    metalness: 0.06,
  }),
  boatWake: new THREE.MeshBasicMaterial({
    color: 0xdff9ff,
    transparent: true,
    opacity: 0.68,
    depthWrite: false,
  }),
  coastalForest: new THREE.MeshStandardMaterial({
    color: 0x2f7d47,
    roughness: 0.86,
  }),
  coastalRock: new THREE.MeshStandardMaterial({
    color: 0x60726d,
    roughness: 0.84,
  }),
  tunnelWall: new THREE.MeshStandardMaterial({
    color: 0xdfe4dc,
    roughness: 0.66,
  }),
  tunnelDarkWall: new THREE.MeshStandardMaterial({
    color: 0x2f3d2c,
    roughness: 0.88,
    metalness: 0.02,
  }),
  tunnelTileStripe: new THREE.MeshStandardMaterial({
    color: 0x2d6b58,
    roughness: 0.68,
  }),
  tunnelBlueStripe: new THREE.MeshStandardMaterial({
    color: 0x263d78,
    roughness: 0.7,
  }),
  tunnelLight: new THREE.MeshBasicMaterial({
    color: 0xeaffbf,
  }),
  tunnelLightGlow: new THREE.MeshBasicMaterial({
    color: 0xcfff78,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
  }),
  roadSign: new THREE.MeshStandardMaterial({
    color: 0x1f302c,
    emissive: 0x07110d,
    emissiveIntensity: 0.45,
    roughness: 0.42,
  }),
  containerRed: new THREE.MeshStandardMaterial({
    color: 0xd84736,
    roughness: 0.58,
    metalness: 0.04,
  }),
  containerBlue: new THREE.MeshStandardMaterial({
    color: 0x236bc8,
    roughness: 0.56,
    metalness: 0.04,
  }),
  containerYellow: new THREE.MeshStandardMaterial({
    color: 0xe9bd37,
    roughness: 0.55,
    metalness: 0.04,
  }),
  containerGreen: new THREE.MeshStandardMaterial({
    color: 0x1aa06f,
    roughness: 0.58,
    metalness: 0.04,
  }),
  containerTrim: new THREE.MeshStandardMaterial({
    color: 0x172228,
    roughness: 0.68,
  }),
  crane: new THREE.MeshStandardMaterial({
    color: 0xe6a91e,
    roughness: 0.48,
    metalness: 0.12,
  }),
  craneDark: new THREE.MeshStandardMaterial({
    color: 0x253139,
    roughness: 0.52,
    metalness: 0.16,
  }),
  truckCab: new THREE.MeshStandardMaterial({
    color: 0xf1f5f7,
    roughness: 0.45,
    metalness: 0.08,
  }),
  truckTrailer: new THREE.MeshStandardMaterial({
    color: 0x2a72c8,
    roughness: 0.55,
    metalness: 0.06,
  }),
  excavatorBody: new THREE.MeshStandardMaterial({
    color: 0xf2b72f,
    roughness: 0.5,
    metalness: 0.08,
  }),
  excavatorArm: new THREE.MeshStandardMaterial({
    color: 0xe59f22,
    roughness: 0.48,
    metalness: 0.1,
  }),
  tire: new THREE.MeshStandardMaterial({
    color: 0x121820,
    roughness: 0.74,
  }),
};

materials.roadMarkingWhite = createRealtimePbrMaterial("road_marking_white", {
  color: 0xffffff,
  roughness: 0.52,
  metalness: 0,
  textureAlpha: true,
  textureNormalScale: 0.42,
  textureAoMapIntensity: 0.34,
});
materials.roadMarkingYellow = createRealtimePbrMaterial("road_marking_yellow", {
  color: 0xffd862,
  roughness: 0.5,
  metalness: 0,
  textureAlpha: true,
  textureNormalScale: 0.42,
  textureAoMapIntensity: 0.34,
});

for (const [key, material] of Object.entries(materials)) {
  if (material && !material.name) {
    material.name = key;
  }
}

bindRealtimeMaterialTexture(materials.rail, "guardrail_white_metal", { normalScale: 0.3, aoMapIntensity: 0.32 });
bindRealtimeMaterialTexture(materials.railStripe, "hazard_red_paint", { normalScale: 0.28, aoMapIntensity: 0.3 });
bindRealtimeMaterialTexture(materials.gwangalliRail, "guardrail_white_metal", { normalScale: 0.34, aoMapIntensity: 0.34 });
bindRealtimeMaterialTexture(materials.gwangalliRailStripe, "painted_bridge_metal", { normalScale: 0.28, aoMapIntensity: 0.32 });
bindRealtimeMaterialTexture(materials.harborRail, "painted_bridge_metal", { normalScale: 0.32, aoMapIntensity: 0.34 });
bindRealtimeMaterialTexture(materials.harborRailStripe, "hazard_yellow_paint", { normalScale: 0.32, aoMapIntensity: 0.34 });

bindRealtimeMaterialTexture(materials.obstacle, "hazard_red_paint", { normalScale: 0.45, aoMapIntensity: 0.42 });
bindRealtimeMaterialTexture(materials.obstacleDark, "black_rubber_tire", { normalScale: 0.5, aoMapIntensity: 0.45 });
bindRealtimeMaterialTexture(materials.obstacleStripe, "hazard_yellow_paint", { normalScale: 0.4, aoMapIntensity: 0.38 });
bindRealtimeMaterialTexture(materials.speedsterSkin, "skin_subtle", { normalScale: 0.16, aoMapIntensity: 0.2 });
bindRealtimeMaterialTexture(materials.glove, "jet_black_leather", { normalScale: 0.45, aoMapIntensity: 0.45 });
bindRealtimeMaterialTexture(materials.shoe, "shoe_white_leather", { normalScale: 0.38, aoMapIntensity: 0.35 });
bindRealtimeMaterialTexture(materials.shoeSole, "black_rubber_tire", { normalScale: 0.38, aoMapIntensity: 0.36 });
bindRealtimeMaterialTexture(materials.jetHoodie, "jet_white_fabric", { normalScale: 0.36, aoMapIntensity: 0.32 });
bindRealtimeMaterialTexture(materials.jetHoodieShadow, "jet_white_fabric", { normalScale: 0.34, aoMapIntensity: 0.36 });
bindRealtimeMaterialTexture(materials.jetPants, "jet_red_fabric", { normalScale: 0.42, aoMapIntensity: 0.36 });
bindRealtimeMaterialTexture(materials.jetPantsTrim, "jet_white_fabric", { normalScale: 0.34, aoMapIntensity: 0.32 });
bindRealtimeMaterialTexture(materials.jetHarness, "jet_black_leather", { normalScale: 0.45, aoMapIntensity: 0.46 });
bindRealtimeMaterialTexture(materials.jetHarnessPlate, "painted_bridge_metal", { normalScale: 0.32, aoMapIntensity: 0.32 });
bindRealtimeMaterialTexture(materials.jetHair, "hair_dark", { normalScale: 0.42, aoMapIntensity: 0.3 });
bindRealtimeMaterialTexture(materials.jetSkin, "skin_subtle", { normalScale: 0.14, aoMapIntensity: 0.18 });
bindRealtimeMaterialTexture(materials.jetShoeWhite, "shoe_white_leather", { normalScale: 0.42, aoMapIntensity: 0.36 });
bindRealtimeMaterialTexture(materials.jetShoeSole, "black_rubber_tire", { normalScale: 0.42, aoMapIntensity: 0.4 });
bindRealtimeMaterialTexture(materials.jetAccentRed, "hazard_red_paint", { normalScale: 0.32, aoMapIntensity: 0.3 });

bindRealtimeMaterialTexture(materials.harborDock, "concrete_dock", { repeat: [2, 2], normalScale: 0.42, aoMapIntensity: 0.42 });
bindRealtimeMaterialTexture(materials.harborDockDark, "concrete_dock", { repeat: [2, 2], normalScale: 0.4, aoMapIntensity: 0.48 });
bindRealtimeMaterialTexture(materials.gwangalliBoardwalk, "wood_boardwalk", { repeat: [2, 2], normalScale: 0.5, aoMapIntensity: 0.42 });
bindRealtimeMaterialTexture(materials.gwangalliBridge, "painted_bridge_concrete", { repeat: [2, 2], normalScale: 0.34, aoMapIntensity: 0.36 });
bindRealtimeMaterialTexture(materials.gwangalliBridgeCable, "painted_bridge_metal", { normalScale: 0.3, aoMapIntensity: 0.34 });

bindRealtimeMaterialTexture(materials.gwangalliBuilding, "white_facade_panel", { repeat: [1.5, 2], normalScale: 0.28, aoMapIntensity: 0.32 });
bindRealtimeMaterialTexture(materials.gwangalliBuildingLight, "blue_glass_facade", { repeat: [1.5, 2], normalScale: 0.24, aoMapIntensity: 0.24 });
bindRealtimeMaterialTexture(materials.gwangalliWindow, "blue_glass_facade", { normalScale: 0.2, aoMapIntensity: 0.22 });
bindRealtimeMaterialTexture(materials.gwangalliIparkGlass, "blue_glass_facade", { repeat: [1.4, 2.4], normalScale: 0.24, aoMapIntensity: 0.26 });
bindRealtimeMaterialTexture(materials.gwangalliIparkDarkGlass, "dark_glass_facade", { repeat: [1.4, 2.4], normalScale: 0.24, aoMapIntensity: 0.3 });
bindRealtimeMaterialTexture(materials.gwangalliIparkFacade, "white_facade_panel", { repeat: [1.5, 2.4], normalScale: 0.26, aoMapIntensity: 0.32 });
bindRealtimeMaterialTexture(materials.haeundaeExordiumGlass, "dark_glass_facade", { repeat: [1.3, 2.2], normalScale: 0.24, aoMapIntensity: 0.28 });
bindRealtimeMaterialTexture(materials.haeundaeExordiumBalcony, "apartment_balcony_facade", { repeat: [1.4, 2.4], normalScale: 0.3, aoMapIntensity: 0.36 });
bindRealtimeMaterialTexture(materials.haeundaeExordiumCore, "dark_glass_facade", { repeat: [1.2, 2.2], normalScale: 0.25, aoMapIntensity: 0.32 });
bindRealtimeMaterialTexture(materials.hyegangSchoolWall, "school_wall", { repeat: [1.5, 1.6], normalScale: 0.28, aoMapIntensity: 0.36 });
bindRealtimeMaterialTexture(materials.hyegangSchoolTrim, "noise_wall_concrete", { normalScale: 0.3, aoMapIntensity: 0.38 });
bindRealtimeMaterialTexture(materials.hyegangSchoolGlass, "blue_glass_facade", { normalScale: 0.22, aoMapIntensity: 0.24 });
bindRealtimeMaterialTexture(materials.hyegangSchoolField, "coastal_forest_canopy", { repeat: [2, 2], normalScale: 0.3, aoMapIntensity: 0.3 });
bindRealtimeMaterialTexture(materials.noiseWallConcrete, "noise_wall_concrete", { repeat: [2, 1], normalScale: 0.38, aoMapIntensity: 0.45 });
bindRealtimeMaterialTexture(materials.noiseWallFrame, "painted_bridge_metal", { normalScale: 0.3, aoMapIntensity: 0.34 });
bindRealtimeMaterialTexture(materials.noiseWallGreen, "tunnel_green_stripe", { normalScale: 0.3, aoMapIntensity: 0.32 });
bindRealtimeMaterialTexture(materials.rightCityGlass, "blue_glass_facade", { repeat: [1.5, 2.5], normalScale: 0.24, aoMapIntensity: 0.26 });
bindRealtimeMaterialTexture(materials.rightCityDarkGlass, "dark_glass_facade", { repeat: [1.5, 2.5], normalScale: 0.24, aoMapIntensity: 0.3 });
bindRealtimeMaterialTexture(materials.rightCityFacade, "white_facade_panel", { repeat: [1.5, 2.3], normalScale: 0.26, aoMapIntensity: 0.34 });
bindRealtimeMaterialTexture(materials.bexcoWall, "noise_wall_concrete", { repeat: [1.5, 1.5], normalScale: 0.34, aoMapIntensity: 0.4 });
bindRealtimeMaterialTexture(materials.bexcoGlass, "blue_glass_facade", { repeat: [1.5, 2], normalScale: 0.24, aoMapIntensity: 0.28 });

bindRealtimeMaterialTexture(materials.marinaDock, "concrete_dock", { repeat: [2, 2], normalScale: 0.42, aoMapIntensity: 0.42 });
bindRealtimeMaterialTexture(materials.marinaPost, "painted_bridge_metal", { normalScale: 0.28, aoMapIntensity: 0.32 });
bindRealtimeMaterialTexture(materials.tourBoatHull, "painted_bridge_metal", { normalScale: 0.26, aoMapIntensity: 0.3 });
bindRealtimeMaterialTexture(materials.tourBoatStripe, "hazard_yellow_paint", { normalScale: 0.26, aoMapIntensity: 0.3 });
bindRealtimeMaterialTexture(materials.tourBoatGlass, "blue_glass_facade", { normalScale: 0.22, aoMapIntensity: 0.24 });
bindRealtimeMaterialTexture(materials.tourBoatRed, "hazard_red_paint", { normalScale: 0.28, aoMapIntensity: 0.32 });
bindRealtimeMaterialTexture(materials.tourBoatYellow, "hazard_yellow_paint", { normalScale: 0.28, aoMapIntensity: 0.32 });
bindRealtimeMaterialTexture(materials.tourBoatNavy, "dark_glass_facade", { normalScale: 0.22, aoMapIntensity: 0.3 });

bindRealtimeMaterialTexture(materials.coastalForest, "coastal_forest_canopy", { repeat: [2, 2], normalScale: 0.44, aoMapIntensity: 0.38 });
bindRealtimeMaterialTexture(materials.coastalRock, "coastal_rock", { repeat: [2, 2], normalScale: 0.55, aoMapIntensity: 0.48 });
bindRealtimeMaterialTexture(materials.tunnelWall, "tunnel_white_tile", { repeat: [2, 2], normalScale: 0.5, aoMapIntensity: 0.48 });
bindRealtimeMaterialTexture(materials.tunnelDarkWall, "tunnel_dark_ceiling", { repeat: [2, 2], normalScale: 0.5, aoMapIntensity: 0.5 });
bindRealtimeMaterialTexture(materials.tunnelTileStripe, "tunnel_green_stripe", { repeat: [2, 1], normalScale: 0.42, aoMapIntensity: 0.4 });
bindRealtimeMaterialTexture(materials.tunnelBlueStripe, "tunnel_blue_stripe", { repeat: [2, 1], normalScale: 0.42, aoMapIntensity: 0.4 });

bindRealtimeMaterialTexture(materials.containerRed, "harbor_container_red", { repeat: [1.5, 1.5], normalScale: 0.6, aoMapIntensity: 0.46 });
bindRealtimeMaterialTexture(materials.containerBlue, "harbor_container_blue", { repeat: [1.5, 1.5], normalScale: 0.6, aoMapIntensity: 0.46 });
bindRealtimeMaterialTexture(materials.containerYellow, "harbor_container_yellow", { repeat: [1.5, 1.5], normalScale: 0.6, aoMapIntensity: 0.46 });
bindRealtimeMaterialTexture(materials.containerGreen, "harbor_container_green", { repeat: [1.5, 1.5], normalScale: 0.6, aoMapIntensity: 0.46 });
bindRealtimeMaterialTexture(materials.containerTrim, "black_rubber_tire", { normalScale: 0.38, aoMapIntensity: 0.4 });
bindRealtimeMaterialTexture(materials.crane, "crane_yellow_metal", { repeat: [1.5, 1.5], normalScale: 0.45, aoMapIntensity: 0.42 });
bindRealtimeMaterialTexture(materials.craneDark, "painted_bridge_metal", { normalScale: 0.36, aoMapIntensity: 0.38 });
bindRealtimeMaterialTexture(materials.truckCab, "painted_bridge_metal", { normalScale: 0.3, aoMapIntensity: 0.32 });
bindRealtimeMaterialTexture(materials.truckTrailer, "harbor_container_blue", { normalScale: 0.46, aoMapIntensity: 0.42 });
bindRealtimeMaterialTexture(materials.excavatorBody, "crane_yellow_metal", { normalScale: 0.44, aoMapIntensity: 0.42 });
bindRealtimeMaterialTexture(materials.excavatorArm, "crane_yellow_metal", { normalScale: 0.44, aoMapIntensity: 0.42 });
bindRealtimeMaterialTexture(materials.tire, "black_rubber_tire", { normalScale: 0.48, aoMapIntensity: 0.46 });

const asphaltRoadMaterials = [
  materials.harborRoad,
  materials.harborRoadAlt,
  materials.gwangalliRoad,
  materials.gwangalliRoadAlt,
  materials.gwangalliTunnelRoad,
  materials.gwangalliTunnelRoadAlt,
];

function createAsphaltTextureSet(quality = graphicsSettings.textureQuality) {
  const config = asphaltTextureQualityConfig[quality] ?? asphaltTextureQualityConfig.high;
  return {
    baseColor: loadPbrTexture(config.baseColor, {
      colorSpace: THREE.SRGBColorSpace,
    }),
    normal: loadPbrTexture(config.normal),
    roughness: loadPbrTexture(config.roughness),
    ao: loadPbrTexture(config.ao),
  };
}

function createSkyTexture(quality = graphicsSettings.textureQuality) {
  const path = skyTextureQualityConfig[quality] ?? skyTextureQualityConfig.high;
  const texture = textureLoader.load(path);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = textureAnisotropy;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

function loadPbrTexture(path, options = {}) {
  const texture = textureLoader.load(path);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = textureAnisotropy;
  texture.colorSpace = options.colorSpace ?? THREE.NoColorSpace;
  if (Array.isArray(options.repeat)) {
    texture.repeat.set(options.repeat[0], options.repeat[1] ?? options.repeat[0]);
  }
  return texture;
}

function getMaterialTexturePath(textureName, mapName, extension) {
  const suffix = materialTextureQualitySuffix[graphicsSettings.textureQuality] ?? materialTextureQualitySuffix.high;
  return `./assets/textures/materials/${textureName}_${mapName}${suffix}.${extension}`;
}

function createRealtimePbrMaterial(textureName, parameters = {}) {
  const {
    textureRepeat,
    textureNormalScale,
    textureAoMapIntensity,
    textureAlpha,
    ...materialParameters
  } = parameters;
  const material = new THREE.MeshStandardMaterial(materialParameters);
  return bindRealtimeMaterialTexture(material, textureName, {
    repeat: textureRepeat,
    normalScale: textureNormalScale,
    aoMapIntensity: textureAoMapIntensity,
    alpha: textureAlpha,
  });
}

function bindRealtimeMaterialTexture(material, textureName, options = {}) {
  if (!material) return material;

  material.userData.realtimeTextureName = textureName;
  material.userData.realtimeTextureOptions = {
    repeat: options.repeat ?? [1, 1],
    normalScale: options.normalScale ?? 0.35,
    aoMapIntensity: options.aoMapIntensity ?? 0.38,
    alpha: Boolean(options.alpha),
  };
  if (!realtimeMaterialTextureBindings.includes(material)) {
    realtimeMaterialTextureBindings.push(material);
  }
  applyRealtimeTextureSetToMaterial(material);
  return material;
}

function getRealtimeMaterialTextureSet(textureName, options = {}) {
  const repeat = options.repeat ?? [1, 1];
  const repeatKey = `${repeat[0]}x${repeat[1] ?? repeat[0]}`;
  const alphaKey = options.alpha ? "alpha" : "opaque";
  const quality = graphicsSettings.textureQuality;
  const cacheKey = `${quality}:${textureName}:${repeatKey}:${alphaKey}`;
  const cached = realtimeMaterialTextureCache.get(cacheKey);
  if (cached) return cached;

  const textureSet = {
    baseColor: loadPbrTexture(getMaterialTexturePath(textureName, "basecolor", "jpg"), {
      colorSpace: THREE.SRGBColorSpace,
      repeat,
    }),
    normal: loadPbrTexture(getMaterialTexturePath(textureName, "normal", "jpg"), { repeat }),
    roughness: loadPbrTexture(getMaterialTexturePath(textureName, "roughness", "jpg"), { repeat }),
    ao: loadPbrTexture(getMaterialTexturePath(textureName, "ao", "jpg"), { repeat }),
  };
  if (options.alpha) {
    textureSet.alpha = loadPbrTexture(getMaterialTexturePath(textureName, "alpha", "png"), { repeat });
  }

  realtimeMaterialTextureCache.set(cacheKey, textureSet);
  return textureSet;
}

function applyRealtimeTextureSetToMaterial(material) {
  const textureName = material.userData.realtimeTextureName;
  if (!textureName) return;

  const options = material.userData.realtimeTextureOptions ?? {};
  const textureSet = getRealtimeMaterialTextureSet(textureName, options);
  material.map = textureSet.baseColor;
  if (material.isMeshStandardMaterial) {
    material.normalMap = textureSet.normal;
    material.roughnessMap = textureSet.roughness;
    material.aoMap = textureSet.ao;
    material.normalScale = new THREE.Vector2(options.normalScale ?? 0.35, options.normalScale ?? 0.35);
    material.aoMapIntensity = options.aoMapIntensity ?? 0.38;
  }
  if (options.alpha) {
    material.alphaMap = textureSet.alpha;
    material.transparent = true;
    material.alphaTest = 0.05;
  }
  material.needsUpdate = true;
}

function applyRealtimeMaterialTextureSettings() {
  const quality = graphicsSettings.textureQuality;
  if (quality === activeMaterialTextureQuality) return;

  activeMaterialTextureQuality = quality;
  for (const material of realtimeMaterialTextureBindings) {
    applyRealtimeTextureSetToMaterial(material);
  }
  disposeInactiveRealtimeTextureSets(quality);
}

function disposeInactiveRealtimeTextureSets(activeQuality) {
  for (const [cacheKey, textureSet] of realtimeMaterialTextureCache) {
    if (cacheKey.startsWith(`${activeQuality}:`)) continue;
    disposeRealtimeTextureSet(textureSet);
    realtimeMaterialTextureCache.delete(cacheKey);
  }
}

function disposeRealtimeTextureSet(textureSet) {
  for (const texture of Object.values(textureSet)) {
    texture.dispose();
  }
}

function applySkyTextureSettings() {
  const quality = graphicsSettings.textureQuality;
  if (quality !== activeSkyTextureQuality) {
    const previousTexture = skyTexture;
    skyTexture = createSkyTexture(quality);
    activeSkyTextureQuality = quality;
    if (skyDomeMesh?.material) {
      skyDomeMesh.material.map = skyTexture;
      skyDomeMesh.material.needsUpdate = true;
    }
    previousTexture.dispose();
  }

  if (skyDomeMesh) {
    skyDomeMesh.scale.setScalar(getSkyDomeRadius());
  }
}

function applyAsphaltTextureSettings() {
  const quality = graphicsSettings.textureQuality;
  if (quality === activeAsphaltTextureQuality) return;

  const previousTextures = asphaltRoadTextures;
  asphaltRoadTextures = createAsphaltTextureSet(quality);
  activeAsphaltTextureQuality = quality;

  for (const material of asphaltRoadMaterials) {
    material.map = asphaltRoadTextures.baseColor;
    material.normalMap = asphaltRoadTextures.normal;
    material.roughnessMap = asphaltRoadTextures.roughness;
    material.aoMap = asphaltRoadTextures.ao;
    material.needsUpdate = true;
  }

  disposeAsphaltTextureSet(previousTextures);
}

function disposeAsphaltTextureSet(textureSet) {
  for (const texture of Object.values(textureSet)) {
    texture.dispose();
  }
}

const pickupClusterColors = [
  new THREE.Color(0xff3046),
  new THREE.Color(0x3e86ff),
  new THREE.Color(0xffffff),
];
const dnaGeometry = createPickupClusterGeometry();
let dnaInstances;
const dnaInstanceObject = new THREE.Object3D();
const hiddenDnaMatrix = new THREE.Matrix4().makeScale(0, 0, 0);
const harborContainerSize = {
  width: 2.8,
  height: 2.65,
  length: 6.4,
  stackGap: 0.08,
};
const harborContainerGeometry = new THREE.BoxGeometry(
  harborContainerSize.width,
  harborContainerSize.height,
  harborContainerSize.length,
);
const harborContainerRibGeometry = new THREE.BoxGeometry(0.1, harborContainerSize.height + 0.14, harborContainerSize.length + 0.16);
const harborContainerDoorGeometry = new THREE.BoxGeometry(harborContainerSize.width + 0.08, harborContainerSize.height * 0.82, 0.1);
const harborWheelGeometry = new THREE.CylinderGeometry(0.42, 0.42, 0.42, 18);
const harborAnimatedCranes = [];
const harborCargoTrucks = [];
const harborExcavators = [];
const harborContainerChunks = [];
const harborContainerChunkSize = 420;
const harborContainerVisibilityRanges = {
  low: 1100,
  medium: 1700,
  high: 2400,
  ultra: 3200,
};
const harborAnimatedVisibilityRanges = {
  low: 1000,
  medium: 1500,
  high: 2200,
  ultra: 3000,
};
const harborVisibilityState = {
  frame: 0,
  lastPlayerZ: Number.NaN,
  lastViewDistance: "",
};
const gwangalliTourBoats = [];
let harborTime = 0;
let gwangalliBoatTime = 0;

init();
requestAnimationFrame(tick);

function init() {
  addLights();
  addSkyDome();
  addEnvironment();
  addTrack();
  addStageThreeHarbor();
  addDnaItems();
  addDashPads();
  addObstacles();
  addGoal();
  addPlayer();
  addTrail();
  bindInput();
  applyGraphicsSettings(false);
  syncGraphicsControls();
  syncDebugControls();
  resize();
  resetGame({ scoreOverride: carriedStageScore });
}

function addLights() {
  hemiLight = new THREE.HemisphereLight(0xdff8ff, 0x1f5c46, 1.05);
  scene.add(hemiLight);

  sunLight = new THREE.DirectionalLight(0xffffff, 2.35);
  sunLight.position.copy(sunFollowOffset);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 190;
  sunLight.shadow.camera.left = -90;
  sunLight.shadow.camera.right = 90;
  sunLight.shadow.camera.top = 90;
  sunLight.shadow.camera.bottom = -90;
  sunTarget = sunLight.target;
  scene.add(sunTarget);
  scene.add(sunLight);
}

function addSkyDome() {
  const geometry = new THREE.SphereGeometry(1, 64, 32);
  const material = new THREE.MeshBasicMaterial({
    map: skyTexture,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    toneMapped: false,
  });
  skyDomeMesh = new THREE.Mesh(geometry, material);
  skyDomeMesh.name = "BlueCloudSkyDome";
  skyDomeMesh.userData.ignoreMouseObject = true;
  skyDomeMesh.frustumCulled = false;
  skyDomeMesh.renderOrder = -1000;
  skyDomeMesh.scale.setScalar(getSkyDomeRadius());
  scene.add(skyDomeMesh);
  updateSkyDome();
}

function getSkyDomeRadius() {
  return Math.max(1400, Math.min(camera.far * 0.72, 6200));
}

function updateSkyDome() {
  if (!skyDomeMesh) return;
  skyDomeMesh.position.copy(camera.position);
}

function getStageIndex(stageRoute) {
  const normalizedRoute = String(stageRoute || defaultStageRoute).trim().toLowerCase();
  if (normalizedRoute === "1" || normalizedRoute === "stage1") return 0;
  if (normalizedRoute === "2" || normalizedRoute === "stage2") return 1;
  if (normalizedRoute === "3" || normalizedRoute === "stage3") return 1;
  return stageRoutes.indexOf(defaultStageRoute);
}

function getStageRoute(stageIndex) {
  const clampedIndex = THREE.MathUtils.clamp(stageIndex, 0, stageRoutes.length - 1);
  return stageRoutes[clampedIndex];
}

function createStageDefinition(stageIndex) {
  if (stageIndex === 0) return createStageTwoDefinition("STAGE 1");
  return createStageThreeDefinition("STAGE 2");
}

function createTutorialStageDefinition() {
  return {
      label: "TUTORIAL",
      goalZ: -980,
      rollClearStartZ: -9999,
      rollClearEndZ: -10000,
      rollLiftHeight: 0,
      rollEnabled: false,
      curvePoints: [
        [0, 0, playerStart.z],
        [0, 0, -90],
        [18, 0, -210],
        [-18, 0, -360],
        [0, 0, -520],
        [24, 0, -690],
        [0, 0, -840],
        [0, 0, -980],
        [0, 0, -1020],
      ],
      trackSegments: makeTrackSegments([
        [28, 0, 22],
        [-80, 0, 22],
        [-160, 2, 21],
        [-250, 2, 21],
        [-340, 5, 22],
        [-430, 5, 22],
        [-530, 2, 22],
        [-620, 2, 21],
        [-725, 7, 22],
        [-830, 7, 22],
        [-920, 3, 21],
        [-1000, 3, 22],
        [-1020, 3, 22],
      ]),
      sidePlatforms: [],
      dashPads: [
        { lane: 1, z: -560 },
        { lane: 1, z: -745 },
      ],
      obstacles: [
        { lanes: [1], z: -235, height: 1.8 },
        { lanes: [0, 2], z: -410, height: 1.8 },
        { lanes: [1], z: -485, height: 1.35 },
        { lanes: [0], z: -680, height: 1.9 },
      ],
      dnaPlan: [
        { type: "trail", lane: 1, zStart: 8, count: 5, spacing: 7.0 },
        { type: "rows", zStart: -86, rowCount: 2, spacing: 14.0 },
        { type: "switch", pattern: [0, 1, 2, 1], zStart: -170, count: 8, spacing: 7.5 },
        { type: "trail", lane: 0, zStart: -290, count: 6, spacing: 7.5 },
        { type: "trail", lane: 2, zStart: -290, count: 6, spacing: 7.5 },
        { type: "rows", zStart: -535, rowCount: 2, spacing: 14.0 },
        { type: "trail", lane: 1, zStart: -620, count: 7, spacing: 8.0 },
        { type: "switch", pattern: [0, 1, 2, 1], zStart: -790, count: 8, spacing: 8.0 },
      ],
      tutorialPrompts: [
        { zStart: 24, zEnd: -86, text: "W / UP: RUN" },
        { zStart: -100, zEnd: -210, text: "A D: MOVE" },
        { zStart: -218, zEnd: -325, text: "Q / E: QUICK STEP" },
        { zStart: -360, zEnd: -500, text: "SPACE: JUMP" },
        { zStart: -520, zEnd: -725, text: "DASH PAD" },
        { zStart: -725, zEnd: -930, text: "SHIFT: BOOST" },
      ],
    };
}

function createStageOneDefinition() {
  return {
      label: "STAGE 1",
      goalZ: -2580,
      rollClearStartZ: -1160,
      rollClearEndZ: -1660,
      rollLiftHeight: 24,
      curvePoints: [
        [0, 0, playerStart.z],
        [0, 0, -80],
        [-36, 0, -260],
        [-72, 0, -520],
        [18, 0, -760],
        [78, 0, -1010],
        [34, 0, -1260],
        [-62, 0, -1510],
        [-84, 0, -1740],
        [12, 0, -1970],
        [82, 0, -2210],
        [38, 0, -2420],
        [0, 0, -2580],
        [0, 0, -2625],
      ],
      trackSegments: [
        { zStart: 28, zEnd: -48, yStart: 0, yEnd: 0, width: 19 },
        { zStart: -48, zEnd: -96, yStart: 0, yEnd: 8.5, width: 17 },
        { zStart: -96, zEnd: -142, yStart: 8.5, yEnd: 8.5, width: 15 },
        { zStart: -142, zEnd: -180, yStart: 8.5, yEnd: 2.2, width: 15 },
        { zStart: -180, zEnd: -252, yStart: 2.2, yEnd: 2.2, width: 19 },
        { zStart: -252, zEnd: -318, yStart: 2.2, yEnd: 6.2, width: 17 },
        { zStart: -318, zEnd: -382, yStart: 6.2, yEnd: 6.2, width: 20 },
        { zStart: -382, zEnd: -442, yStart: 6.2, yEnd: 1.2, width: 17 },
        { zStart: -442, zEnd: -548, yStart: 1.2, yEnd: 1.2, width: 20 },
        { zStart: -548, zEnd: -620, yStart: 1.2, yEnd: 6.8, width: 18 },
        { zStart: -620, zEnd: -690, yStart: 6.8, yEnd: 6.8, width: 16 },
        { zStart: -690, zEnd: -755, yStart: 6.8, yEnd: 0.8, width: 18 },
        { zStart: -755, zEnd: -825, yStart: 0.8, yEnd: 0.8, width: 20 },
        { zStart: -825, zEnd: -908, yStart: 0.8, yEnd: 3.4, width: 18 },
        { zStart: -908, zEnd: -970, yStart: 3.4, yEnd: 11.5, width: 16 },
        { zStart: -970, zEnd: -1032, yStart: 11.5, yEnd: 5.0, width: 18 },
        { zStart: -1032, zEnd: -1095, yStart: 5.0, yEnd: 13.5, width: 16 },
        { zStart: -1095, zEnd: -1158, yStart: 13.5, yEnd: 13.5, width: 19 },
        { zStart: -1158, zEnd: -1220, yStart: 13.5, yEnd: 4.0, width: 17 },
        { zStart: -1220, zEnd: -1300, yStart: 4.0, yEnd: 4.0, width: 20 },
        { zStart: -1300, zEnd: -1385, yStart: 4.0, yEnd: 14.0, width: 18 },
        { zStart: -1385, zEnd: -1465, yStart: 14.0, yEnd: 8.0, width: 16 },
        { zStart: -1465, zEnd: -1540, yStart: 8.0, yEnd: 8.0, width: 20 },
        { zStart: -1540, zEnd: -1640, yStart: 8.0, yEnd: 0.5, width: 18 },
        { zStart: -1640, zEnd: -1730, yStart: 0.5, yEnd: 10.5, width: 16 },
        { zStart: -1730, zEnd: -1815, yStart: 10.5, yEnd: 16.0, width: 18 },
        { zStart: -1815, zEnd: -1905, yStart: 16.0, yEnd: 6.0, width: 20 },
        { zStart: -1905, zEnd: -1995, yStart: 6.0, yEnd: 6.0, width: 17 },
        { zStart: -1995, zEnd: -2095, yStart: 6.0, yEnd: 18.0, width: 16 },
        { zStart: -2095, zEnd: -2180, yStart: 18.0, yEnd: 12.0, width: 18 },
        { zStart: -2180, zEnd: -2295, yStart: 12.0, yEnd: 3.0, width: 20 },
        { zStart: -2295, zEnd: -2420, yStart: 3.0, yEnd: 3.0, width: 18 },
        { zStart: -2420, zEnd: -2525, yStart: 3.0, yEnd: 11.0, width: 16 },
        { zStart: -2525, zEnd: -2625, yStart: 11.0, yEnd: 5.0, width: 20 },
      ],
      sidePlatforms: [
        { width: 7, zStart: -126, zEnd: -152, yStart: 4.2, yEnd: 4.2, thickness: 1.2, xOffset: -12.5 },
        { width: 8, zStart: -338, zEnd: -366, yStart: 8.0, yEnd: 8.0, thickness: 1.2, xOffset: 13.8 },
        { width: 8, zStart: -710, zEnd: -742, yStart: 2.8, yEnd: 2.8, thickness: 1.2, xOffset: -14.2 },
        { width: 8, zStart: -1088, zEnd: -1124, yStart: 16.0, yEnd: 16.0, thickness: 1.2, xOffset: 13.5 },
        { width: 8, zStart: -1735, zEnd: -1770, yStart: 13.0, yEnd: 13.0, thickness: 1.2, xOffset: -13.8 },
        { width: 9, zStart: -2365, zEnd: -2410, yStart: 5.0, yEnd: 5.0, thickness: 1.2, xOffset: 14.0 },
      ],
      dashPads: [
        { lane: 1, z: -38 },
        { lane: 0, z: -188 },
        { lane: 2, z: -292 },
        { lane: 1, z: -430 },
        { lane: 0, z: -600 },
        { lane: 2, z: -768 },
        { lane: 1, z: -944 },
        { lane: 0, z: -1128 },
        { lane: 1, z: -1360 },
        { lane: 2, z: -1585 },
        { lane: 0, z: -1788 },
        { lane: 1, z: -2055 },
        { lane: 2, z: -2385 },
      ],
      obstacles: [
        { lanes: [1], z: -126, height: 1.9 },
        { lanes: [2], z: -360, height: 2.0 },
        { lanes: [0, 2], z: -635, height: 2.1 },
        { lanes: [0], z: -835, height: 2.0 },
        { lanes: [0, 1], z: -1068, height: 2.1 },
        { lanes: [0, 1], z: -1768, height: 2.2 },
        { lanes: [1], z: -1900, height: 2.1 },
        { lanes: [0, 2], z: -2045, height: 2.1 },
        { lanes: [0], z: -2188, height: 2.0 },
        { lanes: [1, 2], z: -2325, height: 2.2 },
        { lanes: [2], z: -2478, height: 2.0 },
      ],
      dnaPlan: [
        { type: "trail", lane: 1, zStart: 10, count: 8, spacing: 6.2 },
        { type: "rows", zStart: -72, rowCount: 3, spacing: 12.0 },
        { type: "switch", pattern: [0, 1, 2, 1], zStart: -152, count: 10, spacing: 6.5 },
        { type: "trail", lane: 2, zStart: -260, count: 8, spacing: 6.5 },
        { type: "rows", zStart: -450, rowCount: 3, spacing: 13.0 },
        { type: "switch", pattern: [2, 1, 0, 1], zStart: -535, count: 10, spacing: 6.5 },
        { type: "trail", lane: 0, zStart: -760, count: 9, spacing: 6.5 },
        { type: "rows", zStart: -930, rowCount: 3, spacing: 13.0 },
        { type: "switch", pattern: [2, 1, 0, 1], zStart: -1010, count: 10, spacing: 6.5 },
        { type: "rows", zStart: -1124, rowCount: 3, spacing: 13.0 },
        { type: "switch", pattern: [0, 1, 2, 1], zStart: -1192, count: 10, spacing: 7.0 },
        { type: "rows", zStart: -1360, rowCount: 2, spacing: 14.0 },
        { type: "trail", lane: 2, zStart: -1515, count: 8, spacing: 7.0 },
        { type: "rows", zStart: -1605, rowCount: 2, spacing: 14.0 },
        { type: "switch", pattern: [0, 1, 2, 1, 0], zStart: -1700, count: 10, spacing: 7.0 },
        { type: "trail", lane: 1, zStart: -1850, count: 9, spacing: 7.0 },
        { type: "rows", zStart: -1980, rowCount: 3, spacing: 13.0 },
        { type: "switch", pattern: [2, 1, 0, 1], zStart: -2120, count: 10, spacing: 7.0 },
        { type: "rows", zStart: -2250, rowCount: 3, spacing: 13.0 },
        { type: "switch", pattern: [0, 1, 2, 1], zStart: -2360, count: 10, spacing: 7.0 },
        { type: "trail", lane: 2, zStart: -2490, count: 9, spacing: 7.0 },
      ],
    };
}

function createStageTwoDefinition(label = "STAGE 2") {
  const goalZ = -10900;
  const startZ = playerStart.z + Math.round((playerStart.z - goalZ) * 0.1);
  const trackNodes = [
    [startZ + 8, 0, 20],
    [startZ - 160, 0, 20],
    [startZ - 340, 0, 20],
    [startZ - 520, 0, 20],
    [startZ - 700, 0, 20],
    [startZ - 880, 0, 20],
    [28, 0, 19],
    [-60, 0, 17],
    [-120, 0, 16],
    [-195, 0, 18],
    [-280, 0, 20],
    [-365, 0, 18],
    [-455, 0, 16],
    [-545, 0, 18],
    [-635, 0, 20],
    [-720, 0, 16],
    [-810, 0, 17],
    [-900, 0, 20],
    [-1000, 0, 18],
    [-1120, 0, 16],
    [-1230, 0, 18],
    [-1340, 0, 20],
    [-1450, 0, 18],
    [-1560, 0, 16],
    [-1670, 0, 16],
    [-1780, 0, 18],
    [-1890, 0, 20],
    [-2005, 0, 19],
    [-2120, 0, 17],
    [-2230, 0, 16],
    [-2340, 0, 16],
    [-2450, 0, 18],
    [-2570, 0, 20],
    [-2690, 0, 16],
    [-2810, 0, 17],
    [-2930, 0, 20],
    [-3060, 0, 18],
    [-3190, 0, 16],
    [-3320, 0, 18],
    [-3460, 10, 20],
    [-3600, 10, 20],
    [-3900, 10, 22],
    [-4200, 8, 22],
    [-4400, 7, 22],
    [-4900, 4, 21],
    [-5400, 4, 20],
    [-5900, 5, 20],
    [-6400, 6, 20],
    [-6900, 7, 20],
    [-7400, 8, 20],
    [-7900, 7, 19],
    [-8350, 2, 18],
    [-8800, -1, 18],
    [-9250, -3, 18],
    [-9700, -1, 18],
    [-10150, 3, 18],
    [-10600, 7, 18],
    [goalZ, 10, 20],
    [goalZ - 60, 10, 22],
  ];
  const bridgeRampEndZ = startZ - (startZ - goalZ) * 0.2;
  const bridgeFenceEndZ = -4400;
  const raisedBridgeY = 32.8;
  const bridgeTrackNodes = trackNodes.map(([z, y, width]) => [
    z,
    getGwangalliBridgeRoadY(z, y, startZ, bridgeRampEndZ, bridgeFenceEndZ, raisedBridgeY),
    z >= -4400 ? 20 : width,
  ]);

  return {
      label,
      startZ,
      goalZ,
      rollClearStartZ: -1840,
      rollClearEndZ: -2240,
      rollLiftHeight: 30,
      rollEnabled: false,
      gwangalliTheme: true,
      hideWaterAfterProgress: 0.6,
      gwangalliBridgeEndZ: -4400,
      gwangalliTunnelStartZ: -7900,
      gwangalliTunnelEndZ: goalZ,
      curvePoints: [
        [1550, 0, startZ],
        [1450, 0, startZ - 260],
        [1320, 0, startZ - 520],
        [1180, 0, startZ - 800],
        [1056, 0, playerStart.z],
        [771, 0, -18],
        [506, 0, -127],
        [278, 0, -302],
        [103, 0, -530],
        [-6, 0, -795],
        [-44, 0, -1080],
        [-44, 0, -1450],
        [-44, 0, -1900],
        [-44, 0, -2350],
        [-44, 0, -2800],
        [-44, 0, -3120],
        [-44, 0, -3380],
        [0, 0, -3600],
        [0, 0, -3900],
        [96, 0, -4120],
        [300, 0, -4400],
        [430, 0, -4900],
        [500, 0, -5600],
        [500, 0, -6500],
        [500, 0, -7350],
        [510, 0, -7900],
        [460, 0, -8350],
        [420, 0, -8850],
        [520, 0, -9400],
        [470, 0, -9900],
        [535, 0, -10450],
        [535, 0, goalZ],
        [535, 0, goalZ - 60],
      ],
      trackSegments: makeTrackSegments(bridgeTrackNodes),
      sidePlatforms: [],
      dashPads: [
        { lane: 1, z: startZ - 160 },
        { lane: 2, z: startZ - 420 },
        { lane: 0, z: startZ - 680 },
        { lane: 1, z: startZ - 920 },
        { lane: 1, z: -70 },
        { lane: 0, z: -285 },
        { lane: 2, z: -520 },
        { lane: 1, z: -760 },
        { lane: 0, z: -1080 },
        { lane: 2, z: -1325 },
        { lane: 1, z: -1585 },
        { lane: 0, z: -2300 },
        { lane: 2, z: -2560 },
        { lane: 1, z: -2825 },
        { lane: 0, z: -3130 },
        { lane: 2, z: -3420 },
        { lane: 1, z: -3820 },
        { lane: 0, z: -4210 },
        { lane: 2, z: -5030 },
        { lane: 1, z: -5740 },
        { lane: 0, z: -6530 },
        { lane: 2, z: -7340 },
        { lane: 1, z: -8260 },
        { lane: 0, z: -9040 },
        { lane: 2, z: -9820 },
        { lane: 1, z: -10540 },
      ],
      obstacles: [
        { lanes: [0], z: startZ - 280, height: 2.0 },
        { lanes: [1, 2], z: startZ - 560, height: 2.1 },
        { lanes: [2], z: startZ - 820, height: 2.0 },
        { lanes: [2], z: -210, height: 2.0 },
        { lanes: [0, 1], z: -610, height: 2.1 },
        { lanes: [0], z: -880, height: 2.0 },
        { lanes: [1, 2], z: -1210, height: 2.15 },
        { lanes: [2], z: -1490, height: 2.05 },
        { lanes: [0, 2], z: -2360, height: 2.1 },
        { lanes: [1], z: -2660, height: 2.0 },
        { lanes: [0, 1], z: -2960, height: 2.15 },
        { lanes: [2], z: -3270, height: 2.0 },
        { lanes: [1], z: -4100, height: 2.0 },
        { lanes: [0, 2], z: -5230, height: 2.1 },
        { lanes: [2], z: -6760, height: 2.0 },
        { lanes: [0], z: -8460, height: 2.1 },
        { lanes: [1, 2], z: -9320, height: 2.05 },
        { lanes: [0, 1], z: -10120, height: 2.15 },
        { lanes: [2], z: -10660, height: 2.0 },
      ],
      dnaPlan: [
        { type: "trail", lane: 1, zStart: startZ - 32, count: 8, spacing: 9.0 },
        { type: "switch", pattern: [1, 0, 1, 2], zStart: startZ - 260, count: 10, spacing: 9.5 },
        { type: "trail", lane: 2, zStart: startZ - 545, count: 7, spacing: 10.0 },
        { type: "switch", pattern: [2, 1, 0, 1], zStart: startZ - 780, count: 9, spacing: 9.5 },
        { type: "trail", lane: 1, zStart: 8, count: 7, spacing: 6.5 },
        { type: "rows", zStart: -140, rowCount: 2, spacing: 13.0 },
        { type: "switch", pattern: [0, 1, 2, 1], zStart: -330, count: 8, spacing: 7.0 },
        { type: "trail", lane: 2, zStart: -470, count: 7, spacing: 7.0 },
        { type: "rows", zStart: -700, rowCount: 2, spacing: 14.0 },
        { type: "switch", pattern: [2, 1, 0, 1], zStart: -980, count: 8, spacing: 7.0 },
        { type: "trail", lane: 0, zStart: -1260, count: 7, spacing: 7.0 },
        { type: "rows", zStart: -1520, rowCount: 2, spacing: 14.0 },
        { type: "switch", pattern: [0, 1, 2, 1], zStart: -1700, count: 8, spacing: 7.5 },
        { type: "trail", lane: 1, zStart: -1900, count: 6, spacing: 8.0 },
        { type: "rows", zStart: -2290, rowCount: 2, spacing: 14.0 },
        { type: "switch", pattern: [2, 1, 0, 1], zStart: -2460, count: 8, spacing: 7.5 },
        { type: "trail", lane: 2, zStart: -2740, count: 7, spacing: 7.0 },
        { type: "rows", zStart: -3060, rowCount: 2, spacing: 14.0 },
        { type: "switch", pattern: [0, 1, 2, 1], zStart: -3340, count: 8, spacing: 7.5 },
        { type: "trail", lane: 1, zStart: -3740, count: 8, spacing: 9.0 },
        { type: "switch", pattern: [0, 1, 2, 1], zStart: -4520, count: 10, spacing: 10.0 },
        { type: "trail", lane: 0, zStart: -4860, count: 8, spacing: 10.0 },
        { type: "switch", pattern: [2, 1, 0, 1], zStart: -5160, count: 12, spacing: 10.0 },
        { type: "rows", zStart: -5480, rowCount: 2, spacing: 18.0 },
        { type: "trail", lane: 1, zStart: -5900, count: 9, spacing: 10.0 },
        { type: "trail", lane: 2, zStart: -6200, count: 8, spacing: 10.5 },
        { type: "switch", pattern: [0, 1, 2, 1, 0], zStart: -6500, count: 12, spacing: 10.0 },
        { type: "trail", lane: 0, zStart: -6900, count: 8, spacing: 10.5 },
        { type: "switch", pattern: [2, 1, 0, 1], zStart: -7060, count: 10, spacing: 10.0 },
        { type: "switch", pattern: [2, 1, 0, 1, 2], zStart: -7480, count: 12, spacing: 10.0 },
        { type: "rows", zStart: -7820, rowCount: 1, spacing: 18.0 },
        { type: "rows", zStart: -8120, rowCount: 2, spacing: 18.0 },
        { type: "trail", lane: 2, zStart: -8400, count: 8, spacing: 11.0 },
        { type: "switch", pattern: [0, 1, 2, 1], zStart: -8780, count: 10, spacing: 10.5 },
        { type: "switch", pattern: [0, 1, 2, 1], zStart: -9180, count: 12, spacing: 10.0 },
        { type: "trail", lane: 0, zStart: -9540, count: 8, spacing: 10.0 },
        { type: "trail", lane: 1, zStart: -9760, count: 8, spacing: 10.0 },
        { type: "trail", lane: 2, zStart: -10000, count: 8, spacing: 10.0 },
        { type: "switch", pattern: [2, 1, 0, 1], zStart: -10320, count: 10, spacing: 10.5 },
        { type: "trail", lane: 1, zStart: -10740, count: 9, spacing: 9.5 },
      ],
    };
}

function getGwangalliBridgeRoadY(z, baseY, startZ, rampEndZ, fenceEndZ, raisedY) {
  if (z >= startZ) return baseY;
  if (z >= rampEndZ) {
    const t = THREE.MathUtils.clamp((startZ - z) / (startZ - rampEndZ), 0, 1);
    return THREE.MathUtils.lerp(baseY, raisedY, t);
  }
  if (z >= fenceEndZ) return raisedY;
  return baseY;
}

function createStageThreeDefinition(label = "STAGE 3") {
  const goalZ = -9000;
  const trackNodes = [
    [28, 0, 24],
    [-260, 0, 24],
    [-520, 1.1, 24],
    [-760, 1.1, 22],
    [-980, 0.4, 23],
    [-1180, 0.4, 24],
    [-1460, 0, 24],
    [-1760, 0, 23],
    [-2060, 1, 24],
    [-2360, 1, 22],
    [-2660, 0.2, 24],
    [-2960, 0.2, 25],
    [-3260, 1.5, 24],
    [-3560, 1.5, 23],
    [-3860, 0.8, 24],
    [-4160, 0.8, 25],
    [-4460, 0, 23],
    [-4760, 0, 24],
    [-5060, 1.3, 24],
    [-5360, 1.3, 22],
    [-5660, 0.3, 24],
    [-5960, 0.3, 25],
    [-6260, 1.6, 24],
    [-6560, 1.6, 23],
    [-6860, 0.8, 24],
    [-7160, 0.8, 25],
    [-7460, 0.1, 23],
    [-7760, 0.1, 24],
    [-8060, 1.4, 24],
    [-8360, 1.4, 23],
    [-8660, 0.7, 24],
    [goalZ, 0.7, 25],
    [goalZ - 140, 0.7, 25],
  ];

  return {
      label,
      goalZ,
      rollClearStartZ: -9999,
      rollClearEndZ: -10000,
      rollLiftHeight: 0,
      rollEnabled: false,
      harborTheme: true,
      curvePoints: [
        [0, 0, playerStart.z],
        [0, 0, -420],
        [-38, 0, -600],
        [-170, 0, -780],
        [-220, 0, -1040],
        [-220, 0, -1760],
        [-160, 0, -1960],
        [-20, 0, -2160],
        [18, 0, -2440],
        [18, 0, -3260],
        [130, 0, -3480],
        [250, 0, -3720],
        [250, 0, -4480],
        [190, 0, -4700],
        [40, 0, -4940],
        [-55, 0, -5200],
        [-55, 0, -6060],
        [-165, 0, -6300],
        [-285, 0, -6560],
        [-285, 0, -7320],
        [-220, 0, -7560],
        [-40, 0, -7840],
        [75, 0, -8120],
        [75, 0, goalZ],
        [75, 0, goalZ - 140],
      ],
      trackSegments: makeTrackSegments(trackNodes),
      sidePlatforms: makeHarborSidePlatforms(trackNodes),
      dashPads: [
        { lane: 1, z: -120 },
        { lane: 0, z: -430 },
        { lane: 2, z: -760 },
        { lane: 1, z: -1100 },
        { lane: 0, z: -1510 },
        { lane: 2, z: -1920 },
        { lane: 1, z: -2360 },
        { lane: 2, z: -2740 },
        { lane: 0, z: -3180 },
        { lane: 1, z: -3620 },
        { lane: 2, z: -4080 },
        { lane: 0, z: -4520 },
        { lane: 1, z: -4980 },
        { lane: 2, z: -5420 },
        { lane: 0, z: -5860 },
        { lane: 1, z: -6320 },
        { lane: 2, z: -6760 },
        { lane: 0, z: -7240 },
        { lane: 1, z: -7680 },
        { lane: 2, z: -8120 },
        { lane: 0, z: -8560 },
        { lane: 1, z: -8860 },
      ],
      obstacles: [
        { lanes: [2], z: -330, height: 2.0 },
        { lanes: [0, 1], z: -680, height: 2.1 },
        { lanes: [1], z: -980, height: 1.7 },
        { lanes: [0], z: -1330, height: 2.0 },
        { lanes: [1, 2], z: -1740, height: 2.15 },
        { lanes: [0, 2], z: -2180, height: 2.05 },
        { lanes: [1], z: -2600, height: 1.9 },
        { lanes: [0, 2], z: -3120, height: 2.1 },
        { lanes: [2], z: -3560, height: 2.0 },
        { lanes: [0, 1], z: -4040, height: 2.15 },
        { lanes: [1], z: -4480, height: 1.9 },
        { lanes: [0], z: -4920, height: 2.0 },
        { lanes: [1, 2], z: -5380, height: 2.15 },
        { lanes: [2], z: -5820, height: 2.0 },
        { lanes: [0, 2], z: -6260, height: 2.05 },
        { lanes: [1], z: -6720, height: 1.9 },
        { lanes: [0, 1], z: -7180, height: 2.15 },
        { lanes: [2], z: -7620, height: 2.0 },
        { lanes: [0], z: -8080, height: 2.0 },
        { lanes: [1, 2], z: -8520, height: 2.15 },
        { lanes: [0, 2], z: -8840, height: 2.05 },
      ],
      dnaPlan: [
        { type: "trail", lane: 1, zStart: -48, count: 6, spacing: 9.0 },
        { type: "rows", zStart: -170, rowCount: 2, spacing: 16.0 },
        { type: "switch", pattern: [0, 1, 0, 1], zStart: -262, count: 6, spacing: 10.0 },
        { type: "trail", lane: 0, zStart: -384, count: 5, spacing: 8.0 },
        { type: "rows", zStart: -500, rowCount: 2, spacing: 16.0 },
        { type: "trail", lane: 2, zStart: -610, count: 6, spacing: 9.0 },
        { type: "trail", lane: 2, zStart: -790, count: 5, spacing: 9.0 },
        { type: "switch", pattern: [0, 2], zStart: -904, count: 6, spacing: 10.0 },
        { type: "trail", lane: 1, zStart: -1038, count: 5, spacing: 8.0 },
        { type: "rows", zStart: -1168, rowCount: 2, spacing: 16.0 },
        { type: "switch", pattern: [1, 2], zStart: -1252, count: 7, spacing: 9.0 },
        { type: "trail", lane: 0, zStart: -1438, count: 5, spacing: 8.0 },
        { type: "trail", lane: 0, zStart: -1660, count: 6, spacing: 9.0 },
        { type: "trail", lane: 2, zStart: -1848, count: 5, spacing: 9.0 },
        { type: "rows", zStart: -1990, rowCount: 2, spacing: 16.0 },
        { type: "trail", lane: 1, zStart: -2098, count: 6, spacing: 9.0 },
        { type: "trail", lane: 1, zStart: -2310, count: 5, spacing: 8.0 },
        { type: "switch", pattern: [0, 2], zStart: -2510, count: 6, spacing: 9.0 },
        { type: "trail", lane: 2, zStart: -2670, count: 5, spacing: 8.0 },
        { type: "switch", pattern: [2, 1, 0, 1], zStart: -2840, count: 8, spacing: 8.0 },
        { type: "rows", zStart: -3160, rowCount: 2, spacing: 16.0 },
        { type: "switch", pattern: [0, 1, 2, 1], zStart: -3340, count: 8, spacing: 9.0 },
        { type: "trail", lane: 0, zStart: -3600, count: 7, spacing: 9.0 },
        { type: "switch", pattern: [2, 1, 0, 1], zStart: -3920, count: 9, spacing: 9.0 },
        { type: "rows", zStart: -4240, rowCount: 2, spacing: 16.0 },
        { type: "trail", lane: 2, zStart: -4540, count: 7, spacing: 9.0 },
        { type: "switch", pattern: [1, 0, 1, 2], zStart: -4820, count: 9, spacing: 9.0 },
        { type: "trail", lane: 1, zStart: -5140, count: 8, spacing: 9.0 },
        { type: "rows", zStart: -5460, rowCount: 2, spacing: 16.0 },
        { type: "switch", pattern: [0, 2, 1, 2], zStart: -5760, count: 9, spacing: 9.0 },
        { type: "trail", lane: 0, zStart: -6060, count: 8, spacing: 9.0 },
        { type: "switch", pattern: [2, 1, 0, 1], zStart: -6380, count: 9, spacing: 9.0 },
        { type: "rows", zStart: -6680, rowCount: 2, spacing: 16.0 },
        { type: "trail", lane: 2, zStart: -7000, count: 8, spacing: 9.0 },
        { type: "switch", pattern: [0, 1, 2, 1], zStart: -7320, count: 9, spacing: 9.0 },
        { type: "trail", lane: 1, zStart: -7640, count: 8, spacing: 9.0 },
        { type: "rows", zStart: -7960, rowCount: 2, spacing: 16.0 },
        { type: "switch", pattern: [2, 1, 0, 1], zStart: -8240, count: 9, spacing: 9.0 },
        { type: "trail", lane: 0, zStart: -8560, count: 8, spacing: 9.0 },
        { type: "switch", pattern: [0, 1, 2, 1], zStart: -8780, count: 8, spacing: 8.0 },
      ],
    };
}

function makeTrackSegments(nodes) {
  const segments = [];
  for (let i = 0; i < nodes.length - 1; i += 1) {
    const [zStart, yStart, width] = nodes[i];
    const [zEnd, yEnd] = nodes[i + 1];
    segments.push({ zStart, zEnd, yStart, yEnd, width });
  }
  return segments;
}

function makeHarborSidePlatforms(nodes) {
  const platforms = [];
  for (let i = 0; i < nodes.length - 1; i += 1) {
    const [zStart, yStart] = nodes[i];
    const [zEnd, yEnd] = nodes[i + 1];
    for (const xOffset of [-35, 35]) {
      platforms.push({
        width: 42,
        zStart,
        zEnd,
        yStart,
        yEnd,
        thickness: 1.0,
        xOffset,
      });
    }
  }
  return platforms;
}

function getGwangalliBridgeEndZ() {
  return currentStage.gwangalliBridgeEndZ ?? currentStage.goalZ;
}

function getGwangalliTunnelStartZ() {
  return currentStage.gwangalliTunnelStartZ ?? Number.NEGATIVE_INFINITY;
}

function isStageZInRange(z, zStart, zEnd) {
  const minZ = Math.min(zStart, zEnd);
  const maxZ = Math.max(zStart, zEnd);
  return z >= minZ && z <= maxZ;
}

function getStageEndZ(stage) {
  return stage.trackSegments.reduce((endZ, segment) => (
    Math.min(endZ, segment.zStart, segment.zEnd)
  ), stage.goalZ);
}

function createStageCurve(curvePoints) {
  const points = curvePoints.map(([x, y, z]) => new THREE.Vector3(x, y, z));
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.42);
  curve.arcLengthDivisions = Math.min(3600, Math.max(1800, Math.abs(stageEndZ) * 0.35));
  return curve;
}

function getStageProgress(z) {
  return THREE.MathUtils.clamp((stageStartZ - z) / stageLength, 0, 1);
}

function getStageZAtGoalProgress(progress) {
  return stageStartZ - (stageStartZ - goalZ) * progress;
}

function smoothstep(edge0, edge1, value) {
  const t = THREE.MathUtils.clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function smoothBand(value, start, end, fade = 0.035) {
  return smoothstep(start, start + fade, value) - smoothstep(end - fade, end, value);
}

function getStageRoll(progress) {
  if (currentStage.rollEnabled === false) return 0;

  const bank = THREE.MathUtils.degToRad(13) * smoothBand(progress, 0.08, 0.2)
    - THREE.MathUtils.degToRad(16) * smoothBand(progress, 0.21, 0.34)
    + THREE.MathUtils.degToRad(18) * smoothBand(progress, 0.35, 0.45)
    - THREE.MathUtils.degToRad(14) * smoothBand(progress, 0.66, 0.78)
    + THREE.MathUtils.degToRad(12) * smoothBand(progress, 0.79, 0.9);
  const loopTurn = smoothstep(0.47, 0.62, progress) * Math.PI * 2;
  return bank + loopTurn;
}

function getStageLift(progress) {
  return rollLiftHeight * smoothBand(progress, 0.445, 0.655, 0.055);
}

function getStageFrame(z, useCache = false) {
  if (useCache) {
    const cacheKey = Math.round(z * 1000);
    if (!staticStageFrameCache.has(cacheKey)) {
      staticStageFrameCache.set(cacheKey, computeStageFrame(z));
    }
    return staticStageFrameCache.get(cacheKey);
  }

  return computeStageFrame(z);
}

function computeStageFrame(z) {
  const progress = getStageProgress(z);
  const center = stageCurve.getPointAt(progress);
  center.y += getStageLift(progress);
  const tangent = stageCurve.getTangentAt(progress).normalize();
  const right = new THREE.Vector3().crossVectors(tangent, worldUp);
  if (right.lengthSq() < 0.0001) {
    right.set(1, 0, 0);
  } else {
    right.normalize();
  }
  const up = new THREE.Vector3().crossVectors(right, tangent).normalize();
  const roll = getStageRoll(progress);

  if (Math.abs(roll) > 0.0001) {
    const rollQuat = new THREE.Quaternion().setFromAxisAngle(tangent, roll);
    right.applyQuaternion(rollQuat).normalize();
    up.applyQuaternion(rollQuat).normalize();
  }

  return { center, tangent, right, up, progress };
}

function getStageQuaternion(frame) {
  const matrix = new THREE.Matrix4();
  matrix.makeBasis(frame.right, frame.up, frame.tangent.clone().negate());
  return new THREE.Quaternion().setFromRotationMatrix(matrix);
}

function toWorldPosition(localPosition, useCache = false) {
  const frame = getStageFrame(localPosition.z, useCache);
  return frame.center.clone()
    .addScaledVector(frame.right, localPosition.x)
    .addScaledVector(frame.up, localPosition.y);
}

function setStageObjectTransform(object, localPosition, localZRotation = 0, extraUp = 0, useCache = false) {
  const frame = getStageFrame(localPosition.z, useCache);
  object.position.copy(frame.center)
    .addScaledVector(frame.right, localPosition.x)
    .addScaledVector(frame.up, localPosition.y + extraUp);
  object.quaternion.copy(getStageQuaternion(frame));
  if (localZRotation !== 0) {
    object.rotateZ(localZRotation);
  }
  return frame;
}

function createWaterGeometry(quality = graphicsSettings.waterQuality) {
  const config = waterQualityConfig[quality] ?? waterQualityConfig.high;
  return new THREE.PlaneGeometry(14000, 14000, config.segments, config.segments);
}

function createWaterMaterial() {
  const material = new THREE.ShaderMaterial({
    name: "ProceduralOceanMaterial",
    uniforms: {
      uTime: { value: 0 },
      uWaveAmplitude: { value: 0.34 },
      uWaveDetail: { value: 0.82 },
      uWaveSpeed: { value: 0.92 },
      uFoamStrength: { value: 0.34 },
      uSparkleStrength: { value: 0.3 },
      uFresnelStrength: { value: 0.62 },
      uDeepColor: { value: new THREE.Color(currentStage.gwangalliTheme ? 0x0a5d85 : 0x0f6fa0) },
      uMidColor: { value: new THREE.Color(currentStage.gwangalliTheme ? 0x179fd0 : 0x21a7db) },
      uShallowColor: { value: new THREE.Color(0x69d8ef) },
      uFoamColor: { value: new THREE.Color(0xe8fbff) },
      uSunColor: { value: new THREE.Color(0xfff4c5) },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uWaveAmplitude;
      uniform float uWaveDetail;
      uniform float uWaveSpeed;

      varying vec2 vWaterUv;
      varying vec3 vWorldPosition;
      varying float vWave;
      varying float vRipple;

      #include <fog_pars_vertex>

      float waveLayer(vec2 position, vec2 direction, float frequency, float speed, float phase) {
        return sin(dot(position, normalize(direction)) * frequency + uTime * speed * uWaveSpeed + phase);
      }

      void main() {
        vec3 transformed = position;
        vec2 waterPosition = position.xy;
        float waveA = waveLayer(waterPosition, vec2(0.8, 0.22), 0.0048, 0.62, 0.0);
        float waveB = waveLayer(waterPosition, vec2(-0.38, 0.92), 0.0072, 0.86, 1.7);
        float waveC = waveLayer(waterPosition, vec2(0.12, 1.0), 0.0115, 1.18, 3.2);
        float longSwell = waveLayer(waterPosition, vec2(1.0, -0.18), 0.0022, 0.32, 2.1);
        float detailWave = sin((waterPosition.x * 0.019 + waterPosition.y * 0.013) + uTime * 1.9 * uWaveSpeed);
        float wave = longSwell * 0.42 + waveA * 0.28 + waveB * 0.2 + waveC * 0.1;
        float ripple = detailWave * uWaveDetail;

        transformed.z += (wave + ripple * 0.08) * uWaveAmplitude;

        vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
        vec4 mvPosition = viewMatrix * worldPosition;
        gl_Position = projectionMatrix * mvPosition;

        vWaterUv = waterPosition * 0.0035;
        vWorldPosition = worldPosition.xyz;
        vWave = wave;
        vRipple = ripple;

        #include <fog_vertex>
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uWaveDetail;
      uniform float uFoamStrength;
      uniform float uSparkleStrength;
      uniform float uFresnelStrength;
      uniform vec3 uDeepColor;
      uniform vec3 uMidColor;
      uniform vec3 uShallowColor;
      uniform vec3 uFoamColor;
      uniform vec3 uSunColor;

      varying vec2 vWaterUv;
      varying vec3 vWorldPosition;
      varying float vWave;
      varying float vRipple;

      #include <fog_pars_fragment>

      float rippleLayer(vec2 uv, float scale, float speed, float phase) {
        return sin(uv.x * scale + uv.y * (scale * 0.63) + uTime * speed + phase);
      }

      void main() {
        vec2 uv = vWaterUv;
        float smallRipple = rippleLayer(uv, 20.0, 0.9, 0.0) * 0.5
          + rippleLayer(uv.yx, 31.0, -0.68, 1.4) * 0.32
          + rippleLayer(uv + vec2(0.21, -0.13), 52.0, 1.22, 2.7) * 0.18;
        smallRipple *= uWaveDetail;

        float depthMix = smoothstep(-0.55, 0.72, vWave + smallRipple * 0.18);
        vec3 waterColor = mix(uDeepColor, uMidColor, depthMix);
        waterColor = mix(waterColor, uShallowColor, smoothstep(0.38, 1.15, smallRipple + vWave * 0.65) * 0.28);

        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        float fresnel = pow(1.0 - clamp(dot(viewDir, vec3(0.0, 1.0, 0.0)), 0.0, 1.0), 2.35);
        waterColor += uShallowColor * fresnel * uFresnelStrength;

        float glitterMask = smoothstep(0.72, 0.98, sin((vWorldPosition.x + vWorldPosition.z) * 0.032 + uTime * 2.6));
        float sparkle = pow(max(0.0, smallRipple * 0.5 + vWave * 0.22 + glitterMask * 0.36), 10.0) * uSparkleStrength;
        waterColor += uSunColor * sparkle;

        float foam = smoothstep(0.58, 0.94, abs(vWave) + smallRipple * 0.24) * uFoamStrength;
        waterColor = mix(waterColor, uFoamColor, foam * 0.38);

        gl_FragColor = vec4(waterColor, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `,
  });

  return material;
}

function addEnvironment() {
  waterMaterial = createWaterMaterial();
  waterMesh = new THREE.Mesh(createWaterGeometry(), waterMaterial);
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.y = seaLevelY;
  waterMesh.receiveShadow = true;
  waterMesh.userData.defaultReceiveShadow = true;
  waterMesh.userData.waterQuality = graphicsSettings.waterQuality;
  scene.add(waterMesh);
  applyWaterSettings(false);

  if (currentStage.harborTheme) return;
  if (currentStage.gwangalliTheme) {
    addGwangalliBeachEnvironment();
    return;
  }

  const islandMaterial = new THREE.MeshStandardMaterial({
    color: 0x50b85d,
    roughness: 0.82,
  });

  const islands = [
    [-34, -22, 17, 6],
    [35, -84, 18, 7],
    [-29, -150, 14, 5],
    [30, -220, 21, 6],
    [-36, -300, 18, 7],
    [38, -370, 24, 8],
    [-32, -455, 20, 6],
    [34, -525, 26, 9],
    [-38, -615, 20, 7],
    [40, -705, 22, 8],
    [-36, -805, 24, 7],
    [36, -890, 28, 9],
    [-40, -990, 23, 8],
    [42, -1085, 26, 10],
    [-42, -1185, 24, 7],
    [38, -1290, 30, 10],
    [-38, -1405, 25, 8],
    [42, -1510, 30, 10],
    [-44, -1625, 24, 7],
    [36, -1745, 28, 9],
    [-40, -1870, 31, 10],
    [44, -1995, 24, 8],
    [-36, -2120, 28, 9],
    [40, -2255, 32, 11],
    [-42, -2395, 25, 8],
    [38, -2545, 34, 10],
  ];

  islands.filter(([x, z, radius]) => isIslandClearOfStage(x, z, radius)).forEach(([x, z, radius, height]) => {
    const island = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius * 1.18, height, 24),
      islandMaterial,
    );
    island.position.set(x, -8 + height * 0.5, z);
    island.receiveShadow = true;
    island.castShadow = false;
    scene.add(island);
  });
}

function isIslandClearOfStage(x, z, radius) {
  if (!isRollClearZone(z)) return true;

  let nearest = Infinity;
  for (let i = -3; i <= 3; i += 1) {
    const sampleZ = z + i * radius * 0.35;
    const center = getStageFrame(sampleZ, true).center;
    nearest = Math.min(nearest, Math.hypot(center.x - x, center.z - z));
  }

  return nearest > radius + 15;
}

function addGwangalliBeachEnvironment() {
  addGwangalliStartApron();
  addGwangalliRoadsideNoiseBarrier();
  addHyegangMiddleSchoolScenery();
  addGwangalliRightSideCityBlocks();
  addHaeundaeIparkStartScenery();
  addGwangalliBridgeDeckDetails();
  addGwangalliBridgeStreetLights();
  addGwangalliBridgePiers();
  addGwangalliCoastalViaductPiers();
  addGwangalliSuspensionStructure();
  addGwangalliTourBoats();
  addGwangalliCoastalLandmarks();
  addYonghoBayLandmarkScenery();
  addGwangalliMidwayResidentialCorridor();
  addGwangalliDenseUrbanCorridor();
  addShinseondaeTunnelApproach();
  addShinseondaeTunnel();
}

function addGwangalliStartApron() {
  const sample = getStageDefinitionGroundSample(0, stageStartZ);
  if (!sample) return;

  const group = new THREE.Group();
  setStageSceneryTransform(group, new THREE.Vector3(0, sample.y - 0.72, stageStartZ), 0, 0, true);

  const deck = new THREE.Mesh(new THREE.BoxGeometry(25.2, 1.1, 36), materials.gwangalliBridge);
  deck.position.z = 12;
  deck.receiveShadow = true;
  group.add(deck);

  const roadCap = new THREE.Mesh(new THREE.PlaneGeometry(20.2, 34), materials.gwangalliRoad);
  roadCap.rotation.x = -Math.PI * 0.5;
  roadCap.position.set(0, 0.76, 12);
  roadCap.receiveShadow = true;
  group.add(roadCap);

  scene.add(group);
}

function addGwangalliRoadsideNoiseBarrier() {
  const startZ = stageStartZ - 12;
  const endZ = getStageZAtGoalProgress(0.04);
  const panelLength = 22;

  for (const side of [-1, 1]) {
    let panelIndex = 0;
    for (let z = startZ; z > endZ; z -= panelLength) {
      const sample = getStageDefinitionGroundSample(0, z);
      if (!sample) continue;

      const distanceToEnd = Math.max(0, z - endZ);
      const taper = smoothstep(0, 1, THREE.MathUtils.clamp(distanceToEnd / 92, 0, 1));
      const heightScale = THREE.MathUtils.lerp(0.46, 1, taper);
      const sideX = side * (sample.segment.width * 0.5 + 2.55);

      const group = new THREE.Group();
      setStageSceneryTransform(group, new THREE.Vector3(sideX, sample.y - 0.12, z), 0, 0, true);

      addNoiseBarrierPanel(group, panelLength + 0.5, heightScale, panelIndex);
      scene.add(group);
      panelIndex += 1;
    }
  }
}

function addNoiseBarrierPanel(group, length, heightScale, panelIndex) {
  const concreteHeight = 1.8 * heightScale;
  const lowerHeight = 2.25 * heightScale;
  const upperHeight = 2.35 * heightScale;
  const totalHeight = concreteHeight + lowerHeight + upperHeight;
  const wallX = 0;

  const concrete = new THREE.Mesh(
    new THREE.BoxGeometry(0.64, Math.max(0.22, concreteHeight), length),
    materials.noiseWallConcrete,
  );
  concrete.position.set(wallX, concreteHeight * 0.5, 0);
  concrete.castShadow = true;
  concrete.receiveShadow = true;
  group.add(concrete);

  const lower = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, Math.max(0.24, lowerHeight), length * 0.94),
    materials.noiseWallGreen,
  );
  lower.position.set(wallX, concreteHeight + lowerHeight * 0.5, 0);
  lower.castShadow = true;
  lower.receiveShadow = true;
  group.add(lower);

  const accentMaterial = panelIndex % 9 === 4
    ? materials.noiseWallOrange
    : panelIndex % 11 === 7
      ? materials.noiseWallBlue
      : materials.noiseWallGlass;
  const upper = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, Math.max(0.18, upperHeight), length * 0.92),
    accentMaterial,
  );
  upper.position.set(wallX, concreteHeight + lowerHeight + upperHeight * 0.5, 0);
  upper.castShadow = true;
  group.add(upper);

  const ribCount = 3;
  for (let i = 0; i < ribCount; i += 1) {
    const ribZ = -length * 0.5 + i * (length / (ribCount - 1));
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.72, Math.max(0.34, totalHeight), 0.36), materials.noiseWallFrame);
    rib.position.set(wallX, totalHeight * 0.5, ribZ);
    rib.castShadow = true;
    rib.receiveShadow = true;
    group.add(rib);
  }

  for (const y of [
    concreteHeight + 0.08,
    concreteHeight + lowerHeight,
    totalHeight,
  ]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.18, length), materials.noiseWallFrame);
    rail.position.set(wallX, y, 0);
    rail.castShadow = true;
    group.add(rail);
  }
}

function addHaeundaeIparkStartScenery() {
  const iparkSceneryZ = getStageZAtGoalProgress(0.13);
  const group = new THREE.Group();
  setStageSceneryTransform(group, new THREE.Vector3(-235, seaLevelY, iparkSceneryZ), Math.PI * 0.5 - 0.18, 0, true);
  group.scale.setScalar(0.82);

  addHaeundaeShorelineBase(group);
  addHaeundaeSmallApartmentRows(group);
  addHaeundaeExordiumApartments(group);
  addHaeundaeIparkTowers(group);
  addHaeundaeMarina(group);

  scene.add(group);
}

function addGwangalliRightSideCityBlocks() {
  const cityZ = getStageZAtGoalProgress(0.07);
  const spacingScale = 2;
  const spreadX = (x) => -x * spacingScale;
  const spreadZ = (z) => -z;
  addGwangalliRightSidePark(cityZ);

  const group = new THREE.Group();
  setStageSceneryTransform(group, new THREE.Vector3(200, seaLevelY + 0.45, cityZ), Math.PI * 1.5 - 0.08, 0, true);
  group.scale.setScalar(0.78);

  const base = new THREE.Mesh(new THREE.BoxGeometry(380, 1.2, 96), materials.coastalRock);
  base.position.set(spreadX(6), 0.15, spreadZ(4));
  base.receiveShadow = true;
  group.add(base);

  addRightCityTower(group, {
    x: spreadX(86),
    z: spreadZ(-6),
    width: 19,
    depth: 30,
    height: 128,
    floors: 17,
    material: materials.rightCityDarkGlass,
    verticals: true,
    crowned: true,
  });
  addRightCityTower(group, {
    x: spreadX(50),
    z: spreadZ(-10),
    width: 18,
    depth: 28,
    height: 118,
    floors: 16,
    material: materials.rightCityDarkGlass,
    verticals: true,
    crowned: true,
  });
  addRightCityTower(group, {
    x: spreadX(12),
    z: spreadZ(0),
    width: 34,
    depth: 22,
    height: 98,
    floors: 13,
    material: materials.rightCityGlass,
    horizontalBands: true,
  });
  addRightCityTower(group, {
    x: spreadX(-28),
    z: spreadZ(-4),
    width: 17,
    depth: 20,
    height: 106,
    floors: 15,
    material: materials.gwangalliIparkGlass,
    verticals: true,
  });
  addRightCityTower(group, {
    x: spreadX(-68),
    z: spreadZ(2),
    width: 25,
    depth: 24,
    height: 78,
    floors: 10,
    material: materials.rightCityGlass,
    horizontalBands: true,
  });
  addRightCityTower(group, {
    x: spreadX(-90),
    z: spreadZ(-5),
    width: 27,
    depth: 26,
    height: 86,
    floors: 11,
    material: materials.rightCityGlass,
    horizontalBands: true,
  });

  scene.add(group);
  addGwangalliRightSideBexco(cityZ);
}

function addGwangalliRightSidePark(cityZ) {
  const group = new THREE.Group();
  setStageSceneryTransform(group, new THREE.Vector3(104, seaLevelY + 0.35, cityZ), -0.08, 0, true);

  const parkBase = new THREE.Mesh(new THREE.BoxGeometry(165, 1.05, 230), materials.coastalRock);
  parkBase.position.set(0, 0.34, 0);
  parkBase.castShadow = false;
  parkBase.receiveShadow = true;
  group.add(parkBase);

  const grass = new THREE.Mesh(new THREE.BoxGeometry(152, 0.18, 216), materials.coastalForest);
  grass.position.set(0, 0.96, 0);
  grass.receiveShadow = true;
  group.add(grass);

  const plaza = new THREE.Mesh(new THREE.BoxGeometry(34, 0.24, 184), materials.gwangalliBoardwalk);
  plaza.position.set(-44, 1.08, 0);
  plaza.receiveShadow = true;
  group.add(plaza);

  const crossPath = new THREE.Mesh(new THREE.BoxGeometry(145, 0.25, 10), materials.gwangalliBoardwalk);
  crossPath.position.set(0, 1.1, -30);
  crossPath.receiveShadow = true;
  group.add(crossPath);

  const pond = new THREE.Mesh(new THREE.CircleGeometry(1, 40), materials.boatWake);
  pond.rotation.x = -Math.PI * 0.5;
  pond.position.set(36, 1.18, 34);
  pond.scale.set(24, 15, 1);
  group.add(pond);

  for (let i = 0; i < 22; i += 1) {
    const tree = new THREE.Group();
    const lane = i % 2 === 0 ? -58 : 58;
    const z = -92 + Math.floor(i / 2) * 18.4;
    tree.position.set(lane + (i % 4 < 2 ? -4 : 4), 1.06, z);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 4.0, 8), materials.coastalRock);
    trunk.position.y = 2.0;
    trunk.castShadow = true;
    tree.add(trunk);

    const crown = new THREE.Mesh(new THREE.ConeGeometry(4.0, 9.0, 10), materials.coastalForest);
    crown.position.y = 8.2;
    crown.castShadow = true;
    tree.add(crown);
    group.add(tree);
  }

  for (let i = 0; i < 9; i += 1) {
    const bench = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.5, 1.4), materials.marinaDock);
    bench.position.set(-18 + (i % 3) * 25, 1.55, -78 + Math.floor(i / 3) * 56);
    bench.rotation.y = (i % 2 === 0 ? 0.04 : -0.05);
    bench.castShadow = true;
    group.add(bench);
  }

  scene.add(group);
}

function addGwangalliRightSideBexco(cityZ) {
  const group = new THREE.Group();
  setStageSceneryTransform(group, new THREE.Vector3(178, seaLevelY + 0.62, cityZ), Math.PI * 1.5 - 0.08, 0, true);
  group.scale.setScalar(0.78);
  addBexcoExhibitionCenter(group, 0, 0);
  scene.add(group);
}

function addRightCityTower(group, {
  x,
  z,
  width,
  depth,
  height,
  floors,
  material,
  horizontalBands = false,
  verticals = false,
  crowned = false,
}) {
  const tower = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  tower.position.set(x, height * 0.5 + 0.8, z);
  tower.castShadow = true;
  tower.receiveShadow = true;
  group.add(tower);

  const cap = new THREE.Mesh(new THREE.BoxGeometry(width + 1.8, 1.8, depth + 1.6), materials.rightCityFacade);
  cap.position.set(x, height + 1.9, z);
  cap.castShadow = true;
  group.add(cap);

  if (crowned) {
    const crownBase = new THREE.Mesh(new THREE.BoxGeometry(width * 0.9, 5.2, depth * 0.86), materials.rightCityFacade);
    crownBase.position.set(x, height + 5.1, z);
    crownBase.castShadow = true;
    group.add(crownBase);

    const crownTop = new THREE.Mesh(new THREE.ConeGeometry(width * 0.58, 8.2, 4), materials.rightCityDarkGlass);
    crownTop.position.set(x, height + 11.0, z);
    crownTop.rotation.y = Math.PI * 0.25;
    crownTop.scale.z = depth / width;
    crownTop.castShadow = true;
    group.add(crownTop);
  }

  for (const side of [-1, 1]) {
    const glassSkin = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.92, height * 0.82, 0.16),
      material === materials.rightCityDarkGlass ? materials.rightCityDarkGlass : materials.rightCityGlass,
    );
    glassSkin.position.set(x, height * 0.52, z + side * (depth * 0.5 + 0.1));
    glassSkin.castShadow = false;
    group.add(glassSkin);
  }

  for (const side of [-1, 1]) {
    const sideGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, height * 0.78, depth * 0.86),
      material === materials.rightCityDarkGlass ? materials.rightCityDarkGlass : materials.rightCityGlass,
    );
    sideGlass.position.set(x + side * (width * 0.5 + 0.08), height * 0.5, z);
    sideGlass.castShadow = false;
    group.add(sideGlass);
  }

  for (let floor = 1; floor < floors; floor += 1) {
    const y = 4.2 + floor * (height - 7) / floors;
    if (horizontalBands) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(width * 0.9, 0.36, 0.12), materials.gwangalliWindow);
      band.position.set(x, y, z - depth * 0.5 - 0.08);
      group.add(band);
    } else {
      for (const side of [-1, 1]) {
        const strip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.72, depth * 0.72), materials.gwangalliWindow);
        strip.position.set(x + side * (width * 0.5 + 0.08), y, z);
        group.add(strip);
      }
    }
  }

  if (verticals) {
    for (const offset of [-0.28, 0, 0.28]) {
      const spine = new THREE.Mesh(new THREE.BoxGeometry(width * 0.08, height * 0.9, 0.16), materials.rightCityFacade);
      spine.position.set(x + width * offset, height * 0.52, z - depth * 0.5 - 0.12);
      spine.castShadow = false;
      group.add(spine);
    }
  }
}

function addBexcoExhibitionCenter(group, x, z) {
  const hall = new THREE.Mesh(new THREE.BoxGeometry(82, 22, 30), materials.bexcoWall);
  hall.position.set(x, 11.8, z);
  hall.castShadow = true;
  hall.receiveShadow = true;
  group.add(hall);

  const glassEntrance = new THREE.Mesh(new THREE.BoxGeometry(18, 18, 2.2), materials.bexcoGlass);
  glassEntrance.position.set(x - 22, 10.0, z - 16.2);
  glassEntrance.rotation.z = -0.18;
  glassEntrance.castShadow = true;
  group.add(glassEntrance);

  const signMaterial = createCanvasLabelMaterial("BEXCO", 256, 82, "#eef6f8", "rgba(63, 70, 76, 0)");
  signMaterial.transparent = true;
  signMaterial.side = THREE.DoubleSide;
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(20, 6.4), signMaterial);
  sign.position.set(x + 20, 23.6, z - 15.2);
  group.add(sign);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(86, 2.4, 33), materials.rightCityFacade);
  roof.position.set(x, 24.0, z);
  roof.castShadow = true;
  group.add(roof);
}

function addHyegangMiddleSchoolScenery() {
  const schoolStartZ = getStageZAtGoalProgress(0.04);
  const fieldEndZ = getStageZAtGoalProgress(0.08);
  const fieldCenterZ = (schoolStartZ + fieldEndZ) * 0.5;
  const fieldLength = Math.abs(schoolStartZ - fieldEndZ);
  const group = new THREE.Group();

  setStageSceneryTransform(group, new THREE.Vector3(-104, seaLevelY + 0.1, fieldCenterZ), 0.08, 0, true);

  addHyegangPlayground(group, fieldLength);
  addHyegangSchoolBuildings(group, fieldLength);

  scene.add(group);
}

function addHyegangPlayground(group, fieldLength) {
  const fieldHalfLength = fieldLength * 0.5;
  const fieldHalfWidth = 62;

  const field = new THREE.Mesh(new THREE.CircleGeometry(1, 96), materials.hyegangSchoolField);
  field.rotation.x = -Math.PI * 0.5;
  field.position.set(0, 0.28, 0);
  field.scale.set(fieldHalfWidth, fieldHalfLength, 1);
  field.receiveShadow = true;
  group.add(field);

  const outerLine = new THREE.Mesh(new THREE.RingGeometry(0.982, 1.0, 96), materials.hyegangSchoolLine);
  outerLine.rotation.x = -Math.PI * 0.5;
  outerLine.position.set(0, 0.35, 0);
  outerLine.scale.set(fieldHalfWidth * 1.02, fieldHalfLength * 1.02, 1);
  group.add(outerLine);

  const innerLine = new THREE.Mesh(new THREE.RingGeometry(0.982, 1.0, 96), materials.hyegangSchoolLine);
  innerLine.rotation.x = -Math.PI * 0.5;
  innerLine.position.set(0, 0.37, 0);
  innerLine.scale.set(fieldHalfWidth * 0.58, fieldHalfLength * 0.62, 1);
  group.add(innerLine);

  const centerCircle = new THREE.Mesh(new THREE.RingGeometry(0.94, 1.0, 48), materials.hyegangSchoolLine);
  centerCircle.rotation.x = -Math.PI * 0.5;
  centerCircle.position.set(0, 0.39, 0);
  centerCircle.scale.set(13, 13, 1);
  group.add(centerCircle);

  for (const z of [-fieldHalfLength * 0.55, fieldHalfLength * 0.55]) {
    addHyegangSoccerGoal(group, 0, z, z > 0 ? Math.PI : 0);
  }

  for (let i = 0; i < 12; i += 1) {
    const student = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 1.25, 8), i % 2 === 0 ? materials.gwangalliBridge : materials.tourBoatNavy);
    body.position.y = 1.05;
    student.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.33, 10, 8), materials.speedsterSkin);
    head.position.y = 1.85;
    student.add(head);

    student.position.set(
      -fieldHalfWidth * 0.42 + (i % 4) * fieldHalfWidth * 0.27,
      0.35,
      -fieldHalfLength * 0.24 + Math.floor(i / 4) * fieldHalfLength * 0.2,
    );
    student.scale.setScalar(0.75);
    group.add(student);
  }
}

function addHyegangSoccerGoal(group, x, z, yaw) {
  const goal = new THREE.Group();
  goal.position.set(x, 0.44, z);
  goal.rotation.y = yaw;

  const postMaterial = materials.marinaPost;
  const leftPost = new THREE.Mesh(new THREE.BoxGeometry(0.32, 4.6, 0.32), postMaterial);
  leftPost.position.set(-8.2, 2.3, 0);
  goal.add(leftPost);

  const rightPost = leftPost.clone();
  rightPost.position.x = 8.2;
  goal.add(rightPost);

  const crossbar = new THREE.Mesh(new THREE.BoxGeometry(16.7, 0.32, 0.32), postMaterial);
  crossbar.position.set(0, 4.55, 0);
  goal.add(crossbar);

  const backBar = new THREE.Mesh(new THREE.BoxGeometry(15.8, 0.24, 0.24), postMaterial);
  backBar.position.set(0, 0.28, -3.2);
  goal.add(backBar);

  for (const side of [-1, 1]) {
    const brace = makeCylinderBetween(
      new THREE.Vector3(side * 8.1, 4.45, 0),
      new THREE.Vector3(side * 7.2, 0.35, -3.2),
      0.1,
      postMaterial,
    );
    goal.add(brace);
  }

  group.add(goal);
}

function addHyegangSchoolBuildings(group, fieldLength) {
  const schoolZ = fieldLength * 0.28;
  const schoolX = -72;
  const campus = new THREE.Group();
  campus.position.set(schoolX, 0, schoolZ);
  campus.rotation.y = Math.PI * 0.5;
  group.add(campus);

  addHyegangSchoolBlock(campus, {
    x: 0,
    z: 0,
    width: 20,
    depth: 188,
    height: 27,
    floors: 4,
  });

  addHyegangSchoolBlock(campus, {
    x: -28,
    z: -58,
    width: 20,
    depth: 96,
    height: 22,
    floors: 3,
  });

  addHyegangSchoolBlock(campus, {
    x: 31,
    z: -42,
    width: 25,
    depth: 72,
    height: 34,
    floors: 4,
    gym: true,
  });

  addHyegangSchoolBlock(campus, {
    x: 32,
    z: 72,
    width: 23,
    depth: 66,
    height: 26,
    floors: 3,
  });

  addHyegangSchoolBlock(campus, {
    x: -31,
    z: 82,
    width: 18,
    depth: 48,
    height: 20,
    floors: 3,
  });

  addHyegangGlassTower(campus, 3, 96, 35);
  addHyegangGlassTower(campus, 2, -16, 29);
  addHyegangGlassTower(campus, 31, 18, 31);
  addHyegangConnector(campus, -14, 22, 14, 58);
  addHyegangConnector(campus, 18, 18, 13, 52);

  const rooftop = new THREE.Mesh(new THREE.BoxGeometry(24, 1.2, 194), materials.hyegangSchoolTrim);
  rooftop.position.set(0, 28.1, 0);
  rooftop.castShadow = true;
  campus.add(rooftop);

  for (let i = 0; i < 5; i += 1) {
    const roofFin = new THREE.Mesh(new THREE.BoxGeometry(0.7, 4.0, 1.0), materials.tourBoatRed);
    roofFin.position.set(2.5, 31.0, 64 + i * 4.2);
    roofFin.rotation.z = 0.22;
    roofFin.castShadow = true;
    campus.add(roofFin);
  }

  const signMaterial = createCanvasLabelMaterial("HYE GANG M.S.", 320, 76, "#23404a", "rgba(245, 248, 246, 0)");
  signMaterial.transparent = true;
  signMaterial.side = THREE.DoubleSide;
  for (const side of [-1, 1]) {
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(16, 3.8), signMaterial);
    sign.position.set(side * 10.16, 21.2, 44);
    sign.rotation.y = side > 0 ? Math.PI * 0.5 : -Math.PI * 0.5;
    campus.add(sign);
  }

  addHyegangRooftopEquipment(campus);
  addHyegangTreeLine(group, fieldLength);
}

function addHyegangSchoolBlock(group, { x, z, width, depth, height, floors, gym = false }) {
  const block = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials.hyegangSchoolWall);
  block.position.set(x, height * 0.5 + 0.65, z);
  block.castShadow = true;
  block.receiveShadow = true;
  group.add(block);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(width + 1.4, 1.1, depth + 2.2), materials.hyegangSchoolTrim);
  roof.position.set(x, height + 1.45, z);
  roof.castShadow = true;
  group.add(roof);

  for (let floor = 0; floor < floors; floor += 1) {
    const y = 6.0 + floor * (height / (floors + 0.6));
    for (const side of [-1, 1]) {
      const windowStrip = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1.35, depth * (gym ? 0.44 : 0.82)),
        floor % 2 === 0 ? materials.hyegangSchoolGlass : materials.gwangalliWindow,
      );
      windowStrip.position.set(x + side * (width * 0.5 + 0.08), y, z);
      group.add(windowStrip);

      const trim = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, depth * 0.9), materials.hyegangSchoolTrim);
      trim.position.set(x + side * (width * 0.5 + 0.12), y + 1.15, z);
      group.add(trim);
    }
  }
}

function addHyegangConnector(group, x, z, width, depth) {
  const connector = new THREE.Mesh(new THREE.BoxGeometry(width, 12, depth), materials.hyegangSchoolWall);
  connector.position.set(x, 6.65, z);
  connector.castShadow = true;
  connector.receiveShadow = true;
  group.add(connector);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(width + 1.0, 0.7, depth + 1.4), materials.hyegangSchoolTrim);
  roof.position.set(x, 13.1, z);
  roof.castShadow = true;
  group.add(roof);

  for (const side of [-1, 1]) {
    const windows = new THREE.Mesh(new THREE.BoxGeometry(width * 0.68, 0.9, 0.08), materials.hyegangSchoolGlass);
    windows.position.set(x, 8.2, z + side * (depth * 0.5 + 0.06));
    group.add(windows);
  }
}

function addHyegangRooftopEquipment(group) {
  const antennaBase = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.8, 6.2), materials.hyegangSchoolTrim);
  antennaBase.position.set(-33, 30.6, -18);
  antennaBase.castShadow = true;
  group.add(antennaBase);

  for (let i = 0; i < 3; i += 1) {
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 10 + i * 1.6, 8), materials.marinaPost);
    mast.position.set(-35 + i * 2.2, 37.0 + i * 0.8, -18 + i * 1.2);
    mast.rotation.z = (i - 1) * 0.08;
    mast.castShadow = true;
    group.add(mast);
  }

  const pitchedRoof = new THREE.Mesh(new THREE.ConeGeometry(17, 9, 4), materials.hyegangSchoolTrim);
  pitchedRoof.position.set(30, 40.2, -42);
  pitchedRoof.rotation.y = Math.PI * 0.25;
  pitchedRoof.scale.z = 0.62;
  pitchedRoof.castShadow = true;
  group.add(pitchedRoof);

  const gymRidge = new THREE.Mesh(new THREE.BoxGeometry(29, 1.2, 4), materials.hyegangSchoolTrim);
  gymRidge.position.set(31, 38.0, -42);
  gymRidge.castShadow = true;
  group.add(gymRidge);
}

function addHyegangTreeLine(group, fieldLength) {
  const treeCount = 13;
  const startZ = -fieldLength * 0.34;
  const spacing = fieldLength * 0.68 / (treeCount - 1);

  for (let i = 0; i < treeCount; i += 1) {
    const tree = new THREE.Group();
    tree.position.set(-70 + (i % 2) * 4, 0.46, startZ + i * spacing);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.55, 4.4, 8), materials.coastalRock);
    trunk.position.y = 2.2;
    trunk.castShadow = true;
    tree.add(trunk);

    const crown = new THREE.Mesh(new THREE.ConeGeometry(3.5 + (i % 3) * 0.45, 9.0, 10), materials.coastalForest);
    crown.position.y = 8.4;
    crown.castShadow = true;
    tree.add(crown);

    group.add(tree);
  }
}

function addHyegangGlassTower(group, x, z, height) {
  const tower = new THREE.Mesh(new THREE.BoxGeometry(17, height, 18), materials.hyegangSchoolWall);
  tower.position.set(x, height * 0.5 + 0.65, z);
  tower.castShadow = true;
  tower.receiveShadow = true;
  group.add(tower);

  const glass = new THREE.Mesh(new THREE.BoxGeometry(0.14, height * 0.82, 12), materials.hyegangSchoolGlass);
  glass.position.set(x + 8.62, height * 0.52, z);
  group.add(glass);

  const cap = new THREE.Mesh(new THREE.BoxGeometry(19, 1.2, 20), materials.hyegangSchoolTrim);
  cap.position.set(x, height + 1.5, z);
  cap.castShadow = true;
  group.add(cap);
}

function addHaeundaeShorelineBase(group) {
  const land = new THREE.Mesh(new THREE.BoxGeometry(340, 1.2, 190), materials.coastalRock);
  land.position.set(-38, 0.15, -18);
  land.castShadow = false;
  land.receiveShadow = true;
  group.add(land);

  const waterfront = new THREE.Mesh(new THREE.BoxGeometry(306, 0.38, 8), materials.marinaDock);
  waterfront.position.set(-44, 1.0, 72);
  waterfront.castShadow = true;
  waterfront.receiveShadow = true;
  group.add(waterfront);

  const promenade = new THREE.Mesh(new THREE.BoxGeometry(300, 0.12, 16), materials.gwangalliBoardwalk);
  promenade.position.set(-44, 1.26, 58);
  promenade.receiveShadow = true;
  group.add(promenade);

  for (let i = 0; i < 18; i += 1) {
    const block = new THREE.Mesh(new THREE.BoxGeometry(10, 1.6, 4.4), materials.coastalRock);
    block.position.set(-190 + i * 16.4, -0.35, 82);
    block.rotation.y = (i % 2 === 0 ? 0.04 : -0.04);
    block.receiveShadow = true;
    group.add(block);
  }
}

function addHaeundaeExordiumApartments(group) {
  const podium = new THREE.Mesh(new THREE.BoxGeometry(54, 7.5, 22), materials.haeundaeExordiumCore);
  podium.position.set(-184, 4.7, -4);
  podium.castShadow = true;
  podium.receiveShadow = true;
  group.add(podium);

  addExordiumTower(group, {
    x: -198,
    z: -14,
    radius: 10.6,
    height: 104,
    scaleX: 0.72,
    seed: 1,
  });
  addExordiumTower(group, {
    x: -172,
    z: -18,
    radius: 11.2,
    height: 118,
    scaleX: 0.78,
    seed: 4,
  });
  addExordiumTower(group, {
    x: -218,
    z: -4,
    radius: 8.2,
    height: 78,
    scaleX: 0.74,
    seed: 7,
  });
}

function addExordiumTower(group, { x, z, radius, height, scaleX, seed }) {
  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius * 0.96, height, 32),
    materials.haeundaeExordiumGlass,
  );
  tower.position.set(x, 1.08 + height * 0.5, z);
  tower.scale.x = scaleX;
  tower.castShadow = true;
  tower.receiveShadow = true;
  group.add(tower);

  const darkSpine = new THREE.Mesh(
    new THREE.BoxGeometry(radius * 0.36, height * 0.88, 0.22),
    materials.haeundaeExordiumCore,
  );
  darkSpine.position.set(x + radius * scaleX * 0.54, height * 0.49, z - radius * 0.88);
  darkSpine.castShadow = false;
  group.add(darkSpine);

  const floorCount = Math.floor(height / 6.2);
  for (let floor = 1; floor < floorCount; floor += 1) {
    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 1.02, radius * 1.02, 0.22, 32),
      floor % 4 === 0 ? materials.gwangalliBuildingLight : materials.haeundaeExordiumBalcony,
    );
    band.position.set(x, 2.5 + floor * 6.0, z);
    band.scale.x = scaleX;
    band.castShadow = false;
    group.add(band);
  }

  const crown = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.72, radius * 0.94, 3.6, 32),
    materials.haeundaeExordiumBalcony,
  );
  crown.position.set(x, height + 3.2, z);
  crown.scale.x = scaleX * 0.95;
  crown.castShadow = true;
  group.add(crown);

  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 0.74, 24, 12),
    seed % 2 === 0 ? materials.haeundaeExordiumBalcony : materials.haeundaeExordiumGlass,
  );
  cap.position.set(x, height + 5.0, z);
  cap.scale.set(scaleX, 0.28, 0.72);
  cap.castShadow = true;
  group.add(cap);
}

function addHaeundaeIparkTowers(group) {
  const iparkHeightScale = 2;
  addIparkSailTower(group, {
    x: 104,
    z: -52,
    width: 24,
    depth: 17,
    height: 118 * iparkHeightScale,
    curve: 1,
    material: materials.gwangalliIparkGlass,
    label: "I'PARK",
  });
  addIparkSailTower(group, {
    x: 46,
    z: -58,
    width: 23,
    depth: 18,
    height: 104 * iparkHeightScale,
    curve: -1,
    material: materials.gwangalliIparkGlass,
  });
  addIparkSailTower(group, {
    x: 140,
    z: -68,
    width: 20,
    depth: 15,
    height: 78 * iparkHeightScale,
    curve: 1,
    material: materials.gwangalliIparkFacade,
  });
  addIparkRoundedTower(group, { x: 4, z: -46, radius: 9.4, height: 96 * iparkHeightScale, seed: 2 });
  addIparkRoundedTower(group, { x: -16, z: -48, radius: 8.2, height: 82 * iparkHeightScale, seed: 5 });
  addIparkRectTower(group, { x: 74, z: -88, width: 18, depth: 15, height: 88 * iparkHeightScale, seed: 9 });
  addIparkRectTower(group, { x: -40, z: -28, width: 17, depth: 14, height: 58 * iparkHeightScale, seed: 14 });
}

function addIparkSailTower(group, { x, z, width, depth, height, curve, material, label }) {
  const tower = new THREE.Mesh(createIparkSailTowerGeometry(width, height, depth, curve), material);
  tower.position.set(x, 1.08, z);
  tower.castShadow = true;
  tower.receiveShadow = true;
  group.add(tower);

  addIparkWindowBands(group, { x, z, width, depth, height, rows: Math.floor(height / 7.2), yBase: 4.5 });
  addIparkVerticalSpine(group, { x: x + curve * width * 0.33, z, height, depth });

  if (label) {
    const labelMaterial = createCanvasLabelMaterial(label, 256, 80, "#f5fbff", "rgba(10, 34, 48, 0)");
    labelMaterial.side = THREE.DoubleSide;
    labelMaterial.transparent = true;
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.66, 5.1), labelMaterial);
    sign.position.set(x + curve * width * 0.12, height * 0.86, z - depth * 0.5 - 0.12);
    sign.castShadow = false;
    group.add(sign);
  }
}

function createIparkSailTowerGeometry(width, height, depth, curve) {
  const half = width * 0.5;
  const shape = new THREE.Shape();
  shape.moveTo(-half, 0);
  shape.lineTo(half, 0);
  if (curve > 0) {
    shape.lineTo(half, height * 0.98);
    shape.quadraticCurveTo(half * 0.05, height * 1.04, -half, height * 0.79);
  } else {
    shape.lineTo(half, height * 0.79);
    shape.quadraticCurveTo(-half * 0.05, height * 1.04, -half, height * 0.98);
  }
  shape.lineTo(-half, 0);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    curveSegments: 16,
  });
  geometry.translate(0, 0, -depth * 0.5);
  geometry.computeVertexNormals();
  return geometry;
}

function addIparkRoundedTower(group, { x, z, radius, height, seed }) {
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.92, height, 28), materials.gwangalliIparkDarkGlass);
  tower.position.set(x, 1.08 + height * 0.5, z);
  tower.scale.x = 0.78;
  tower.castShadow = true;
  tower.receiveShadow = true;
  group.add(tower);

  const crown = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.7, radius * 0.8, 2.4, 28), materials.gwangalliIparkFacade);
  crown.position.set(x, height + 2.8, z);
  crown.scale.x = 0.85;
  crown.castShadow = true;
  group.add(crown);

  addIparkWindowBands(group, {
    x,
    z,
    width: radius * 1.2,
    depth: radius * 1.6,
    height,
    rows: Math.floor(height / 7.2),
    yBase: 5.2,
  });
}

function addIparkRectTower(group, { x, z, width, depth, height, seed }) {
  const tower = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), seed % 2 === 0 ? materials.gwangalliIparkFacade : materials.gwangalliBuilding);
  tower.position.set(x, 1.08 + height * 0.5, z);
  tower.castShadow = true;
  tower.receiveShadow = true;
  group.add(tower);

  addIparkWindowBands(group, { x, z, width, depth, height, rows: Math.floor(height / 7), yBase: 4.8 });
}

function addIparkWindowBands(group, { x, z, width, depth, height, rows, yBase }) {
  const safeRows = Math.max(4, rows);
  for (let row = 0; row < safeRows; row += 1) {
    const y = yBase + row * ((height - yBase * 1.5) / safeRows);
    const bandWidth = width * (row % 4 === 0 ? 0.46 : 0.68);
    const material = row % 3 === 0 ? materials.gwangalliBuildingLight : materials.gwangalliWindow;

    for (const side of [-1, 1]) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(bandWidth, 0.34, 0.08), material);
      band.position.set(x, y, z + side * (depth * 0.5 + 0.08));
      band.castShadow = false;
      group.add(band);
    }
  }
}

function addIparkVerticalSpine(group, { x, z, height, depth }) {
  const spine = new THREE.Mesh(new THREE.BoxGeometry(1.0, height * 0.76, 0.12), materials.gwangalliIparkDarkGlass);
  spine.position.set(x, height * 0.48, z - depth * 0.5 - 0.14);
  spine.castShadow = false;
  group.add(spine);
}

function addHaeundaeSmallApartmentRows(group) {
  for (let i = 0; i < 14; i += 1) {
    const height = 18 + (i % 5) * 4.2;
    const width = 8.5 + (i % 3) * 1.4;
    const depth = 9.5 + (i % 4) * 1.1;
    const x = -94 + i * 13.8;
    const z = 2 + (i % 3) * 13;
    addIparkRectTower(group, { x, z, width, depth, height, seed: i + 30 });
  }
}

function addHaeundaeMarina(group) {
  const mainDock = new THREE.Mesh(new THREE.BoxGeometry(214, 0.35, 5.2), materials.marinaDock);
  mainDock.position.set(-78, 0.62, 98);
  mainDock.castShadow = true;
  mainDock.receiveShadow = true;
  group.add(mainDock);

  for (let i = 0; i < 13; i += 1) {
    const x = -176 + i * 16.4;
    const finger = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.28, 46), materials.marinaDock);
    finger.position.set(x, 0.58, 117);
    finger.castShadow = true;
    finger.receiveShadow = true;
    group.add(finger);

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 3.2, 8), materials.marinaPost);
    post.position.set(x, 1.35, 140);
    post.castShadow = true;
    group.add(post);
  }

  const boatPlacements = [
    [-176, 136, -0.08, 0.58, "ferry"],
    [-160, 116, 0.04, 0.48, "speedboat"],
    [-143, 136, -0.04, 0.5, "fishing"],
    [-126, 116, 0.08, 0.46, "catamaran"],
    [-108, 136, -0.06, 0.48, "speedboat"],
    [-90, 116, 0.05, 0.52, "fishing"],
    [-70, 136, -0.02, 0.6, "ferry"],
    [-50, 116, 0.08, 0.48, "speedboat"],
    [-30, 136, -0.04, 0.5, "catamaran"],
    [-10, 116, 0.04, 0.52, "fishing"],
    [10, 136, -0.02, 0.56, "ferry"],
  ];
  boatPlacements.forEach(([x, z, yaw, scale, type], index) => addStaticMarinaBoat(group, x, z, yaw, scale, type, index));
}

function addStaticMarinaBoat(group, x, z, yaw, scale, type, seed) {
  const boat = new THREE.Group();
  boat.position.set(x, 0.74, z);
  boat.rotation.y = yaw + Math.PI * 0.5;
  boat.scale.setScalar(scale);
  addTourBoatModel(boat, type, seed);

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 11.5 + (seed % 3) * 1.8, 8), materials.marinaPost);
  mast.position.set(0, 7.4, 0.6);
  mast.castShadow = true;
  boat.add(mast);

  group.add(boat);
}

function addGwangalliBridgeDeckDetails() {
  const bridgeEndZ = getGwangalliBridgeEndZ();

  for (const segment of currentStage.trackSegments) {
    if (Math.min(segment.zStart, segment.zEnd) < bridgeEndZ) continue;

    const deckWidth = segment.width + 4.8;
    const lowerDeck = new THREE.Mesh(
      makeScenerySlopedBoxGeometry(deckWidth, segment.zStart, segment.zEnd, segment.yStart - 2.45, segment.yEnd - 2.45, 0.52),
      materials.gwangalliBridge,
    );
    lowerDeck.receiveShadow = true;
    scene.add(lowerDeck);

    const underGirder = new THREE.Mesh(
      makeScenerySlopedBoxGeometry(deckWidth + 1.2, segment.zStart, segment.zEnd, segment.yStart - 3.25, segment.yEnd - 3.25, 0.36),
      materials.gwangalliBridge,
    );
    underGirder.receiveShadow = true;
    scene.add(underGirder);
  }

  addGwangalliBridgeContinuousSideBeams();
  addGwangalliBridgeContinuousRails();
  addGwangalliLaneMarkings();
}

function addGwangalliBridgeContinuousSideBeams() {
  const bridgeEndZ = getGwangalliBridgeEndZ();
  const sideX = 11.45;

  for (const side of [-1, 1]) {
    const upperBeam = new THREE.Mesh(
      makeContinuousScenerySideBoxGeometry(side * sideX, stageStartZ, bridgeEndZ, 0.25, 0.72, 1.5, 6),
      materials.gwangalliBridge,
    );
    upperBeam.castShadow = true;
    upperBeam.receiveShadow = true;
    scene.add(upperBeam);

    const lowerBeam = new THREE.Mesh(
      makeContinuousScenerySideBoxGeometry(side * sideX, stageStartZ, bridgeEndZ, -2.0, 0.54, 1.0, 6),
      materials.gwangalliBridgeCable,
    );
    lowerBeam.castShadow = false;
    lowerBeam.receiveShadow = true;
    scene.add(lowerBeam);
  }
}

function addGwangalliBridgeContinuousRails() {
  const bridgeEndZ = getGwangalliBridgeEndZ();
  const railX = 10.75;

  for (const side of [-1, 1]) {
    const barrier = new THREE.Mesh(
      makeContinuousScenerySideBoxGeometry(side * railX, stageStartZ, bridgeEndZ, 0.94, 0.42, 0.38, 6),
      materials.gwangalliRail,
    );
    barrier.castShadow = false;
    barrier.receiveShadow = true;
    scene.add(barrier);

    const cap = new THREE.Mesh(
      makeContinuousScenerySideBoxGeometry(side * railX, stageStartZ, bridgeEndZ, 1.18, 0.48, 0.1, 6),
      materials.gwangalliRailStripe,
    );
    cap.castShadow = false;
    cap.receiveShadow = true;
    scene.add(cap);
  }
}

function addGwangalliLaneMarkings() {
  for (let z = stageStartZ - 62; z > currentStage.goalZ; z -= 48) {
    const sample = getStageDefinitionGroundSample(0, z);
    if (!sample) continue;

    const mark = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.04, 8.5),
      materials.roadMarkingWhite,
    );
    setStageObjectTransform(mark, new THREE.Vector3(0, sample.y + 0.69, z), 0, 0.02, true);
    mark.receiveShadow = false;
    scene.add(mark);
  }
}

function addGwangalliBridgeStreetLights() {
  const bridgeEndZ = getGwangalliBridgeEndZ();
  const placements = [];

  for (let z = stageStartZ - 90; z > bridgeEndZ - 20; z -= 100) {
    const sample = getStageDefinitionGroundSample(0, z);
    if (!sample) continue;

    for (const side of [-1, 1]) {
      placements.push({
        x: side * (sample.segment.width * 0.5 + 1.15),
        side,
        y: sample.y,
        z,
      });
    }
  }

  addGwangalliBridgeStreetLightInstances(
    new THREE.CylinderGeometry(0.08, 0.12, 6.8, 8),
    materials.gwangalliBridgeCable,
    placements,
    ({ x, y, z }) => new THREE.Vector3(x, y + 3.4, z),
    true,
  );
  addGwangalliBridgeStreetLightInstances(
    new THREE.BoxGeometry(2.0, 0.08, 0.08),
    materials.gwangalliBridgeCable,
    placements,
    ({ x, side, y, z }) => new THREE.Vector3(x - side * 0.92, y + 6.72, z),
    true,
  );
  addGwangalliBridgeStreetLightInstances(
    new THREE.BoxGeometry(0.82, 0.22, 0.48),
    materials.beachLamp,
    placements,
    ({ x, side, y, z }) => new THREE.Vector3(x - side * 1.86, y + 6.62, z),
    true,
  );
}

function addGwangalliBridgeStreetLightInstances(geometry, material, placements, getLocalPosition, castShadow) {
  if (placements.length === 0) return;

  const mesh = new THREE.InstancedMesh(geometry, material, placements.length);
  const instanceObject = new THREE.Object3D();

  placements.forEach((placement, index) => {
    setStageSceneryTransform(instanceObject, getLocalPosition(placement), 0, 0, true);
    instanceObject.updateMatrix();
    mesh.setMatrixAt(index, instanceObject.matrix);
  });

  mesh.instanceMatrix.needsUpdate = true;
  mesh.castShadow = castShadow;
  mesh.receiveShadow = false;
  scene.add(mesh);
}

function addGwangalliBridgePiers() {
  const bridgeEndZ = getGwangalliBridgeEndZ();
  for (let z = stageStartZ - 150; z > bridgeEndZ + 70; z -= 220) {
    addGwangalliBridgePier(z);
  }
}

function addGwangalliCoastalViaductPiers() {
  const startZ = getGwangalliBridgeEndZ() - 160;
  const endZ = getGwangalliTunnelStartZ() + 180;
  for (let z = startZ; z > endZ; z -= 280) {
    addGwangalliCoastalPier(z);
  }
}

function addGwangalliCoastalPier(z) {
  const sample = getStageDefinitionGroundSample(0, z);
  if (!sample) return;

  const waterY = -8.0;
  const deckBottomY = sample.y - 1.2;
  const pierHeight = Math.max(8.5, deckBottomY - waterY);
  const roadHalfWidth = sample.segment.width * 0.5;
  const pierX = roadHalfWidth + 0.9;

  const group = new THREE.Group();
  setStageSceneryTransform(group, new THREE.Vector3(0, waterY, z), 0, 0);

  const cap = new THREE.Mesh(new THREE.BoxGeometry(sample.segment.width + 3.6, 0.58, 3.2), materials.gwangalliBridge);
  cap.position.y = pierHeight;
  cap.castShadow = true;
  cap.receiveShadow = true;
  group.add(cap);

  for (const x of [-pierX, pierX]) {
    const column = new THREE.Mesh(new THREE.BoxGeometry(1.05, pierHeight, 1.8), materials.gwangalliBridge);
    column.position.set(x, pierHeight * 0.5, 0);
    column.castShadow = true;
    column.receiveShadow = true;
    group.add(column);

    const footing = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.46, 3.0), materials.gwangalliBridgeCable);
    footing.position.set(x, 0.24, 0);
    footing.receiveShadow = true;
    group.add(footing);
  }

  scene.add(group);
}

function addGwangalliBridgePier(z) {
  const sample = getStageDefinitionGroundSample(0, z);
  if (!sample) return;

  const waterY = -8.0;
  const deckBottomY = sample.y - 3.0;
  const pierHeight = Math.max(4.5, deckBottomY - waterY);
  const roadHalfWidth = sample.segment.width * 0.5;
  const pierX = roadHalfWidth + 1.7;
  const capWidth = sample.segment.width + 5.2;

  const group = new THREE.Group();
  setStageSceneryTransform(group, new THREE.Vector3(0, waterY, z), 0, 0);

  const cap = new THREE.Mesh(new THREE.BoxGeometry(capWidth, 0.74, 3.6), materials.gwangalliBridge);
  cap.position.y = pierHeight;
  cap.castShadow = true;
  cap.receiveShadow = true;
  group.add(cap);

  const base = new THREE.Mesh(new THREE.BoxGeometry(capWidth * 0.72, 0.55, 4.2), materials.gwangalliBridgeCable);
  base.position.y = 0.25;
  base.castShadow = false;
  base.receiveShadow = true;
  group.add(base);

  for (const x of [-pierX, pierX]) {
    const column = new THREE.Mesh(new THREE.BoxGeometry(1.45, pierHeight, 2.25), materials.gwangalliBridge);
    column.position.set(x, pierHeight * 0.5, 0);
    column.castShadow = true;
    column.receiveShadow = true;
    group.add(column);

    const footing = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.55, 3.6), materials.gwangalliBridgeCable);
    footing.position.set(x, 0.34, 0);
    footing.castShadow = false;
    footing.receiveShadow = true;
    group.add(footing);
  }

  scene.add(group);
}

function addGwangalliSuspensionStructure() {
  const towerZs = [
    getStageZAtGoalProgress(0.27),
    getStageZAtGoalProgress(0.33),
  ];
  const anchorZs = [
    getStageZAtGoalProgress(0.24),
    getStageZAtGoalProgress(0.36),
  ];
  const towerX = 13.2;
  const cableX = 12.0;

  for (const z of towerZs) {
    addGwangalliBridgeTower(-towerX, z);
    addGwangalliBridgeTower(towerX, z);
    addGwangalliTowerPortal(z, towerX);
  }

  for (let i = 0; i < towerZs.length - 1; i += 1) {
    for (const sideX of [-cableX, cableX]) {
      addGwangalliApproachCable(sideX, towerZs[i], anchorZs[i]);
      addGwangalliApproachHangers(sideX, towerZs[i], anchorZs[i]);
      addGwangalliMainCable(sideX, towerZs[i], towerZs[i + 1]);
      addGwangalliHangers(sideX, towerZs[i], towerZs[i + 1]);
      addGwangalliApproachCable(sideX, towerZs[i + 1], anchorZs[i + 1]);
      addGwangalliApproachHangers(sideX, towerZs[i + 1], anchorZs[i + 1]);
    }
  }

  for (const z of anchorZs) {
    for (const sideX of [-cableX, cableX]) {
      addGwangalliCableAnchor(sideX, z);
    }
  }
}

function addGwangalliBridgeTower(x, z) {
  const sample = getStageDefinitionGroundSample(0, z);
  if (!sample) return;

  const towerGroup = new THREE.Group();
  setStageSceneryTransform(towerGroup, new THREE.Vector3(x, sample.y - 3.0, z), 0, 0);

  const pylon = new THREE.Mesh(new THREE.BoxGeometry(2.35, 52, 2.05), materials.gwangalliBridge);
  pylon.position.y = 26;
  pylon.castShadow = true;
  towerGroup.add(pylon);

  const cap = new THREE.Mesh(new THREE.BoxGeometry(5.4, 1.2, 2.65), materials.gwangalliBridge);
  cap.position.y = 51.6;
  cap.castShadow = true;
  towerGroup.add(cap);

  const base = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.7, 3.65), materials.gwangalliBridge);
  base.position.y = 0.6;
  base.castShadow = true;
  base.receiveShadow = true;
  towerGroup.add(base);

  for (const y of [12, 24, 36, 47]) {
    const band = new THREE.Mesh(new THREE.BoxGeometry(5.3, 0.28, 2.45), materials.gwangalliBridgeCable);
    band.position.y = y;
    towerGroup.add(band);
  }

  for (const localX of [-0.56, 0.56]) {
    const topPost = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.6, 0.28), materials.gwangalliBridge);
    topPost.position.set(localX, 53.2, 0);
    topPost.castShadow = true;
    towerGroup.add(topPost);
  }

  scene.add(towerGroup);
}

function addGwangalliTowerPortal(z, towerX) {
  const sample = getStageDefinitionGroundSample(0, z);
  if (!sample) return;

  const deckY = sample.y;
  const portalGroup = new THREE.Group();
  setStageSceneryTransform(portalGroup, new THREE.Vector3(0, deckY - 3.0, z), 0, 0);

  const web = createGwangalliTowerWeb(towerX);
  web.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  portalGroup.add(web);

  scene.add(portalGroup);
  addGwangalliTowerArchTrim(z, towerX);
}

function createGwangalliTowerWeb(towerX) {
  const half = towerX - 1.55;
  const archHalf = Math.min(6.05, towerX - 4.15);
  const group = new THREE.Group();

  const upper = new THREE.Shape();
  upper.moveTo(-half, 16.0);
  upper.lineTo(-half, 44.6);
  upper.bezierCurveTo(-half * 0.74, 43.9, -half * 0.36, 37.4, 0, 36.8);
  upper.bezierCurveTo(half * 0.36, 37.4, half * 0.74, 43.9, half, 44.6);
  upper.lineTo(half, 16.0);
  upper.lineTo(archHalf, 16.0);
  upper.bezierCurveTo(archHalf * 0.9, 27.5, archHalf * 0.42, 34.4, 0, 35.5);
  upper.bezierCurveTo(-archHalf * 0.42, 34.4, -archHalf * 0.9, 27.5, -archHalf, 16.0);
  upper.lineTo(-half, 16.0);
  group.add(new THREE.Mesh(createGwangalliTowerWebPanelGeometry(upper), materials.gwangalliBridge));

  const leftFoot = createGwangalliTowerFootShape(-1, half, archHalf);
  const rightFoot = createGwangalliTowerFootShape(1, half, archHalf);
  group.add(new THREE.Mesh(createGwangalliTowerWebPanelGeometry(leftFoot), materials.gwangalliBridge));
  group.add(new THREE.Mesh(createGwangalliTowerWebPanelGeometry(rightFoot), materials.gwangalliBridge));

  return group;
}

function createGwangalliTowerFootShape(side, half, archHalf) {
  const outer = side * half;
  const inner = side * archHalf;
  const tipOuter = side * (half - 0.18);
  const tipInner = side * (half - 1.38);
  const shape = new THREE.Shape();

  shape.moveTo(tipOuter, 5.85);
  shape.lineTo(outer, 16.0);
  shape.lineTo(inner, 16.0);
  shape.bezierCurveTo(
    side * (archHalf + 0.05),
    12.1,
    side * (half - 1.15),
    7.15,
    tipInner,
    5.85,
  );
  shape.quadraticCurveTo(side * (half - 0.72), 5.45, tipOuter, 5.85);
  return shape;
}

function createGwangalliTowerWebPanelGeometry(shape) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 1.85,
    bevelEnabled: false,
    curveSegments: 18,
  });
  geometry.translate(0, 0, -0.925);
  geometry.computeVertexNormals();
  return geometry;
}

function addGwangalliTowerArchTrim(z, towerX) {
  const sample = getStageDefinitionGroundSample(0, z);
  if (!sample) return;

  const archHalf = Math.min(6.05, towerX - 4.15);
  const centerY = sample.y + 5.95;
  let previous = null;
  for (let i = 0; i <= 24; i += 1) {
    const t = i / 24;
    const angle = Math.PI * (1 - t);
    const x = Math.cos(angle) * archHalf;
    const y = centerY + 29.25 * Math.sin(angle);
    const point = toSceneryWorldPosition(new THREE.Vector3(x, y, z - 1.02), true);
    if (previous) {
      const segment = makeCylinderBetween(previous, point, 0.18, materials.gwangalliBridgeCable);
      segment.castShadow = true;
      scene.add(segment);
    }
    previous = point;
  }
}

function addGwangalliMainCable(x, zStart, zEnd) {
  const samples = 28;
  let previous = null;
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const z = THREE.MathUtils.lerp(zStart, zEnd, t);
    const ground = getStageDefinitionGroundSample(0, z);
    if (!ground) continue;
    const y = getGwangalliCableY(ground.y, t);
    const point = toSceneryWorldPosition(new THREE.Vector3(x, y, z), true);
    if (previous) {
      const cable = makeCylinderBetween(previous, point, 0.5, materials.gwangalliBridgeCable);
      cable.castShadow = false;
      scene.add(cable);
    }
    previous = point;
  }
}

function addGwangalliApproachCable(x, zTower, zAnchor) {
  const samples = 12;
  let previous = null;
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const z = THREE.MathUtils.lerp(zTower, zAnchor, t);
    const ground = getStageDefinitionGroundSample(0, z);
    if (!ground) continue;
    const y = getGwangalliApproachCableY(ground.y, t);
    const point = toSceneryWorldPosition(new THREE.Vector3(x, y, z), true);
    if (previous) {
      const cable = makeCylinderBetween(previous, point, 0.46, materials.gwangalliBridgeCable);
      cable.castShadow = false;
      scene.add(cable);
    }
    previous = point;
  }
}

function addGwangalliHangers(x, zStart, zEnd) {
  for (let z = zStart - 34; z > zEnd + 34; z -= 34) {
    const ground = getStageDefinitionGroundSample(0, z);
    if (!ground) continue;
    const spanT = (zStart - z) / (zStart - zEnd);
    const cableY = getGwangalliCableY(ground.y, spanT);
    const deckY = ground.y + 1.25;
    const top = toSceneryWorldPosition(new THREE.Vector3(x, cableY, z), true);
    const bottom = toSceneryWorldPosition(new THREE.Vector3(x, deckY, z), true);
    const hanger = makeCylinderBetween(top, bottom, 0.075, materials.gwangalliBridgeCable);
    hanger.castShadow = false;
    scene.add(hanger);
  }
}

function addGwangalliApproachHangers(x, zTower, zAnchor) {
  const hangerCount = 7;
  for (let i = 1; i < hangerCount; i += 1) {
    const t = i / hangerCount;
    const z = THREE.MathUtils.lerp(zTower, zAnchor, t);
    const ground = getStageDefinitionGroundSample(0, z);
    if (!ground) continue;

    const cableY = getGwangalliApproachCableY(ground.y, t);
    const deckY = ground.y + 1.25;
    if (cableY - deckY < 1.4) continue;

    const top = toSceneryWorldPosition(new THREE.Vector3(x, cableY, z), true);
    const bottom = toSceneryWorldPosition(new THREE.Vector3(x, deckY, z), true);
    const hanger = makeCylinderBetween(top, bottom, 0.07, materials.gwangalliBridgeCable);
    hanger.castShadow = false;
    scene.add(hanger);
  }
}

function addGwangalliCableAnchor(x, z) {
  const sample = getStageDefinitionGroundSample(0, z);
  if (!sample) return;

  const anchor = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.0, 2.4), materials.gwangalliBridge);
  setStageSceneryTransform(anchor, new THREE.Vector3(x, sample.y + 0.95, z), 0, 0, true);
  anchor.castShadow = true;
  anchor.receiveShadow = true;
  scene.add(anchor);
}

function getGwangalliCableY(groundY, spanT) {
  const towerClearance = 48.0;
  const deckClearance = 1.75;
  const sag = Math.sin(THREE.MathUtils.clamp(spanT, 0, 1) * Math.PI);
  return groundY + THREE.MathUtils.lerp(towerClearance, deckClearance, sag);
}

function getGwangalliApproachCableY(groundY, spanT) {
  const towerClearance = 48.0;
  const anchorClearance = 1.55;
  const easedT = smoothstep(0, 1, spanT);
  return groundY + THREE.MathUtils.lerp(towerClearance, anchorClearance, easedT);
}

function addGwangalliTourBoats() {
  const boats = [
    { type: "ferry", x: -38, z: -76, yaw: 0.2, scale: 1.05, speed: -8.0, range: 300 },
    { type: "speedboat", x: 42, z: -116, yaw: -0.18, scale: 0.95, speed: 12.0, range: 260 },
    { type: "catamaran", x: -58, z: -168, yaw: 0.32, scale: 1.18, speed: -6.4, range: 340 },
    { type: "fishing", x: 60, z: -230, yaw: -0.24, scale: 1.08, speed: 5.8, range: 280 },
    { type: "speedboat", x: -48, z: -320, yaw: 0.18, scale: 1.0, speed: -13.2, range: 320 },
    { type: "ferry", x: 54, z: -430, yaw: -0.24, scale: 0.9, speed: 7.0, range: 300 },
    { type: "catamaran", x: -70, z: -560, yaw: 0.08, scale: 1.2, speed: -5.6, range: 360 },
    { type: "fishing", x: 68, z: -710, yaw: 0.42, scale: 0.95, speed: 6.2, range: 300 },
    { type: "speedboat", x: -54, z: -880, yaw: -0.35, scale: 1.05, speed: -11.0, range: 320 },
    { type: "ferry", x: 82, z: -1060, yaw: 0.15, scale: 1.15, speed: 7.4, range: 360 },
    { type: "fishing", x: -76, z: -1260, yaw: 0.28, scale: 0.85, speed: -5.2, range: 280 },
    { type: "catamaran", x: 58, z: -1480, yaw: -0.18, scale: 1.0, speed: 6.0, range: 340 },
    { type: "ferry", x: -88, z: -1720, yaw: 0.36, scale: 1.08, speed: -6.8, range: 360 },
    { type: "speedboat", x: 74, z: -1980, yaw: -0.28, scale: 0.92, speed: 12.6, range: 320 },
    { type: "fishing", x: -60, z: -2220, yaw: 0.12, scale: 1.0, speed: -4.8, range: 280 },
    { type: "catamaran", x: 88, z: -2440, yaw: 0.24, scale: 1.16, speed: 5.5, range: 350 },
    { type: "speedboat", x: -82, z: -2680, yaw: -0.2, scale: 0.9, speed: -11.8, range: 330 },
    { type: "ferry", x: 62, z: -2920, yaw: 0.34, scale: 1.04, speed: 7.2, range: 340 },
    { type: "catamaran", x: -70, z: -3180, yaw: -0.12, scale: 1.1, speed: -5.4, range: 300 },
    { type: "fishing", x: 78, z: -3420, yaw: 0.2, scale: 0.96, speed: 4.9, range: 260 },
    { type: "ferry", x: -86, z: -3720, yaw: 0.28, scale: 1.12, speed: -6.2, range: 320 },
    { type: "catamaran", x: 82, z: -3960, yaw: -0.18, scale: 1.05, speed: 5.8, range: 310 },
    { type: "speedboat", x: -64, z: -4240, yaw: 0.18, scale: 0.92, speed: -12.4, range: 280 },
  ];

  boats.forEach((boat, index) => addTourBoat({ ...boat, seed: index }));
}

function addTourBoat({ type, x, z, yaw, scale, seed, speed, range }) {
  const group = new THREE.Group();
  setStageSceneryTransform(group, new THREE.Vector3(x, -7.85, z), yaw, 0);
  group.scale.setScalar(scale);

  const wake = new THREE.Mesh(new THREE.PlaneGeometry(getTourBoatWakeWidth(type, seed), getTourBoatWakeLength(type)), materials.boatWake);
  wake.rotation.x = -Math.PI * 0.5;
  wake.position.set(0, -0.08, getTourBoatWakeOffset(type));
  group.add(wake);

  addTourBoatModel(group, type, seed);
  scene.add(group);
  gwangalliTourBoats.push({
    group,
    wake,
    type,
    x,
    z,
    baseX: x,
    yaw,
    scale,
    speed,
    minZ: Math.max(currentStage.goalZ + 90, z - range * 0.55),
    maxZ: Math.min(-36, z + range * 0.45),
    drift: 1.4 + (seed % 4) * 0.45,
    phase: seed * 1.37,
  });
}

function addTourBoatModel(group, type, seed) {
  if (type === "speedboat") {
    addSpeedBoatModel(group, seed);
  } else if (type === "catamaran") {
    addCatamaranModel(group, seed);
  } else if (type === "fishing") {
    addFishingBoatModel(group, seed);
  } else {
    addFerryBoatModel(group, seed);
  }
}

function addFerryBoatModel(group, seed) {
  const hull = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.8, 11.5), materials.tourBoatHull);
  hull.position.y = 0.48;
  hull.castShadow = true;
  hull.receiveShadow = true;
  group.add(hull);

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(4.95, 0.2, 10.4), seed % 2 === 0 ? materials.tourBoatStripe : materials.tourBoatRed);
  stripe.position.y = 0.84;
  group.add(stripe);

  const lowerCabin = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.1, 5.8), materials.tourBoatGlass);
  lowerCabin.position.set(0, 1.55, -0.6);
  lowerCabin.castShadow = true;
  group.add(lowerCabin);

  const upperCabin = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.8, 3.6), materials.tourBoatHull);
  upperCabin.position.set(0, 2.45, -1.1);
  upperCabin.castShadow = true;
  group.add(upperCabin);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.22, 6.3), materials.tourBoatHull);
  roof.position.set(0, 3.0, -0.8);
  roof.castShadow = true;
  group.add(roof);
}

function addCatamaranModel(group, seed) {
  for (const side of [-1, 1]) {
    const pontoon = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.58, 10.2), materials.tourBoatHull);
    pontoon.position.set(side * 1.65, 0.36, 0);
    pontoon.castShadow = true;
    pontoon.receiveShadow = true;
    group.add(pontoon);
  }

  const deck = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.24, 8.0), seed % 2 === 0 ? materials.tourBoatYellow : materials.tourBoatHull);
  deck.position.y = 0.88;
  deck.castShadow = true;
  group.add(deck);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.05, 3.7), materials.tourBoatGlass);
  cabin.position.set(0, 1.55, -0.9);
  cabin.castShadow = true;
  group.add(cabin);

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.8, 8), materials.tourBoatHull);
  mast.position.set(0, 2.4, 1.7);
  mast.castShadow = true;
  group.add(mast);
}

function addSpeedBoatModel(group, seed) {
  const hull = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.52, 8.6), seed % 2 === 0 ? materials.tourBoatRed : materials.tourBoatNavy);
  hull.position.y = 0.4;
  hull.castShadow = true;
  hull.receiveShadow = true;
  group.add(hull);

  const bow = new THREE.Mesh(new THREE.ConeGeometry(1.52, 2.2, 4), seed % 2 === 0 ? materials.tourBoatRed : materials.tourBoatNavy);
  bow.position.set(0, 0.42, -5.0);
  bow.rotation.x = Math.PI * 0.5;
  bow.rotation.z = Math.PI * 0.25;
  bow.scale.z = 0.5;
  bow.castShadow = true;
  group.add(bow);

  const cockpit = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.72, 2.4), materials.tourBoatGlass);
  cockpit.position.set(0, 1.0, -0.5);
  cockpit.castShadow = true;
  group.add(cockpit);
}

function addFishingBoatModel(group, seed) {
  const hull = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.7, 8.8), seed % 2 === 0 ? materials.tourBoatHull : materials.tourBoatYellow);
  hull.position.y = 0.42;
  hull.castShadow = true;
  hull.receiveShadow = true;
  group.add(hull);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.25, 2.4), materials.tourBoatGlass);
  cabin.position.set(0, 1.35, 1.2);
  cabin.castShadow = true;
  group.add(cabin);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.2, 2.8), materials.tourBoatHull);
  roof.position.set(0, 2.1, 1.2);
  roof.castShadow = true;
  group.add(roof);

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.3, 8), materials.tourBoatNavy);
  mast.position.set(0, 2.2, -1.7);
  mast.castShadow = true;
  group.add(mast);
}

function getTourBoatWakeWidth(type, seed) {
  if (type === "speedboat") return 4.8 + (seed % 2) * 0.7;
  if (type === "catamaran") return 6.4;
  if (type === "fishing") return 4.2;
  return 5.4 + (seed % 3) * 0.6;
}

function getTourBoatWakeLength(type) {
  if (type === "speedboat") return 16.5;
  if (type === "catamaran") return 13.0;
  if (type === "fishing") return 9.5;
  return 12.0;
}

function getTourBoatWakeOffset(type) {
  if (type === "speedboat") return 7.2;
  if (type === "catamaran") return 6.5;
  if (type === "fishing") return 5.2;
  return 6.8;
}

function updateGwangalliTourBoats(dt) {
  if (gwangalliTourBoats.length === 0) return;

  gwangalliBoatTime += dt;
  for (const boat of gwangalliTourBoats) {
    boat.z += boat.speed * dt;
    if (boat.speed < 0 && boat.z < boat.minZ) {
      boat.z = boat.maxZ;
    } else if (boat.speed > 0 && boat.z > boat.maxZ) {
      boat.z = boat.minZ;
    }

    const bob = Math.sin(gwangalliBoatTime * 1.7 + boat.phase) * 0.12;
    const driftX = Math.sin(gwangalliBoatTime * 0.45 + boat.phase) * boat.drift;
    const directionYaw = boat.speed > 0 ? Math.PI : 0;
    setStageSceneryTransform(
      boat.group,
      new THREE.Vector3(boat.baseX + driftX, -7.85 + bob, boat.z),
      boat.yaw + directionYaw,
      0,
    );
    boat.group.scale.setScalar(boat.scale);
    boat.group.rotateZ(Math.sin(gwangalliBoatTime * 1.25 + boat.phase) * 0.025);

    const wakePulse = 1 + Math.sin(gwangalliBoatTime * 2.4 + boat.phase) * 0.08;
    boat.wake.scale.set(1, wakePulse, 1);
  }
}

function addGwangalliCoastalLandmarks() {
  if (!currentStage.gwangalliTheme) return;

  const clusters = [
    { x: 138, z: -3700, count: 5, seed: 1 },
    { x: 176, z: -3920, count: 7, seed: 6 },
    { x: 152, z: -4300, count: 6, seed: 12 },
    { x: 184, z: -4880, count: 7, seed: 18 },
    { x: 158, z: -5500, count: 6, seed: 26 },
    { x: 180, z: -6200, count: 6, seed: 33 },
    { x: 146, z: -7040, count: 5, seed: 41 },
  ];
  clusters
    .filter((cluster) => !isGwangalliBuildingRemovalZone(cluster.z))
    .forEach(addGwangalliApartmentCluster);

  addGwangalliCoastalRoadDetails();
}

function getGoalProgressForZ(z) {
  const goalDistance = stageStartZ - goalZ;
  if (goalDistance <= 0) return 0;
  return THREE.MathUtils.clamp((stageStartZ - z) / goalDistance, 0, 1);
}

function isGwangalliBuildingRemovalZone(z) {
  const progress = getGoalProgressForZ(z);
  return progress >= 0.35 && progress <= 0.56;
}

function addGwangalliIsland({ x, z, radius, height }) {
  const group = new THREE.Group();
  setStageSceneryTransform(group, new THREE.Vector3(x, -8.2, z), 0, 0);

  const rock = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.78, radius, height, 24),
    materials.coastalRock,
  );
  rock.position.y = height * 0.5;
  rock.receiveShadow = true;
  group.add(rock);

  const forest = new THREE.Mesh(
    new THREE.ConeGeometry(radius * 0.82, height * 1.6, 28),
    materials.coastalForest,
  );
  forest.position.y = height + height * 0.58;
  forest.scale.z = 0.72;
  forest.receiveShadow = true;
  group.add(forest);

  for (let i = 0; i < 7; i += 1) {
    const tree = new THREE.Mesh(
      new THREE.ConeGeometry(radius * 0.08, height * 0.55, 8),
      materials.coastalForest,
    );
    const angle = i * 0.9;
    tree.position.set(Math.cos(angle) * radius * 0.42, height * 1.16, Math.sin(angle) * radius * 0.22);
    tree.castShadow = false;
    group.add(tree);
  }

  scene.add(group);
}

function addGwangalliApartmentCluster({ x, z, count, seed }) {
  const ground = getStageDefinitionGroundSample(0, z);
  if (!ground) return;

  const group = new THREE.Group();
  setStageSceneryTransform(group, new THREE.Vector3(x, ground.y - 2.4, z), 0, 0);

  const foundation = new THREE.Mesh(
    new THREE.BoxGeometry(count * 10.5 + 12, 0.58, 28),
    materials.coastalRock,
  );
  foundation.position.set(-5, 0.29, 5.2);
  foundation.castShadow = false;
  foundation.receiveShadow = true;
  group.add(foundation);

  for (let i = 0; i < count; i += 1) {
    const height = 24 + ((seed + i * 3) % 7) * 4.8;
    const width = 8 + ((seed + i) % 3) * 1.6;
    const depth = 10 + ((seed + i * 2) % 4) * 2.2;
    const building = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials.gwangalliBuilding);
    building.position.set((i - count * 0.5) * 10.5, height * 0.5, ((i + seed) % 3) * 6.4);
    building.castShadow = true;
    building.receiveShadow = true;
    group.add(building);

    const rows = Math.min(6, Math.floor(height / 6));
    for (let row = 0; row < rows; row += 1) {
      const windowStrip = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.72, 0.34, 0.08),
        row % 2 === 0 ? materials.gwangalliWindow : materials.gwangalliBuildingLight,
      );
      windowStrip.position.set(building.position.x, 5 + row * 5.2, building.position.z - depth * 0.5 - 0.06);
      group.add(windowStrip);
    }
  }

  scene.add(group);
}

function addYonghoBayLandmarkScenery() {
  if (!currentStage.gwangalliTheme) return;

  const sceneryZ = getStageZAtGoalProgress(0.5);
  const group = new THREE.Group();
  setStageSceneryTransform(group, new THREE.Vector3(-178, seaLevelY + 0.62, sceneryZ), Math.PI * 0.5 - 0.08, 0, true);
  group.scale.setScalar(0.9);

  addYonghoBayIslandAndCruiseTerminal(group);

  const rotatedDistrict = new THREE.Group();
  rotatedDistrict.rotation.y = Math.PI * 0.5;
  group.add(rotatedDistrict);

  addYonghoBayReclaimedPier(rotatedDistrict);
  addYonghoBayPark(rotatedDistrict);
  addYonghoBaySmallApartments(rotatedDistrict);
  addYonghoBayWTowers(rotatedDistrict);

  scene.add(group);
}

function addYonghoBayWTowers(group) {
  const towers = [
    { x: 10, z: 18, width: 25, depth: 27, height: 138, logo: "W", offset: -1 },
    { x: 72, z: 8, width: 23, depth: 25, height: 126, logo: "S", offset: 1 },
    { x: 122, z: 20, width: 20, depth: 23, height: 108, logo: "", offset: 0 },
  ];

  towers.forEach((tower, index) => {
    addYonghoBayWTower(group, { ...tower, index });
  });

  const podium = new THREE.Mesh(new THREE.BoxGeometry(162, 8, 24), materials.haeundaeExordiumCore);
  podium.position.set(60, 4.9, 13);
  podium.castShadow = true;
  podium.receiveShadow = true;
  group.add(podium);

  const podiumGlass = new THREE.Mesh(new THREE.BoxGeometry(154, 2.8, 0.18), materials.rightCityGlass);
  podiumGlass.position.set(60, 7.3, 0.72);
  group.add(podiumGlass);
}

function addYonghoBayWTower(group, { x, z, width, depth, height, logo, offset, index }) {
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials.gwangalliIparkDarkGlass);
  body.position.set(x, height * 0.5 + 8.2, z);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(width * 0.78, height * 0.86, 0.18), materials.gwangalliIparkGlass);
  frontGlass.position.set(x, height * 0.51 + 8.4, z - depth * 0.5 - 0.11);
  group.add(frontGlass);

  const sideCore = new THREE.Mesh(new THREE.BoxGeometry(width * 0.35, height * 0.78, depth * 0.82), materials.haeundaeExordiumCore);
  sideCore.position.set(x + offset * width * 0.42, height * 0.46 + 8.2, z + depth * 0.08);
  sideCore.castShadow = true;
  sideCore.receiveShadow = true;
  group.add(sideCore);

  const crown = new THREE.Mesh(new THREE.BoxGeometry(width + 3.8, 7.2, depth + 2.6), materials.gwangalliIparkFacade);
  crown.position.set(x, height + 12.1, z);
  crown.castShadow = true;
  group.add(crown);

  const topInset = new THREE.Mesh(new THREE.BoxGeometry(width * 0.72, 3.2, depth * 0.76), materials.rightCityFacade);
  topInset.position.set(x, height + 17.0, z);
  topInset.castShadow = true;
  group.add(topInset);

  if (logo) {
    const logoPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(5.4, 2.4),
      createCanvasLabelMaterial(logo, 160, 80, index === 0 ? "#29415a" : "#1e6aae", "rgba(245, 248, 250, 0)"),
    );
    logoPanel.position.set(x + width * 0.18, height + 18.8, z - depth * 0.5 - 0.14);
    group.add(logoPanel);
  }

  for (let floor = 1; floor < 18; floor += 1) {
    const y = 12 + floor * (height - 12) / 18;
    const band = new THREE.Mesh(new THREE.BoxGeometry(width * 0.76, 0.32, 0.12), materials.gwangalliWindow);
    band.position.set(x, y, z - depth * 0.5 - 0.18);
    group.add(band);
  }

  for (const side of [-1, 1]) {
    const whiteRail = new THREE.Mesh(new THREE.BoxGeometry(0.72, height * 0.88, 0.16), materials.gwangalliIparkFacade);
    whiteRail.position.set(x + side * width * 0.44, height * 0.51 + 8.2, z - depth * 0.5 - 0.22);
    group.add(whiteRail);
  }

  for (const plaqueY of [height * 0.34 + 8.2, height * 0.58 + 8.2]) {
    const redPlaque = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.2, 0.18), materials.tourBoatRed);
    redPlaque.position.set(x + width * 0.42, plaqueY, z - depth * 0.5 - 0.28);
    group.add(redPlaque);
  }
}

function addYonghoBaySmallApartments(group) {
  const base = new THREE.Mesh(new THREE.BoxGeometry(260, 1.0, 58), materials.coastalRock);
  base.position.set(50, 0.56, 72);
  base.receiveShadow = true;
  group.add(base);

  for (let i = 0; i < 16; i += 1) {
    const row = Math.floor(i / 8);
    const column = i % 8;
    const height = 32 + ((i * 7) % 5) * 4.5 + row * 6;
    const width = 10 + (i % 3) * 1.2;
    const depth = 13 + (i % 2) * 2;
    const x = -82 + column * 24 + (row % 2) * 7;
    const z = 54 + row * 32 + ((i % 3) - 1) * 2;
    const apartment = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials.gwangalliIparkFacade);
    apartment.position.set(x, height * 0.5 + 1.2, z);
    apartment.castShadow = true;
    apartment.receiveShadow = true;
    group.add(apartment);

    const glass = new THREE.Mesh(new THREE.BoxGeometry(width * 0.72, height * 0.76, 0.12), materials.haeundaeExordiumGlass);
    glass.position.set(x, height * 0.5 + 1.4, z - depth * 0.5 - 0.08);
    group.add(glass);

    for (let floor = 1; floor < 6; floor += 1) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(width * 0.84, 0.2, 0.12), materials.haeundaeExordiumBalcony);
      band.position.set(x, 4 + floor * (height - 5) / 6, z - depth * 0.5 - 0.16);
      group.add(band);
    }
  }
}

function addYonghoBayPark(group) {
  const parkBase = new THREE.Mesh(new THREE.BoxGeometry(238, 0.78, 38), materials.coastalRock);
  parkBase.position.set(34, 0.42, -18);
  parkBase.receiveShadow = true;
  group.add(parkBase);

  const grass = new THREE.Mesh(new THREE.BoxGeometry(222, 0.16, 27), materials.coastalForest);
  grass.position.set(34, 0.92, -18);
  grass.receiveShadow = true;
  group.add(grass);

  const path = new THREE.Mesh(new THREE.BoxGeometry(210, 0.18, 4.2), materials.gwangalliBoardwalk);
  path.position.set(34, 1.04, -17.5);
  path.receiveShadow = true;
  group.add(path);

  const flowerBed = new THREE.Mesh(new THREE.BoxGeometry(88, 0.2, 5.2), materials.tourBoatRed);
  flowerBed.position.set(64, 1.08, -29.5);
  group.add(flowerBed);

  for (let i = 0; i < 28; i += 1) {
    const tree = new THREE.Group();
    tree.position.set(-72 + (i % 14) * 16, 0.98, -28 + Math.floor(i / 14) * 18 + ((i % 3) - 1) * 1.5);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.42, 3.2, 8), materials.coastalRock);
    trunk.position.y = 1.65;
    trunk.castShadow = true;
    tree.add(trunk);

    const crown = new THREE.Mesh(new THREE.ConeGeometry(3.2 + (i % 3) * 0.35, 7.2, 10), materials.coastalForest);
    crown.position.y = 5.4;
    crown.castShadow = true;
    tree.add(crown);
    group.add(tree);
  }

  for (let i = 0; i < 7; i += 1) {
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 8.4, 8), materials.marinaPost);
    lamp.position.set(-92 + i * 34, 4.2, -41.5);
    lamp.castShadow = true;
    group.add(lamp);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.18, 0.42), materials.beachLamp);
    head.position.set(lamp.position.x + 0.78, 8.1, -41.5);
    group.add(head);
  }
}

function addYonghoBayReclaimedPier(group) {
  const quay = new THREE.Mesh(new THREE.BoxGeometry(270, 1.05, 11.5), materials.marinaDock);
  quay.position.set(20, 0.62, -54);
  quay.castShadow = true;
  quay.receiveShadow = true;
  group.add(quay);

  const seawall = new THREE.Mesh(new THREE.BoxGeometry(280, 2.2, 3.6), materials.coastalRock);
  seawall.position.set(20, 0.92, -61.8);
  seawall.receiveShadow = true;
  group.add(seawall);

  const railing = new THREE.Mesh(new THREE.BoxGeometry(264, 0.32, 0.28), materials.gwangalliRail);
  railing.position.set(20, 2.35, -67.0);
  group.add(railing);

  for (let i = 0; i < 16; i += 1) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 2.4, 8), materials.marinaPost);
    post.position.set(-110 + i * 16, 1.45, -67);
    post.castShadow = true;
    group.add(post);
  }

  for (let i = 0; i < 5; i += 1) {
    const finger = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.28, 28), materials.marinaDock);
    finger.position.set(-86 + i * 40, 0.54, -82);
    finger.castShadow = true;
    finger.receiveShadow = true;
    group.add(finger);
  }

  addYonghoBayCruiseBoat(group, -124, -86, 1.15, "BUSAN CRUISE");
  addYonghoBayCruiseBoat(group, -52, -94, 0.72, "");
}

function addYonghoBayIslandAndCruiseTerminal(group) {
  const island = new THREE.Group();
  island.position.set(-300, -0.15, -72);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(76, 92, 15, 32), materials.coastalRock);
  base.position.y = 7.4;
  base.scale.z = 0.58;
  base.receiveShadow = true;
  island.add(base);

  const hillA = new THREE.Mesh(new THREE.ConeGeometry(64, 46, 32), materials.coastalForest);
  hillA.position.set(-18, 33, -6);
  hillA.scale.z = 0.74;
  hillA.castShadow = true;
  island.add(hillA);

  const hillB = new THREE.Mesh(new THREE.ConeGeometry(55, 34, 28), materials.coastalForest);
  hillB.position.set(38, 27, 8);
  hillB.scale.z = 0.82;
  hillB.castShadow = true;
  island.add(hillB);

  const shore = new THREE.Mesh(new THREE.BoxGeometry(150, 0.45, 6), materials.marinaDock);
  shore.position.set(0, 1.2, 47);
  island.add(shore);
  group.add(island);

  const breakwater = new THREE.Mesh(new THREE.BoxGeometry(148, 0.58, 4.2), materials.coastalRock);
  breakwater.position.set(-294, 0.34, -126);
  breakwater.rotation.y = -0.08;
  breakwater.receiveShadow = true;
  group.add(breakwater);

  const lighthouse = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.45, 10, 16), materials.gwangalliBridge);
  lighthouse.position.set(-366, 5.6, -128);
  lighthouse.castShadow = true;
  group.add(lighthouse);

  const terminal = new THREE.Group();
  terminal.position.set(-209, 0.65, -62);
  const hall = new THREE.Mesh(new THREE.BoxGeometry(44, 8.5, 18), materials.rightCityFacade);
  hall.position.y = 4.2;
  hall.castShadow = true;
  hall.receiveShadow = true;
  terminal.add(hall);

  const glass = new THREE.Mesh(new THREE.BoxGeometry(36, 4.2, 0.16), materials.rightCityGlass);
  glass.position.set(0, 4.6, -9.2);
  terminal.add(glass);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(52, 1.1, 22), materials.gwangalliIparkFacade);
  roof.position.y = 9.1;
  roof.castShadow = true;
  terminal.add(roof);

  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 3.2),
    createCanvasLabelMaterial("YONGHO BAY", 384, 96, "#17314a", "rgba(245, 248, 250, 0)"),
  );
  sign.position.set(0, 7.2, -9.36);
  terminal.add(sign);
  group.add(terminal);

  const terminalDock = new THREE.Mesh(new THREE.BoxGeometry(66, 0.3, 5.2), materials.marinaDock);
  terminalDock.position.set(-209, 0.5, -77);
  terminalDock.receiveShadow = true;
  group.add(terminalDock);
}

function addYonghoBayCruiseBoat(group, x, z, scale, label) {
  const boat = new THREE.Group();
  boat.position.set(x, 0.62, z);
  boat.scale.setScalar(scale);

  const hull = new THREE.Mesh(new THREE.BoxGeometry(36, 2.8, 9.0), materials.tourBoatHull);
  hull.position.y = 1.4;
  hull.castShadow = true;
  boat.add(hull);

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(36.4, 0.6, 9.2), materials.tourBoatNavy);
  stripe.position.y = 1.1;
  boat.add(stripe);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(26, 6.2, 7.2), materials.tourBoatGlass);
  cabin.position.set(0, 5.1, 0);
  cabin.castShadow = true;
  boat.add(cabin);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(29, 0.72, 8.5), materials.tourBoatHull);
  roof.position.y = 8.65;
  boat.add(roof);

  if (label) {
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 3.0),
      createCanvasLabelMaterial(label, 320, 80, "#f8fbff", "rgba(10, 32, 75, 0)"),
    );
    sign.position.set(0, 2.4, -4.62);
    boat.add(sign);
  }

  group.add(boat);
}

function addGwangalliMidwayResidentialCorridor() {
  if (!currentStage.gwangalliTheme) return;

  const startZ = getStageZAtGoalProgress(0.5);
  const endZ = getStageZAtGoalProgress(0.6);
  addGwangalliMidwayRoadsideTrees(startZ, endZ);

  let rowIndex = 0;
  for (let z = startZ; z > endZ; z -= 118) {
    const ground = getStageDefinitionGroundSample(0, z);
    if (!ground) {
      rowIndex += 1;
      continue;
    }

    const group = new THREE.Group();
    setStageSceneryTransform(group, new THREE.Vector3(0, ground.y - 0.8, z), 0, 0, true);
    addGwangalliMidwayApartmentRow(group, rowIndex);
    addGwangalliMidwayTreeVerge(group, rowIndex);
    scene.add(group);
    rowIndex += 1;
  }
}

function addGwangalliMidwayApartmentRow(group, rowIndex) {
  const base = new THREE.Mesh(new THREE.BoxGeometry(112, 0.9, 126), materials.coastalRock);
  base.position.set(-50, 0.48, 0);
  base.receiveShadow = true;
  group.add(base);

  const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(8, 0.18, 118), materials.gwangalliBoardwalk);
  sidewalk.position.set(-13, 1.0, 0);
  sidewalk.receiveShadow = true;
  group.add(sidewalk);

  const podium = new THREE.Mesh(new THREE.BoxGeometry(74, 4.6, 21), materials.rightCityFacade);
  podium.position.set(-55, 3.2, -36 + (rowIndex % 2) * 12);
  podium.castShadow = false;
  podium.receiveShadow = true;
  group.add(podium);

  for (let i = 0; i < 5; i += 1) {
    const seed = rowIndex * 13 + i * 7;
    const x = -27 - i * 13.5 + ((seed % 3) - 1) * 1.8;
    const z = -42 + i * 20 + ((seed % 5) - 2) * 2.2;
    const width = 9.5 + (seed % 3) * 1.2;
    const depth = 17 + (seed % 4) * 2.4;
    const height = 32 + (seed % 6) * 5.2 + (i % 2) * 10;
    addGwangalliMidwayApartmentTower(group, { x, z, width, depth, height, seed });
  }
}

function addGwangalliMidwayApartmentTower(group, { x, z, width, depth, height, seed }) {
  const material = seed % 2 === 0 ? materials.gwangalliBuilding : materials.rightCityFacade;
  const tower = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  tower.position.set(x, height * 0.5 + 1.1, z);
  tower.castShadow = height > 46;
  tower.receiveShadow = true;
  group.add(tower);

  const innerFace = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, height * 0.74, depth * 0.82),
    seed % 2 === 0 ? materials.gwangalliWindow : materials.rightCityGlass,
  );
  innerFace.position.set(x + width * 0.5 + 0.1, height * 0.5 + 1.2, z);
  group.add(innerFace);

  const floorCount = Math.min(7, Math.max(4, Math.floor(height / 9)));
  for (let floor = 1; floor <= floorCount; floor += 1) {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.34, depth * 0.78),
      floor % 2 === 0 ? materials.gwangalliBuildingLight : materials.gwangalliWindow,
    );
    strip.position.set(x + width * 0.5 + 0.18, 3 + floor * (height - 5) / (floorCount + 1), z);
    group.add(strip);
  }
}

function addGwangalliMidwayTreeVerge(group, rowIndex) {
  const grass = new THREE.Mesh(new THREE.BoxGeometry(58, 0.18, 128), materials.coastalForest);
  grass.position.set(39, 0.98, 0);
  grass.receiveShadow = true;
  group.add(grass);

  const walkway = new THREE.Mesh(new THREE.BoxGeometry(7, 0.2, 122), materials.gwangalliBoardwalk);
  walkway.position.set(15, 1.1, 0);
  walkway.receiveShadow = true;
  group.add(walkway);

  if (rowIndex % 2 === 0) {
    const lowWall = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.1, 120), materials.noiseWallConcrete);
    lowWall.position.set(18.8, 1.55, 0);
    lowWall.receiveShadow = true;
    group.add(lowWall);
  }
}

function addGwangalliMidwayRoadsideTrees(startZ, endZ) {
  const placements = [];
  for (let z = startZ - 18; z > endZ + 14; z -= 34) {
    const ground = getStageDefinitionGroundSample(0, z);
    if (!ground) continue;

    for (let column = 0; column < 3; column += 1) {
      const seed = Math.abs(Math.round(z)) + column * 19;
      placements.push({
        x: 25 + column * 9.6 + ((seed % 5) - 2) * 0.9,
        y: ground.y,
        z: z + ((seed % 7) - 3) * 1.1,
        scale: 0.82 + (seed % 5) * 0.07,
      });
    }
  }

  if (placements.length === 0) return;

  const trunkGeometry = new THREE.CylinderGeometry(0.32, 0.42, 1, 7);
  const crownGeometry = new THREE.ConeGeometry(3.6, 1, 9);
  const trunkMesh = new THREE.InstancedMesh(trunkGeometry, materials.coastalRock, placements.length);
  const crownMesh = new THREE.InstancedMesh(crownGeometry, materials.coastalForest, placements.length);
  const dummy = new THREE.Object3D();

  placements.forEach((placement, index) => {
    const base = toSceneryWorldPosition(new THREE.Vector3(placement.x, placement.y, placement.z), true);
    dummy.position.copy(base).addScaledVector(worldUp, 2.0 * placement.scale);
    dummy.scale.set(placement.scale, 4.0 * placement.scale, placement.scale);
    dummy.updateMatrix();
    trunkMesh.setMatrixAt(index, dummy.matrix);

    dummy.position.copy(base).addScaledVector(worldUp, 7.6 * placement.scale);
    dummy.scale.set(placement.scale, 8.6 * placement.scale, placement.scale);
    dummy.updateMatrix();
    crownMesh.setMatrixAt(index, dummy.matrix);
  });

  trunkMesh.castShadow = true;
  trunkMesh.receiveShadow = true;
  crownMesh.castShadow = true;
  crownMesh.receiveShadow = true;
  scene.add(trunkMesh);
  scene.add(crownMesh);
}

function addGwangalliDenseUrbanCorridor() {
  if (!currentStage.gwangalliTheme) return;

  const tunnelStartZ = getGwangalliTunnelStartZ();
  if (!Number.isFinite(tunnelStartZ)) return;

  const startZ = getStageZAtGoalProgress(0.62);
  const endZ = getStageZAtGoalProgress(0.8);
  const rowSpacing = 132;
  let rowIndex = 0;

  for (let z = startZ; z > endZ; z -= rowSpacing) {
    const ground = getStageDefinitionGroundSample(0, z);
    if (!ground) {
      rowIndex += 1;
      continue;
    }

    const group = new THREE.Group();
    setStageSceneryTransform(group, new THREE.Vector3(0, ground.y - 1.05, z), 0, 0, true);

    for (const side of [-1, 1]) {
      const closeToRoad = z > tunnelStartZ + 20;
      if (closeToRoad) {
        addGwangalliUrbanBlockBase(group, side, rowIndex);
      }

      for (let column = 0; column < 3; column += 1) {
        const seed = rowIndex * 17 + column * 5 + (side > 0 ? 3 : 11);
        const height = 34 + (seed % 9) * 7 + (column === 2 ? 24 : column * 9) + (closeToRoad ? 0 : 18);
        const width = 13 + (seed % 4) * 2.2;
        const depth = 18 + ((seed + column) % 5) * 2.6;
        const x = side * ((closeToRoad ? 25 : 54) + column * (closeToRoad ? 18 : 24) + ((seed % 3) - 1) * 2.4);
        const towerZ = -42 + column * 42 + ((seed % 5) - 2) * 3.2;

        addGwangalliUrbanTower(group, {
          x,
          z: towerZ,
          width,
          depth,
          height,
          side,
          seed,
        });
      }
    }

    scene.add(group);
    rowIndex += 1;
  }
}

function addGwangalliUrbanBlockBase(group, side, rowIndex) {
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(50, 1.1, 144),
    materials.coastalRock,
  );
  base.position.set(side * 36.5, 0.55, 0);
  base.receiveShadow = true;
  group.add(base);

  const sidewalk = new THREE.Mesh(
    new THREE.BoxGeometry(5.8, 0.2, 134),
    materials.gwangalliBoardwalk,
  );
  sidewalk.position.set(side * 13.2, 1.22, 0);
  sidewalk.receiveShadow = true;
  group.add(sidewalk);

  if (rowIndex % 3 === 1) {
    const serviceRoad = new THREE.Mesh(
      new THREE.BoxGeometry(10.5, 0.16, 126),
      materials.gwangalliRoad,
    );
    serviceRoad.position.set(side * 22.2, 1.25, 0);
    serviceRoad.receiveShadow = true;
    group.add(serviceRoad);
  }
}

function addGwangalliUrbanTower(group, {
  x,
  z,
  width,
  depth,
  height,
  side,
  seed,
}) {
  const material = seed % 3 === 0
    ? materials.rightCityDarkGlass
    : seed % 3 === 1
      ? materials.gwangalliBuilding
      : materials.rightCityGlass;

  const tower = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  tower.position.set(x, height * 0.5 + 1.2, z);
  tower.castShadow = height > 48;
  tower.receiveShadow = true;
  group.add(tower);

  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(width + 1.2, 1.25, depth + 1.0),
    materials.rightCityFacade,
  );
  cap.position.set(x, height + 1.85, z);
  cap.castShadow = false;
  cap.receiveShadow = true;
  group.add(cap);

  const innerFaceX = x - side * (width * 0.5 + 0.08);
  const glassPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, height * 0.68, depth * 0.72),
    material === materials.gwangalliBuilding ? materials.gwangalliWindow : materials.rightCityGlass,
  );
  glassPanel.position.set(innerFaceX, height * 0.5 + 1.4, z);
  group.add(glassPanel);

  const floorCount = Math.min(7, Math.max(3, Math.floor(height / 13)));
  for (let floor = 1; floor <= floorCount; floor += 1) {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.44, depth * 0.78),
      floor % 2 === 0 ? materials.gwangalliBuildingLight : materials.gwangalliWindow,
    );
    strip.position.set(innerFaceX - side * 0.04, 3.2 + floor * (height - 6) / (floorCount + 1), z);
    group.add(strip);
  }

  if (seed % 4 === 0) {
    const rooftop = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.58, 3.8, depth * 0.5),
      materials.rightCityFacade,
    );
    rooftop.position.set(x, height + 4.3, z);
    rooftop.castShadow = false;
    group.add(rooftop);
  }
}

function addGwangalliCoastalRoadDetails() {
  const tunnelStartZ = getGwangalliTunnelStartZ();

  const coastalLightStartZ = getGwangalliBridgeEndZ() - 80;
  for (let z = coastalLightStartZ; z > tunnelStartZ + 120; z -= 100) {
    addGwangalliStreetLightPair(z);
  }
}

function addGwangalliStreetLight(x, z) {
  const sample = getStageDefinitionGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  setStageSceneryTransform(group, new THREE.Vector3(x, sample.y, z), 0, 0);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 8.2, 8), materials.gwangalliBridgeCable);
  pole.position.y = 4.1;
  pole.castShadow = true;
  group.add(pole);

  const arm = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.08), materials.gwangalliBridgeCable);
  arm.position.set(-Math.sign(x) * 0.92, 7.7, 0);
  arm.castShadow = true;
  group.add(arm);

  const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.22, 0.48), materials.beachLamp);
  lamp.position.set(-Math.sign(x) * 2.0, 7.58, 0);
  lamp.castShadow = true;
  group.add(lamp);

  scene.add(group);
}

function addGwangalliStreetLightPair(z) {
  const sample = getStageDefinitionGroundSample(0, z);
  if (!sample) return;

  const sideX = sample.segment.width * 0.5 + 1.15;
  addGwangalliStreetLight(-sideX, z);
  addGwangalliStreetLight(sideX, z);
}

function addShinseondaeTunnelApproach() {
  const tunnelStartZ = getGwangalliTunnelStartZ();
  if (!Number.isFinite(tunnelStartZ)) return;

  addShinseondaeApproachSideRoads(tunnelStartZ);

  for (let z = tunnelStartZ + 360; z > tunnelStartZ + 30; z -= 78) {
    const sample = getStageDefinitionGroundSample(0, z);
    if (!sample) continue;

    const group = new THREE.Group();
    setStageSceneryTransform(group, new THREE.Vector3(0, sample.y, z), 0, 0);
    const approachT = THREE.MathUtils.clamp((tunnelStartZ + 360 - z) / 330, 0, 1);
    const wallHeight = THREE.MathUtils.lerp(1.7, 4.2, smoothstep(0, 1, approachT));
    const wallY = wallHeight * 0.5 - 0.1;
    const stripeY = wallHeight * 0.64;

    for (const side of [-1, 1]) {
      const retainingWall = new THREE.Mesh(new THREE.BoxGeometry(1.0, wallHeight, 82), materials.tunnelWall);
      retainingWall.position.set(side * 11.2, wallY, 0);
      retainingWall.castShadow = true;
      retainingWall.receiveShadow = true;
      group.add(retainingWall);

      const greenStripe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 82), materials.tunnelTileStripe);
      greenStripe.position.set(side * 10.64, stripeY, 0);
      group.add(greenStripe);
    }

    scene.add(group);
  }

  addShinseondaeTunnelEntrance(tunnelStartZ);
  addShinseondaeVariableMessageSign(tunnelStartZ + 260);
}

function addShinseondaeApproachSideRoads(tunnelStartZ) {
  const sideRoadStartZ = getStageZAtGoalProgress(0.6);
  const sideRoadEndZ = tunnelStartZ - 18;

  for (const side of [-1, 1]) {
    const sideRoad = new THREE.Mesh(
      makeContinuousScenerySideBoxGeometry(side * 15.1, sideRoadStartZ, sideRoadEndZ, 0.12, 8.2, 0.42, 14),
      materials.gwangalliRoadAlt,
    );
    sideRoad.receiveShadow = true;
    scene.add(sideRoad);

    const sidewalk = new THREE.Mesh(
      makeContinuousScenerySideBoxGeometry(side * 21.2, sideRoadStartZ, sideRoadEndZ, 0.18, 3.2, 0.38, 14),
      materials.gwangalliBoardwalk,
    );
    sidewalk.receiveShadow = true;
    scene.add(sidewalk);

    const innerCurb = new THREE.Mesh(
      makeContinuousSceneryVerticalBoxGeometry(side * 10.7, sideRoadStartZ, sideRoadEndZ, 0.16, 0.98, 0.34, 16),
      materials.gwangalliRail,
    );
    innerCurb.castShadow = false;
    innerCurb.receiveShadow = true;
    scene.add(innerCurb);

    const outerRail = new THREE.Mesh(
      makeContinuousSceneryVerticalBoxGeometry(side * 22.9, sideRoadStartZ, sideRoadEndZ, 0.28, 1.42, 0.32, 16),
      materials.gwangalliRailStripe,
    );
    outerRail.castShadow = false;
    outerRail.receiveShadow = true;
    scene.add(outerRail);
  }
}

function addShinseondaeTunnelEntrance(z) {
  const sample = getStageDefinitionGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  setStageSceneryTransform(group, new THREE.Vector3(0, sample.y, z), 0, 0);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(3.2, 8.6, 20), materials.tunnelWall);
  leftWall.position.set(-12.2, 4.2, 0);
  leftWall.castShadow = true;
  leftWall.receiveShadow = true;
  group.add(leftWall);

  const rightWall = leftWall.clone();
  rightWall.position.x = 12.2;
  group.add(rightWall);

  const header = new THREE.Mesh(new THREE.BoxGeometry(27.6, 3.0, 3.2), materials.tunnelWall);
  header.position.set(0, 8.0, -1.2);
  header.castShadow = true;
  group.add(header);

  addTunnelEntranceBrickLines(group);
  addTunnelEntranceLetterSigns(group);
  addTunnelEntranceLimitSigns(group);

  scene.add(group);
}

function addShinseondaeVariableMessageSign(z) {
  const sample = getStageDefinitionGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  setStageSceneryTransform(group, new THREE.Vector3(0, sample.y, z), 0, 0);

  const leftPost = new THREE.Mesh(new THREE.BoxGeometry(0.34, 8.2, 0.34), materials.gwangalliBridgeCable);
  leftPost.position.set(-12.5, 4.1, 0);
  const rightPost = leftPost.clone();
  rightPost.position.x = 12.5;
  group.add(leftPost, rightPost);

  const beam = new THREE.Mesh(new THREE.BoxGeometry(27.5, 0.34, 0.34), materials.gwangalliBridgeCable);
  beam.position.y = 8.15;
  group.add(beam);

  const board = new THREE.Mesh(new THREE.BoxGeometry(18.8, 2.7, 0.42), materials.roadSign);
  board.position.set(0, 6.78, 0.08);
  board.castShadow = true;
  group.add(board);

  const message = new THREE.Mesh(
    new THREE.PlaneGeometry(17.8, 2.05),
    createCanvasMultilineLabelMaterial(["전조등을 켜시오"], 1024, 220, "#b8ff7a", "rgba(0, 0, 0, 0)"),
  );
  message.position.set(0, 6.8, 0.32);
  group.add(message);

  addOverheadSmallSign(group, -5.5, 8.92, "구간단속지점");
  addOverheadSmallSign(group, 5.5, 8.92, "지점고속단속중");

  for (const x of [-2.2, 2.2]) {
    const cameraBox = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.38, 0.52), materials.gwangalliBridgeCable);
    cameraBox.position.set(x, 8.42, 0.18);
    cameraBox.castShadow = true;
    group.add(cameraBox);

    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.13, 16), materials.roadSign);
    lens.position.set(x, 8.42, 0.46);
    group.add(lens);
  }

  addShinseondaeWarningSignStack(group, -1);
  addShinseondaeWarningSignStack(group, 1);
  addCrashCushion(group, -1);
  addCrashCushion(group, 1);

  scene.add(group);
}

function addTunnelEntranceBrickLines(group) {
  for (let row = 0; row < 7; row += 1) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(27.8, 0.035, 0.08), materials.gwangalliRailStripe);
    line.position.set(0, 6.72 + row * 0.38, 0.46);
    group.add(line);
  }

  for (let column = 0; column < 18; column += 1) {
    const stagger = column % 2 === 0 ? 0 : 0.19;
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.035, 2.56, 0.08), materials.gwangalliRailStripe);
    line.position.set(-13.2 + column * 1.55, 7.82 + stagger, 0.47);
    group.add(line);
  }
}

function addTunnelEntranceLetterSigns(group) {
  const letters = ["지", "하", "차", "도"];
  letters.forEach((letter, index) => {
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(3.25, 1.78, 0.12),
      createCanvasLabelMaterial(letter, 160, 120, "#111820", "#f6f7f2"),
    );
    panel.position.set(-7.35 + index * 4.9, 9.55, 0.58);
    group.add(panel);
  });
}

function addTunnelEntranceLimitSigns(group) {
  const signs = [
    { x: -4.7, label: "NO", radius: 0.64 },
    { x: 0, label: "4.5m", radius: 0.68 },
    { x: 4.7, label: "60", radius: 0.68 },
  ];

  signs.forEach((sign) => {
    const disc = createRoundRoadSignMesh(sign.label, sign.radius, 0.14);
    disc.position.set(sign.x, 8.45, 0.62);
    group.add(disc);
  });
}

function addOverheadSmallSign(group, x, y, label) {
  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(4.7, 0.82, 0.16),
    createCanvasLabelMaterial(label, 320, 96, "#1d1a12", "#c9862d"),
  );
  sign.position.set(x, y, 0.34);
  sign.castShadow = true;
  group.add(sign);
}

function addShinseondaeWarningSignStack(group, side) {
  const x = side * 12.95;
  const pole = new THREE.Mesh(new THREE.BoxGeometry(0.24, 6.0, 0.24), materials.gwangalliBridgeCable);
  pole.position.set(x, 3.0, 0.16);
  pole.castShadow = true;
  group.add(pole);

  addTriangleRoadSign(group, x, 5.92, 0.46);
  addCircleRoadSign(group, x, 4.9, 0.46, "4.5m", 0.44);
  addCircleRoadSign(group, x, 3.98, 0.46, "NO", 0.42);
  addCircleRoadSign(group, x, 3.08, 0.46, "60", 0.42);

  const sideNotice = new THREE.Mesh(
    new THREE.BoxGeometry(1.28, 1.02, 0.12),
    createCanvasMultilineLabelMaterial(["진입", "금지"], 180, 160, "#183043", "#f5f7fb"),
  );
  sideNotice.position.set(x, 6.86, 0.46);
  group.add(sideNotice);
}

function addCircleRoadSign(group, x, y, z, label, radius) {
  const sign = createRoundRoadSignMesh(label, radius, 0.1);
  sign.position.set(x, y, z);
  group.add(sign);
}

function addTriangleRoadSign(group, x, y, z) {
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(0.98, 0.9),
    createTriangleRoadSignMaterial(),
  );
  sign.position.set(x, y, z);
  group.add(sign);
}

function addCrashCushion(group, side) {
  for (let i = 0; i < 3; i += 1) {
    const block = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.48, 1.25), materials.obstacleStripe);
    block.position.set(side * (13.35 + i * 0.62), 0.42, 4.9 - i * 0.38);
    block.rotation.y = side * 0.12;
    block.castShadow = true;
    group.add(block);

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 1.32), materials.obstacleDark);
    stripe.position.set(block.position.x - side * 0.22, 0.47, block.position.z);
    stripe.rotation.set(0, block.rotation.y, side * 0.42);
    group.add(stripe);
  }
}

function addShinseondaeTunnel() {
  const tunnelStartZ = getGwangalliTunnelStartZ();
  const tunnelEndZ = currentStage.gwangalliTunnelEndZ ?? currentStage.goalZ;
  if (!Number.isFinite(tunnelStartZ)) return;

  const tunnelInteriorStartZ = tunnelStartZ - 10;
  const shellStartZ = tunnelInteriorStartZ;
  const shellEndZ = tunnelEndZ + 36;
  const ceiling = new THREE.Mesh(
    makeContinuousScenerySideBoxGeometry(0, shellStartZ, shellEndZ, 7.25, 22.8, 0.82, 7),
    materials.tunnelDarkWall,
  );
  ceiling.receiveShadow = true;
  scene.add(ceiling);

  const centerCeilingRib = new THREE.Mesh(
    makeContinuousScenerySideBoxGeometry(0, shellStartZ, shellEndZ, 6.86, 1.35, 0.22, 18),
    materials.gwangalliBridgeCable,
  );
  centerCeilingRib.receiveShadow = true;
  scene.add(centerCeilingRib);

  for (const side of [-1, 1]) {
    const wall = new THREE.Mesh(
      makeContinuousSceneryVerticalBoxGeometry(side * 10.9, shellStartZ, shellEndZ, 0.35, 6.95, 0.86, 7),
      materials.tunnelWall,
    );
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);

    const sideBase = new THREE.Mesh(
      makeContinuousScenerySideBoxGeometry(side * 10.28, shellStartZ, shellEndZ, 0.72, 1.32, 0.46, 7),
      materials.tunnelWall,
    );
    sideBase.castShadow = true;
    sideBase.receiveShadow = true;
    scene.add(sideBase);

    const guardRail = new THREE.Mesh(
      makeContinuousScenerySideBoxGeometry(side * 9.62, shellStartZ, shellEndZ, 1.38, 0.24, 0.2, 10),
      materials.gwangalliBridgeCable,
    );
    guardRail.castShadow = true;
    scene.add(guardRail);

    const greenStripe = new THREE.Mesh(
      makeContinuousSceneryVerticalBoxGeometry(side * 10.43, shellStartZ, shellEndZ, 2.9, 3.12, 0.08, 9),
      materials.tunnelTileStripe,
    );
    scene.add(greenStripe);

    const blueStripe = new THREE.Mesh(
      makeContinuousSceneryVerticalBoxGeometry(side * 10.42, shellStartZ, shellEndZ, 2.46, 2.62, 0.08, 9),
      materials.tunnelBlueStripe,
    );
    scene.add(blueStripe);
  }

  for (let z = tunnelInteriorStartZ; z > tunnelEndZ + 40; z -= 34) {
    const sample = getStageDefinitionGroundSample(0, z);
    if (!sample) continue;

    const group = new THREE.Group();
    setStageSceneryTransform(group, new THREE.Vector3(0, sample.y, z), 0, 0);
    const blockIndex = Math.round((tunnelInteriorStartZ - z) / 34);

    for (const side of [-1, 1]) {
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.18, 1.35), materials.tunnelLight);
      lamp.position.set(side * 7.45, 6.48, 0);
      group.add(lamp);

      const glow = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.74), materials.tunnelLightGlow);
      glow.position.set(side * 7.45, 6.36, 0);
      glow.rotation.x = -Math.PI / 2;
      group.add(glow);

      if (blockIndex % 7 === 2) {
        const servicePanel = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 1.2), materials.roadSign);
        servicePanel.position.set(side * 10.36, 1.82, 0);
        group.add(servicePanel);
      }
    }

    scene.add(group);
  }

  for (let z = tunnelStartZ - 260; z > tunnelEndZ + 300; z -= 520) {
    addTunnelEmergencyBox(-10.2, z);
    addTunnelEmergencyBox(10.2, z - 260);
  }
}

function addTunnelEmergencyBox(x, z) {
  const sample = getStageDefinitionGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  setStageSceneryTransform(group, new THREE.Vector3(x, sample.y, z), 0, 0);

  const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.05, 0.9), materials.roadSign);
  cabinet.position.y = 1.75;
  group.add(cabinet);

  const sign = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.88, 0.48), materials.tunnelLight);
  sign.position.y = 3.1;
  group.add(sign);

  scene.add(group);
}

function createCanvasLabelMaterial(label, width, height, textColor, backgroundColor) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, width, height);
  context.fillStyle = textColor;
  let fontSize = Math.round(height * 0.42);
  do {
    context.font = `bold ${fontSize}px Arial, sans-serif`;
    fontSize -= 2;
  } while (context.measureText(label).width > width * 0.82 && fontSize > 16);
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, width * 0.5, height * 0.52);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({ map: texture });
}

function createCanvasMultilineLabelMaterial(lines, width, height, textColor, backgroundColor) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, width, height);
  context.fillStyle = textColor;
  const fontSize = Math.round(height / (lines.length + 1.25));
  context.font = `bold ${fontSize}px Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  const lineHeight = fontSize * 1.12;
  const firstY = height * 0.5 - (lines.length - 1) * lineHeight * 0.5;

  lines.forEach((line, index) => {
    context.fillText(line, width * 0.5, firstY + index * lineHeight);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({ map: texture, transparent: backgroundColor.includes("rgba") });
}

function createCircleRoadSignMaterial(label) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, size, size);
  context.beginPath();
  context.arc(size * 0.5, size * 0.5, size * 0.43, 0, Math.PI * 2);
  context.fillStyle = "#f7f8f4";
  context.fill();
  context.lineWidth = size * 0.075;
  context.strokeStyle = "#b51f36";
  context.stroke();
  context.fillStyle = "#132030";
  context.font = `bold ${label.length > 3 ? 52 : 72}px Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, size * 0.5, size * 0.52);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({ map: texture, transparent: true });
}

function createRoundRoadSignMesh(label, radius, depth = 0.12) {
  const faceMaterial = createCircleRoadSignMaterial(label);
  const sign = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, depth, 56),
    [materials.gwangalliBridgeCable, faceMaterial, faceMaterial],
  );
  sign.rotation.x = Math.PI * 0.5;
  sign.castShadow = true;
  sign.receiveShadow = true;
  return sign;
}

function createTriangleRoadSignMaterial() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, size, size);
  context.beginPath();
  context.moveTo(size * 0.5, size * 0.12);
  context.lineTo(size * 0.88, size * 0.82);
  context.lineTo(size * 0.12, size * 0.82);
  context.closePath();
  context.fillStyle = "#f9c74f";
  context.fill();
  context.lineWidth = size * 0.055;
  context.strokeStyle = "#9d2735";
  context.stroke();
  context.fillStyle = "#151923";
  context.font = "bold 82px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("!", size * 0.5, size * 0.58);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({ map: texture, transparent: true });
}

function getStageSceneryFrame(z, useCache = false) {
  if (useCache) {
    const cacheKey = Math.round(z * 1000);
    if (!staticStageSceneryFrameCache.has(cacheKey)) {
      staticStageSceneryFrameCache.set(cacheKey, getStageSceneryFrame(z, false));
    }
    return staticStageSceneryFrameCache.get(cacheKey);
  }

  const progress = getStageProgress(z);
  const center = stageCurve.getPointAt(progress);
  center.y += getStageLift(progress);
  const tangent = stageCurve.getTangentAt(progress).normalize();
  const right = new THREE.Vector3().crossVectors(tangent, worldUp);
  if (right.lengthSq() < 0.0001) {
    right.set(1, 0, 0);
  } else {
    right.normalize();
  }
  const up = worldUp.clone();
  return { center, tangent, right, up };
}

function toSceneryWorldPosition(localPosition, useCache = false) {
  const frame = getStageSceneryFrame(localPosition.z, useCache);
  return frame.center.clone()
    .addScaledVector(frame.right, localPosition.x)
    .addScaledVector(frame.up, localPosition.y);
}

function setStageSceneryTransform(object, localPosition, localYRotation = 0, extraUp = 0, useCache = false) {
  const frame = getStageSceneryFrame(localPosition.z, useCache);
  object.position.copy(frame.center)
    .addScaledVector(frame.right, localPosition.x)
    .addScaledVector(frame.up, localPosition.y + extraUp);
  const matrix = new THREE.Matrix4();
  matrix.makeBasis(frame.right, frame.up, frame.tangent.clone().negate());
  object.quaternion.setFromRotationMatrix(matrix);
  if (localYRotation !== 0) {
    object.rotateY(localYRotation);
  }
  return frame;
}

function makeScenerySlopedBoxGeometry(width, zStart, zEnd, yStart, yEnd, thickness, xOffset = 0) {
  const half = width * 0.5;
  const steps = Math.max(1, Math.ceil(Math.abs(zStart - zEnd) / 10));
  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const z = THREE.MathUtils.lerp(zStart, zEnd, t);
    const y = THREE.MathUtils.lerp(yStart, yEnd, t);
    const row = [
      new THREE.Vector3(xOffset - half, y, z),
      new THREE.Vector3(xOffset + half, y, z),
      new THREE.Vector3(xOffset - half, y - thickness, z),
      new THREE.Vector3(xOffset + half, y - thickness, z),
    ];

    for (const local of row) {
      const world = toSceneryWorldPosition(local, true);
      vertices.push(world.x, world.y, world.z);
      uvs.push(local.x / roadTextureTileMeters, -local.z / roadTextureTileMeters);
    }
  }

  for (let i = 0; i < steps; i += 1) {
    const a = i * 4;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    const e = a + 4;
    const f = a + 5;
    const g = a + 6;
    const h = a + 7;
    indices.push(
      a, b, f, a, f, e,
      c, g, h, c, h, d,
      c, a, e, c, e, g,
      b, d, h, b, h, f,
    );
  }

  const start = 0;
  const end = steps * 4;
  indices.push(
    start, start + 2, start + 3, start, start + 3, start + 1,
    end, end + 1, end + 3, end, end + 3, end + 2,
  );

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makeContinuousScenerySideBoxGeometry(xCenter, zStart, zEnd, yOffset, width, thickness, step = 8) {
  const half = width * 0.5;
  const steps = Math.max(1, Math.ceil(Math.abs(zStart - zEnd) / step));
  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const z = THREE.MathUtils.lerp(zStart, zEnd, t);
    const ground = getStageDefinitionGroundSample(0, z);
    const y = (ground?.y ?? 0) + yOffset;
    const row = [
      new THREE.Vector3(xCenter - half, y, z),
      new THREE.Vector3(xCenter + half, y, z),
      new THREE.Vector3(xCenter - half, y - thickness, z),
      new THREE.Vector3(xCenter + half, y - thickness, z),
    ];

    for (const local of row) {
      const world = toSceneryWorldPosition(local, true);
      vertices.push(world.x, world.y, world.z);
      uvs.push(local.x / roadTextureTileMeters, -local.z / roadTextureTileMeters);
    }
  }

  for (let i = 0; i < steps; i += 1) {
    const a = i * 4;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    const e = a + 4;
    const f = a + 5;
    const g = a + 6;
    const h = a + 7;
    indices.push(
      a, b, f, a, f, e,
      c, g, h, c, h, d,
      c, a, e, c, e, g,
      b, d, h, b, h, f,
    );
  }

  const start = 0;
  const end = steps * 4;
  indices.push(
    start, start + 2, start + 3, start, start + 3, start + 1,
    end, end + 1, end + 3, end, end + 3, end + 2,
  );

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makeContinuousSceneryVerticalBoxGeometry(xCenter, zStart, zEnd, yBottomOffset, yTopOffset, thickness, step = 8) {
  const half = thickness * 0.5;
  const steps = Math.max(1, Math.ceil(Math.abs(zStart - zEnd) / step));
  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const z = THREE.MathUtils.lerp(zStart, zEnd, t);
    const ground = getStageDefinitionGroundSample(0, z);
    const groundY = ground?.y ?? 0;
    const row = [
      new THREE.Vector3(xCenter - half, groundY + yTopOffset, z),
      new THREE.Vector3(xCenter + half, groundY + yTopOffset, z),
      new THREE.Vector3(xCenter - half, groundY + yBottomOffset, z),
      new THREE.Vector3(xCenter + half, groundY + yBottomOffset, z),
    ];

    for (const local of row) {
      const world = toSceneryWorldPosition(local, true);
      vertices.push(world.x, world.y, world.z);
      uvs.push(-local.z / roadTextureTileMeters, local.y / roadTextureTileMeters);
    }
  }

  for (let i = 0; i < steps; i += 1) {
    const a = i * 4;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    const e = a + 4;
    const f = a + 5;
    const g = a + 6;
    const h = a + 7;
    indices.push(
      a, e, f, a, f, b,
      c, d, h, c, h, g,
      a, c, g, a, g, e,
      b, f, h, b, h, d,
    );
  }

  const start = 0;
  const end = steps * 4;
  indices.push(
    start, start + 1, start + 3, start, start + 3, start + 2,
    end, end + 2, end + 3, end, end + 3, end + 1,
  );

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makeCylinderBetween(start, end, radius, material) {
  const delta = end.clone().sub(start);
  const length = delta.length();
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 8), material);
  mesh.position.copy(start).addScaledVector(delta, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
  return mesh;
}

function addTrack() {
  for (const segment of currentStage.trackSegments) {
    addTrackSegment(segment);
  }

  const platformMaterial = new THREE.MeshStandardMaterial({
    color: 0xffc85a,
    roughness: 0.58,
  });
  const stagePlatformMaterial = currentStage.harborTheme
    ? materials.harborDock
    : currentStage.gwangalliTheme ? materials.gwangalliBoardwalk : platformMaterial;

  for (const platform of currentStage.sidePlatforms) {
    const mesh = new THREE.Mesh(
      makeSlopedBoxGeometry(
        platform.width,
        platform.zStart,
        platform.zEnd,
        platform.yStart,
        platform.yEnd,
        platform.thickness,
        platform.xOffset,
      ),
      stagePlatformMaterial,
    );
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    scene.add(mesh);
  }
}

function addStageThreeHarbor() {
  if (!currentStage.harborTheme) return;

  const harborEndZ = getStageEndZ(currentStage);
  addHarborDockEdges();
  addHarborServiceLanes(harborEndZ);
  addHarborQuayFixtures(harborEndZ);
  addHarborFeatureContainerStacks(harborEndZ);
  addDenseHarborContainers(harborEndZ);
  addHarborSupportDetails(harborEndZ);
  addHarborPortWorkZones(harborEndZ);
  addHarborLargeShipFleet(harborEndZ);
  addHarborCraneField(harborEndZ);
  addHarborCargoTruckRoutes(harborEndZ);
  addHarborExcavatorField(harborEndZ);
}

function addHarborFeatureContainerStacks(harborEndZ) {
  const stackSpacing = 420;
  const stackCount = Math.ceil(Math.abs(harborEndZ) / stackSpacing);
  for (let index = 0; index < stackCount; index += 1) {
    const side = index % 2 === 0 ? -1 : 1;
    const z = -180 - index * stackSpacing;
    if (z < harborEndZ + 120) break;
    const x = side * (35 + (index % 3) * 4.8);
    const layers = 2 + (index % 5 === 0 ? 1 : 0);
    addHarborContainerStack(x, z, layers, index);
  }
}

function addHarborCraneField(harborEndZ) {
  const craneSpacing = 360;
  const craneCount = Math.min(28, Math.ceil(Math.abs(harborEndZ) / craneSpacing));
  Array.from({ length: craneCount }, (_, index) => {
    const side = index % 2 === 0 ? -1 : 1;
    return {
      x: side * (49 + (index % 2) * 3.4),
      z: -240 - index * craneSpacing,
      side,
      phase: index * 0.43,
    };
  })
    .filter(({ z }) => z > harborEndZ + 120)
    .forEach(addHarborCrane);
}

function addHarborCargoTruckRoutes(harborEndZ) {
  const truckMaterials = [
    materials.truckTrailer,
    materials.containerGreen,
    materials.containerBlue,
    materials.containerRed,
    materials.containerYellow,
  ];
  let index = 0;
  for (let zStart = -160; zStart > harborEndZ + 180; zStart -= 520) {
    const side = index % 2 === 0 ? 1 : -1;
    const routeLength = 260 + (index % 3) * 55;
    const zEnd = Math.max(zStart - routeLength, harborEndZ + 90);
    if (zEnd >= zStart - 90) break;
    const startRatio = 0.28 + (index % 4) * 0.12;
    addHarborCargoTruck({
      x: side * (20 + (index % 2) * 3.8),
      zStart,
      zEnd,
      z: THREE.MathUtils.lerp(zStart, zEnd, startRatio),
      direction: index % 2 === 0 ? -1 : 1,
      speed: 15 + (index % 4) * 1.6,
      material: truckMaterials[index % truckMaterials.length],
    });
    index += 1;
  }
}

function addHarborExcavatorField(harborEndZ) {
  for (let index = 0; index < 10; index += 1) {
    const z = -620 - index * 820;
    if (z < harborEndZ + 160) break;
    const side = index % 2 === 0 ? -1 : 1;
    addHarborExcavator({
      x: side * (46 + (index % 2) * 2.4),
      z,
      phase: 0.4 + index * 0.67,
    });
  }
}

function addHarborSupportDetails(harborEndZ) {
  for (let index = 0, z = -260; z > harborEndZ + 180; index += 1, z -= 520) {
    const side = index % 2 === 0 ? -1 : 1;
    addHarborWarehouse({ x: side * 50, z: z - 30, side, seed: index });
    addHarborLightPole(side * 13.2, z + 24, 7.2 + (index % 2) * 0.6);
    addHarborLightPole(-side * 52, z - 42, 8.4);
    if (index % 3 === 0) {
      addHarborFuelTanks({ x: -side * 49, z: z - 130, side: -side, seed: index });
    }
    if (index % 3 === 1) {
      addHarborPipeRack({ x: -side * 47, z: z - 120, side: -side, seed: index });
    }
    if (index % 4 === 2) {
      addHarborMooredShip({ x: side * 72, z: z - 170, side, seed: index });
    }
    if (index % 4 === 0) {
      addHarborServiceGate(z - 210, index);
    }
  }
}

function addHarborServiceLanes(harborEndZ) {
  const zStart = -70;
  const zEnd = harborEndZ + 140;
  for (const side of [-1, 1]) {
    const laneCenterX = side * 27.4;
    const lane = new THREE.Mesh(
      makeContinuousScenerySideBoxGeometry(laneCenterX, zStart, zEnd, 0.16, 5.4, 0.08, 28),
      materials.harborRoadAlt,
    );
    lane.receiveShadow = true;
    scene.add(lane);

    for (const stripeOffset of [-2.35, 2.35]) {
      const stripe = new THREE.Mesh(
        makeContinuousScenerySideBoxGeometry(laneCenterX + stripeOffset, zStart, zEnd, 0.22, 0.12, 0.04, 34),
        materials.harborRailStripe,
      );
      stripe.receiveShadow = false;
      scene.add(stripe);
    }
  }
}

function addHarborQuayFixtures(harborEndZ) {
  for (let index = 0, z = -160; z > harborEndZ + 180; index += 1, z -= 420) {
    for (const side of [-1, 1]) {
      const sample = getGroundSample(0, z);
      if (!sample) continue;

      const group = new THREE.Group();
      group.userData.debugName = "Harbor Quay Fixtures";
      setStageObjectTransform(group, new THREE.Vector3(side * 59.2, sample.y, z), 0, 0, true);

      const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.42, 0.72, 14), materials.craneDark);
      bollard.position.y = 0.46;
      bollard.castShadow = false;
      group.add(bollard);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.16, 14), materials.harborRailStripe);
      cap.position.y = 0.9;
      cap.castShadow = false;
      group.add(cap);

      const fender = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.7, 3.4), materials.containerTrim);
      fender.position.set(-side * 1.2, 1.0, index % 2 === 0 ? 1.4 : -1.4);
      fender.castShadow = false;
      group.add(fender);

      scene.add(group);
    }
  }
}

function addHarborPortWorkZones(harborEndZ) {
  for (let index = 0, z = -420; z > harborEndZ + 260; index += 1, z -= 760) {
    const side = index % 2 === 0 ? 1 : -1;
    addHarborTrailerParking({ x: side * 42, z: z - 80, side, seed: index });
    addHarborCargoPallets({ x: side * 51, z: z - 205, seed: index });
    addHarborForklift({ x: -side * 33, z: z - 150, side: -side, seed: index });
    addHarborHighMastLight(side * 18.6, z + 52, 12.5 + (index % 3) * 1.2);
    if (index % 2 === 0) {
      addHarborInspectionBooth({ x: -side * 30.5, z: z + 92, side: -side, seed: index });
    }
  }
}

function addHarborTrailerParking({ x, z, side, seed }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  group.userData.debugName = "Parked Container Trailers";
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y, z), 0, 0, true);

  const trailerMaterials = [materials.containerBlue, materials.containerGreen, materials.containerRed, materials.truckTrailer];
  for (let index = 0; index < 4; index += 1) {
    const trailer = new THREE.Mesh(
      new THREE.BoxGeometry(2.85, 2.38, 8.8),
      trailerMaterials[(seed + index) % trailerMaterials.length],
    );
    trailer.position.set((index % 2 - 0.5) * 4.0, 1.65, (Math.floor(index / 2) - 0.5) * 11.0);
    trailer.rotation.y = side * 0.05;
    trailer.castShadow = false;
    trailer.receiveShadow = true;
    group.add(trailer);

    const stand = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.22, 0.38), materials.containerTrim);
    stand.position.set(trailer.position.x, 0.58, trailer.position.z - 3.4);
    stand.castShadow = false;
    group.add(stand);

    for (const wheelX of [-1.52, 1.52]) {
      const wheel = new THREE.Mesh(harborWheelGeometry, materials.tire);
      wheel.rotation.z = Math.PI * 0.5;
      wheel.position.set(trailer.position.x + wheelX, 0.5, trailer.position.z + 3.2);
      wheel.castShadow = false;
      group.add(wheel);
    }
  }

  scene.add(group);
}

function addHarborCargoPallets({ x, z, seed }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  group.userData.debugName = "Port Cargo Pallets";
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y, z), 0, 0, true);

  const crateGeometry = new THREE.BoxGeometry(1.35, 0.82, 1.45);
  const crateMesh = new THREE.InstancedMesh(crateGeometry, materials.harborDockDark, 16);
  const instanceObject = new THREE.Object3D();
  for (let index = 0; index < 16; index += 1) {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const stack = 1 + ((seed + index) % 3);
    instanceObject.position.set((column - 1.5) * 1.75, 0.45 + stack * 0.25, (row - 1.5) * 1.85);
    instanceObject.scale.set(1, 0.7 + stack * 0.22, 1);
    instanceObject.rotation.y = ((seed + index) % 2) * 0.08;
    instanceObject.updateMatrix();
    crateMesh.setMatrixAt(index, instanceObject.matrix);
  }
  crateMesh.instanceMatrix.needsUpdate = true;
  crateMesh.castShadow = false;
  crateMesh.receiveShadow = true;
  group.add(crateMesh);

  const tarp = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.16, 7.2), seed % 2 === 0 ? materials.harborRailStripe : materials.containerBlue);
  tarp.position.y = 1.82;
  tarp.castShadow = false;
  group.add(tarp);

  scene.add(group);
}

function addHarborForklift({ x, z, side, seed }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  group.userData.debugName = "Port Forklift";
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y, z), 0, 0, true);
  group.rotateY(side * (Math.PI * 0.5 + 0.16 * ((seed % 3) - 1)));

  const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 2.6), materials.excavatorBody);
  body.position.y = 1.0;
  body.castShadow = false;
  body.receiveShadow = true;
  group.add(body);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.55, 1.65, 1.3), materials.craneDark);
  cabin.position.set(0, 2.1, 0.45);
  cabin.castShadow = false;
  group.add(cabin);

  const mast = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.65, 0.18), materials.containerTrim);
  mast.position.set(0, 1.8, -1.55);
  mast.castShadow = false;
  group.add(mast);

  for (const forkX of [-0.42, 0.42]) {
    const fork = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 2.2), materials.containerTrim);
    fork.position.set(forkX, 0.42, -2.25);
    fork.castShadow = false;
    group.add(fork);
  }

  for (const wheelX of [-0.95, 0.95]) {
    for (const wheelZ of [-0.75, 0.9]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.28, 14), materials.tire);
      wheel.rotation.z = Math.PI * 0.5;
      wheel.position.set(wheelX, 0.38, wheelZ);
      wheel.castShadow = false;
      group.add(wheel);
    }
  }

  scene.add(group);
}

function addHarborHighMastLight(x, z, height) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  group.userData.debugName = "Harbor High Mast Light";
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y, z), 0, 0, true);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, height, 10), materials.harborRail);
  pole.position.y = height * 0.5;
  pole.castShadow = false;
  group.add(pole);

  const crown = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.16, 2.8), materials.harborRail);
  crown.position.y = height;
  crown.castShadow = false;
  group.add(crown);

  for (const [lampX, lampZ] of [[1.3, 0], [-1.3, 0], [0, 1.3], [0, -1.3]]) {
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.44), materials.beachLamp);
    lamp.position.set(lampX, height - 0.22, lampZ);
    group.add(lamp);
  }

  scene.add(group);
}

function addHarborInspectionBooth({ x, z, side, seed }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  group.userData.debugName = "Port Checkpoint Booth";
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y, z), 0, 0, true);

  const booth = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.7, 3.0), materials.truckCab);
  booth.position.y = 1.55;
  booth.castShadow = false;
  booth.receiveShadow = true;
  group.add(booth);

  const glass = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.75, 0.08), materials.tourBoatGlass);
  glass.position.set(0, 1.95, -1.54);
  group.add(glass);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.22, 3.8), materials.harborRailStripe);
  roof.position.y = 3.0;
  roof.castShadow = false;
  group.add(roof);

  const barrierPost = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.2, 0.22), materials.containerTrim);
  barrierPost.position.set(side * 2.4, 0.62, -1.2);
  group.add(barrierPost);

  const barrier = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.18, 0.16), seed % 2 === 0 ? materials.harborRailStripe : materials.dashPad);
  barrier.position.set(side * 5.1, 1.2, -1.2);
  barrier.rotation.z = side * -0.08;
  group.add(barrier);

  scene.add(group);
}

function addHarborLargeShipFleet(harborEndZ) {
  const fleet = [
    { type: "megaContainer", side: -1, x: -128, z: -620, scale: 1.02, seed: 3 },
    { type: "oilTanker", side: 1, x: 132, z: -1320, scale: 0.95, seed: 7 },
    { type: "ultraTrade", side: -1, x: -250, z: -2500, scale: 1.0, seed: 9 },
    { type: "bulkCarrier", side: -1, x: -138, z: -2140, scale: 1.0, seed: 11 },
    { type: "feederContainer", side: 1, x: 104, z: -2920, scale: 0.76, seed: 15 },
    { type: "tugboat", side: -1, x: -84, z: -3340, scale: 0.72, seed: 19 },
    { type: "megaContainer", side: 1, x: 140, z: -4080, scale: 1.12, seed: 23 },
    { type: "oilTanker", side: -1, x: -146, z: -5120, scale: 1.04, seed: 27 },
    { type: "bulkCarrier", side: 1, x: 132, z: -6060, scale: 0.92, seed: 31 },
    { type: "feederContainer", side: -1, x: -108, z: -7020, scale: 0.84, seed: 35 },
    { type: "tugboat", side: 1, x: 86, z: -7440, scale: 0.76, seed: 39 },
    { type: "megaContainer", side: -1, x: -150, z: -8240, scale: 1.0, seed: 43 },
  ];

  for (const ship of fleet) {
    if (ship.z < harborEndZ + 240) continue;
    if (ship.type === "ultraTrade") {
      addHarborUltraTradeShip(ship);
    } else if (ship.type === "megaContainer") {
      addHarborMegaContainerShip(ship);
    } else if (ship.type === "oilTanker") {
      addHarborOilTanker(ship);
    } else if (ship.type === "bulkCarrier") {
      addHarborBulkCarrier(ship);
    } else if (ship.type === "feederContainer") {
      addHarborFeederShip(ship);
    } else {
      addHarborTugboat(ship);
    }
  }
}

function addHarborUltraTradeShip({ x, z, side, scale, seed }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  group.userData.debugName = "Ultra Trade Ship";
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y - 28 * scale, z), 0, 0, true);

  const length = 528 * scale;
  const width = 58 * scale;
  const hullHeight = 28 * scale;
  addLargeShipHull(group, width, hullHeight, length, materials.tourBoatNavy, materials.tourBoatRed, side);

  const mainDeck = new THREE.Mesh(new THREE.BoxGeometry(width * 0.88, 0.9 * scale, length * 0.82), materials.harborDock);
  mainDeck.position.y = hullHeight + 0.32 * scale;
  mainDeck.castShadow = true;
  mainDeck.receiveShadow = true;
  group.add(mainDeck);

  const colorMaterials = [materials.containerRed, materials.containerBlue, materials.containerYellow, materials.containerGreen];
  for (let bay = 0; bay < 14; bay += 1) {
    for (let column = 0; column < 7; column += 1) {
      const stackHeight = 2 + ((bay + column + seed) % 4);
      const cargo = new THREE.Mesh(
        new THREE.BoxGeometry(5.6 * scale, stackHeight * 3.4 * scale, 18 * scale),
        colorMaterials[(seed + bay + column) % colorMaterials.length],
      );
      cargo.position.set(
        (column - 3) * 6.6 * scale,
        hullHeight + 0.9 * scale + stackHeight * 1.7 * scale,
        -length * 0.32 + bay * 21.5 * scale,
      );
      cargo.castShadow = true;
      cargo.receiveShadow = true;
      group.add(cargo);

      const cargoTop = new THREE.Mesh(
        new THREE.BoxGeometry(5.75 * scale, 0.16 * scale, 18.2 * scale),
        materials.containerTrim,
      );
      cargoTop.position.set(cargo.position.x, cargo.position.y + stackHeight * 1.7 * scale + 0.1 * scale, cargo.position.z);
      cargoTop.castShadow = true;
      group.add(cargoTop);
    }
  }

  addShipBridge(
    group,
    side * width * 0.18,
    hullHeight + 17.8 * scale,
    length * 0.36,
    24 * scale,
    28 * scale,
    22 * scale,
  );
  addShipBridge(
    group,
    side * width * 0.12,
    hullHeight + 35.0 * scale,
    length * 0.37,
    18 * scale,
    10 * scale,
    15 * scale,
  );
  addShipMast(group, side * width * 0.2, hullHeight + 44 * scale, length * 0.41, 22 * scale);
  addShipRails(group, width, hullHeight + 1.5 * scale, length * 0.88, scale * 2.6);

  const bowNamePlate = new THREE.Mesh(new THREE.BoxGeometry(width * 0.42, 2.0 * scale, 0.55 * scale), materials.truckCab);
  bowNamePlate.position.set(0, hullHeight * 0.55, -length * 0.49);
  bowNamePlate.castShadow = true;
  group.add(bowNamePlate);

  for (const craneZ of [-length * 0.18, length * 0.02, length * 0.22]) {
    const deckCrane = new THREE.Group();
    deckCrane.position.set(-side * width * 0.34, hullHeight + 1.4 * scale, craneZ);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.55 * scale, 0.7 * scale, 18 * scale, 12), materials.crane);
    post.position.y = 9 * scale;
    post.castShadow = true;
    deckCrane.add(post);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(34 * scale, 0.65 * scale, 0.65 * scale), materials.crane);
    arm.position.set(side * 14 * scale, 17.2 * scale, 0);
    arm.rotation.z = -side * 0.14;
    arm.castShadow = true;
    deckCrane.add(arm);
    group.add(deckCrane);
  }

  scene.add(group);
}

function addHarborMegaContainerShip({ x, z, side, scale, seed }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  group.userData.debugName = "Mega Container Ship";
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y - 7.4 * scale, z), 0, 0, true);

  const length = 132 * scale;
  const width = 22 * scale;
  const hullHeight = 9.0 * scale;
  addLargeShipHull(group, width, hullHeight, length, materials.tourBoatNavy, materials.tourBoatHull, side);

  const deck = new THREE.Mesh(new THREE.BoxGeometry(width * 0.92, 0.42 * scale, length * 0.86), materials.harborDock);
  deck.position.y = hullHeight + 0.15 * scale;
  deck.castShadow = true;
  group.add(deck);

  const colorMaterials = [materials.containerRed, materials.containerBlue, materials.containerYellow, materials.containerGreen];
  for (let row = 0; row < 6; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      const stackHeight = 2 + ((row + column + seed) % 3);
      for (let layer = 0; layer < stackHeight; layer += 1) {
        const cargo = new THREE.Mesh(
          new THREE.BoxGeometry(3.2 * scale, 2.0 * scale, 8.0 * scale),
          colorMaterials[(seed + row + column + layer) % colorMaterials.length],
        );
        cargo.position.set(
          (column - 1.5) * 4.0 * scale,
          hullHeight + 1.25 * scale + layer * 2.05 * scale,
          -length * 0.25 + row * 8.8 * scale,
        );
        cargo.castShadow = true;
        cargo.receiveShadow = true;
        group.add(cargo);
      }
    }
  }

  addShipBridge(group, side * width * 0.16, hullHeight + 5.6 * scale, length * 0.34, 11.0 * scale, 9.2 * scale, 10.8 * scale);
  addShipMast(group, side * width * 0.22, hullHeight + 12.5 * scale, length * 0.39, 8.0 * scale);
  addShipRails(group, width, hullHeight + 0.8 * scale, length * 0.9, scale);

  scene.add(group);
}

function addHarborOilTanker({ x, z, side, scale, seed }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  group.userData.debugName = "Oil Tanker";
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y - 6.8 * scale, z), 0, 0, true);

  const length = 118 * scale;
  const width = 20 * scale;
  const hullHeight = 8.0 * scale;
  addLargeShipHull(group, width, hullHeight, length, materials.craneDark, materials.tourBoatRed, side);

  const deck = new THREE.Mesh(new THREE.BoxGeometry(width * 0.86, 0.34 * scale, length * 0.78), materials.harborRail);
  deck.position.y = hullHeight + 0.1 * scale;
  deck.castShadow = true;
  group.add(deck);

  for (let index = 0; index < 6; index += 1) {
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(3.2 * scale, 3.2 * scale, 9.5 * scale, 24), materials.truckCab);
    tank.rotation.z = Math.PI * 0.5;
    tank.position.set(0, hullHeight + 2.2 * scale, -length * 0.26 + index * 9.8 * scale);
    tank.castShadow = true;
    tank.receiveShadow = true;
    group.add(tank);
  }

  for (const pipeX of [-width * 0.22, width * 0.22]) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.28 * scale, 0.28 * scale, length * 0.62, 12), materials.craneDark);
    pipe.rotation.x = Math.PI * 0.5;
    pipe.position.set(pipeX, hullHeight + 1.1 * scale, -length * 0.02);
    pipe.castShadow = true;
    group.add(pipe);
  }

  addShipBridge(group, side * width * 0.18, hullHeight + 4.7 * scale, length * 0.34, 9.0 * scale, 8.2 * scale, 8.8 * scale);
  addShipMast(group, side * width * 0.18, hullHeight + 11.2 * scale, length * 0.39, 7.0 * scale);
  addShipRails(group, width, hullHeight + 0.65 * scale, length * 0.86, scale);

  scene.add(group);
}

function addHarborBulkCarrier({ x, z, side, scale, seed }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  group.userData.debugName = "Bulk Carrier";
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y - 6.4 * scale, z), 0, 0, true);

  const length = 104 * scale;
  const width = 21 * scale;
  const hullHeight = 8.2 * scale;
  addLargeShipHull(group, width, hullHeight, length, materials.tourBoatNavy, materials.harborDockDark, side);

  const deck = new THREE.Mesh(new THREE.BoxGeometry(width * 0.84, 0.35 * scale, length * 0.82), materials.harborDock);
  deck.position.y = hullHeight + 0.08 * scale;
  deck.castShadow = true;
  group.add(deck);

  for (let index = 0; index < 5; index += 1) {
    const hold = new THREE.Mesh(new THREE.BoxGeometry(width * 0.58, 0.3 * scale, 10.5 * scale), materials.containerTrim);
    hold.position.set(0, hullHeight + 0.35 * scale, -length * 0.28 + index * 13.0 * scale);
    hold.castShadow = true;
    group.add(hold);

    const cargo = new THREE.Mesh(new THREE.BoxGeometry(width * 0.46, 0.75 * scale, 8.3 * scale), seed % 2 === 0 ? materials.coastalRock : materials.harborDockDark);
    cargo.position.set(0, hullHeight + 0.85 * scale, -length * 0.28 + index * 13.0 * scale);
    cargo.castShadow = true;
    group.add(cargo);
  }

  for (let craneIndex = 0; craneIndex < 3; craneIndex += 1) {
    const miniCrane = new THREE.Group();
    miniCrane.position.set(side * width * 0.32, hullHeight + 1.2 * scale, -length * 0.18 + craneIndex * 19 * scale);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.18 * scale, 5.8 * scale, 10), materials.crane);
    post.position.y = 2.9 * scale;
    post.castShadow = true;
    miniCrane.add(post);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(9.2 * scale, 0.22 * scale, 0.22 * scale), materials.crane);
    arm.position.set(-side * 3.8 * scale, 5.4 * scale, 0);
    arm.rotation.z = side * 0.18;
    arm.castShadow = true;
    miniCrane.add(arm);
    group.add(miniCrane);
  }

  addShipBridge(group, side * width * 0.18, hullHeight + 4.5 * scale, length * 0.35, 8.0 * scale, 7.4 * scale, 8.2 * scale);
  addShipRails(group, width, hullHeight + 0.68 * scale, length * 0.84, scale);

  scene.add(group);
}

function addHarborFeederShip({ x, z, side, scale, seed }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  group.userData.debugName = "Feeder Container Ship";
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y - 4.8 * scale, z), 0, 0, true);

  const length = 76 * scale;
  const width = 14.5 * scale;
  const hullHeight = 6.6 * scale;
  addLargeShipHull(group, width, hullHeight, length, seed % 2 === 0 ? materials.containerBlue : materials.tourBoatNavy, materials.tourBoatHull, side);

  const colorMaterials = [materials.containerRed, materials.containerBlue, materials.containerYellow, materials.containerGreen];
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      const cargo = new THREE.Mesh(
        new THREE.BoxGeometry(3.0 * scale, 1.8 * scale, 7.0 * scale),
        colorMaterials[(seed + row + column) % colorMaterials.length],
      );
      cargo.position.set((column - 1) * 3.6 * scale, hullHeight + 1.1 * scale, -length * 0.22 + row * 8.2 * scale);
      cargo.castShadow = true;
      group.add(cargo);
    }
  }

  addShipBridge(group, side * width * 0.14, hullHeight + 3.6 * scale, length * 0.32, 6.0 * scale, 5.6 * scale, 6.2 * scale);
  addShipRails(group, width, hullHeight + 0.52 * scale, length * 0.82, scale);

  scene.add(group);
}

function addHarborTugboat({ x, z, side, scale, seed }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  group.userData.debugName = "Tugboat";
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y - 2.1 * scale, z), 0, 0, true);

  const length = 24 * scale;
  const width = 8.6 * scale;
  const hullHeight = 3.1 * scale;
  addLargeShipHull(group, width, hullHeight, length, seed % 2 === 0 ? materials.tourBoatRed : materials.tourBoatYellow, materials.craneDark, side);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(5.0 * scale, 3.0 * scale, 6.0 * scale), materials.truckCab);
  cabin.position.set(0, hullHeight + 2.1 * scale, -length * 0.08);
  cabin.castShadow = true;
  group.add(cabin);

  const glass = new THREE.Mesh(new THREE.BoxGeometry(4.1 * scale, 0.72 * scale, 0.12 * scale), materials.tourBoatGlass);
  glass.position.set(0, hullHeight + 2.75 * scale, -length * 0.08 - 3.05 * scale);
  group.add(glass);

  const tireRail = new THREE.Mesh(new THREE.BoxGeometry(width * 1.05, 0.42 * scale, 0.42 * scale), materials.tire);
  for (const tireZ of [-length * 0.3, length * 0.05, length * 0.34]) {
    const rail = tireRail.clone();
    rail.position.set(0, hullHeight + 0.5 * scale, tireZ);
    rail.castShadow = true;
    group.add(rail);
  }

  addShipMast(group, 0, hullHeight + 5.0 * scale, length * 0.16, 5.0 * scale);
  scene.add(group);
}

function addLargeShipHull(group, width, height, length, hullMaterial, stripeMaterial, side) {
  const hull = new THREE.Mesh(new THREE.BoxGeometry(width, height, length), hullMaterial);
  hull.position.y = height * 0.5;
  hull.castShadow = true;
  hull.receiveShadow = true;
  group.add(hull);

  const bow = new THREE.Mesh(new THREE.ConeGeometry(width * 0.5, length * 0.13, 4), hullMaterial);
  bow.rotation.x = Math.PI * 0.5;
  bow.rotation.z = Math.PI * 0.25;
  bow.position.set(0, height * 0.5, -length * 0.565);
  bow.castShadow = true;
  group.add(bow);

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(width * 1.02, height * 0.14, length * 0.92), stripeMaterial);
  stripe.position.y = height * 0.32;
  stripe.castShadow = true;
  group.add(stripe);

  const keel = new THREE.Mesh(new THREE.BoxGeometry(width * 0.72, height * 0.18, length * 0.82), materials.craneDark);
  keel.position.y = height * 0.08;
  keel.castShadow = true;
  group.add(keel);
}

function addShipBridge(group, x, y, z, width, height, depth) {
  const tower = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials.truckCab);
  tower.position.set(x, y, z);
  tower.castShadow = true;
  tower.receiveShadow = true;
  group.add(tower);

  const glass = new THREE.Mesh(new THREE.BoxGeometry(width * 0.82, height * 0.18, 0.16), materials.tourBoatGlass);
  glass.position.set(x, y + height * 0.18, z - depth * 0.52);
  group.add(glass);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(width * 1.06, height * 0.08, depth * 1.04), materials.harborRail);
  roof.position.set(x, y + height * 0.54, z);
  roof.castShadow = true;
  group.add(roof);
}

function addShipMast(group, x, y, z, height) {
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, height, 10), materials.harborRail);
  mast.position.set(x, y + height * 0.5, z);
  mast.castShadow = true;
  group.add(mast);

  const radar = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.12, 0.42), materials.harborRail);
  radar.position.set(x, y + height * 0.86, z);
  radar.castShadow = true;
  group.add(radar);
}

function addShipRails(group, width, y, length, scale) {
  for (const railX of [-width * 0.49, width * 0.49]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12 * scale, 0.12 * scale, length), materials.harborRail);
    rail.position.set(railX, y, 0);
    rail.castShadow = true;
    group.add(rail);
  }
}

function addHarborDockEdges() {
  for (const segment of currentStage.trackSegments) {
    const width = 0.5;
    for (const xOffset of [-56.1, -14.1, 14.1, 56.1]) {
      const edge = new THREE.Mesh(
        makeSlopedBoxGeometry(width, segment.zStart, segment.zEnd, segment.yStart + 0.12, segment.yEnd + 0.12, 0.26, xOffset),
        materials.harborDockDark,
      );
      edge.receiveShadow = true;
      scene.add(edge);
    }
  }
}

function addHarborWarehouse({ x, z, side, seed }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y, z), 0, 0, true);

  const depth = 22 + (seed % 3) * 3.2;
  const body = new THREE.Mesh(new THREE.BoxGeometry(12.4, 6.2, depth), materials.harborDockDark);
  body.position.y = 3.1;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(13.4, 0.68, depth + 1.2), materials.harborRail);
  roof.position.y = 6.58;
  roof.castShadow = true;
  group.add(roof);

  const doorMaterial = seed % 2 === 0 ? materials.harborRail : materials.containerTrim;
  for (const doorZ of [-7.2, 0, 7.2]) {
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.65, 3.6), doorMaterial);
    door.position.set(-side * 6.28, 1.78, doorZ);
    door.castShadow = true;
    group.add(door);
  }

  const office = new THREE.Mesh(new THREE.BoxGeometry(2.9, 1.7, 3.2), materials.truckCab);
  office.position.set(side * 4.0, 5.9, -depth * 0.24);
  office.castShadow = true;
  group.add(office);

  const trim = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.32, depth + 0.8), materials.harborRailStripe);
  trim.position.set(-side * 6.36, 4.55, 0);
  trim.castShadow = true;
  group.add(trim);

  scene.add(group);
}

function addHarborLightPole(x, z, height) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y, z), 0, 0, true);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, height, 10), materials.harborRail);
  pole.position.y = height * 0.5;
  pole.castShadow = true;
  group.add(pole);

  const armDirection = x > 0 ? -1 : 1;
  const arm = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.12, 0.12), materials.harborRail);
  arm.position.set(armDirection * 0.8, height - 0.25, 0);
  arm.castShadow = true;
  group.add(arm);

  const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.18, 0.42), materials.beachLamp);
  lamp.position.set(armDirection * 1.62, height - 0.38, 0);
  group.add(lamp);

  scene.add(group);
}

function addHarborFuelTanks({ x, z, side, seed }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y, z), 0, 0, true);

  const tankMaterial = seed % 2 === 0 ? materials.truckCab : materials.harborRail;
  for (let index = 0; index < 3; index += 1) {
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.05, 5.4, 24), tankMaterial);
    tank.position.set((index - 1) * 4.2, 2.7, 0);
    tank.castShadow = true;
    tank.receiveShadow = true;
    group.add(tank);

    const band = new THREE.Mesh(new THREE.CylinderGeometry(2.08, 2.08, 0.16, 24), materials.harborRailStripe);
    band.position.set((index - 1) * 4.2, 4.5, 0);
    band.castShadow = true;
    group.add(band);
  }

  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 12.6, 12), materials.craneDark);
  pipe.rotation.z = Math.PI * 0.5;
  pipe.position.set(0, 0.82, side * 2.5);
  pipe.castShadow = true;
  group.add(pipe);

  scene.add(group);
}

function addHarborPipeRack({ x, z, seed }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y, z), 0, 0, true);

  for (const postX of [-2.8, 2.8]) {
    for (const postZ of [-3.8, 3.8]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.4, 0.18), materials.harborRail);
      post.position.set(postX, 1.2, postZ);
      post.castShadow = true;
      group.add(post);
    }
  }

  for (let level = 0; level < 4; level += 1) {
    for (let index = 0; index < 3; index += 1) {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 8.0, 10), seed % 2 === 0 ? materials.containerTrim : materials.harborRail);
      pipe.rotation.x = Math.PI * 0.5;
      pipe.position.set((index - 1) * 1.35, 0.68 + level * 0.42, 0);
      pipe.castShadow = true;
      group.add(pipe);
    }
  }

  scene.add(group);
}

function addHarborMooredShip({ x, z, side, seed }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y - 2.2, z), 0, 0, true);

  const hull = new THREE.Mesh(new THREE.BoxGeometry(14.5, 4.0, 58), seed % 2 === 0 ? materials.tourBoatNavy : materials.containerBlue);
  hull.position.y = 1.9;
  hull.castShadow = true;
  hull.receiveShadow = true;
  group.add(hull);

  const deck = new THREE.Mesh(new THREE.BoxGeometry(13.2, 0.38, 52), materials.harborDock);
  deck.position.y = 4.05;
  deck.castShadow = true;
  group.add(deck);

  const bowBlock = new THREE.Mesh(new THREE.BoxGeometry(9.8, 2.2, 8.0), materials.tourBoatHull);
  bowBlock.position.set(0, 4.65, -23.0);
  bowBlock.castShadow = true;
  group.add(bowBlock);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(6.8, 3.35, 7.6), materials.truckCab);
  cabin.position.set(side * 1.0, 5.8, -15.8);
  cabin.castShadow = true;
  group.add(cabin);

  const bridgeGlass = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.82, 0.12), materials.tourBoatGlass);
  bridgeGlass.position.set(side * 1.0, 6.4, -19.66);
  group.add(bridgeGlass);

  for (let railZ = -23; railZ <= 23; railZ += 5.6) {
    for (const railX of [-6.9, 6.9]) {
      const railPost = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 0.12), materials.harborRail);
      railPost.position.set(railX, 4.62, railZ);
      railPost.castShadow = true;
      group.add(railPost);
    }
  }

  for (const railX of [-6.9, 6.9]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 48), materials.harborRail);
    rail.position.set(railX, 5.05, 1);
    rail.castShadow = true;
    group.add(rail);
  }

  for (let index = 0; index < 10; index += 1) {
    const container = createHarborContainer(seed + index);
    container.scale.set(0.82, 0.82, 0.82);
    container.position.set(
      (index % 3 - 1) * 3.0,
      5.25 + Math.floor(index / 6) * 2.2,
      -5.5 + (index % 5) * 4.8,
    );
    group.add(container);
  }

  scene.add(group);
}

function addHarborServiceGate(z, seed) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  setStageObjectTransform(group, new THREE.Vector3(0, sample.y, z), 0, 0, true);

  for (const x of [-13.35, 13.35]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.32, 6.4, 0.32), materials.harborRail);
    post.position.set(x, 3.2, 0);
    post.castShadow = true;
    group.add(post);
  }

  const beam = new THREE.Mesh(new THREE.BoxGeometry(27.8, 0.34, 0.44), materials.harborRail);
  beam.position.y = 6.25;
  beam.castShadow = true;
  group.add(beam);

  const sign = new THREE.Mesh(new THREE.BoxGeometry(8.8, 1.05, 0.18), materials.roadSign);
  sign.position.set(0, 5.48, -0.1);
  sign.castShadow = true;
  group.add(sign);

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.12, 0.2), seed % 2 === 0 ? materials.harborRailStripe : materials.dashPad);
  stripe.position.set(0, 5.48, -0.22);
  group.add(stripe);

  scene.add(group);
}

function addHarborContainerStack(x, z, layers, seed) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y, z), 0, 0, true);

  for (let layer = 0; layer < layers; layer += 1) {
    const container = createHarborContainer(seed + layer);
    container.position.set(
      layer % 2 === 0 ? 0 : 0.24,
      harborContainerSize.height * 0.5 + layer * (harborContainerSize.height + harborContainerSize.stackGap),
      layer % 2 === 0 ? 0 : -0.3,
    );
    if ((seed + layer) % 3 === 0) container.rotation.y = Math.PI * 0.5;
    group.add(container);
  }

  scene.add(group);
}

function addDenseHarborContainers(harborEndZ = stageEndZ) {
  const containerMaterials = [
    materials.containerRed,
    materials.containerBlue,
    materials.containerYellow,
    materials.containerGreen,
  ];
  const chunks = new Map();
  const xColumns = [-49, -43.5, -38, 38, 43.5, 49];
  let seed = 0;

  const getChunk = (z) => {
    const chunkIndex = Math.floor(Math.max(0, stageStartZ - z) / harborContainerChunkSize);
    if (!chunks.has(chunkIndex)) {
      chunks.set(chunkIndex, {
        index: chunkIndex,
        minZ: Infinity,
        maxZ: -Infinity,
        slots: containerMaterials.map(() => []),
      });
    }

    const chunk = chunks.get(chunkIndex);
    chunk.minZ = Math.min(chunk.minZ, z);
    chunk.maxZ = Math.max(chunk.maxZ, z);
    return chunk;
  };

  for (let row = 0; ; row += 1) {
    const z = -52 - row * 48;
    if (z < harborEndZ + 80) break;
    const yardPhase = ((Math.abs(z) + 120) % 760);
    const inContainerYard = yardPhase < 285 || (yardPhase > 560 && yardPhase < 650);
    if (!inContainerYard) continue;

    const sample = getGroundSample(0, z);
    if (!sample) continue;

    for (let column = 0; column < xColumns.length; column += 1) {
      if ((row + column) % 7 === 0) continue;

      const x = xColumns[column] + ((row + column) % 2 === 0 ? -0.45 : 0.45);
      const layers = (row + column) % 5 === 0 ? 2 : 1;
      for (let layer = 0; layer < layers; layer += 1) {
        const materialIndex = seed % containerMaterials.length;
        const itemZ = z - (column % 3) * 3.4;
        getChunk(itemZ).slots[materialIndex].push({
          x,
          z: itemZ,
          y: sample.y + harborContainerSize.height * 0.5 + layer * (harborContainerSize.height + harborContainerSize.stackGap),
          rotationY: (row + column + layer) % 4 === 0 ? Math.PI * 0.5 : 0,
        });
        seed += 1;
      }
    }
  }

  const instanceObject = new THREE.Object3D();
  Array.from(chunks.values())
    .sort((a, b) => a.index - b.index)
    .forEach((chunk) => {
      const group = new THREE.Group();
      group.name = `Harbor Container Chunk ${chunk.index}`;

      chunk.slots.forEach((items, materialIndex) => {
        if (items.length === 0) return;

        const mesh = new THREE.InstancedMesh(harborContainerGeometry, containerMaterials[materialIndex], items.length);
        mesh.name = "Harbor Container Instances";
        mesh.castShadow = false;
        mesh.receiveShadow = true;
        items.forEach((item, index) => {
          const frame = getStageFrame(item.z, true);
          instanceObject.position.copy(frame.center)
            .addScaledVector(frame.right, item.x)
            .addScaledVector(frame.up, item.y);
          instanceObject.quaternion.copy(getStageQuaternion(frame));
          instanceObject.rotateY(item.rotationY);
          instanceObject.updateMatrix();
          mesh.setMatrixAt(index, instanceObject.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
        mesh.computeBoundingBox?.();
        mesh.computeBoundingSphere?.();
        group.add(mesh);
      });

      if (group.children.length === 0) return;

      scene.add(group);
      harborContainerChunks.push({
        group,
        minZ: chunk.minZ,
        maxZ: chunk.maxZ,
      });
    });

  updateHarborVisibility(true);
}

function createHarborContainer(seed) {
  const colorMaterials = [
    materials.containerRed,
    materials.containerBlue,
    materials.containerYellow,
    materials.containerGreen,
  ];
  const group = new THREE.Group();
  const body = new THREE.Mesh(harborContainerGeometry, colorMaterials[seed % colorMaterials.length]);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const halfW = harborContainerSize.width * 0.5;
  const halfL = harborContainerSize.length * 0.5;
  const halfH = harborContainerSize.height * 0.5;

  for (let i = -1; i <= 1; i += 1) {
    const rib = new THREE.Mesh(harborContainerRibGeometry, materials.containerTrim);
    rib.position.x = i * halfW * 0.72;
    rib.castShadow = true;
    group.add(rib);
  }

  for (const x of [-halfW - 0.04, halfW + 0.04]) {
    for (const z of [-halfL - 0.04, halfL + 0.04]) {
      const corner = new THREE.Mesh(new THREE.BoxGeometry(0.16, harborContainerSize.height + 0.18, 0.16), materials.containerTrim);
      corner.position.set(x, 0, z);
      corner.castShadow = true;
      group.add(corner);
    }
  }

  for (const y of [-halfH - 0.04, halfH + 0.04]) {
    const topBottomX = new THREE.Mesh(new THREE.BoxGeometry(harborContainerSize.width + 0.18, 0.12, 0.14), materials.containerTrim);
    for (const z of [-halfL - 0.04, halfL + 0.04]) {
      const rail = topBottomX.clone();
      rail.position.set(0, y, z);
      rail.castShadow = true;
      group.add(rail);
    }

    const topBottomZ = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, harborContainerSize.length + 0.18), materials.containerTrim);
    for (const x of [-halfW - 0.04, halfW + 0.04]) {
      const rail = topBottomZ.clone();
      rail.position.set(x, y, 0);
      rail.castShadow = true;
      group.add(rail);
    }
  }

  const door = new THREE.Mesh(harborContainerDoorGeometry, materials.containerTrim);
  door.position.z = halfL + 0.06;
  door.castShadow = true;
  group.add(door);

  for (const x of [-0.46, 0.46]) {
    const doorBar = new THREE.Mesh(new THREE.BoxGeometry(0.08, harborContainerSize.height * 0.75, 0.12), materials.harborRail);
    doorBar.position.set(x, 0, halfL + 0.13);
    doorBar.castShadow = true;
    group.add(doorBar);
  }

  const idPlate = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.32, 0.13), seed % 2 === 0 ? materials.harborRailStripe : materials.truckCab);
  idPlate.position.set(-halfW - 0.08, halfH * 0.42, -halfL * 0.2);
  idPlate.castShadow = true;
  group.add(idPlate);

  return group;
}

function addHarborCrane({ x, z, side, phase }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y, z), 0, 0, true);

  const legGeometry = new THREE.BoxGeometry(0.82, 20, 0.82);
  for (const legX of [-4.6, 4.6]) {
    for (const legZ of [-3.1, 3.1]) {
      const leg = new THREE.Mesh(legGeometry, materials.crane);
      leg.position.set(legX, 10, legZ);
      leg.castShadow = true;
      group.add(leg);

      const wheelBase = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.38, 1.25), materials.craneDark);
      wheelBase.position.set(legX, 0.26, legZ);
      wheelBase.castShadow = true;
      group.add(wheelBase);
    }
  }

  const topBeam = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.72, 1.05), materials.crane);
  topBeam.position.set(0, 20.2, -3.1);
  topBeam.castShadow = true;
  group.add(topBeam);

  const rearBeam = topBeam.clone();
  rearBeam.position.z = 3.1;
  group.add(rearBeam);

  const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.62, 7.0), materials.crane);
  for (const crossX of [-4.6, 4.6]) {
    const beam = crossBeam.clone();
    beam.position.set(crossX, 19.95, 0);
    beam.castShadow = true;
    group.add(beam);
  }

  for (const braceX of [-3.2, 3.2]) {
    for (const braceZ of [-3.1, 3.1]) {
      const brace = new THREE.Mesh(new THREE.BoxGeometry(0.24, 13.5, 0.24), materials.craneDark);
      brace.position.set(braceX, 10.2, braceZ);
      brace.rotation.z = braceX < 0 ? -0.22 : 0.22;
      brace.castShadow = true;
      group.add(brace);
    }
  }

  const boomPivot = new THREE.Group();
  boomPivot.position.set(0, 21.25, -3.1);
  const boom = new THREE.Mesh(new THREE.BoxGeometry(42, 0.46, 0.52), materials.crane);
  boom.position.x = -side * 18.4;
  boom.castShadow = true;
  boomPivot.add(boom);

  const boomTop = new THREE.Mesh(new THREE.BoxGeometry(38, 0.18, 0.2), materials.craneDark);
  boomTop.position.set(-side * 17.2, 0.72, 0);
  boomTop.castShadow = true;
  boomPivot.add(boomTop);

  const counter = new THREE.Mesh(new THREE.BoxGeometry(6.8, 1.25, 1.25), materials.craneDark);
  counter.position.x = side * 4.6;
  counter.castShadow = true;
  boomPivot.add(counter);

  const trolley = new THREE.Group();
  const trolleyBody = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.82, 1.05), materials.craneDark);
  trolleyBody.castShadow = true;
  trolley.add(trolleyBody);
  const cable = new THREE.Mesh(new THREE.BoxGeometry(0.08, 11.2, 0.08), materials.craneDark);
  cable.position.y = -6.0;
  trolley.add(cable);
  const hook = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.52, 0.52), materials.craneDark);
  hook.position.y = -11.9;
  hook.castShadow = true;
  trolley.add(hook);
  boomPivot.add(trolley);
  group.add(boomPivot);

  scene.add(group);
  harborAnimatedCranes.push({ group, z, boomPivot, trolley, side, phase, trolleyBase: 10.5, trolleyRange: 8.0 });
}

function addHarborCargoTruck({ x, zStart, zEnd, z, direction, speed, material }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  const trailer = new THREE.Mesh(new THREE.BoxGeometry(2.65, 2.55, 8.6), material);
  trailer.position.set(0, 1.9, 1.45);
  trailer.castShadow = true;
  trailer.receiveShadow = true;
  group.add(trailer);

  const trailerRoof = new THREE.Mesh(new THREE.BoxGeometry(2.75, 0.12, 8.7), materials.containerTrim);
  trailerRoof.position.set(0, 3.24, 1.45);
  trailerRoof.castShadow = true;
  group.add(trailerRoof);

  for (const stripeY of [1.35, 2.38]) {
    const sideStripeLeft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.11, 8.72), materials.containerTrim);
    sideStripeLeft.position.set(-1.36, stripeY, 1.45);
    sideStripeLeft.castShadow = true;
    group.add(sideStripeLeft);
    const sideStripeRight = sideStripeLeft.clone();
    sideStripeRight.position.x = 1.36;
    group.add(sideStripeRight);
  }

  const cab = new THREE.Mesh(new THREE.BoxGeometry(2.45, 2.35, 2.6), materials.truckCab);
  cab.position.set(0, 1.62, -4.55);
  cab.castShadow = true;
  group.add(cab);

  const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(2.28, 0.24, 2.05), materials.harborRail);
  cabRoof.position.set(0, 2.92, -4.62);
  cabRoof.castShadow = true;
  group.add(cabRoof);

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.72, 0.08), materials.tourBoatGlass);
  windshield.position.set(0, 2.05, -5.88);
  windshield.castShadow = false;
  group.add(windshield);

  for (const side of [-1, 1]) {
    const sideWindow = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.54, 0.76), materials.tourBoatGlass);
    sideWindow.position.set(side * 1.26, 2.02, -4.78);
    sideWindow.castShadow = false;
    group.add(sideWindow);

    const mirrorArm = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.05), materials.craneDark);
    mirrorArm.position.set(side * 1.38, 1.98, -5.58);
    mirrorArm.castShadow = true;
    group.add(mirrorArm);

    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.22), materials.craneDark);
    mirror.position.set(side * 1.64, 1.98, -5.58);
    mirror.castShadow = true;
    group.add(mirror);

    const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.18, 0.08), materials.beachLamp);
    headlight.position.set(side * 0.62, 0.82, -5.92);
    group.add(headlight);
  }

  const bumper = new THREE.Mesh(new THREE.BoxGeometry(2.38, 0.28, 0.22), materials.craneDark);
  bumper.position.set(0, 0.72, -6.03);
  bumper.castShadow = true;
  group.add(bumper);

  const wheels = [];
  for (const wheelX of [-1.42, 1.42]) {
    for (const wheelZ of [-5.25, -3.75, 0.9, 3.65, 5.25]) {
      const wheel = new THREE.Mesh(harborWheelGeometry, materials.tire);
      wheel.rotation.z = Math.PI * 0.5;
      wheel.position.set(wheelX, 0.52, wheelZ);
      wheel.castShadow = true;
      group.add(wheel);
      wheels.push(wheel);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.44, 14), materials.harborRail);
      hub.rotation.z = Math.PI * 0.5;
      hub.position.copy(wheel.position);
      hub.castShadow = true;
      group.add(hub);
    }
  }

  scene.add(group);
  const truck = {
    mesh: group,
    wheels,
    x,
    z,
    minZ: Math.min(zStart, zEnd),
    maxZ: Math.max(zStart, zEnd),
    direction,
    speed,
  };
  harborCargoTrucks.push(truck);
  updateHarborVehicleTransform(truck);
}

function addHarborExcavator({ x, z, phase }) {
  const sample = getGroundSample(0, z);
  if (!sample) return;

  const group = new THREE.Group();
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y, z), 0, 0, true);

  const base = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.75, 3.2), materials.tire);
  base.position.y = 0.46;
  base.castShadow = true;
  group.add(base);

  const bodyPivot = new THREE.Group();
  bodyPivot.position.y = 1.45;
  const body = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.65, 2.55), materials.excavatorBody);
  body.castShadow = true;
  bodyPivot.add(body);

  const armPivot = new THREE.Group();
  armPivot.position.set(0.84, 0.55, -0.2);
  const boom = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.58, 6.2), materials.excavatorArm);
  boom.position.z = -2.85;
  boom.rotation.x = -0.35;
  boom.castShadow = true;
  armPivot.add(boom);
  const bucket = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.68, 1.05), materials.craneDark);
  bucket.position.set(0, -0.58, -5.95);
  bucket.castShadow = true;
  armPivot.add(bucket);
  bodyPivot.add(armPivot);
  group.add(bodyPivot);

  scene.add(group);
  harborExcavators.push({ group, z, bodyPivot, armPivot, phase });
}

function updateHarborVisibility(force = false) {
  if (!currentStage.harborTheme) return;

  harborVisibilityState.frame += 1;
  const playerZ = player.position.z;
  const viewDistance = graphicsSettings.viewDistance;
  const needsUpdate = force
    || harborVisibilityState.frame % 8 === 0
    || Math.abs(playerZ - harborVisibilityState.lastPlayerZ) > 70
    || viewDistance !== harborVisibilityState.lastViewDistance;
  if (!needsUpdate) return;

  harborVisibilityState.lastPlayerZ = playerZ;
  harborVisibilityState.lastViewDistance = viewDistance;

  const containerForwardRange = harborContainerVisibilityRanges[viewDistance] ?? harborContainerVisibilityRanges.high;
  const containerBackwardRange = Math.min(900, containerForwardRange * 0.45);
  for (const chunk of harborContainerChunks) {
    chunk.group.visible = isHarborZRangeVisible(
      chunk.minZ,
      chunk.maxZ,
      playerZ,
      containerForwardRange,
      containerBackwardRange,
    );
  }

  const animatedForwardRange = harborAnimatedVisibilityRanges[viewDistance] ?? harborAnimatedVisibilityRanges.high;
  const animatedBackwardRange = Math.min(700, animatedForwardRange * 0.35);
  for (const crane of harborAnimatedCranes) {
    crane.active = isHarborZVisible(crane.z, playerZ, animatedForwardRange, animatedBackwardRange);
    crane.group.visible = crane.active;
  }
  for (const truck of harborCargoTrucks) {
    truck.active = isHarborZVisible(truck.z, playerZ, animatedForwardRange, animatedBackwardRange);
    truck.mesh.visible = truck.active;
  }
  for (const excavator of harborExcavators) {
    excavator.active = isHarborZVisible(excavator.z, playerZ, animatedForwardRange, animatedBackwardRange);
    excavator.group.visible = excavator.active;
  }
}

function isHarborZVisible(z, playerZ, forwardRange, backwardRange) {
  return z >= playerZ - forwardRange && z <= playerZ + backwardRange;
}

function isHarborZRangeVisible(minZ, maxZ, playerZ, forwardRange, backwardRange) {
  return maxZ >= playerZ - forwardRange && minZ <= playerZ + backwardRange;
}

function advanceHarborTruckRoute(truck, dt) {
  truck.z += truck.direction * truck.speed * dt;
  if (truck.z < truck.minZ) {
    truck.z = truck.minZ;
    truck.direction = 1;
  } else if (truck.z > truck.maxZ) {
    truck.z = truck.maxZ;
    truck.direction = -1;
  }
}

function updateStageThreeHarbor(dt) {
  if (!currentStage.harborTheme) return;

  harborTime += dt;
  updateHarborVisibility();

  for (const crane of harborAnimatedCranes) {
    if (!crane.active) continue;
    crane.boomPivot.rotation.y = Math.sin(harborTime * 0.48 + crane.phase) * 0.045;
    crane.trolley.position.x = -crane.side * (
      (crane.trolleyBase ?? 4.2) + Math.sin(harborTime * 0.78 + crane.phase) * (crane.trolleyRange ?? 3.3)
    );
  }

  for (const truck of harborCargoTrucks) {
    advanceHarborTruckRoute(truck, dt);
    if (!truck.active) continue;
    for (const wheel of truck.wheels) {
      wheel.rotation.x += truck.direction * truck.speed * dt * 0.28;
    }
    updateHarborVehicleTransform(truck);
  }

  for (const excavator of harborExcavators) {
    if (!excavator.active) continue;
    excavator.bodyPivot.rotation.y = Math.sin(harborTime * 0.34 + excavator.phase) * 0.28;
    excavator.armPivot.rotation.x = -0.18 + Math.sin(harborTime * 0.72 + excavator.phase) * 0.18;
  }
}

function updateHarborVehicleTransform(vehicle) {
  const sample = getGroundSample(0, vehicle.z);
  if (!sample) return;

  setStageObjectTransform(vehicle.mesh, new THREE.Vector3(vehicle.x, sample.y, vehicle.z), 0, 0, true);
  if (vehicle.direction > 0) {
    vehicle.mesh.rotateY(Math.PI);
  }
}

function addTrackSegment({ zStart, zEnd, yStart, yEnd, width }) {
  let material = trackSegments.length % 2 === 0 ? materials.track : materials.trackAlt;
  const segmentMidZ = (zStart + zEnd) * 0.5;
  if (currentStage.harborTheme) {
    material = trackSegments.length % 2 === 0 ? materials.harborRoad : materials.harborRoadAlt;
  } else if (currentStage.gwangalliTheme) {
    const inTunnel = isStageZInRange(segmentMidZ, getGwangalliTunnelStartZ(), currentStage.gwangalliTunnelEndZ ?? currentStage.goalZ);
    material = inTunnel ? materials.gwangalliTunnelRoad : materials.gwangalliRoad;
  }
  const track = new THREE.Mesh(
    makeSlopedBoxGeometry(width, zStart, zEnd, yStart, yEnd, 1.25),
    material,
  );
  track.receiveShadow = true;
  track.castShadow = false;
  scene.add(track);

  const segment = { zStart, zEnd, yStart, yEnd, width, rail: true };
  trackSegments.push(segment);

  const inGwangalliTunnel = currentStage.gwangalliTheme
    && isStageZInRange(segmentMidZ, getGwangalliTunnelStartZ(), currentStage.gwangalliTunnelEndZ ?? currentStage.goalZ);
  const useDefaultRailVisuals = !(currentStage.gwangalliTheme && segmentMidZ >= getGwangalliBridgeEndZ()) && !inGwangalliTunnel;
  if (useDefaultRailVisuals) {
    addRail(segment, -width * 0.5 - 0.28);
    addRail(segment, width * 0.5 + 0.28);
  }
}

function addRail(segment, x) {
  const railMaterials = getRailMaterials();
  const rail = new THREE.Mesh(
    makeSlopedBoxGeometry(0.34, segment.zStart, segment.zEnd, segment.yStart + 0.74, segment.yEnd + 0.74, 0.4, x),
    railMaterials.base,
  );
  rail.castShadow = false;
  scene.add(rail);

  const stripe = new THREE.Mesh(
    makeSlopedBoxGeometry(0.38, segment.zStart + 5, segment.zEnd - 5, segment.yStart + 1.03, segment.yEnd + 1.03, 0.08, x),
    railMaterials.stripe,
  );
  stripe.castShadow = false;
  scene.add(stripe);
}

function getRailMaterials() {
  if (currentStage.gwangalliTheme) {
    return {
      base: materials.gwangalliRail,
      stripe: materials.gwangalliRailStripe,
    };
  }

  if (currentStage.harborTheme) {
    return {
      base: materials.harborRail,
      stripe: materials.harborRailStripe,
    };
  }

  return {
    base: materials.rail,
    stripe: materials.railStripe,
  };
}

function makeSlopedBoxGeometry(width, zStart, zEnd, yStart, yEnd, thickness, xOffset = 0) {
  const half = width * 0.5;
  const steps = Math.max(1, Math.ceil(Math.abs(zStart - zEnd) / 8));
  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const z = THREE.MathUtils.lerp(zStart, zEnd, t);
    const y = THREE.MathUtils.lerp(yStart, yEnd, t);
    const row = [
      new THREE.Vector3(xOffset - half, y, z),
      new THREE.Vector3(xOffset + half, y, z),
      new THREE.Vector3(xOffset - half, y - thickness, z),
      new THREE.Vector3(xOffset + half, y - thickness, z),
    ];

    for (const local of row) {
      const world = toWorldPosition(local, true);
      vertices.push(world.x, world.y, world.z);
      uvs.push(local.x / roadTextureTileMeters, -z / roadTextureTileMeters);
    }
  }

  for (let i = 0; i < steps; i += 1) {
    const a = i * 4;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    const e = a + 4;
    const f = a + 5;
    const g = a + 6;
    const h = a + 7;
    indices.push(
      a, b, f, a, f, e,
      c, g, h, c, h, d,
      c, a, e, c, e, g,
      b, d, h, b, h, f,
    );
  }

  const start = 0;
  const end = steps * 4;
  indices.push(
    start, start + 2, start + 3, start, start + 3, start + 1,
    end, end + 1, end + 3, end, end + 3, end + 2,
  );

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
  geometry.setAttribute("uv2", new THREE.BufferAttribute(new Float32Array(uvs), 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createPickupClusterGeometry() {
  const parts = [
    {
      geometry: new THREE.IcosahedronGeometry(0.31, 1),
      color: pickupClusterColors[0],
      scale: [1.08, 0.96, 1.0],
      position: [-0.34, 0.02, 0.02],
      rotation: [0.18, -0.24, 0.12],
    },
    {
      geometry: new THREE.IcosahedronGeometry(0.34, 1),
      color: pickupClusterColors[1],
      scale: [1.0, 1.12, 0.98],
      position: [0.02, 0.26, -0.02],
      rotation: [-0.12, 0.28, -0.16],
    },
    {
      geometry: new THREE.IcosahedronGeometry(0.31, 1),
      color: pickupClusterColors[2],
      scale: [1.06, 0.98, 1.02],
      position: [0.36, 0.02, 0.04],
      rotation: [0.24, 0.18, -0.1],
    },
  ];

  for (const part of parts) {
    part.geometry.scale(...part.scale);
    part.geometry.rotateX(part.rotation[0]);
    part.geometry.rotateY(part.rotation[1]);
    part.geometry.rotateZ(part.rotation[2]);
    part.geometry.translate(...part.position);
  }

  return mergeColoredGeometries(parts);
}

function mergeColoredGeometries(parts) {
  const positions = [];
  const colors = [];

  for (const part of parts) {
    const { color, geometry: source } = part;
    const geometry = source.index ? source.toNonIndexed() : source;
    const position = geometry.getAttribute("position");
    for (let i = 0; i < position.count; i += 1) {
      positions.push(position.getX(i), position.getY(i), position.getZ(i));
      colors.push(color.r, color.g, color.b);
    }
    if (geometry !== source) {
      geometry.dispose();
    }
    source.dispose();
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
  merged.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3));
  merged.computeVertexNormals();
  merged.computeBoundingSphere();
  return merged;
}

function addDnaItems() {
  const addDnaItem = (x, z, lift = 1.42) => {
    if (!isDnaPlacementClear(x, z)) return;

    const sample = getGroundSample(x, z);
    if (!sample) return;

    const localPosition = new THREE.Vector3(x, sample.y + lift, z);
    const frame = getStageFrame(z, true);
    const basePosition = frame.center.clone()
      .addScaledVector(frame.right, localPosition.x)
      .addScaledVector(frame.up, localPosition.y);
    dnaItems.push({
      index: dnaItems.length,
      localPosition,
      basePosition,
      baseQuaternion: getStageQuaternion(frame),
      up: frame.up.clone(),
      collected: false,
      spin: 1 + Math.random() * 0.8,
      spinAngle: 0,
      bobPhase: Math.random() * Math.PI * 2,
    });
  };

  const addLaneTrail = (lane, zStart, count, spacing = 5.0) => {
    for (let i = 0; i < count; i += 1) {
      addDnaItem(lanes[lane], zStart - i * spacing);
    }
  };

  const addRows = (zStart, rowCount, spacing = 9.0) => {
    for (let i = 0; i < rowCount; i += 1) {
      const z = zStart - i * spacing;
      for (const x of lanes) {
        addDnaItem(x, z);
      }
    }
  };

  const addLaneSwitch = (pattern, zStart, count, spacing = 5.0) => {
    for (let i = 0; i < count; i += 1) {
      addDnaItem(lanes[pattern[i % pattern.length]], zStart - i * spacing);
    }
  };

  for (const plan of currentStage.dnaPlan) {
    if (plan.type === "trail") {
      addLaneTrail(plan.lane, plan.zStart, plan.count, plan.spacing);
    } else if (plan.type === "rows") {
      addRows(plan.zStart, plan.rowCount, plan.spacing);
    } else if (plan.type === "switch") {
      addLaneSwitch(plan.pattern, plan.zStart, plan.count, plan.spacing);
    }
  }

  dnaInstances = new THREE.InstancedMesh(dnaGeometry, materials.dna, dnaItems.length);
  dnaInstances.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  dnaInstances.castShadow = false;
  dnaInstances.receiveShadow = false;
  scene.add(dnaInstances);

  refreshDnaInstances();
}

function isDnaPlacementClear(x, z) {
  const clearOfDashPads = !dashPadPlacements.some((placement) => (
    Math.abs(x - lanes[placement.lane]) < 0.01 && Math.abs(z - placement.z) <= 3.7
  ));
  const clearOfObstacles = !obstaclePlacements.some((placement) => (
    placement.lanes.some((lane) => Math.abs(x - lanes[lane]) < 0.01)
      && Math.abs(z - placement.z) <= 5.8
      && !isRollClearZone(placement.z)
  ));
  return clearOfDashPads && clearOfObstacles;
}

function addDashPads() {
  for (const placement of dashPadPlacements) {
    createDashPad(lanes[placement.lane], placement.z);
  }
}

function createDashPad(x, z) {
  const sample = getGroundSample(x, z);
  if (!sample) return;

  const group = new THREE.Group();
  setStageObjectTransform(group, new THREE.Vector3(x, sample.y + 0.09, z), 0, 0, true);

  const pad = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.16, 6.1), materials.dashPad);
  pad.castShadow = false;
  pad.receiveShadow = true;
  group.add(pad);

  for (let i = 0; i < 3; i += 1) {
    const arrow = new THREE.Mesh(makeArrowGeometry(1.0, 1.15), materials.dashArrow);
    arrow.rotation.x = -Math.PI / 2;
    arrow.position.set(0, 0.11, 1.4 - i * 1.45);
    group.add(arrow);
  }

  scene.add(group);
  dashPads.push({
    mesh: group,
    position: new THREE.Vector3(x, sample.y + 0.42, z),
    radius: 3.2,
    cooldown: 0,
  });
}

function makeArrowGeometry(width, length) {
  const shape = new THREE.Shape();
  shape.moveTo(0, length * 0.5);
  shape.lineTo(width * 0.5, -length * 0.1);
  shape.lineTo(width * 0.2, -length * 0.1);
  shape.lineTo(width * 0.2, -length * 0.5);
  shape.lineTo(-width * 0.2, -length * 0.5);
  shape.lineTo(-width * 0.2, -length * 0.1);
  shape.lineTo(-width * 0.5, -length * 0.1);
  shape.lineTo(0, length * 0.5);
  return new THREE.ShapeGeometry(shape);
}

function addObstacles() {
  for (const placement of obstaclePlacements) {
    if (isRollClearZone(placement.z)) continue;

    for (const lane of placement.lanes) {
      createObstacle(lanes[lane], placement.z, 2.45, placement.height, 2.25);
    }
  }
}

function isRollClearZone(z) {
  return z <= rollClearStartZ && z >= rollClearEndZ;
}

function createObstacle(x, z, width, height, depth) {
  const sample = getGroundSample(x, z);
  if (!sample) return;

  const group = new THREE.Group();
  const localPosition = new THREE.Vector3(x, sample.y + height * 0.5, z);
  setStageObjectTransform(group, localPosition, 0, 0, true);

  const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials.obstacle);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.22, 0.18, depth + 0.22),
    materials.obstacleDark,
  );
  cap.position.y = height * 0.5 + 0.08;
  cap.castShadow = true;
  group.add(cap);

  for (let i = -1; i <= 1; i += 1) {
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.18, height * 0.72, 0.08),
      materials.obstacleStripe,
    );
    stripe.position.set(i * width * 0.28, 0, depth * 0.5 + 0.05);
    stripe.rotation.z = -0.35;
    group.add(stripe);
  }

  scene.add(group);
  obstacles.push({
    mesh: group,
    position: localPosition,
    basePosition: group.position.clone(),
    baseQuaternion: group.quaternion.clone(),
    size: new THREE.Vector3(width, height, depth),
  });
}

function addGoal() {
  const z = goalZ;
  const sample = getGroundSample(0, z);
  const y = sample.y + 5.8;

  const goal = new THREE.Group();
  setStageObjectTransform(goal, new THREE.Vector3(0, y, z), 0, 0, true);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(8.2, 0.32, 18, 72), materials.goal);
  ring.castShadow = true;
  goal.add(ring);

  const poleGeometry = new THREE.CylinderGeometry(0.22, 0.22, 11.8, 14);
  const leftPole = new THREE.Mesh(poleGeometry, materials.rail);
  const rightPole = leftPole.clone();
  leftPole.position.set(-8.2, -0.15, 0);
  rightPole.position.set(8.2, -0.15, 0);
  goal.add(leftPole, rightPole);

  const checkerBlack = new THREE.MeshStandardMaterial({ color: 0x11151b, roughness: 0.55 });
  const checkerWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45 });
  for (let x = -2; x <= 1; x += 1) {
    for (let yy = 0; yy < 2; yy += 1) {
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(1.05, 0.64, 0.1),
        (x + yy) % 2 === 0 ? checkerWhite : checkerBlack,
      );
      tile.position.set(x * 1.05 + 0.52, 5.1 - yy * 0.64, 0.04);
      goal.add(tile);
    }
  }

  scene.add(goal);
}

function addPlayer() {
  const group = new THREE.Group();
  const model = new THREE.Group();
  model.position.y = 0.1;
  group.add(model);
  const energyLines = [];

  addBox(model, 0.68, 0.78, 0.42, materials.jetHoodie, 0, 0.13, 0);
  addBox(model, 0.74, 0.12, 0.48, materials.jetHoodieShadow, 0, -0.31, 0);
  addBox(model, 0.03, 0.68, 0.024, materials.jetHarness, 0, 0.15, -0.226);
  addBox(model, 0.04, 0.52, 0.028, materials.jetAccentRed, -0.36, -0.02, -0.16);
  addBox(model, 0.04, 0.52, 0.028, materials.jetAccentRed, 0.36, -0.02, -0.16);

  const hoodBack = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 16), materials.jetHoodie);
  hoodBack.scale.set(1.08, 0.56, 0.72);
  hoodBack.position.set(0, 0.56, 0.2);
  model.add(hoodBack);

  const hoodCollar = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.055, 10, 32), materials.jetHoodieShadow);
  hoodCollar.position.set(0, 0.55, -0.02);
  hoodCollar.rotation.x = Math.PI / 2;
  hoodCollar.scale.set(1.12, 0.76, 1);
  model.add(hoodCollar);

  const innerCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.18, 16), materials.jetHarness);
  innerCollar.position.set(0, 0.51, -0.04);
  model.add(innerCollar);

  addJetHarness(model, energyLines);

  const head = new THREE.Group();
  head.position.set(0, 0.89, -0.12);
  model.add(head);

  const face = new THREE.Mesh(new THREE.SphereGeometry(0.26, 32, 20), materials.jetSkin);
  face.scale.set(0.84, 1.06, 0.78);
  head.add(face);

  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.28, 28, 16), materials.jetHair);
  hairCap.scale.set(0.96, 0.66, 0.9);
  hairCap.position.set(0, 0.12, 0.01);
  head.add(hairCap);

  addJetHair(head);

  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 10), materials.eyeWhite);
    eye.scale.set(1.45, 0.72, 0.22);
    eye.position.set(side * 0.085, 0.03, -0.205);
    head.add(eye);

    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 8), materials.jetEyeBlue);
    iris.scale.set(0.9, 1.05, 0.28);
    iris.position.set(side * 0.085, 0.025, -0.224);
    head.add(iris);
  }

  const neck = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.18, 6, 10), materials.jetSkin);
  neck.position.set(0, 0.52, -0.06);
  model.add(neck);

  const armLeft = createArm(-1, energyLines);
  const armRight = createArm(1, energyLines);
  const legLeft = createLeg(-1, energyLines);
  const legRight = createLeg(1, energyLines);
  model.add(armLeft, armRight, legLeft, legRight);

  addJetEnergyLine(energyLines, model, 0.56, 0.024, 0.02, 0, 0.61, -0.285);

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = !child.userData.energyLine;
      child.receiveShadow = !child.userData.energyLine;
    }
  });

  scene.add(group);
  player.mesh = group;
  player.parts = {
    model,
    arms: [armLeft, armRight],
    legs: [legLeft, legRight],
    head,
    energyLines,
  };
}

function addBox(parent, width, height, depth, material, x, y, z, rx = 0, ry = 0, rz = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  parent.add(mesh);
  return mesh;
}

function addJetHarness(parent, energyLines) {
  addBox(parent, 0.075, 0.78, 0.052, materials.jetHarness, -0.24, 0.18, -0.254, 0, 0, -0.08);
  addBox(parent, 0.075, 0.78, 0.052, materials.jetHarness, 0.24, 0.18, -0.254, 0, 0, 0.08);
  addBox(parent, 0.66, 0.085, 0.062, materials.jetHarness, 0, 0.16, -0.286);
  addBox(parent, 0.18, 0.12, 0.075, materials.jetHarnessPlate, 0, 0.16, -0.325);

  addBox(parent, 0.08, 0.76, 0.056, materials.jetHarness, -0.22, 0.2, 0.248, 0, 0, 0.36);
  addBox(parent, 0.08, 0.76, 0.056, materials.jetHarness, 0.22, 0.2, 0.248, 0, 0, -0.36);
  addBox(parent, 0.26, 0.34, 0.08, materials.jetHarnessPlate, 0, 0.24, 0.31);
  addJetEnergyLine(energyLines, parent, 0.05, 0.24, 0.014, 0, 0.24, 0.36);
}

function addJetHair(head) {
  addHairSpike(head, -0.18, 0.18, -0.04, 0.075, 0.28, -0.55, 0.08, -0.55);
  addHairSpike(head, -0.08, 0.22, -0.09, 0.08, 0.34, -0.78, -0.1, -0.22);
  addHairSpike(head, 0.06, 0.23, -0.1, 0.085, 0.36, -0.84, 0.08, 0.18);
  addHairSpike(head, 0.18, 0.17, -0.04, 0.075, 0.28, -0.58, -0.08, 0.48);
  addHairSpike(head, -0.24, 0.08, 0.02, 0.07, 0.24, -0.15, 0.1, -0.82);
  addHairSpike(head, 0.24, 0.08, 0.02, 0.07, 0.24, -0.15, -0.1, 0.82);
  addHairSpike(head, 0, 0.23, 0.08, 0.075, 0.26, 0.3, 0, 0);
}

function addHairSpike(parent, x, y, z, radius, length, rx, ry, rz) {
  const spike = new THREE.Mesh(new THREE.ConeGeometry(radius, length, 8), materials.jetHair);
  spike.position.set(x, y, z);
  spike.rotation.set(rx, ry, rz);
  parent.add(spike);
}

function addJetEnergyLine(lines, parent, width, height, depth, x, y, z, rx = 0, ry = 0, rz = 0) {
  const line = addBox(parent, width, height, depth, materials.jetEnergy, x, y, z, rx, ry, rz);
  line.visible = false;
  line.userData.energyLine = true;
  line.userData.phase = lines.length * 0.73;
  lines.push(line);
  return line;
}

function createArm(side, energyLines) {
  const arm = new THREE.Group();
  arm.position.set(side * 0.45, 0.36, -0.02);
  arm.rotation.z = side * 0.2;

  const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(0.082, 0.46, 6, 12), materials.jetHoodie);
  sleeve.position.y = -0.23;
  sleeve.rotation.z = side * 0.06;
  arm.add(sleeve);

  addBox(arm, 0.18, 0.1, 0.16, materials.jetHarness, 0, -0.48, -0.01);
  addJetEnergyLine(energyLines, arm, 0.024, 0.24, 0.018, side * 0.062, -0.28, -0.095, 0, 0, side * 0.16);

  const glove = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 12), materials.jetHarness);
  glove.scale.set(1.08, 0.88, 0.9);
  glove.position.set(0, -0.61, -0.035);
  arm.add(glove);

  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 8), materials.jetSkin);
  palm.scale.set(1.05, 0.72, 0.5);
  palm.position.set(0, -0.62, -0.09);
  arm.add(palm);

  return arm;
}

function createLeg(side, energyLines) {
  const leg = new THREE.Group();
  leg.position.set(side * 0.2, -0.34, 0.01);

  const pants = new THREE.Mesh(new THREE.CapsuleGeometry(0.095, 0.52, 6, 12), materials.jetPants);
  pants.position.y = -0.25;
  pants.rotation.z = side * 0.04;
  leg.add(pants);

  addBox(leg, 0.04, 0.42, 0.018, materials.jetPantsTrim, side * 0.086, -0.25, -0.03, 0, 0, side * -0.08);
  addBox(leg, 0.16, 0.08, 0.16, materials.jetHarness, 0, -0.55, -0.02);

  const shoe = new THREE.Group();
  shoe.position.set(0, -0.46, -0.12);

  const sole = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.11, 0.66), materials.jetShoeSole);
  sole.position.set(0, -0.07, 0.03);
  shoe.add(sole);

  const top = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.2, 0.58), materials.jetShoeWhite);
  top.position.set(0, 0.02, -0.03);
  shoe.add(top);

  addBox(shoe, 0.34, 0.07, 0.12, materials.jetHoodieShadow, 0, 0.16, -0.12);
  addBox(shoe, 0.07, 0.1, 0.24, materials.jetAccentRed, side * 0.17, 0.02, -0.02, 0, 0.16 * side, 0);
  addBox(shoe, 0.24, 0.04, 0.34, materials.jetHarnessPlate, 0, 0.03, -0.13, 0, 0, side * 0.12);
  addJetEnergyLine(energyLines, shoe, 0.028, 0.042, 0.38, side * 0.21, 0.06, -0.04, 0, 0.08 * side, 0);

  leg.add(shoe);
  leg.shoe = shoe;
  return leg;
}

function addTrail() {
  const geometry = new THREE.SphereGeometry(0.5, 18, 12);
  for (let i = 0; i < 18; i += 1) {
    const material = new THREE.MeshBasicMaterial({
      color: 0x91e9ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const ghost = new THREE.Mesh(geometry, material);
    ghost.visible = false;
    scene.add(ghost);
    trail.push({ mesh: ghost, life: 0 });
  }
}

function bindInput() {
  window.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "KeyQ", "KeyE", "KeyI", "KeyJ", "KeyK", "KeyL", "KeyO", "KeyU", "KeyP", "Escape"].includes(event.code)) {
      event.preventDefault();
    }
    if ((event.code === "KeyP" || event.code === "Escape") && !event.repeat) {
      setPaused(!isPaused, "manual");
      return;
    }
    if (isPaused) return;
    if (event.code === "KeyM" && !keys.has("KeyM")) {
      toggleMusic();
    } else if (musicWanted && isGameplayKey(event.code)) {
      startMusic();
    }
    if (event.code === "Space" && !keys.has("Space")) {
      jumpQueued = true;
    }
    if (event.code === "KeyQ" && !keys.has("KeyQ")) {
      quickStepQueued = -1;
    }
    if (event.code === "KeyE" && !keys.has("KeyE")) {
      quickStepQueued = 1;
    }
    if (event.code === "KeyR") {
      resetGame();
    }
    if (event.code === "KeyO") {
      resetCameraView();
    }
    if (event.code === "Digit1" || event.code === "Numpad1") {
      refillBoostGauge();
    }
    keys.add(event.code);
  });

  window.addEventListener("keyup", (event) => {
    keys.delete(event.code);
  });

  bindTouchControls();
  canvas.addEventListener("pointermove", handleMouseObjectPointerMove);
  canvas.addEventListener("pointerleave", handleMouseObjectPointerLeave);
  canvas.addEventListener("pointercancel", handleMouseObjectPointerLeave);
  restartButton.addEventListener("click", resetGame);
  nextStageButton.addEventListener("click", goToNextStage);
  menuButton?.addEventListener("click", () => setMainMenuOpen(menuPanel?.classList.contains("hidden")));
  document.addEventListener("pointerdown", (event) => {
    if (!menuPanel || !menuButton || menuPanel.classList.contains("hidden")) return;
    if (menuPanel.contains(event.target) || menuButton.contains(event.target)) return;
    setMainMenuOpen(false);
  });
  stageSelectButtons.forEach((button) => {
    button.addEventListener("click", () => selectStage(button.dataset.stageSelect));
  });
  stageMenuToggle?.addEventListener("click", () => setStageMenuOpen(stageMenu?.classList.contains("hidden")));
  document.addEventListener("pointerdown", (event) => {
    if (!stageMenu || !stageMenuToggle || stageMenu.classList.contains("hidden")) return;
    if (stageMenu.contains(event.target) || stageMenuToggle.contains(event.target)) return;
    setStageMenuOpen(false);
  });
  musicButton.addEventListener("click", toggleMusic);
  graphicsButton?.addEventListener("click", () => setGraphicsPanelOpen(graphicsPanel?.classList.contains("hidden")));
  debugButton?.addEventListener("click", () => setDebugPanelOpen(debugPanel?.classList.contains("hidden")));
  pauseButton?.addEventListener("click", () => setPaused(true, "manual"));
  resumeButton?.addEventListener("click", () => setPaused(false, "manual"));
  helpButton?.addEventListener("click", () => setHelpPanelOpen(helpPanel?.classList.contains("hidden")));
  document.querySelector("[data-close-panel='graphics']")?.addEventListener("click", () => setGraphicsPanelOpen(false));
  document.querySelector("[data-close-panel='debug']")?.addEventListener("click", () => setDebugPanelOpen(false));
  document.querySelector("[data-close-panel='help']")?.addEventListener("click", () => setHelpPanelOpen(false));
  fullscreenButton?.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", updateFullscreenButton);
  document.addEventListener("visibilitychange", handleVisibilityPause);
  window.addEventListener("pagehide", handleVisibilityPause);
  window.addEventListener("blur", handleWindowBlurPause);
  bindGraphicsControls();
  bindDebugControls();
  window.addEventListener("resize", resize);
  updateMusicButton();
  updateStageSelector();
  updateFullscreenButton();
}

function handleVisibilityPause(event) {
  if ((document.hidden || event?.type === "pagehide") && !finished) {
    setPaused(true, "system");
  }
}

function handleWindowBlurPause() {
  if (touchControlsEnabled && !finished) {
    setPaused(true, "system");
  }
}

function bindTouchControls() {
  if (!touchControlsEnabled) return;

  document.body.classList.add("touch-enabled");
  updateTouchOrientationState();
  syncTouchControls();
  window.addEventListener("resize", updateTouchOrientationState);
  window.addEventListener("orientationchange", updateTouchOrientationState);
  touchControlsEl.addEventListener("contextmenu", (event) => event.preventDefault());
  canvas.addEventListener("pointerdown", handleTouchQuickStepTap);

  touchControlButtons.forEach((button) => {
    button.addEventListener("pointerdown", handleTouchControlDown);
    button.addEventListener("pointerup", handleTouchControlUp);
    button.addEventListener("pointercancel", handleTouchControlUp);
    button.addEventListener("lostpointercapture", handleTouchControlUp);
  });
}

function updateTouchOrientationState() {
  if (!touchControlsEnabled) return;

  const portrait = window.innerHeight > window.innerWidth;
  document.body.classList.toggle("portrait-touch", portrait);
  rotatePromptEl?.setAttribute("aria-hidden", portrait ? "false" : "true");
}

function handleTouchControlDown(event) {
  if (isPaused) return;

  const button = event.currentTarget;
  const control = button.dataset.touchControl;
  if (!control) return;

  event.preventDefault();
  button.setPointerCapture?.(event.pointerId);
  touchInput.activePointers.set(event.pointerId, control);
  button.classList.add("is-pressed");
  tryLockLandscape();
  if (musicWanted) startMusic();

  if (control === "jump") {
    if (!touchInput.jump) jumpQueued = true;
    touchInput.jump = true;
  } else if (control === "boost") {
    touchInput.boost = !touchInput.boost;
  } else if (control === "brake") {
    touchInput.brake = true;
  } else if (control === "forward") {
    toggleTouchAutoForward();
  }

  syncTouchControls();
}

function handleTouchControlUp(event) {
  const button = event.currentTarget;
  const control = touchInput.activePointers.get(event.pointerId) ?? button.dataset.touchControl;

  event.preventDefault();
  touchInput.activePointers.delete(event.pointerId);
  button.releasePointerCapture?.(event.pointerId);
  button.classList.remove("is-pressed");

  if (control === "jump") {
    touchInput.jump = false;
  } else if (control === "brake") {
    touchInput.brake = false;
  }

  syncTouchControls();
}

function handleTouchQuickStepTap(event) {
  if (!touchControlsEnabled || document.body.classList.contains("portrait-touch") || finished || isPaused) return;
  if (event.pointerType === "mouse") return;
  if (event.target !== canvas) return;

  event.preventDefault();
  tryLockLandscape();
  if (musicWanted) startMusic();
  quickStepQueued = event.clientX < window.innerWidth * 0.5 ? -1 : 1;
}

function toggleTouchAutoForward() {
  touchInput.autoForward = !touchInput.autoForward;
  if (!touchInput.autoForward) {
    touchInput.boost = false;
  }
  if (touchInput.autoForward && !touchInput.runStarted) {
    touchInput.runStarted = true;
    startedAt = performance.now();
  }
}

function resetTouchRunState() {
  touchInput.activePointers.clear();
  touchInput.autoForward = false;
  touchInput.runStarted = false;
  touchInput.brake = false;
  touchInput.boost = false;
  touchInput.jump = false;
  syncTouchControls();
}

function syncTouchControls() {
  if (!touchControlsEnabled) return;

  touchControlButtons.forEach((button) => {
    const isForward = button.dataset.touchControl === "forward";
    const isBoost = button.dataset.touchControl === "boost";
    const isLatched = (isForward && touchInput.autoForward) || (isBoost && touchInput.boost);
    button.classList.toggle("is-latched", isLatched);
    if (isForward || isBoost) {
      button.setAttribute("aria-pressed", isLatched ? "true" : "false");
    }
  });
}

function tryLockLandscape() {
  if (!touchControlsEnabled || !screen.orientation?.lock) return;
  try {
    screen.orientation.lock("landscape").catch(() => {});
  } catch {
    // Some mobile browsers only allow orientation lock after fullscreen.
  }
}

function tick(now = performance.now()) {
  const frameCap = getFrameCap();
  if (frameCap > 0 && lastFrameTime > 0 && now - lastFrameTime < 1000 / frameCap - 0.5) {
    requestAnimationFrame(tick);
    return;
  }
  lastFrameTime = now;

  if (isPaused) {
    clock.getDelta();
    renderGame(0);
    requestAnimationFrame(tick);
    return;
  }

  const dt = Math.min(clock.getDelta(), 0.033);
  updateGame(dt);
  renderGame(dt);
  requestAnimationFrame(tick);
}

function updateGame(dt) {
  updateDnaItems(dt);
  updateLooseDnaItems(dt);
  updateObstacles(dt);
  updateDashPads(dt);
  updateStageThreeHarbor(dt);
  updateGwangalliTourBoats(dt);
  updateWater(dt);
  updateMusicState();
  hitCooldown = Math.max(0, hitCooldown - dt);
  hitStun = Math.max(0, hitStun - dt);
  jumpImpact = Math.max(0, jumpImpact - dt * 4.8);
  quickStepCooldown = Math.max(0, quickStepCooldown - dt);
  quickStepFlash = Math.max(0, quickStepFlash - dt * 5.5);
  boostMotionBlurTarget = 0;
  playerBoostEffectActive = false;

  if (!finished) {
    updatePlayer(dt);
    checkGoal();
  } else {
    player.velocity.x *= Math.exp(-3.2 * dt);
    player.velocity.z *= Math.exp(-3.2 * dt);
    player.velocity.y += -33 * dt;
    player.position.addScaledVector(player.velocity, dt);
    snapToGround();
  }

  updateTrail(dt);
  updateTutorialPrompt();
  updateHud();
}

function updatePlayer(dt) {
  const keyboardForward = isDown("KeyW", "ArrowUp");
  const keyboardBack = isDown("KeyS", "ArrowDown");
  const touchForward = touchControlsEnabled && touchInput.autoForward && !touchInput.brake;
  const holdingForward = keyboardForward || touchForward;
  const holdingBack = keyboardBack || (touchControlsEnabled && touchInput.brake);
  const stunned = hitStun > 0;
  const brakingInput = holdingBack && !keyboardForward;
  debugSuperBoostActive = debugSettings.superBoost && isDown("KeyU");
  const keyboardBoost = isDown("ShiftLeft", "ShiftRight");
  const touchBoost = touchControlsEnabled && touchInput.boost && touchInput.autoForward;
  const boosting = !stunned && !brakingInput && (keyboardBoost || touchBoost) && boostGauge > 0;
  playerBoostEffectActive = boosting || debugSuperBoostActive;
  const strafeInput = (isDown("KeyD", "ArrowRight") ? 1 : 0) - (isDown("KeyA", "ArrowLeft") ? 1 : 0);
  const speedLimit = debugSuperBoostActive ? debugSuperBoostSpeed : maxHorizontalSpeed;

  if (boosting) {
    boostGauge = Math.max(0, boostGauge - boostDrainPerSecond * dt);
  }
  if (stunned) {
    jumpHoldRemaining = 0;
    quickStepQueued = 0;
  }

  const dashPadTargetSpeed = getDashPadTargetSpeed();
  const currentForwardSpeed = Math.max(0, -player.velocity.z);
  let targetVelocityZ = 0;
  let forwardAccel = 52;

  if (debugSuperBoostActive) {
    targetVelocityZ = -debugSuperBoostSpeed;
    forwardAccel = 720;
  } else if (boosting) {
    targetVelocityZ = -Math.min(Math.max(boostTopSpeed, dashPadTargetSpeed), speedLimit);
    forwardAccel = 118;
  } else if (holdingForward && !holdingBack) {
    const targetForwardSpeed = Math.min(Math.max(runTopSpeed, dashPadTargetSpeed), speedLimit);
    targetVelocityZ = -targetForwardSpeed;
    forwardAccel = targetVelocityZ < player.velocity.z ? 56 : 52;
  } else if (brakingInput) {
    const brakingForward = currentForwardSpeed > 2;
    targetVelocityZ = brakingForward ? 0 : reverseTopSpeed;
    forwardAccel = brakingForward ? 128 : 38;
  } else if (dashPadTargetSpeed > 0) {
    targetVelocityZ = -Math.min(dashPadTargetSpeed, speedLimit);
    forwardAccel = targetVelocityZ < player.velocity.z ? 36 : 52;
  }

  player.velocity.z = debugSuperBoostActive || boosting
    ? targetVelocityZ
    : moveToward(player.velocity.z, targetVelocityZ, forwardAccel * dt);

  const airControl = player.grounded ? 1 : 0.58;
  const targetSideSpeed = strafeInput * (boosting ? 17 : 15);
  const sideAccel = (strafeInput === 0 ? 42 : 64) * airControl;

  if (!stunned && quickStepQueued !== 0 && quickStepCooldown <= 0 && quickStepTimer <= 0.012) {
    startQuickStep(quickStepQueued);
    quickStepQueued = 0;
  }

  if (quickStepTimer > 0) {
    quickStepTimer = Math.max(0, quickStepTimer - dt);
    const t = 1 - quickStepTimer / quickStepDuration;
    const eased = 1 - Math.pow(1 - THREE.MathUtils.clamp(t, 0, 1), 3);
    player.position.x = THREE.MathUtils.lerp(quickStepStartX, quickStepTargetX, eased);
    player.velocity.x = 0;
  } else {
    player.velocity.x = moveToward(player.velocity.x, targetSideSpeed, sideAccel * dt);
    if (Math.abs(player.velocity.x) < 0.02) {
      player.velocity.x = 0;
    }
  }

  clampHorizontalSpeed(speedLimit);

  const speed = getHorizontalSpeed();
  const canJump = player.grounded || debugSettings.infiniteJump;

  if (!stunned && jumpQueued && canJump) {
    player.velocity.y = 42.5 + Math.min(speed * 0.04, 4.5);
    player.grounded = false;
    jumpHoldRemaining = 0.075;
    jumpImpact = 1;
    spawnTrailBurst();
  }
  jumpQueued = false;

  if (jumpHoldRemaining > 0 && isJumpHeld() && player.velocity.y > 0) {
    player.velocity.y += 9 * dt;
    jumpHoldRemaining -= dt;
  } else if (!isJumpHeld()) {
    jumpHoldRemaining = 0;
  }

  player.velocity.y -= (player.velocity.y > 0 ? 128 : 82) * dt;
  player.position.addScaledVector(player.velocity, dt);
  if (player.position.z > stageStartZ + 8) {
    player.position.z = stageStartZ + 8;
    player.velocity.z = Math.min(player.velocity.z, 0);
  }

  snapToGround();
  if (!stunned) {
    checkDashPads();
  }
  clampHorizontalSpeed(speedLimit);
  checkDnaCollection();
  checkObstacleCollision();

  player.yaw = THREE.MathUtils.lerp(player.yaw, THREE.MathUtils.clamp(player.velocity.x * 0.035, -0.48, 0.48), 1 - Math.exp(-8 * dt));
  boostMotionBlurTarget = boosting || debugSuperBoostActive
    ? THREE.MathUtils.clamp(getHorizontalSpeed() / boostTopSpeed, 0.55, 1) * getMotionBlurScale()
    : 0;
}

function snapToGround() {
  const sample = getGroundSample(player.position.x, player.position.z);
  player.grounded = false;

  if (sample) {
    const halfWidth = sample.segment.width * 0.5 - player.radius * 0.72;
    if (sample.segment.rail && Math.abs(player.position.x) > halfWidth) {
      player.position.x = Math.sign(player.position.x) * halfWidth;
      player.velocity.x *= -0.24;
    }

    const groundY = sample.y + player.radius;
    const distanceToGround = player.position.y - groundY;
    const canSnapDown = player.velocity.y <= 0 && distanceToGround <= groundSnapDistance;

    if (player.position.y <= groundY || canSnapDown) {
      player.position.y = groundY;
      if (player.velocity.y < 0 || canSnapDown) {
        player.velocity.y = 0;
      }
      player.grounded = true;
    }
  }

  if (player.position.y < -18 || player.position.z > stageStartZ + 16) {
    resetGame();
  }
}

function getGroundSampleFromSegments(x, z, segments) {
  for (const segment of segments) {
    const zMin = Math.min(segment.zStart, segment.zEnd);
    const zMax = Math.max(segment.zStart, segment.zEnd);
    if (z >= zMin && z <= zMax && Math.abs(x) <= segment.width * 0.5 + 0.2) {
      const t = (segment.zStart - z) / (segment.zStart - segment.zEnd);
      return {
        y: THREE.MathUtils.lerp(segment.yStart, segment.yEnd, t),
        segment,
      };
    }
  }
  return null;
}

function getStageDefinitionGroundSample(x, z) {
  return getGroundSampleFromSegments(x, z, currentStage.trackSegments);
}

function getGroundSample(x, z) {
  return getGroundSampleFromSegments(x, z, trackSegments);
}

function startQuickStep(direction) {
  const sample = getGroundSample(player.position.x, player.position.z);
  if (!sample) return;

  const laneDirection = Math.sign(direction);
  if (laneDirection === 0) return;

  const halfWidth = sample.segment.width * 0.5 - player.radius * 1.2;
  quickStepDirection = laneDirection;
  quickStepStartX = player.position.x;
  quickStepTargetX = getQuickStepTargetX(laneDirection, halfWidth);
  quickStepTimer = quickStepDuration;
  quickStepCooldown = quickStepCooldownDuration;
  quickStepFlash = 1;
  player.velocity.x = laneDirection * 36;
  spawnTrailBurst();
}

function getQuickStepTargetX(direction, halfWidth) {
  const laneCenters = getQuickStepLaneCenters(halfWidth);
  if (laneCenters.length === 0) {
    return THREE.MathUtils.clamp(player.position.x, -halfWidth, halfWidth);
  }

  const currentLaneIndex = getClosestQuickStepLaneIndex(laneCenters, player.position.x);
  const targetLaneIndex = THREE.MathUtils.clamp(
    currentLaneIndex + direction,
    0,
    laneCenters.length - 1,
  );
  return laneCenters[targetLaneIndex];
}

function getQuickStepLaneCenters(halfWidth) {
  const outerLaneX = Math.min(quickStepDistance * 2, halfWidth);
  const laneCenters = [-outerLaneX, -quickStepDistance, 0, quickStepDistance, outerLaneX];
  const result = [];

  for (const laneCenter of laneCenters) {
    const clampedCenter = THREE.MathUtils.clamp(laneCenter, -halfWidth, halfWidth);
    if (!result.some((x) => Math.abs(x - clampedCenter) < quickStepLaneSnapEpsilon)) {
      result.push(clampedCenter);
    }
  }

  return result;
}

function getClosestQuickStepLaneIndex(laneCenters, x) {
  let closestIndex = 0;
  let closestDistance = Math.abs(x - laneCenters[0]);

  for (let i = 1; i < laneCenters.length; i += 1) {
    const distance = Math.abs(x - laneCenters[i]);
    if (distance < closestDistance) {
      closestIndex = i;
      closestDistance = distance;
    }
  }

  return closestIndex;
}

function checkDashPads() {
  for (const pad of dashPads) {
    if (pad.cooldown > 0) continue;

    const distance = player.position.distanceTo(pad.position);
    if (distance < pad.radius && player.grounded) {
      triggerDashPad(pad);
    }
  }
}

function triggerDashPad(pad) {
  const currentSpeed = Math.min(getHorizontalSpeed(), maxHorizontalSpeed);
  const boostedSpeed = Math.min(currentSpeed + dashPadSpeedGain, maxHorizontalSpeed);
  dashPadBoostStartSpeed = currentSpeed;
  dashPadBoostRemaining = dashPadFadeDuration;
  player.velocity.x = 0;
  player.velocity.z = -boostedSpeed;
  player.velocity.y = Math.max(player.velocity.y, 3.4);
  player.yaw = 0;
  pad.cooldown = 0.9;
  quickStepFlash = 1;
  pulseDashPad(pad.mesh);
  spawnTrailBurst();
}

function pulseDashPad(mesh) {
  mesh.scale.set(1.08, 1.08, 1.08);
  setTimeout(() => mesh.scale.set(1, 1, 1), 95);
}

function updateDashPads(dt) {
  dashPadBoostRemaining = Math.max(0, dashPadBoostRemaining - dt);
  if (dashPadBoostRemaining <= 0) {
    dashPadBoostStartSpeed = 0;
  }

  for (const pad of dashPads) {
    pad.cooldown = Math.max(0, pad.cooldown - dt);
  }
}

function getDashPadTargetSpeed() {
  if (dashPadBoostRemaining <= 0) return 0;

  const fade = THREE.MathUtils.clamp(dashPadBoostRemaining / dashPadFadeDuration, 0, 1);
  const boostedTarget = Math.min(dashPadBoostStartSpeed + dashPadSpeedGain, maxHorizontalSpeed);
  return THREE.MathUtils.lerp(dashPadBoostStartSpeed, boostedTarget, fade);
}

function updateObstacles(dt) {
  for (const obstacle of obstacles) {
    obstacle.mesh.position.copy(obstacle.basePosition);
    obstacle.mesh.quaternion.copy(obstacle.baseQuaternion);
    obstacle.mesh.rotateY(Math.sin(performance.now() * 0.002 + obstacle.position.z) * 0.02);
    const pulse = 1 + Math.sin(performance.now() * 0.006 + obstacle.position.z) * 0.015;
    obstacle.mesh.scale.set(pulse, 1, pulse);
  }
}

function updateDnaItems(dt) {
  for (const dna of dnaItems) {
    if (dna.collected) continue;
    dna.spinAngle += dt * dna.spin * 2.8;
    const bob = Math.sin(performance.now() * 0.004 + dna.bobPhase) * 0.035;
    setDnaInstanceMatrix(dna, bob);
  }
  if (dnaInstances) {
    dnaInstances.instanceMatrix.needsUpdate = true;
  }
}

function setDnaInstanceMatrix(dna, bob = 0) {
  if (!dnaInstances) return;

  dnaInstanceObject.position.copy(dna.basePosition).addScaledVector(dna.up, bob);
  dnaInstanceObject.quaternion.copy(dna.baseQuaternion);
  dnaInstanceObject.scale.setScalar(1);
  dnaInstanceObject.rotateY(dna.spinAngle * 0.85);
  dnaInstanceObject.rotateZ(dna.spinAngle * 0.42);
  dnaInstanceObject.updateMatrix();
  dnaInstances.setMatrixAt(dna.index, dnaInstanceObject.matrix);
}

function hideDnaInstance(dna) {
  if (!dnaInstances) return;

  dnaInstances.setMatrixAt(dna.index, hiddenDnaMatrix);
  dnaInstances.instanceMatrix.needsUpdate = true;
}

function refreshDnaInstances() {
  for (const dna of dnaItems) {
    if (dna.collected) {
      hideDnaInstance(dna);
    } else {
      setDnaInstanceMatrix(dna);
    }
  }
  if (dnaInstances) {
    dnaInstances.instanceMatrix.needsUpdate = true;
  }
}

function updateLooseDnaItems(dt) {
  for (let i = looseDnaItems.length - 1; i >= 0; i -= 1) {
    const loose = looseDnaItems[i];
    loose.age += dt;
    loose.velocity.y -= 30 * dt;
    loose.localPosition.addScaledVector(loose.velocity, dt);
    loose.spinAngle += dt * loose.spin * 1.4;

    const sample = getGroundSample(loose.localPosition.x, loose.localPosition.z);
    if (sample && loose.localPosition.y <= sample.y + 0.46) {
      loose.localPosition.y = sample.y + 0.46;
      if (loose.velocity.y < 0) {
        loose.velocity.y *= -0.42;
      }
      loose.velocity.x *= Math.exp(-2.8 * dt);
      loose.velocity.z *= Math.exp(-2.8 * dt);
    }

    setStageObjectTransform(loose.mesh, loose.localPosition, loose.spinAngle);

    if (loose.age > loose.collectDelay && loose.localPosition.distanceTo(player.position) < 1.45) {
      collectedDna += 1;
      addScore(dnaScoreValue);
      restoreBoostGauge(dnaBoostGaugeGain);
      scene.remove(loose.mesh);
      looseDnaItems.splice(i, 1);
      continue;
    }

    if (loose.age > 8 || loose.localPosition.y < -14) {
      scene.remove(loose.mesh);
      looseDnaItems.splice(i, 1);
    }
  }
}

function checkDnaCollection() {
  for (const dna of dnaItems) {
    if (dna.collected) continue;
    if (dna.localPosition.distanceTo(player.position) < 1.42) {
      dna.collected = true;
      hideDnaInstance(dna);
      collectedDna += 1;
      addScore(dnaScoreValue);
      restoreBoostGauge(dnaBoostGaugeGain);
    }
  }
}

function addScore(amount) {
  score += amount;
}

function restoreBoostGauge(amount) {
  boostGauge = Math.min(boostGaugeMax, boostGauge + amount);
}

function checkObstacleCollision() {
  if (hitCooldown > 0) return;

  for (const obstacle of obstacles) {
    const dx = Math.abs(player.position.x - obstacle.position.x);
    const dz = Math.abs(player.position.z - obstacle.position.z);
    const horizontalHit = dx < obstacle.size.x * 0.5 + player.radius * 0.72
      && dz < obstacle.size.z * 0.5 + player.radius * 0.72;

    if (!horizontalHit) continue;

    const obstacleTop = obstacle.position.y + obstacle.size.y * 0.5;
    const playerBottom = player.position.y - player.radius;
    if (playerBottom > obstacleTop - 0.12) continue;

    handleObstacleHit(obstacle);
    break;
  }
}

function handleObstacleHit(obstacle) {
  hitCooldown = 1.2;
  hitStun = hitStunDuration;
  addScore(-obstacleScorePenalty);
  dashPadBoostStartSpeed = 0;
  dashPadBoostRemaining = 0;
  quickStepQueued = 0;
  quickStepTimer = 0;
  player.position.z = Math.min(player.position.z + 3.2, stageStartZ + 8);
  player.velocity.z = Math.max(player.velocity.z, 12);
  player.velocity.y = Math.max(player.velocity.y, 9.5);
  player.velocity.x += Math.sign(player.position.x - obstacle.position.x || 1) * 7.5;
  jumpImpact = 1;
  obstacle.mesh.scale.set(1.2, 1.08, 1.2);
  setTimeout(() => obstacle.mesh.scale.set(1, 1, 1), 120);
  dropCollectedDna();
}

function dropCollectedDna() {
  const count = collectedDna;
  if (count <= 0) return;

  collectedDna = 0;
  const origin = player.position.clone();

  for (let i = 0; i < count; i += 1) {
    const meteor = new THREE.Mesh(dnaGeometry, materials.dna);
    meteor.castShadow = false;
    meteor.receiveShadow = false;

    const angle = (i / Math.max(1, count)) * Math.PI * 2 + Math.random() * 0.38;
    const radius = 0.35 + Math.random() * 0.75;
    const localPosition = new THREE.Vector3(
      origin.x + Math.cos(angle) * radius,
      origin.y + 0.45 + Math.random() * 0.55,
      origin.z + Math.sin(angle) * radius,
    );
    setStageObjectTransform(meteor, localPosition);
    scene.add(meteor);

    const burstSpeed = 8 + Math.random() * 13;
    looseDnaItems.push({
      mesh: meteor,
      localPosition,
      velocity: new THREE.Vector3(
        Math.cos(angle) * burstSpeed,
        8 + Math.random() * 8,
        Math.sin(angle) * burstSpeed - Math.random() * 6,
      ),
      age: 0,
      collectDelay: 0.65,
      spin: 5 + Math.random() * 6,
      spinAngle: 0,
    });
  }
}

function checkGoal() {
  if (player.position.z < goalZ + 6 && Math.abs(player.position.x) < 9.2) {
    setPaused(false, "finish");
    finished = true;
    finishEl.classList.remove("hidden");
    finishKickerEl.textContent = `${currentStage.label} CLEAR`;
    finishTimeEl.textContent = `${getElapsedSeconds().toFixed(2)}s`;
    finishScoreEl.textContent = `${score}`;
    nextStageButton.classList.toggle("hidden", currentStageIndex >= stageCount - 1);
  }
}

function goToNextStage() {
  if (currentStageIndex >= stageCount - 1) return;

  if (currentStageIndex >= 0) {
    window.sessionStorage.setItem("dx-speed-stage-score", `${score}`);
  } else {
    window.sessionStorage.removeItem("dx-speed-stage-score");
  }
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("stage", getStageRoute(currentStageIndex + 1));
  window.location.href = nextUrl.toString();
}

function selectStage(stageRoute) {
  const stageIndex = getStageIndex(stageRoute);

  window.sessionStorage.removeItem("dx-speed-stage-score");
  setMainMenuOpen(false);
  setStageMenuOpen(false);
  if (stageIndex === currentStageIndex) {
    resetGame();
    return;
  }

  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("stage", getStageRoute(stageIndex));
  window.location.href = nextUrl.toString();
}

function updateStageSelector() {
  stageSelectButtons.forEach((button) => {
    const stageIndex = getStageIndex(button.dataset.stageSelect);
    button.setAttribute("aria-pressed", stageIndex === currentStageIndex ? "true" : "false");
  });
}

function hideLoadingScreen() {
  if (!loadingScreenEl) return;
  if (loadingProgressEl) loadingProgressEl.style.width = "100%";
  if (loadingStatusEl) loadingStatusEl.textContent = "Ready";
  loadingScreenEl.classList.add("is-complete");
  window.setTimeout(() => {
    loadingScreenEl.classList.add("hidden");
  }, 260);
}

function setMainMenuOpen(open) {
  if (!menuPanel || !menuButton) return;
  menuPanel.classList.toggle("hidden", !open);
  menuButton.setAttribute("aria-expanded", open ? "true" : "false");
  if (!open) {
    setStageMenuOpen(false);
  }
}

function setStageMenuOpen(open) {
  if (!stageMenu || !stageMenuToggle) return;
  stageMenu.classList.toggle("hidden", !open);
  stageMenuToggle.setAttribute("aria-expanded", open ? "true" : "false");
}

function updateTutorialPrompt() {
  if (!tutorialPromptEl) return;

  const prompt = currentStage.tutorialPrompts?.find(({ zStart, zEnd }) => (
    player.position.z <= zStart && player.position.z >= zEnd
  ));

  if (!prompt || finished) {
    tutorialPromptEl.classList.add("hidden");
    tutorialPromptEl.textContent = "";
    return;
  }

  tutorialPromptEl.textContent = prompt.text;
  tutorialPromptEl.classList.remove("hidden");
}

function renderGame(dt) {
  if (player.mesh) {
    const quickStepLean = quickStepTimer > 0 ? -quickStepDirection * 0.18 : 0;
    const lean = -player.velocity.x * 0.014 + quickStepLean;
    setStageObjectTransform(player.mesh, player.position);
    player.mesh.rotateY(player.yaw);
    player.mesh.rotateZ(lean);
    player.mesh.scale.set(1 - jumpImpact * 0.08, 1 + jumpImpact * 0.18, 1 - jumpImpact * 0.08);
    animatePlayerModel(dt);
  }
  updateCamera(dt);
  updateSunShadow();
  updateBoostMotionBlur(dt);
  renderFrame();
}

function updateBoostMotionBlur(dt) {
  const fadeRate = boostMotionBlurTarget > boostMotionBlurStrength ? 9.5 : 18;
  boostMotionBlurStrength = THREE.MathUtils.lerp(
    boostMotionBlurStrength,
    boostMotionBlurTarget,
    1 - Math.exp(-fadeRate * dt),
  );

  if (boostMotionBlurTarget <= 0 && boostMotionBlurStrength < 0.014) {
    boostMotionBlurStrength = 0;
  }
}

function renderFrame() {
  updateSkyDome();
  boostMotionBlurMaterial.uniforms.uStrength.value = boostMotionBlurStrength;
  boostMotionBlurMaterial.uniforms.tDiffuse.value = sceneRenderTarget.texture;

  renderer.setRenderTarget(sceneRenderTarget);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);
  renderer.render(postScene, postCamera);
}

function updateSunShadow() {
  if (!sunLight || !sunTarget) return;

  const distanceConfig = shadowDistanceConfig[graphicsSettings.shadowDistance] ?? shadowDistanceConfig.far;
  const frame = getStageFrame(player.position.z);
  const target = toWorldPosition(new THREE.Vector3(0, Math.max(player.position.y, 1.2), player.position.z))
    .addScaledVector(frame.tangent, distanceConfig.lead);
  sunTarget.position.copy(target);
  sunLight.position.copy(target).add(sunFollowOffset);
  sunTarget.updateMatrixWorld();
  sunLight.updateMatrixWorld();
}

function animatePlayerModel(dt) {
  if (!player.parts) return;

  const speed = getHorizontalSpeed();
  const moving = speed > 2;
  const runAmount = THREE.MathUtils.clamp(speed / 54, 0, 1.8);
  runPhase += speed * dt * 0.18;

  const swing = Math.sin(runPhase) * 0.82 * runAmount;
  const counterSwing = Math.sin(runPhase + Math.PI) * 0.82 * runAmount;
  const shoePulse = 1 + Math.min(runAmount, 1.2) * 0.12;
  const airborne = !player.grounded;

  player.parts.model.position.y = 0.1
    + (moving && player.grounded ? Math.abs(Math.sin(runPhase * 2)) * 0.035 : 0)
    + (airborne ? 0.04 : 0);
  player.parts.model.rotation.x = THREE.MathUtils.lerp(
    player.parts.model.rotation.x,
    airborne ? -0.12 : -THREE.MathUtils.clamp(speed * 0.004, 0, 0.28),
    1 - Math.exp(-9 * dt),
  );
  player.parts.model.rotation.z = THREE.MathUtils.lerp(
    player.parts.model.rotation.z,
    -player.velocity.x * 0.01,
    1 - Math.exp(-8 * dt),
  );

  const [armLeft, armRight] = player.parts.arms;
  const [legLeft, legRight] = player.parts.legs;

  if (airborne) {
    armLeft.rotation.x = THREE.MathUtils.lerp(armLeft.rotation.x, -0.65, 1 - Math.exp(-10 * dt));
    armRight.rotation.x = THREE.MathUtils.lerp(armRight.rotation.x, -0.65, 1 - Math.exp(-10 * dt));
    legLeft.rotation.x = THREE.MathUtils.lerp(legLeft.rotation.x, 0.5, 1 - Math.exp(-10 * dt));
    legRight.rotation.x = THREE.MathUtils.lerp(legRight.rotation.x, -0.25, 1 - Math.exp(-10 * dt));
  } else {
    armLeft.rotation.x = swing;
    armRight.rotation.x = counterSwing;
    legLeft.rotation.x = counterSwing;
    legRight.rotation.x = swing;
  }

  armLeft.rotation.z = -0.32;
  armRight.rotation.z = 0.32;
  legLeft.shoe.rotation.x = moving ? -0.18 + Math.sin(runPhase + Math.PI) * 0.18 : 0;
  legRight.shoe.rotation.x = moving ? -0.18 + Math.sin(runPhase) * 0.18 : 0;
  legLeft.shoe.scale.set(1, 1, moving ? shoePulse : 1);
  legRight.shoe.scale.set(1, 1, moving ? shoePulse : 1);
  player.parts.head.rotation.y = THREE.MathUtils.lerp(
    player.parts.head.rotation.y,
    THREE.MathUtils.clamp(player.velocity.x * 0.018, -0.2, 0.2),
    1 - Math.exp(-8 * dt),
  );

  const energyAmount = playerBoostEffectActive
    ? THREE.MathUtils.clamp(0.35 + speed / boostTopSpeed, 0.35, 1)
    : 0;
  materials.jetEnergy.opacity = energyAmount > 0 ? 0.3 + energyAmount * 0.55 : 0;
  for (const line of player.parts.energyLines ?? []) {
    line.visible = energyAmount > 0;
    const pulse = energyAmount > 0
      ? 1 + Math.sin(runPhase * 3 + line.userData.phase) * 0.08 * energyAmount
      : 1;
    line.scale.setScalar(pulse);
  }
}

function updateCamera(dt) {
  updateManualCameraInput(dt);
  const speed = getHorizontalSpeed();
  const cameraSpeed = Math.min(speed, runTopSpeed * 1.08);
  const frame = getStageFrame(player.position.z);
  const centerWorld = toWorldPosition(new THREE.Vector3(0, player.position.y, player.position.z));
  const cameraBack = 7.8 + cameraSpeed * 0.028;
  const cameraLift = 4.2 + cameraSpeed * 0.012;
  const cameraOffset = frame.tangent.clone()
    .multiplyScalar(-cameraBack)
    .addScaledVector(frame.up, cameraLift);
  const yawRotation = new THREE.Quaternion().setFromAxisAngle(frame.up, cameraYawOffset);
  cameraOffset.applyQuaternion(yawRotation);
  const pitchAxis = frame.right.clone().applyQuaternion(yawRotation).normalize();
  cameraOffset.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(pitchAxis, cameraPitchOffset));
  const desired = centerWorld.clone().add(cameraOffset);

  camera.position.lerp(desired, 1 - Math.exp(-6.2 * dt));

  const lookAt = centerWorld.clone()
    .addScaledVector(frame.tangent, 5.8 + speed * 0.085)
    .addScaledVector(frame.up, 1.05);
  camera.up.lerp(frame.up, 1 - Math.exp(-5.2 * dt)).normalize();
  camera.lookAt(lookAt);

  const targetFov = 68 + Math.min(cameraSpeed * 0.14, 8) + jumpImpact * 2.5 + quickStepFlash * 1.5;
  camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 1 - Math.exp(-4.2 * dt));
  camera.updateProjectionMatrix();
}

function updateManualCameraInput(dt) {
  const yawSpeed = 1.35;
  const pitchSpeed = 0.92;
  const yawInput = (isDown("KeyJ") ? 1 : 0) - (isDown("KeyL") ? 1 : 0);
  const pitchInput = (isDown("KeyI") ? 1 : 0) - (isDown("KeyK") ? 1 : 0);

  cameraYawOffset = THREE.MathUtils.clamp(
    cameraYawOffset + yawInput * yawSpeed * dt,
    -THREE.MathUtils.degToRad(78),
    THREE.MathUtils.degToRad(78),
  );
  cameraPitchOffset = THREE.MathUtils.clamp(
    cameraPitchOffset + pitchInput * pitchSpeed * dt,
    -THREE.MathUtils.degToRad(34),
    THREE.MathUtils.degToRad(42),
  );
}

function resetCameraView() {
  cameraYawOffset = 0;
  cameraPitchOffset = 0;
}

function updateTrail(dt) {
  if (getHorizontalSpeed() > 18 && Math.random() > 0.25) {
    const ghost = trail.reduce((oldest, item) => (item.life < oldest.life ? item : oldest), trail[0]);
    setStageObjectTransform(ghost.mesh, player.position);
    ghost.mesh.scale.setScalar(0.88);
    ghost.mesh.material.opacity = 0.32;
    ghost.mesh.visible = true;
    ghost.life = 0.46;
  }

  for (const ghost of trail) {
    if (ghost.life <= 0) {
      ghost.mesh.visible = false;
      continue;
    }
    ghost.life -= dt;
    ghost.mesh.material.opacity = Math.max(0, ghost.life * 0.65);
    ghost.mesh.scale.multiplyScalar(1 + dt * 1.5);
  }
}

function spawnTrailBurst() {
  for (let i = 0; i < 5; i += 1) {
    const ghost = trail[i];
    const localPosition = player.position.clone();
    localPosition.z += i * 0.45;
    setStageObjectTransform(ghost.mesh, localPosition);
    ghost.mesh.material.opacity = 0.42;
    ghost.mesh.scale.setScalar(1 + i * 0.1);
    ghost.mesh.visible = true;
    ghost.life = 0.42 + i * 0.04;
  }
}

function setPaused(paused, reason = "manual") {
  if (finished && paused) return;
  if (isPaused === paused) return;

  isPaused = paused;
  document.body.classList.toggle("game-paused", isPaused);
  pauseMenu?.classList.toggle("hidden", !isPaused);
  pauseButton?.setAttribute("aria-expanded", isPaused ? "true" : "false");

  if (isPaused) {
    pauseStartedAt = performance.now();
    keys.clear();
    quickStepQueued = 0;
    jumpQueued = false;
    if (touchControlsEnabled) {
      touchInput.activePointers.clear();
      touchInput.brake = false;
      touchInput.jump = false;
      syncTouchControls();
    }
    setMainMenuOpen(false);
    setStageMenuOpen(false);
    setGraphicsPanelOpen(false);
    setDebugPanelOpen(false);
    pauseMusicForGame();
  } else {
    if (pauseStartedAt > 0) {
      startedAt += performance.now() - pauseStartedAt;
      pauseStartedAt = 0;
    }
    setHelpPanelOpen(false);
    clock.getDelta();
    resumeMusicForGame(reason);
  }
}

function pauseMusicForGame() {
  musicWasPlayingBeforePause = Boolean(musicAudio && musicStarted && !musicAudio.paused);
  if (musicAudio) {
    musicAudio.pause();
  }
  musicStarted = false;
  updateMusicButton();
}

function resumeMusicForGame(reason) {
  const shouldResume = reason !== "reset" && musicWanted && musicWasPlayingBeforePause;
  musicWasPlayingBeforePause = false;
  if (shouldResume) {
    startMusic();
  } else {
    updateMusicButton();
  }
}

function startMusic() {
  if (!musicWanted) return;
  if (isPaused) return;

  if (!musicAudio) {
    setupMusic();
  }
  if (!musicAudio) return;
  if (musicStarted) return;

  musicStarted = true;
  musicAudio.volume = stageMusicVolume;
  const playResult = musicAudio.play();
  if (playResult?.catch) {
    playResult.catch(() => {
      musicStarted = false;
      updateMusicButton();
    });
  }
  updateMusicButton();
}

function stopMusic() {
  musicStarted = false;

  if (musicAudio) {
    musicAudio.pause();
  }

  updateMusicButton();
}

function toggleMusic() {
  musicWanted = !musicWanted;
  if (musicWanted) {
    startMusic();
  } else {
    stopMusic();
  }
  updateMusicButton();
}

function setupMusic() {
  musicAudio = new Audio(stageMusicUrl);
  musicAudio.loop = true;
  musicAudio.preload = "auto";
  musicAudio.volume = stageMusicVolume;
  musicAudio.addEventListener("error", () => {
    musicWanted = false;
    musicStarted = false;
    updateMusicButton();
  });
}

function updateMusicState() {
  if (!musicAudio || !musicStarted) return;
  musicAudio.volume = stageMusicVolume;
}

function updateWater(dt) {
  if (!waterMaterial) return;

  if (waterMesh && Number.isFinite(currentStage.hideWaterAfterProgress)) {
    waterMesh.visible = getStageProgress(player.position.z) < currentStage.hideWaterAfterProgress;
  }

  waterTime += dt;
  waterMaterial.uniforms.uTime.value = waterTime;
}

function updateMusicButton() {
  if (!musicButton) return;

  musicButton.textContent = musicWanted ? "MUSIC ON" : "MUSIC OFF";
  musicButton.setAttribute("aria-pressed", musicWanted ? "true" : "false");
}

function loadGraphicsSettings() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(graphicsStorageKey));
    return normalizeGraphicsSettings(stored);
  } catch {
    return normalizeGraphicsSettings();
  }
}

function normalizeGraphicsSettings(source = {}) {
  const preset = graphicsPresets[source.preset] ? source.preset : graphicsDefaults.preset;
  const base = source.preset === "custom" ? graphicsDefaults : graphicsPresets[preset];
  const settings = { ...graphicsDefaults, ...base, ...source };

  return {
    preset: source.preset === "custom" ? "custom" : preset,
    renderScale: isValidGraphicsValue(settings.renderScale, ["0.75", "1", "1.25", "1.5"]) ? settings.renderScale : graphicsDefaults.renderScale,
    mobileRenderScale: isValidGraphicsValue(settings.mobileRenderScale, ["0.75", "1", "1.25", "1.5", "1.75", "2"]) ? settings.mobileRenderScale : graphicsDefaults.mobileRenderScale,
    shadowQuality: isValidGraphicsValue(settings.shadowQuality, Object.keys(shadowQualityConfig)) ? settings.shadowQuality : graphicsDefaults.shadowQuality,
    shadowSoftness: isValidGraphicsValue(settings.shadowSoftness, ["hard", "soft"]) ? settings.shadowSoftness : graphicsDefaults.shadowSoftness,
    shadowDistance: isValidGraphicsValue(settings.shadowDistance, Object.keys(shadowDistanceConfig)) ? settings.shadowDistance : graphicsDefaults.shadowDistance,
    motionBlur: isValidGraphicsValue(settings.motionBlur, Object.keys(motionBlurStrengthConfig)) ? settings.motionBlur : graphicsDefaults.motionBlur,
    textureQuality: isValidGraphicsValue(settings.textureQuality, Object.keys(asphaltTextureQualityConfig)) ? settings.textureQuality : graphicsDefaults.textureQuality,
    waterQuality: isValidGraphicsValue(settings.waterQuality, Object.keys(waterQualityConfig)) ? settings.waterQuality : graphicsDefaults.waterQuality,
    viewDistance: isValidGraphicsValue(settings.viewDistance, Object.keys(viewDistanceConfig)) ? settings.viewDistance : graphicsDefaults.viewDistance,
    lighting: isValidGraphicsValue(settings.lighting, Object.keys(lightingConfig)) ? settings.lighting : graphicsDefaults.lighting,
    frameCap: isValidGraphicsValue(settings.frameCap, ["30", "60", "120", "unlimited"]) ? settings.frameCap : graphicsDefaults.frameCap,
  };
}

function isValidGraphicsValue(value, allowedValues) {
  return allowedValues.includes(String(value));
}

function loadDebugSettings() {
  try {
    return normalizeDebugSettings(JSON.parse(window.localStorage.getItem(debugStorageKey)));
  } catch {
    return normalizeDebugSettings();
  }
}

function normalizeDebugSettings(source = {}) {
  return {
    superBoost: typeof source.superBoost === "boolean" ? source.superBoost : debugDefaults.superBoost,
    infiniteJump: typeof source.infiniteJump === "boolean" ? source.infiniteJump : debugDefaults.infiniteJump,
    mouseObject: typeof source.mouseObject === "boolean" ? source.mouseObject : debugDefaults.mouseObject,
  };
}

function saveDebugSettings() {
  window.localStorage.setItem(debugStorageKey, JSON.stringify(debugSettings));
}

function bindGraphicsControls() {
  if (!graphicsControls.preset) return;

  graphicsControls.preset.addEventListener("change", () => {
    const preset = graphicsControls.preset.value;
    if (graphicsPresets[preset]) {
      graphicsSettings = normalizeGraphicsSettings({ preset, ...graphicsPresets[preset] });
      applyGraphicsSettings();
      syncGraphicsControls();
    }
  });

  for (const [key, control] of Object.entries(graphicsControls)) {
    if (!control || key === "preset") continue;
    control.addEventListener("change", () => {
      graphicsSettings = normalizeGraphicsSettings({
        ...graphicsSettings,
        preset: "custom",
        [key]: control.value,
      });
      applyGraphicsSettings();
      syncGraphicsControls();
    });
  }
}

function bindDebugControls() {
  debugProgressButtons.forEach((button) => {
    button.addEventListener("click", () => {
      warpToGoalProgress(Number(button.dataset.debugProgress) / 100);
    });
  });

  for (const [key, control] of Object.entries(debugControls)) {
    if (!control) continue;
    control.addEventListener("change", () => {
      debugSettings = normalizeDebugSettings({
        ...debugSettings,
        [key]: control.checked,
      });
      saveDebugSettings();
      syncDebugControls();
      if (key === "mouseObject" && !debugSettings.mouseObject) {
        hideMouseObjectLabel();
      } else if (key === "mouseObject") {
        requestMouseObjectPick();
      }
    });
  }
}

function syncGraphicsControls() {
  for (const [key, control] of Object.entries(graphicsControls)) {
    if (!control) continue;
    control.value = graphicsSettings[key];
  }
}

function syncDebugControls() {
  for (const [key, control] of Object.entries(debugControls)) {
    if (!control) continue;
    control.checked = Boolean(debugSettings[key]);
  }
  if (!debugSettings.mouseObject) {
    hideMouseObjectLabel();
  }
}

function handleMouseObjectPointerMove(event) {
  if (event.pointerType && event.pointerType !== "mouse") return;

  mouseObjectPointerState.active = true;
  mouseObjectPointerState.clientX = event.clientX;
  mouseObjectPointerState.clientY = event.clientY;
  requestMouseObjectPick();
}

function handleMouseObjectPointerLeave() {
  mouseObjectPointerState.active = false;
  hideMouseObjectLabel();
}

function requestMouseObjectPick() {
  if (!debugSettings.mouseObject || !mouseObjectPointerState.active) {
    hideMouseObjectLabel();
    return;
  }

  if (mouseObjectPointerState.raf) return;
  mouseObjectPointerState.raf = requestAnimationFrame(() => {
    mouseObjectPointerState.raf = 0;
    updateMouseObjectPick();
  });
}

function updateMouseObjectPick() {
  if (!debugSettings.mouseObject || !mouseObjectPointerState.active) {
    hideMouseObjectLabel();
    return;
  }

  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    hideMouseObjectLabel();
    return;
  }

  const localX = mouseObjectPointerState.clientX - rect.left;
  const localY = mouseObjectPointerState.clientY - rect.top;
  if (localX < 0 || localY < 0 || localX > rect.width || localY > rect.height) {
    hideMouseObjectLabel();
    return;
  }

  mouseObjectPointer.set((localX / rect.width) * 2 - 1, -(localY / rect.height) * 2 + 1);
  mouseObjectRaycaster.setFromCamera(mouseObjectPointer, camera);
  const hits = mouseObjectRaycaster.intersectObjects(scene.children, true);
  const hit = hits.find(({ object }) => isMouseObjectHitCandidate(object));
  if (!hit) {
    hideMouseObjectLabel();
    return;
  }

  showMouseObjectLabel(resolveMouseObjectName(hit), mouseObjectPointerState.clientX, mouseObjectPointerState.clientY);
}

function isMouseObjectHitCandidate(object) {
  for (let current = object; current; current = current.parent) {
    if (!current.visible || current.userData.ignoreMouseObject) return false;
  }

  const material = Array.isArray(object.material) ? object.material[0] : object.material;
  if (material?.transparent && material.opacity <= 0.04) return false;
  return true;
}

function resolveMouseObjectName(hit) {
  const object = hit.object;
  if (object === dnaInstances && Number.isInteger(hit.instanceId)) {
    return `DNA Item #${hit.instanceId + 1}`;
  }

  for (let current = object; current; current = current.parent) {
    const explicitName = current.userData.debugName || current.userData.label || current.name;
    if (explicitName) return explicitName;
  }

  const materialsToCheck = Array.isArray(object.material) ? object.material : [object.material];
  const material = materialsToCheck.find((item) => item?.name);
  if (material?.name) return titleCaseIdentifier(material.name);
  return object.type || object.geometry?.type || "Scene Object";
}

function titleCaseIdentifier(value) {
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function showMouseObjectLabel(label, clientX, clientY) {
  if (!mouseObjectLabelEl) return;

  const margin = 12;
  mouseObjectLabelEl.textContent = label;
  mouseObjectLabelEl.classList.remove("hidden");
  const bounds = mouseObjectLabelEl.getBoundingClientRect();
  const x = Math.min(clientX, window.innerWidth - bounds.width - margin - 14);
  const y = Math.min(clientY, window.innerHeight - bounds.height - margin - 14);
  mouseObjectLabelEl.style.left = `${Math.max(margin, x)}px`;
  mouseObjectLabelEl.style.top = `${Math.max(margin, y)}px`;
}

function hideMouseObjectLabel() {
  if (!mouseObjectLabelEl) return;
  mouseObjectLabelEl.classList.add("hidden");
}

function applyGraphicsSettings(save = true) {
  applyRenderScale();
  applyAsphaltTextureSettings();
  applyRealtimeMaterialTextureSettings();
  applyShadowSettings();
  applyViewDistanceSettings();
  updateHarborVisibility(true);
  applySkyTextureSettings();
  applyLightingSettings();
  applyWaterSettings();
  boostMotionBlurMaterial.uniforms.uStrength.value = boostMotionBlurStrength;
  resize();

  if (save) {
    window.localStorage.setItem(graphicsStorageKey, JSON.stringify(graphicsSettings));
  }
}

function applyRenderScale() {
  renderer.setPixelRatio(getEffectiveRenderScale());
}

function getEffectiveRenderScale() {
  const scale = Number(touchControlsEnabled ? graphicsSettings.mobileRenderScale : graphicsSettings.renderScale);
  return Number.isFinite(scale) && scale > 0 ? scale : Number(graphicsDefaults.renderScale);
}

function applyShadowSettings() {
  const config = shadowQualityConfig[graphicsSettings.shadowQuality] ?? shadowQualityConfig.high;
  const distanceConfig = shadowDistanceConfig[graphicsSettings.shadowDistance] ?? shadowDistanceConfig.far;
  renderer.shadowMap.enabled = config.enabled;
  renderer.shadowMap.type = graphicsSettings.shadowSoftness === "soft"
    ? THREE.PCFSoftShadowMap
    : THREE.PCFShadowMap;

  if (sunLight) {
    sunLight.castShadow = config.enabled;
    sunLight.shadow.mapSize.set(config.size, config.size);
    sunLight.shadow.camera.far = distanceConfig.far;
    sunLight.shadow.camera.left = -distanceConfig.bounds;
    sunLight.shadow.camera.right = distanceConfig.bounds;
    sunLight.shadow.camera.top = distanceConfig.bounds;
    sunLight.shadow.camera.bottom = -distanceConfig.bounds;
    sunLight.shadow.camera.updateProjectionMatrix();
    if (sunLight.shadow.map) {
      sunLight.shadow.map.dispose();
      sunLight.shadow.map = null;
    }
  }

  scene.traverse((object) => {
    if (!object.isMesh) return;
    if (object.userData.defaultCastShadow === undefined) {
      object.userData.defaultCastShadow = object.castShadow;
      object.userData.defaultReceiveShadow = object.receiveShadow;
    }
    object.castShadow = config.enabled && object.userData.defaultCastShadow;
    object.receiveShadow = config.enabled && object.userData.defaultReceiveShadow;
    const materialsToUpdate = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materialsToUpdate) {
      if (material) material.needsUpdate = true;
    }
  });
}

function applyViewDistanceSettings() {
  const config = viewDistanceConfig[graphicsSettings.viewDistance] ?? viewDistanceConfig.high;
  camera.far = config.cameraFar;
  scene.fog.near = config.fogNear;
  scene.fog.far = config.fogFar;
  camera.updateProjectionMatrix();
}

function applyLightingSettings() {
  const config = lightingConfig[graphicsSettings.lighting] ?? lightingConfig.cinematic;
  renderer.toneMapping = config.toneMapping;
  renderer.toneMappingExposure = config.exposure;
  if (hemiLight) hemiLight.intensity = config.hemi;
  if (sunLight) sunLight.intensity = config.sun;
}

function applyWaterSettings(rebuildGeometry = true) {
  if (!waterMesh || !waterMaterial) return;

  const quality = graphicsSettings.waterQuality;
  const config = waterQualityConfig[quality] ?? waterQualityConfig.high;
  if (rebuildGeometry && waterMesh.userData.waterQuality !== quality) {
    waterMesh.geometry.dispose();
    waterMesh.geometry = createWaterGeometry(quality);
    waterMesh.userData.waterQuality = quality;
  }

  waterMaterial.uniforms.uWaveAmplitude.value = config.amplitude;
  waterMaterial.uniforms.uWaveDetail.value = config.detail;
  waterMaterial.uniforms.uWaveSpeed.value = config.speed;
  waterMaterial.uniforms.uFoamStrength.value = config.foam;
  waterMaterial.uniforms.uSparkleStrength.value = config.sparkle;
  waterMaterial.uniforms.uFresnelStrength.value = config.fresnel;
}

function getMotionBlurScale() {
  return motionBlurStrengthConfig[graphicsSettings.motionBlur] ?? motionBlurStrengthConfig.high;
}

function getFrameCap() {
  return graphicsSettings.frameCap === "unlimited" ? 0 : Number(graphicsSettings.frameCap);
}

function setGraphicsPanelOpen(open) {
  if (!graphicsPanel || !graphicsButton) return;
  graphicsPanel.classList.toggle("hidden", !open);
  graphicsButton.setAttribute("aria-expanded", open ? "true" : "false");
  if (open) {
    setMainMenuOpen(false);
    setStageMenuOpen(false);
    setDebugPanelOpen(false);
    setHelpPanelOpen(false);
  }
}

function setDebugPanelOpen(open) {
  if (!debugPanel || !debugButton) return;
  debugPanel.classList.toggle("hidden", !open);
  debugButton.setAttribute("aria-expanded", open ? "true" : "false");
  if (open) {
    setMainMenuOpen(false);
    setStageMenuOpen(false);
    setGraphicsPanelOpen(false);
    setHelpPanelOpen(false);
  }
}

function setHelpPanelOpen(open) {
  if (!helpPanel || !helpButton) return;
  if (open && !isPaused) {
    setPaused(true, "manual");
  }
  helpPanel.classList.toggle("hidden", !open);
  helpButton.setAttribute("aria-expanded", open ? "true" : "false");
  if (open) {
    setMainMenuOpen(false);
    setStageMenuOpen(false);
    setGraphicsPanelOpen(false);
    setDebugPanelOpen(false);
  }
}

async function toggleFullscreen() {
  if (!fullscreenButton || !document.fullscreenEnabled) {
    updateFullscreenButton();
    return;
  }

  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen({ navigationUI: "hide" });
      tryLockLandscape();
    }
  } catch (error) {
    console.warn("Fullscreen request failed", error);
  } finally {
    updateFullscreenButton();
  }
}

function updateFullscreenButton() {
  if (!fullscreenButton) return;

  const available = Boolean(document.fullscreenEnabled);
  fullscreenButton.disabled = !available;
  fullscreenButton.textContent = !available
    ? "Unavailable"
    : document.fullscreenElement ? "Exit Fullscreen" : "Fullscreen";
}

function isGameplayKey(code) {
  return [
    "KeyW",
    "KeyA",
    "KeyS",
    "KeyD",
    "KeyQ",
    "KeyE",
    "KeyI",
    "KeyJ",
    "KeyK",
    "KeyL",
    "KeyO",
    "KeyU",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "Space",
    "ShiftLeft",
    "ShiftRight",
  ].includes(code);
}

function updateHud() {
  const speedCap = debugSuperBoostActive ? 2000 : 400;
  dnaEl.textContent = `${collectedDna}/${dnaItems.length}`;
  speedEl.textContent = `${Math.round(Math.min(getHorizontalSpeed() * speedDisplayScale, speedCap))}`;
  timeEl.textContent = getElapsedSeconds().toFixed(2);
  scoreEl.textContent = `${score}`;
  progressEl.textContent = `${getGoalProgressPercent()}%`;
  heightEl.textContent = `${Math.round(getPlayerHeightAboveSea())}m`;
  boostGaugeEl.textContent = `${Math.round(boostGauge)}%`;
  boostFillEl.style.width = `${boostGauge}%`;
  boostFillEl.parentElement.setAttribute("aria-valuenow", `${Math.round(boostGauge)}`);
}

function getPlayerHeightAboveSea() {
  return player.position.y - player.radius - seaLevelY;
}

function refillBoostGauge() {
  boostGauge = boostGaugeMax;
  updateHud();
}

function warpToGoalProgress(progress) {
  const targetZ = getStageZAtGoalProgress(THREE.MathUtils.clamp(progress, 0, 0.98));
  const sample = getGroundSample(0, targetZ);
  if (!sample) return;

  finished = false;
  hitStun = 0;
  hitCooldown = 0;
  jumpQueued = false;
  jumpHoldRemaining = 0;
  quickStepQueued = 0;
  quickStepTimer = 0;
  quickStepCooldown = 0;
  dashPadBoostRemaining = 0;
  boostMotionBlurTarget = 0;
  boostMotionBlurStrength = 0;
  playerBoostEffectActive = false;
  materials.jetEnergy.opacity = 0;
  boostMotionBlurMaterial.uniforms.uStrength.value = 0;
  if (touchControlsEnabled) resetTouchRunState();
  player.position.set(0, sample.y + player.radius, targetZ);
  player.velocity.set(0, 0, 0);
  player.grounded = true;
  resetCameraView();
  updateHarborVisibility(true);
  clearLooseDnaItems();
  finishEl.classList.add("hidden");
  updateHud();
}

function getGoalProgressPercent() {
  const goalDistance = stageStartZ - goalZ;
  if (goalDistance <= 0) return 0;

  const progress = (stageStartZ - player.position.z) / goalDistance;
  return Math.round(THREE.MathUtils.clamp(progress, 0, 1) * 100);
}

function resetGame(options = {}) {
  setPaused(false, "reset");
  const scoreOverride = Number.isFinite(options.scoreOverride) ? options.scoreOverride : 0;

  finished = false;
  jumpQueued = false;
  jumpHoldRemaining = 0;
  jumpImpact = 0;
  hitCooldown = 0;
  hitStun = 0;
  runPhase = 0;
  quickStepQueued = 0;
  quickStepDirection = 0;
  quickStepTimer = 0;
  quickStepCooldown = 0;
  quickStepStartX = 0;
  quickStepTargetX = 0;
  quickStepFlash = 0;
  boostGauge = boostGaugeMax;
  boostMotionBlurTarget = 0;
  boostMotionBlurStrength = 0;
  playerBoostEffectActive = false;
  materials.jetEnergy.opacity = 0;
  boostMotionBlurMaterial.uniforms.uStrength.value = 0;
  resetCameraView();
  dashPadBoostStartSpeed = 0;
  dashPadBoostRemaining = 0;
  debugSuperBoostActive = false;
  startedAt = performance.now();
  if (touchControlsEnabled) resetTouchRunState();
  collectedDna = 0;
  score = scoreOverride;
  finishEl.classList.add("hidden");
  finishKickerEl.textContent = `${currentStage.label}`;
  finishScoreEl.textContent = "0";
  nextStageButton.classList.add("hidden");
  if (tutorialPromptEl) {
    tutorialPromptEl.classList.add("hidden");
    tutorialPromptEl.textContent = "";
  }

  player.position.copy(stageStart);
  if (Number.isFinite(debugStartZ)) {
    const debugZ = THREE.MathUtils.clamp(debugStartZ, stageEndZ + 8, stageStartZ);
    const sample = getGroundSample(0, debugZ);
    if (sample) {
      player.position.set(0, sample.y + player.radius, debugZ);
    }
  }
  player.velocity.set(0, 0, 0);
  player.yaw = 0;
  player.grounded = false;
  if (player.mesh) {
    player.mesh.scale.set(1, 1, 1);
    setStageObjectTransform(player.mesh, player.position);
  }
  if (player.parts) {
    player.parts.model.position.y = 0.1;
    player.parts.model.rotation.set(0, 0, 0);
    for (const arm of player.parts.arms) arm.rotation.set(0, 0, 0);
    for (const leg of player.parts.legs) {
      leg.rotation.set(0, 0, 0);
      leg.shoe.rotation.set(0, 0, 0);
      leg.shoe.scale.set(1, 1, 1);
    }
    player.parts.head.rotation.set(0, 0, 0);
    for (const line of player.parts.energyLines ?? []) {
      line.visible = false;
      line.scale.setScalar(1);
    }
  }

  for (const dna of dnaItems) {
    dna.collected = false;
    dna.spinAngle = 0;
  }
  refreshDnaInstances();

  clearLooseDnaItems();

  for (const pad of dashPads) {
    pad.cooldown = 0;
  }

  const startFrame = getStageFrame(stageStartZ);
  camera.up.copy(startFrame.up);
  camera.position.copy(toWorldPosition(new THREE.Vector3(0, 5.3, stageStartZ + 8)));
  updateHarborVisibility(true);
  updateHud();
}

function clearLooseDnaItems() {
  for (const loose of looseDnaItems) {
    scene.remove(loose.mesh);
  }
  looseDnaItems.length = 0;
}

function getHorizontalSpeed() {
  return Math.hypot(player.velocity.x, player.velocity.z);
}

function clampHorizontalSpeed(maxSpeed) {
  const speed = getHorizontalSpeed();
  if (speed <= maxSpeed || speed <= 0) return;

  const scale = maxSpeed / speed;
  player.velocity.x *= scale;
  player.velocity.z *= scale;
}

function getElapsedSeconds() {
  if (touchControlsEnabled && !touchInput.runStarted && !finished) {
    return 0;
  }
  return (performance.now() - startedAt) / 1000;
}

function isDown(...codes) {
  return codes.some((code) => keys.has(code));
}

function isJumpHeld() {
  return isDown("Space") || (touchControlsEnabled && touchInput.jump);
}

function moveToward(current, target, maxDelta) {
  if (Math.abs(target - current) <= maxDelta) {
    return target;
  }
  return current + Math.sign(target - current) * maxDelta;
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  const pixelRatio = renderer.getPixelRatio();
  sceneRenderTarget.setSize(
    Math.max(1, Math.floor(width * pixelRatio)),
    Math.max(1, Math.floor(height * pixelRatio)),
  );
  boostMotionBlurMaterial.uniforms.uAspect.value = camera.aspect;
}
