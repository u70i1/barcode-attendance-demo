import StudentCard from "./components/StudentCard";
import InputDevice from "./components/InputDevice";
import "./App.css";

function onScan() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Hi!");
      resolve();
    }, 1000);
  });
}

function App() {
  return (
    <div className="container">
      {/* <StudentCard name="Simon Pegg" nisn="0081234567" time="06:57" /> */}
      <InputDevice onScan={onScan} />
    </div>
  );
}

export default App;
