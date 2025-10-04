// CreatePlanet.js
import * as BABYLON from 'babylonjs';
import { SceneManager } from './SceneManager';

export function InsertPlanet() {
    const scene = SceneManager.getScene();

  BABYLON.ImportMeshAsync("./game/assets/models/Skybox.glb", scene).then((meshes) => {
        meshes.meshes[0].position = new BABYLON.Vector3(0, 0, 0);
        meshes.meshes[0].scaling = new BABYLON.Vector3(1000, 1000, 1000);
        console.log("Meshes loaded:", meshes);
    }).catch((error) => {
        console.error("Error loading meshes:", error);
    });
    
    
  BABYLON.ImportMeshAsync("./game/assets/models/Planets.glb", scene).then((meshes) => {
        meshes.meshes[0].position = new BABYLON.Vector3(0, 0, 0);
        meshes.meshes[0].scaling = new BABYLON.Vector3(2, 2, 2);
        console.log("Meshes loaded:", meshes);
    }).catch((error) => {
        console.error("Error loading meshes:", error);
    });
    
  BABYLON.ImportMeshAsync("./game/assets/models/Kepler_22b.glb", scene).then((meshes) => {
        meshes.meshes[0].position = new BABYLON.Vector3(500,500,500);
        meshes.meshes[0].scaling = new BABYLON.Vector3(2, 2, 2);
    });
}