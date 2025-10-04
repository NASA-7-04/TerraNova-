// App.js
import './assets/css/stylesheet.css';
import './assets/css/App.css';
import WelcomeWindow from './components/home/Welcome.js';
import {PlanetSelection} from './components/home/PlanetSelection.js';
import { WhiteFrameOnRight } from './components/home/WhiteFrameOnRight.js';

function App() {
  return (
    <div className="App">
      <WhiteFrameOnRight>
        <WelcomeWindow />
      </WhiteFrameOnRight>
    </div>
  );
}

export default App;
