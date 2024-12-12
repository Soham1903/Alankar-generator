import React, { useState } from "react";
import { FaUndo, FaTrashAlt } from "react-icons/fa";
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
};

const findKeyByValue = (map, value) => {
  return Object.keys(map).find((key) => map[key] === value) || null;
};

const App = () => {
  const [straightPattern, setStraightPattern] = useState([]);
  const [reversePattern, setReversePattern] = useState([]);
  const [straightOutput, setStraightOutput] = useState([]);
  const [reverseOutput, setReverseOutput] = useState([]);
  const [currentNote, setCurrentNote] = useState(null); // State for highlighting the current note
  const [tempo, setTempo] = useState(120); // Tempo state

  const playNoteSound = async (note) => {
    const audio = new Audio(`/sounds/${note}.mp3`);
    await audio.play();
  };

  const handleNoteClick = (note, type) => {
    playNoteSound(note);
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

  const clearStraightPattern = () => {
    setStraightPattern([]);
    setStraightOutput([]);
  };

  const clearReversePattern = () => {
    setReversePattern([]);
    setReverseOutput([]);
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

  const calculateDelay = (pattern) => {
    // Adjust delay based on the tempo
    const notesPerMeasure = pattern.length; // Use the length of the current pattern
    return 60000 / tempo / notesPerMeasure;
  };

  const playPatternWithHighlights = async (pattern, map) => {
    const noteDelay = calculateDelay(pattern);
    const lineDelay = noteDelay * 2; // Delay between lines (can adjust as needed)

    for (const line of pattern) {
      for (const note of line) {
        setCurrentNote(note); // Highlight the current note
        await playNoteSound(note);
        await new Promise((resolve) => setTimeout(resolve, noteDelay)); // Delay between notes
      }
      setCurrentNote(null); // Clear highlight between lines
      await new Promise((resolve) => setTimeout(resolve, lineDelay)); // Delay between lines
    }
  };

  const handleTempoChange = (e) => {
    const newTempo = parseInt(e.target.value, 10);
    if (!isNaN(newTempo)) {
      setTempo(newTempo);
    }
  };

  return (
    <div className="container">
      <h2>🎵 Alankar Generator 🎵</h2>

      <div className="tempo-container">
        <h3>Set Tempo (BPM)</h3>
        <input
          type="range"
          min="40"
          max="200"
          value={tempo}
          onChange={(e) => setTempo(e.target.value)}
          className="tempo-slider"
        />
        <input
          type="number"
          value={tempo}
          onChange={handleTempoChange}
          min="40"
          max="200"
          className="tempo-input"
        />
        <div>Tempo: {tempo} BPM</div>
      </div>

      <div className="pattern-container">
        <h3>Select Notes for आरोह</h3>
        {Object.keys(notesMap).map((note) => (
          <button
            key={note}
            onClick={() => handleNoteClick(note, "straight")}
            className={`note-button ${currentNote === note ? "highlight" : ""}`}
          >
            {note}
          </button>
        ))}
        <div className="selected-notes">
          Selected: {straightPattern.join(" ")}
        </div>
        <button onClick={undoStraightNote} className="undo-button">
          <FaUndo />
        </button>
        <button onClick={clearStraightPattern} className="clear-button">
          <FaTrashAlt />
        </button>
        <button onClick={generateStraightPattern} className="generate-button">
          Generate आरोह
        </button>
        <button
          onClick={() => playPatternWithHighlights(straightOutput, notesMap)}
          className="play-button"
        >
          Play आरोह
        </button>
      </div>

      <div className="pattern-container">
        <h3>Select Notes for अवरोह</h3>
        {Object.keys(reverseNotesMap).map((note) => (
          <button
            key={note}
            onClick={() => handleNoteClick(note, "reverse")}
            className={`note-button ${currentNote === note ? "highlight" : ""}`}
          >
            {note}
          </button>
        ))}
        <div className="selected-notes">
          Selected: {reversePattern.join(" ")}
        </div>
        <button onClick={undoReverseNote} className="undo-button">
          <FaUndo />
        </button>
        <button onClick={clearReversePattern} className="clear-button">
          <FaTrashAlt />
        </button>
        <button onClick={generateReversePattern} className="generate-button">
          Generate अवरोह
        </button>
        <button
          onClick={() =>
            playPatternWithHighlights(reverseOutput, reverseNotesMap)
          }
          className="play-button"
        >
          Play अवरोह
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
