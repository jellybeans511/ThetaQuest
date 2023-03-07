
import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

var vrButton = VRButton;

var camera, scene, renderer, clock, sphere;
var video, texture;
let localVideo = document.getElementById("js-local-video");

function init() {

  clock = new THREE.Clock();

  scene = new THREE.Scene();

  const light = new THREE.AmbientLight(0xffff00, 1);
  scene.add(light);

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
  camera.layers.enable(1); // render left view when no stereo available
  //camera.position.set(0, 1.6, 0);
  //scene.add(camera);

  const panoSphereGeo = new THREE.SphereGeometry(6, 256, 256);
  const panoSphereMat = new THREE.MeshStandardMaterial({
    side: THREE.BackSide,
    displacementScale: - 4.0
  });
  sphere = new THREE.Mesh(panoSphereGeo, panoSphereMat);

  const manager = new THREE.LoadingManager();
  const loader = new THREE.TextureLoader(manager);

  video = document.createElement('video');
  video.width = window.innerWidth;
  video.height = window.innerHeight;
  video.autoplay = true;
  video.playsInline = true;

  navigator.mediaDevices.getUserMedia({
    video: {
      width: 3840,
      height: 1920,
      frameRate: 30
    }
  }).then(function (stream) {
    video.srcObject = stream;
    localVideo.srcObject = stream;
    localVideo.autoplay = true;
    localVideo.playsInline = true;
  }).catch(function (err) {
    console.log("An error occurred: " + err);
  });

  texture = new THREE.VideoTexture(video);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101010);



  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBAFormat;

  // left ///////////////////////////////////
/*
  const geometry1 = new THREE.SphereGeometry(500, 60, 40);
  // invert the geometry on the x-axis so that all of the faces point inward
  geometry1.scale(- 1, 1, 1);

  const uvs1 = geometry1.attributes.uv.array;

  for (let i = 0; i < uvs1.length; i += 2) {

    uvs1[i] *= 0.5;

  }

  const material1 = new THREE.MeshBasicMaterial({ map: texture });

  const mesh1 = new THREE.Mesh(geometry1, material1);
  mesh1.rotation.y = - Math.PI / 2;
  mesh1.layers.set(1); // display in left eye only
  scene.add(mesh1);

  // right /////////////////////////////////

  const geometry2 = new THREE.SphereGeometry(500, 60, 40);
  geometry2.scale(-1, 1, 1);

  const uvs2 = geometry2.attributes.uv.array;

  for (let i = 0; i < uvs2.length; i += 2) {

    uvs2[i] *= 0.5;
   // uvs2[i] += 0.5;

  }

  const material2 = new THREE.MeshBasicMaterial({ map: texture });

  const mesh2 = new THREE.Mesh(geometry2, material2);
  mesh2.rotation.y = - Math.PI / 2;
  mesh2.layers.set(2); // display in right eye only
  scene.add(mesh2);
*/
  //Single Display Mode 
  
   const geometry = new THREE.SphereGeometry(500, 60, 40);
   geometry.scale(- 1, 1, 1);
   const material = new THREE.MeshBasicMaterial({ map: texture });

   const mesh = new THREE.Mesh(geometry, material);
   //mesh.rotation.y = - Math.PI / 2;
   scene.add(mesh);
   
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType('local');
  container.appendChild(renderer.domElement);
  
  //document.body.appendChild(renderer.domElement);
  document.body.appendChild(VRButton.createButton(renderer));
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  /*if (video.readyState === video.HAVE_ENOUGH_DATA) {
    texture.needsUpdate = true;
  }*/
  renderer.render(scene, camera);
}

init();
animate();
