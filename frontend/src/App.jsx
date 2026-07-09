import { useState } from "react";
import StudentCard from "./components/StudentCard";
import "./App.css";

function App() {
  return (
    <div className="container">
      <StudentCard name="Simon Pegg" nisn="0081234567" time="06:57" />
    </div>
  );
}

export default App;
