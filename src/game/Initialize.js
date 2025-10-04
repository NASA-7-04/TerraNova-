// Initialize.js
import { GameCamera, GameObject, } from './objects/ObjectClasses';
import * as BABYLON from 'babylonjs';

export function initialize(){
    const Skybox = new GameObject("Skybox",{
        meshId : "./game/assets/models/Skybox.glb",
        size : new BABYLON.Vector3(1000,1000,1000),
    });
    const Camera = new GameCamera("Camera",{
        position : new BABYLON.Vector3(0,5,-10),
        target : new BABYLON.Vector3(0,0,0),
        fov : 0.8,
    });
    const Earth = new GameObject("Earth",{
        meshId : "./game/assets/models/Earth.glb",
    });
    Earth.onMouseClick.connect(() => {
        Camera.tweenToTargetObject(Earth);
    });

    const Planet55CancriE = new GameObject("Planet55CancriE",{
        meshId : "./game/assets/models/55_cancri_e.glb",
        position : new BABYLON.Vector3(100,100,100),
    });
    Planet55CancriE.onMouseClick.connect(() => {
        Camera.tweenToTargetObject(Planet55CancriE);
    });

    const Kepler22B = new GameObject("Kepler22B",{
        meshId : "./game/assets/models/Kepler_22b.glb",
        position : new BABYLON.Vector3(-192,-191,41),
    });
    Kepler22B.onMouseClick.connect(() => {
        Camera.tweenToTargetObject(Kepler22B);
    });

    const Trappist1E = new GameObject("Trappist1E",{
        meshId : "./game/assets/models/Trappist_1e.glb",
        position : new BABYLON.Vector3(1,201,-255),
    });
    Trappist1E.onMouseClick.connect(() => {
        Camera.tweenToTargetObject(Trappist1E);
    });

}