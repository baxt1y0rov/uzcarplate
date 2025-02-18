import { useRef } from "react";
import html2canvas from "html2canvas";
import "./App.css";
import Flag from "./assets/flag.jpeg";

function App() {
  const plateRef = useRef(null);

  const downloadLicensePlate = async () => {
    if (!plateRef.current) return;
  
    // Convert inputs to spans for better rendering
    const inputs = plateRef.current.querySelectorAll("input");
    const inputValues = [];
  
    inputs.forEach((input, index) => {
      inputValues.push(input.value || input.placeholder); // Store value or placeholder
      const span = document.createElement("span");
      span.textContent = input.value || input.placeholder;
      span.style.cssText = `
        display: inline-block;
        width: ${input.offsetWidth}px;
        height: ${input.offsetHeight}px;
        text-align: center;
        font-size: ${window.getComputedStyle(input).fontSize};
        font-family: ${window.getComputedStyle(input).fontFamily};
        font-weight: ${window.getComputedStyle(input).fontWeight};
      `;
      input.replaceWith(span);
      input.dataset.tempSpan = index;
    });
  
    // Take screenshot
    const canvas = await html2canvas(plateRef.current, {
      backgroundColor: 'rgba(52, 52, 52, 0.0)', // Ensures correct background
      scale: 4, // Improves resolution
      useCORS: true,
    });
  
    // Restore inputs
    plateRef.current.querySelectorAll("span").forEach((span) => {
      const index = span.dataset.tempSpan;
      if (index !== undefined) {
        const input = document.createElement("input");
        input.type = "text";
        input.value = inputValues[index];
        input.style.cssText = span.style.cssText; // Maintain styling
        span.replaceWith(input);
      }
    });
  
    // Save the image
    const image = canvas.toDataURL("image/png");
    const filename = `${inputValues.join("")}.png`;
  
    const link = document.createElement("a");
    link.href = image;
    link.download = filename;
    link.click();
  };


  const handleInput = (e, maxLength, type, nextFieldId, prevFieldId) => {
    let value = e.target.value.toUpperCase(); 

    if (type === "number") value = value.replace(/\D/g, ""); 
    if (type === "letter") value = value.replace(/[^A-Z]/g, ""); 

    if (value.length > maxLength) value = value.slice(0, maxLength); 
    e.target.value = value; 
    if (value.length === maxLength && nextFieldId) {
      document.getElementById(nextFieldId)?.focus();
    }
  };


  const handleBackspace = (e, prevFieldId) => {
    if (e.key === "Backspace" && e.target.value.length === 0 && prevFieldId) {
      document.getElementById(prevFieldId)?.focus();
    }
  };

  return (
    <div className="container">
      <div className="license-plate" ref={plateRef}>
        <div className="left-section">
          <input
            className="tleft-section"
            id="region"
            type="text"
            placeholder="--"
            maxLength="2"
            onInput={(e) => handleInput(e, 2, "number", "letter1", null)}
            onKeyDown={(e) => handleBackspace(e, null)}
          />
        </div>
        <div className="divider"></div>
        <div className="right-section">
          <div className="plate-number">
            <input
              className="plate-number1"
              id="letter1"
              type="text"
              placeholder="_"
              maxLength="1"
              onInput={(e) => handleInput(e, 1, "letter", "number", "region")}
              onKeyDown={(e) => handleBackspace(e, "region")}
            />
            <input
              className="plate-number2"
              id="number"
              type="text"
              placeholder="---"
              maxLength="3"
              onInput={(e) => handleInput(e, 3, "number", "letter2", "letter1")}
              onKeyDown={(e) => handleBackspace(e, "letter1")}
            />
            <input
              className="plate-number3"  
              id="letter2"
              type="text"
              placeholder="__"
              maxLength="2"
              onInput={(e) => handleInput(e, 2, "letter", null, "number")}
              onKeyDown={(e) => handleBackspace(e, "number")}
            />
          </div>
          <div className="country-code">
            <div className="flag">
              <img src={Flag} alt="flag" />
            </div>
            <span className="uz">UZ</span>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button className="download-btn" onClick={downloadLicensePlate}>
        Download License Plate
      </button>
    </div>
  );
}

export default App;