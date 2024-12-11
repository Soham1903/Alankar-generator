import React, { useState } from "react";
import "./AlankarGenerator.css";

const notesMap = {
  सा: 1,
  रे: 2,
  ग: 3,
  म: 4,
  प: 5,
  ध: 6,
  नि: 7,
  सां: 8,
  रें: 9,
  गं: 10,
};

const reverseNotesMap = {
  गं: 1,
  रें: 2,
  सां: 3,
  नि: 4,
  ध: 5,
  प: 6,
  म: 7,
  ग: 8,
  रे: 9,
  सा: 10,
  ऩि: 11,
  ध़: 12,
};

const findKeyByValue = (map, value) => {
  return Object.keys(map).find((key) => map[key] === value) || null;
};

const App = () => {
  const [straightPattern, setStraightPattern] = useState([]);
  const [reversePattern, setReversePattern] = useState([]);
  const [straightOutput, setStraightOutput] = useState([]);
  const [reverseOutput, setReverseOutput] = useState([]);

  const handleNoteClick = (note, type) => {
    if (type === "straight") {
      setStraightPattern([...straightPattern, note]);
    } else {
      setReversePattern([...reversePattern, note]);
    }
  };

  const undoStraightNote = () => {
    setStraightPattern(straightPattern.slice(0, -1));
  };

  const undoReverseNote = () => {
    setReversePattern(reversePattern.slice(0, -1));
  };

  const generateStraightPattern = () => {
    const numericPattern = straightPattern.map((note) => notesMap[note]);
    const output = [];

    let stop = false;
    for (let j = 0; !stop && j <= 8; j++) {
      const line = numericPattern
        .map((num) => findKeyByValue(notesMap, num + j))
        .filter((note) => note !== null);

      output.push(line);
      if (line[line.length - 1] === "सां") {
        stop = true;
      }
    }
    setStraightOutput(output);
  };

  const generateReversePattern = () => {
    const numericPattern = reversePattern.map((note) => reverseNotesMap[note]);
    const output = [];

    let stop = false;
    for (let j = 0; !stop && j <= 9; j++) {
      const line = numericPattern
        .map((num) => findKeyByValue(reverseNotesMap, num + j))
        .filter((note) => note !== null);

      output.push(line);
      if (line[line.length - 1] === "सा") {
        stop = true;
      }
    }
    setReverseOutput(output);
  };

  return (
    <div className="container">
      <h2>🎵 Alankar Generator 🎵</h2>

      <div className="pattern-container">
        <h3>Select Notes for आरोह</h3>
        {Object.keys(notesMap).map((note) => (
          <button
            key={note}
            onClick={() => handleNoteClick(note, "straight")}
            className="note-button"
          >
            {note}
          </button>
        ))}
        <div className="selected-notes">
          Selected: {straightPattern.join(" ")}
        </div>
        <button onClick={undoStraightNote} className="undo-button">
          Undo
        </button>
        <button onClick={generateStraightPattern} className="generate-button">
          Generate आरोह
        </button>
      </div>

      <div className="pattern-container">
        <h3>Select Notes for अवरोह</h3>
        {Object.keys(reverseNotesMap).map((note) => (
          <button
            key={note}
            onClick={() => handleNoteClick(note, "reverse")}
            className="note-button"
          >
            {note}
          </button>
        ))}
        <div className="selected-notes">
          Selected: {reversePattern.join(" ")}
        </div>
        <button onClick={undoReverseNote} className="undo-button">
          Undo
        </button>
        <button onClick={generateReversePattern} className="generate-button">
          Generate अवरोह
        </button>
      </div>

      <div className="output-container">
        <h3>आरोह Pattern:</h3>
        {straightOutput.map((line, index) => (
          <div key={index} className="output-line">
            {line.join(" ")}
          </div>
        ))}
      </div>

      <div className="output-container">
        <h3>अवरोह Pattern:</h3>
        {reverseOutput.map((line, index) => (
          <div key={index} className="output-line">
            {line.join(" ")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;