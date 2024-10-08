import * as THREE from 'three';
import './style.css'
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

// Create a sphere geometry
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: "#00ff83", roughness: 0.2 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}



// Add a point light
const light = new THREE.PointLight(0xffffff, 50, 100);
light.position.set(0, 10, 10);
scene.add(light);

// Setup camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });

// Set renderer size
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

 // Orbit controls
 const controls = new OrbitControls(camera, canvas);
 controls.enableDamping = true;
 controls.enablePan = false;
 controls.enableZoom = false;
 controls.autoRotate = true;
 controls.autoRotateSpeed = 5;


// Create star geometry and material
const starGeometry = new THREE.SphereGeometry(0.1, 24, 24);
const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

// Function to create a star
const createStar = () => {
  const star = new THREE.Mesh(starGeometry, starMaterial);

  // Randomly position the star
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
  return star;
};

// Create multiple stars
const stars = Array(200).fill().map(createStar);

// Animate the stars
gsap.to(stars, {
  z: "+=50",
  repeat: -1,
  yoyo: true,
  ease: "none",
  duration: 50,
  onUpdate: () => {
    stars.forEach(star => {
      if (star.position.z > 50) {
        star.position.z = -50;
      }
    });
  },
});



//Resize
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  // renderer.render(scene, camera);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}
loop();

// Timeline 
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z:0, x:0, y:0 }, { z:1, x:1, y:1 })
tl.fromTo('nav', { y: "-100%"}, { y: "0%"})
tl.fromTo('.tittle', { opacity: 0 }, { opacity: 1 })

// Mouse Animation
let mouseDown = false
let rgb = [];
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

window.addEventListener('mousemove', (e) => {
    if (mouseDown) {
      rgb = [
        Math.round((e.pageX / sizes.width) * 255),
        Math.round((e.pageY / sizes.height) * 255),
        150,
      ]
      let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
      gsap.to(mesh.material.color, {
        r: newColor.r,
        g: newColor.g,
        b: newColor.b,
        ease: 'elastic.out',
        duration: 0.5,
      })
    }
})
