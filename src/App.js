// App.js
import './assets/css/stylesheet.css';
import './assets/css/App.css';
import WelcomeWindow from './components/home/Welcome.js';
import {PlanetSelection} from './components/home/PlanetSelection.js';
import { Menu1, WhiteFrameOnRight } from './components/home/WhiteFrameOnRight.js';
import {GameFrame} from './game/GameScene.js';

function App() {
  return (
    <div className="App">
      <Menu1 />
      <div style = {{
        width : "75%",
        height : "100vh",
        zIndex : 1,
      }}>
      <GameFrame />
      </div>
    </div>
  );
}

export default App;
