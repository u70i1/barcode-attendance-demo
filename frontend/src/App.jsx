import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StudentCard from "./StudentCard/StudentCard";
import InputDevice from "./InputDevice/InputDevice";
import "./App.css";
import printSound from "./assets/audio/card.wav";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function App() {
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const printCardSound = useRef(new Audio(printSound));

  async function handleScan(nisn) {
    setError(null);
    setIsLoading(true);
    setStudent(null);

    try {
      const response = await fetch(`${API_BASE_URL}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nisn }),
      });

      if (!response.ok) {
        throw new Error(
          `Scan failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      setStudent(data);
      printCardSound.current.play();
    } catch (err) {
      console.error("Scan error:", err);
      setError("Failed to scan card. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-container">
      <div className="deck-container">
        <AnimatePresence>
          {student && (
            <motion.div
              style={{ position: "absolute", top: "50%" }}
              key={student.nisn}
              initial={{ y: "-150%", opacity: 1 }}
              animate={{ y: "-50%", opacity: 1 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <StudentCard
                name={student.name}
                nisn={student.nisn}
                time={student.timestamp}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* TODO: Add more status message like error */}
        {isLoading && <div className="status-message">Scanning...</div>}
      </div>

      <InputDevice onScan={handleScan} />
    </div>
  );
}

export default App;
