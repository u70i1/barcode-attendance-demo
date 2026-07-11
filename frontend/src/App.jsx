import StudentCard from "./components/StudentCard";
import InputDevice from "./components/InputDevice";
import "./App.css";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [isCardPlaced, setIsCardPlaced] = useState(false);
  const [student, setStudent] = useState(null);
  // const [student, setStudent] = useState(null);

  async function handleScan(nisn) {
    try {
      const response = await fetch("http://localhost:8000/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nisn }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      setStudent(data);
      return data;
    } catch (err) {}
  }

  return (
    <div className="app-container">
      <div className="deck-container">
        <AnimatePresence>
          {student && (
            <motion.div
              style={{ position: "absolute", top: "50%" }}
              key={student.nisn + student.time}
              initial={{ y: "-150%", opacity: 1 }}
              animate={{ y: "-50%", opacity: 1 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.6, ease: [0, 0.99, 0.37, 0.96] }}
            >
              <StudentCard
                key={student.nisn + student.time}
                name={student.name}
                nisn={student.nisn}
                time={student.time}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <InputDevice onScan={handleScan} />
    </div>
  );
}

export default App;
