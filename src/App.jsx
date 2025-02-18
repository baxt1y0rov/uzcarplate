import { useRef } from "react";
import html2canvas from "html2canvas";
import "./App.css";
import Flag from "./assets/flag.jpeg";

function App() {
  const plateRef = useRef(null);

  // Function to extract and use the license plate text as filename
  const downloadLicensePlate = async () => {
    if (!plateRef.current) return;

    // Get text from input fields and join them
    const licensePlateContent = Array.from(plateRef.current.querySelectorAll("input"))
      .map(input => input.value.trim() || input.placeholder)
      .join("");

    const filename = `${licensePlateContent}.png`;

    const canvas = await html2canvas(plateRef.current, {
      backgroundColor: null,
      scale: 6,
    });

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = filename;
    link.click();
  };

  // Handle user input and automatically move between fields
  const handleInput = (e, maxLength, type, nextFieldId, prevFieldId) => {
    let value = e.target.value.toUpperCase(); // Convert to uppercase

    if (type === "number") value = value.replace(/\D/g, ""); // Only numbers
    if (type === "letter") value = value.replace(/[^A-Z]/g, ""); // Only uppercase letters

    if (value.length > maxLength) value = value.slice(0, maxLength); // Limit length
    e.target.value = value; // Set cleaned value

    // Move to next input when max length reached
    if (value.length === maxLength && nextFieldId) {
      document.getElementById(nextFieldId)?.focus();
    }
  };

  // Handle backspace: move to previous field when empty
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