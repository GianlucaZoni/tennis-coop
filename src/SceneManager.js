import * as THREE from "three";
import Stats from 'three/examples/jsm/libs/stats.module.js';

export class SceneManager {
    constructor() {

        // scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xa7e677);

        // Splitscreen camera
        this.views = [
            {
                // Camera Left
                left: 0,
                top: 0,
                width: window.innerWidth / 2,
                height: window.innerHeight,
                camera: new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight / 2, 1, 1000)
            },
            {
                // Camera Right
                left: window.innerWidth / 2,
                top: 0,
                width: window.innerWidth / 2,
                height: window.innerHeight,
                camera: new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight / 2, 1, 1000)
            }
        ];

        for (let ii = 0; ii < this.views.length; ++ii) {
            const view = this.views[ii];
            if (ii === 0) {
                // Position for Camera Left
                view.camera.position.set(50, 12, 0);
                view.camera.lookAt(0, 0, 0);
            } else if (ii === 1) {
                // Position for Camera Right
                view.camera.position.set(-50, 12, 0);
                view.camera.lookAt(0, 0, 0);
            }
        }

        // renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#court") });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // lighting
        const ambientLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambientLight);

        // helpers
        const gridHelper = new THREE.GridHelper(200, 50);
        const axesHelper = new THREE.AxesHelper(15);
        //this.scene.add(gridHelper, axesHelper);
    }

    resize() {
        for (let ii = 0; ii < this.views.length; ++ii) {
            const view = this.views[ii];
            view.camera.aspect = window.innerWidth / window.innerHeight / 2;
            view.camera.updateProjectionMatrix();
        }
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        for (let i = 0; i < this.views.length; ++i) {
            const view = this.views[i];
            const camera = view.camera;

            this.renderer.setViewport(view.left, view.top, view.width, view.height);
            this.renderer.setScissor(view.left, view.top, view.width, view.height);
            this.renderer.setScissorTest(true);

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            this.renderer.render(this.scene, camera);
        }
    }
}