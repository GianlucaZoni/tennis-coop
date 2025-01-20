import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SceneManager } from "./src/SceneManager";
import { Court } from "./src/Court.js";
import { Net } from "./src/Net";
import { Racket } from "./src/Racket.js";
import { Ball } from "./src/Ball";
import Stats from 'three/examples/jsm/libs/stats.module.js';
import GUI from 'lil-gui';

const stats = new Stats();
document.body.appendChild(stats.dom);

/*
const gui = new GUI();
//const friction = gui.add("friction", 0.99, 0, 1, 0.01);
const guiFriction = {Friction: 0.99};
const guiAcceleration = {Acceleration: 0.002};

gui.add(guiFriction, "Friction", 0, 1, 0.01);
gui.add(guiAcceleration, "Acceleration", 0, 1, 0.001);
*/



const sm = new SceneManager();
const scene = sm.scene;
//const camera = sm.camera;
//const camera1 = sm.camera1;
//const camera2 = sm.camera2;
const renderer = sm.renderer;

//const controls = new OrbitControls(camera, renderer.domElement);
//const controls2 = new OrbitControls(camera2, renderer.domElement);
const loader = new GLTFLoader();

const court = new Court(scene);
const net = new Net(scene, loader);
const ball = new Ball(scene);

const player1Position = { x: 25, y: 2.5, z: 0 };
const player2Position = { x: -25, y: 2.5, z: 0 };
const player1Controls = { up: "w", left: "a", down: "s", right: "d", swing: " " };
// const player2Controls = { up: "ArrowUp", left: "ArrowLeft", down: "ArrowDown", right: "ArrowRight", swing: "Enter" };
const player2Controls = { up: "ArrowDown", left: "ArrowRight", down: "ArrowUp", right: "ArrowLeft", swing: "Enter" };
const player1 = new Racket(scene, loader, player1Position, 1, player1Controls);
const player2 = new Racket(scene, loader, player2Position, -1, player2Controls);

court.render();
net.render();
ball.render();
player1.render();
player2.render();

// handle resize
window.addEventListener("resize", e => sm.resize(), false);

// handle inputs
let keyboard = {};
document.addEventListener("keydown", e => keyboard[e.key] = true );
document.addEventListener("keyup", e => keyboard[e.key] = false );

// reset
function reset() {
    ball.serve(1);
    ball.score = [0, 0];

    player1.x = player1Position.x;
    player1.y = player1Position.y;
    player1.z = player1Position.z;

    player1.dx = 0;
    player1.dy = 0;
    player1.dz = 0;
    
    player1.rotation = { x: 0, y: 0, z: 0 };

    player1.charge = 0;
    player1.charging = false;
    player1.swinging = false;

    player2.x = player2Position.x;
    player2.y = player2Position.y;
    player2.z = player2Position.z;

    player2.dx = 0;
    player2.dy = 0;
    player2.dz = 0;
    
    player2.rotation = { x: 0, y: 0, z: 0 };

    player2.charge = 0;
    player2.charging = false;
    player2.swinging = false;
}

// animation loop
let t0 = 0;

function animate(timestamp) {
    let dt = timestamp - t0;
    t0 = timestamp;
    
    if (keyboard["r"]) reset();
    
    ball.update(net, player1, player2, dt);
    player1.update(keyboard, ball, dt);
    player2.update(keyboard, ball, dt);
    //renderer.render(scene, camera);
    
    requestAnimationFrame(animate);
    sm.render();
    stats.update();

}

animate();
//stats.update();