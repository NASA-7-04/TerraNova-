//SceneManager.js
import {initialize} from './Initialize';
let scene = null;

export const SceneManager = {
  setScene(newScene) {
    scene = newScene;
  },
  getScene() {
    return scene;
  },
  init(newScene) {
    scene = newScene;
    initialize();
  }
};