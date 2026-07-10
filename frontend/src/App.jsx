import { useState } from "react";
import StudentCard from "./components/StudentCard";
import Input from "./components/Input";
import "./App.css";

function App() {
  return (
    <div className="container">
      {/* <StudentCard name="Simon Pegg" nisn="0081234567" time="06:57" /> */}
      <Input />
    </div>
  );
}

export default App;
