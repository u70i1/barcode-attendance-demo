import "./Printer.css";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Printer({ status }) {
  const displayText = status ?? "WAITING";
  const fullText = `${displayText}`;
  const [displayChars, setDisplayChars] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setDisplayChars("");

    let index = 0;

    intervalRef.current = setInterval(() => {
      if (index < fullText.length) {
        setDisplayChars(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(intervalRef.current);
      }
    }, 10);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fullText]);

  return (
    <div className="printer">
      <div className="printer-panel">
        <div className="printer-line-wrapper">
          <span className="printer-text">{displayChars}</span>
        </div>
      </div>
    </div>
  );
}
