import "./InputDevice.css";

import logo from "../assets/school-logo.png";
import screw from "../assets/screw.png";
import OtpInput from "react-otp-input";
import { useEffect, useState, useRef } from "react";

import Cable from "./sub-components/Cable";

function InputDevice({ onScan }) {
  const now = new Date();
  const hh_mm = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const [nisn, setNisn] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    if (!isScanning) {
      const firstInput = containerRef.current?.querySelector("input");
      firstInput?.focus();
    }
  }, [isScanning]);

  useEffect(() => {
    if (nisn.length === 10) {
      const scanned = async () => {
        setNisn("");
        setIsScanning(true);
        await onScan();
        setIsScanning(false);
      };
      scanned();
    }
  }, [nisn]);

  return (
    <>
      <Cable />
      <div className="input-device">
        <img src={screw} className="screw tl" alt="screw" />
        <img src={screw} className="screw tr" alt="screw" />
        <img src={screw} className="screw dl" alt="screw" />
        <img src={screw} className="screw dr" alt="screw" />
        <div className="device-header">
          <img src={logo} alt="" className="device-logo" />
          <p className="device-title">
            rapture high school of art · attendance terminal
          </p>
        </div>

        <div className="input-panel">
          <div className="panel-clock">
            <span className="time">{hh_mm}</span>
            <span className="date">RAB 07 Jul</span>
          </div>
          <label className="panel-label">NISN</label>
          <div
            className="scanning-label"
            style={{ display: isScanning ? "flex" : "none" }}
          >
            <p>SCANNING...</p>
          </div>
          <div
            className="input-boxes"
            ref={containerRef}
            style={{ display: isScanning ? "none" : "block" }}
          >
            <OtpInput
              containerStyle={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0px",

                height: "21px",
                width: "320px",
              }}
              value={nisn}
              onChange={setNisn}
              numInputs={10}
              shouldAutoFocus={true}
              renderInput={(props) => <input {...props} className="digit" />}
            />{" "}
          </div>
        </div>
      </div>
    </>
  );
}

export default InputDevice;
