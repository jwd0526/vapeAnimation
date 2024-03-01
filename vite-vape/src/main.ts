import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

// init scene
const scene = new THREE.Scene();

// init camera
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-30, 5, 0);
camera.lookAt(scene.position);

// init renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// init orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = true;
controls.enableZoom = true;
controls.enablePan = true;

// init vBody
const roundRectShape = new THREE.Shape();
const x = 3.5, y = 15, z = 10;
const radius = 1.6;
roundRectShape.moveTo(0, radius);
roundRectShape.lineTo(0, y - radius);
roundRectShape.quadraticCurveTo(0, y, radius, y);
roundRectShape.lineTo(x - radius, y);
roundRectShape.quadraticCurveTo(x, y, x, y - radius);
roundRectShape.lineTo(x, radius);
roundRectShape.quadraticCurveTo(x, 0, x - radius, 0);
roundRectShape.lineTo(radius, 0);
roundRectShape.quadraticCurveTo(0, 0, 0, radius);
const extrudeSettings = {
    depth: z,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: radius,
    bevelThickness: radius
};
const vBodyGeometry = new THREE.ExtrudeGeometry(roundRectShape, extrudeSettings);
const material = new THREE.MeshPhongMaterial({ color: 0x70FFBB });
const vBody = new THREE.Mesh(vBodyGeometry, material);
vBody.castShadow = true;

// init vTip
const chamferSize = (Math.PI / 16);
const roundRectShap = new THREE.Shape();
const a = 1.75, b = 2.5, c = 3.5;
const rad = chamferSize;
roundRectShap.moveTo(0, rad);
roundRectShap.lineTo(0, b - rad);
roundRectShap.quadraticCurveTo(0, b, rad, b);
roundRectShap.lineTo(a - rad, b);
roundRectShap.quadraticCurveTo(a, b, a, b - rad);
roundRectShap.lineTo(a, rad);
roundRectShap.quadraticCurveTo(a, 0, a - rad, 0);
roundRectShap.lineTo(rad, 0);
roundRectShap.quadraticCurveTo(0, 0, 0, rad);
const extrudeSetting = {
    depth: c,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: rad,
    bevelThickness: rad
};
const vTipGeometry = new THREE.ExtrudeGeometry(roundRectShap, extrudeSetting);
const vTipMaterial = new THREE.MeshPhongMaterial({ color: 0x70FFBB });
const vTip = new THREE.Mesh(vTipGeometry, vTipMaterial);
vTip.castShadow = true;
vTip.position.set(.95, 16.2, 1.6);

// init shape that blends body and tip
const width = 4; // x-axis
const height = 1.5; // y-axis
const depth = 3.9; // z-axis
const triangleShape = new THREE.Shape();
triangleShape.moveTo(-width / 2, height / 2);
triangleShape.lineTo(width / 2, height / 2);
triangleShape.lineTo(0, -height / 2);
triangleShape.lineTo(-width / 2, height / 2);
const textrudeSettings = {
    depth: depth,
    bevelEnabled: false
};

const triangularPrismGeometry = new THREE.ExtrudeGeometry(triangleShape, textrudeSettings);
const triangularPrismMaterial = new THREE.MeshPhongMaterial({ color: 0x70FFBB }); // Adjust color as needed
const triangularPrism = new THREE.Mesh(triangularPrismGeometry, triangularPrismMaterial);
triangularPrism.castShadow = true;
triangularPrism.position.set(1.81, 16.8, 5.3); // Adjust position as needed
triangularPrism.rotateX(Math.PI)


// ambient light
const ambLight = new THREE.AmbientLight(0xffffff, .2)
scene.add(ambLight);  

// point light
const light2 = new THREE.PointLight(0xffffff, 2, 100); 
light2.position.set(0, 40, 0);
light2.name = "SUNLIGHT";
light2.castShadow = true;
light2.decay = .1;
scene.add(light2);

// shadow light props
light2.shadow.mapSize.width = 2048;
light2.shadow.mapSize.height = 2048;
light2.shadow.camera.near = 0.5;
light2.shadow.camera.far = 100;

// init floor
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI / 2;
floor.position.y = -10;
scene.add(floor);

// init group
const group = new THREE.Group();
group.position.set(-2.5, 5, 1);
group.rotation.y = Math.PI / 2;


// add geometries to the group
group.add(vBody);
group.add(vTip);
group.add(triangularPrism);
group.scale.set(.5,.5,.5)

scene.add(group);

const loader = new FontLoader;
loader.load('path/to/font.json', function (font) {
    const textGeometry = new TextGeometry('Your Text Here', {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: false
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(x, y, z);
    scene.add(textMesh);
});

camera.position.set(0, 25, 30);
camera.lookAt(group.position);

// movement controls
function onDocumentKeyDown(event: KeyboardEvent) {
  var keyCode = event.keyCode;
  if (keyCode == 39) {        // left arrow
      group.rotation.y -= (Math.PI / 16);
  } else if (keyCode == 37) { // right arrow
      group.rotation.y += (Math.PI / 16);
  } else if (keyCode == 38) { // up arrow
      group.rotation.x -= (Math.PI / 16);
  } else if (keyCode == 40) { // down arrow
      group.rotation.x += (Math.PI / 16);
  } else if (keyCode == 87) { //  w
      group.position.z -= (Math.PI / 16);
  } else if (keyCode == 83) { // s
      group.position.z += (Math.PI / 16);
  } else if (keyCode == 68) { // a
      group.position.x += (Math.PI / 16);
  } else if (keyCode == 65) { // d
      group.position.x -= (Math.PI / 16);
  } else if (keyCode == 32) { // space
      group.position.y += (Math.PI / 16);
  } else if (keyCode == 16) { // Lshift
      group.position.y -= (Math.PI / 16);
  } else if (keyCode == 81) { // q
      group.rotation.z += (Math.PI / 16);
  } else if (keyCode == 69) { // e
      group.rotation.z -= (Math.PI / 16);
  }
}

function funnyAnimation() {
  const targetRotation = new THREE.Euler(0, 0, Math.PI / 2);
  const targetPosition = new THREE.Vector3(-2.5, 5, 1);
    function updateRotationAndPosition() {
      const rotationSpeed = 40;
      if (Math.abs(group.rotation.z - targetRotation.z) > 0.01) {
        group.rotation.z += (targetRotation.z - group.rotation.z) / rotationSpeed;
      }
      if (Math.abs(group.rotation.y) > 0.01) {
        group.rotation.y += (0 - group.rotation.y) / rotationSpeed;
      }
      if (Math.abs(group.rotation.x) > 0.01) {
        group.rotation.x += (0 - group.rotation.x) / rotationSpeed;
      }
      const positionSpeed = 40;
      if (group.position.distanceTo(targetPosition) > 0.01) {
        group.position.lerp(targetPosition, 1 / positionSpeed);
      }
      renderer.render(scene, camera);
      if ((Math.abs(group.rotation.z - targetRotation.z) > 0.01 ||
          Math.abs(group.rotation.y) > 0.01 ||
          Math.abs(group.rotation.x) > 0.01 ||
          group.position.distanceTo(targetPosition) > 0.01)) {
        requestAnimationFrame(updateRotationAndPosition);
      } else {
        // when complete, do...
        canDoHeli = false;
        helicopter();
      }
    }
  requestAnimationFrame(updateRotationAndPosition);
}

function helicopter() {
  let rotationSpeed = 0.0005; // Initial rotation speed
  let shakeIntensity = 0.5; // Initial screen shake intensity
  let acceleration = 0.0015; // Acceleration rate for rotation speed
  let shakeDuration = 2000; // Duration of screen shake in milliseconds
  let ySpeed = 0.02; // Initial speed for y position increment
  let yAcceleration = 0.0015; // Acceleration rate for y position speed
  canDoHeli = false;

  function updateRotationAndPosition() {
    // Screen shake effect
    if (shakeDuration > 0) {
      const randomX = Math.random() * shakeIntensity - shakeIntensity / 2;
      const randomY = Math.random() * shakeIntensity - shakeIntensity / 2;
      camera.position.x += randomX;
      camera.position.y += randomY;
      shakeDuration -= 16; // refresh rate of ~60
    } else {
      rotationSpeed += acceleration;
      if (rotationSpeed >= 1.5) {
        if (group.position.y < 60) {
          group.position.y += ySpeed;
          ySpeed += yAcceleration;
        }
      }
      group.rotation.y += rotationSpeed;
    }
    renderer.render(scene, camera);
    if (group.position.y < 60 || shakeDuration > 0) {
      requestAnimationFrame(updateRotationAndPosition);
    }
  }
  requestAnimationFrame(updateRotationAndPosition);
}

function checkPositionalRange() {
  const targetPosition = new THREE.Vector3(0, 18, 30);
  const tolerance = Math.PI; // tolerance for proximity
  const distanceToTarget = group.position.distanceTo(targetPosition);
  if (distanceToTarget < tolerance) {
    funnyAnimation();
  }
}

var canDoHeli: Boolean = true;

document.addEventListener('keydown', onDocumentKeyDown, false);
document.body.appendChild(renderer.domElement);

// animate
function animate() {
  requestAnimationFrame(animate);
  if (canDoHeli == true) { // only checks proximity if it hasn't been in target proximity
    checkPositionalRange()
  }
  controls.update();
  renderer.render(scene, camera);
}

animate();

