import { useState } from "react";
import StudentCard from "./components/StudentCard";
import InputDevice from "./components/InputDevice";
import "./App.css";

function App() {
  return (
    <div className="container">
      {/* <StudentCard name="Simon Pegg" nisn="0081234567" time="06:57" /> */}
      <InputDevice />
    </div>
  );
}

export default App;
