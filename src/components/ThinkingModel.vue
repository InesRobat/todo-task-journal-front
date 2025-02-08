<template>
  <div ref="container" class="thinking-model-container"></div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import modelUrl from "@/assets/models/daydreaming.glb";

export default {
  name: "ThinkingModel",
  mounted() {
    this.init3DScene();
    window.addEventListener("resize", this.onWindowResize, false);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
  },
  methods: {
    init3DScene() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.renderer = new THREE.WebGLRenderer({ antialias: true });

      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setSize(window.innerWidth / 2, 400);
      this.$refs.container.appendChild(this.renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0x404040, 10);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
      directionalLight.position.set(5, 5, 5).normalize();
      this.scene.add(directionalLight);

      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          this.model = gltf.scene;
          this.scene.add(this.model);

          this.model.scale.set(1, 1, 1);
          this.model.position.set(0, 0, 0);

          this.animate();
        },
        undefined,
        (error) => {
          console.error("Error loading model:", error);
        }
      );

      this.camera.position.z = 6;

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.25;
      this.controls.screenSpacePanning = false;
    },

    animate() {
      const animate = () => {
        requestAnimationFrame(animate);

        if (this.model) {
          this.model.rotation.y += 0.01;
        }

        this.renderer.render(this.scene, this.camera);
      };
      animate();
    },

    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth / 2, 400);
    },
  },
};
</script>

<style scoped>
.thinking-model-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>
