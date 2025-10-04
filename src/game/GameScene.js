// GameScene.js
import React, {useRef, useEffect} from 'react';
// Load babylon.js
import * as BABYLON from 'babylonjs';

import 'babylonjs-loaders';
import 'babylonjs-materials';
import 'babylonjs-gui';
import 'babylonjs-serializers';
import { AdvancedDynamicTexture, Control, TextBlock } from 'babylonjs-gui';

export  function createScene(engine, canvas) {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera("cam", Math.PI / 2, Math.PI / 3, 10, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true, true);

  new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Add Texture
  const result = BABYLON.ImportMeshAsync("./game/assets/models/Planets.glb", scene);
    result.then((meshes) => {
        meshes.meshes[0].position = new BABYLON.Vector3(0, 0, 0);
        meshes.meshes[0].scaling = new BABYLON.Vector3(2, 2, 2);
        console.log("Meshes loaded:", meshes);
    }).catch((error) => {
        console.error("Error loading meshes:", error);
    });
    
    
  const result2 = BABYLON.ImportMeshAsync("./game/assets/models/Planets.glb", scene);
    result.then((meshes) => {
        meshes.meshes[0].position = new BABYLON.Vector3(0, 0, 0);
        meshes.meshes[0].scaling = new BABYLON.Vector3(100, 100, 100);
        meshes.meshes[0].lightSources = [];
        console.log("Meshes loaded:", meshes);
    }).catch((error) => {
        console.error("Error loading meshes:", error);
    });

  return scene;
}

export function GameFrame({ onSceneReady }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect( () => {
    if (!canvasRef.current) return;

    const engine = new BABYLON.Engine(canvasRef.current, true, { preserveDrawingBuffer: true, stencil: true });
    engineRef.current = engine;

    const scene =  createScene(engine, canvasRef.current);
    sceneRef.current = scene;

    // optional callback to parent (expose scene/engine)
    if (onSceneReady) onSceneReady({ scene, engine, canvas: canvasRef.current });

    engine.runRenderLoop(() => {
      if (scene && !scene.isDisposed) scene.render();
    });

    const handleResize = () => {
      try { engine.resize(); } catch (e) {}
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      try {
        scene.dispose();
        engine.dispose();
      } catch (e) {}
      engineRef.current = null;
      sceneRef.current = null;
    };
  }, [onSceneReady]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
      touch-action="none"
    />
  );
}