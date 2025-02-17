import './App.css'
import Flag from './assets/flag.jpeg'

function App() {
  return (
    <div className="license-plate">
      <div className="left-section">
        <span>01</span>
      </div>
      <div className="divider"></div>
      <div className="right-section">
        <div className="plate-number">
          <span className="letter">F</span>
          <span className="number">345</span>
          <span className="letter">NB</span>
        </div>
        <div className="country-code">
          <div className="flag">
           <img src={Flag} alt="flag" />
          </div>
          <span className="uz">UZ</span>
        </div>
      </div>
    </div>
  )
}

export default App