import { useRef } from "react";
import html2canvas from "html2canvas";
import "./App.css";
import Flag from "./assets/flag.jpeg";

function App() {
  const plateRef = useRef(null);

  const downloadLicensePlate = async () => {
    if (!plateRef.current) return;

    // Extract the content from all relevant spans
    const licensePlateContent = Array.from(plateRef.current.querySelectorAll('span')).map(span => span.textContent.trim()).join('');
    
    // Use the extracted content as the filename (e.g., "01A123BC")
    const filename = `${licensePlateContent}.png`;

    const canvas = await html2canvas(plateRef.current, {
      backgroundColor: null,
      scale: 6,
    });

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = filename; // Set the dynamically generated filename
    link.click();
  };

  // Function to handle input while preserving placeholders
  const handleInput = (e, maxLength, type, placeholder) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const startOffset = range.startOffset;

    let text = e.target.textContent;


    if (type === "number") {
      text = text.replace(/\D/g, "");
    } else if (type === "letter") {
      text = text.replace(/[^A-Z]/g, "").toUpperCase(); // Only uppercase letters
    }

    if (text.length > maxLength) {
      text = text.substring(0, maxLength);
    }

    // Replace the placeholder with the new input
    if (placeholder === "--" && text.length < 2) {
      text = "--".slice(0, text.length) + text;
    } else if (placeholder === "_" && text.length < 1) {
      text = "_".slice(0, text.length) + text;
    }

    e.target.textContent = text;

    // Restore cursor position
    const newOffset = Math.min(startOffset, text.length);
    range.setStart(e.target.childNodes[0], newOffset);
    range.setEnd(e.target.childNodes[0], newOffset);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <div className="container">
      <div className="license-plate" ref={plateRef}>
        <div className="left-section">
          <span
            contentEditable
            onInput={(e) => handleInput(e, 2, "number", "--")} // Max 2 digits
          >
            --
          </span>
        </div>
        <div className="divider"></div>
        <div className="right-section">
          <div className="plate-number">
            <span
              className="letter"
              contentEditable
              onInput={(e) => handleInput(e, 1, "letter", "_")} // Max 1 letter
            >
              _
            </span>
            <span
              className="number"
              contentEditable
              onInput={(e) => handleInput(e, 3, "number", "--")} // Max 3 digits
            >
              ---
            </span>
            <span
              className="letter"
              contentEditable
              onInput={(e) => handleInput(e, 2, "letter", "_")} // Max 2 letters
            >
              __
            </span>
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