import "./InputDevice.css";

import logo from "../assets/school-logo.png";
import screw from "../assets/screw.png";
import OtpInput from "react-otp-input";
import { useState } from "react";

import Cable from "./sub-components/Cable";

function InputDevice({ onScan }) {
  const now = new Date();
  const hh_mm = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const [nisn, setNisn] = useState();

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
            rapture high · attendance terminal
          </p>
        </div>

        <div className="input-panel">
          <div className="panel-clock">
            <span className="time">{hh_mm}</span>
            <span className="date">RAB 07 Jul</span>
          </div>
          <label className="panel-label">NISN</label>
          <div className="input-boxes">
            <OtpInput
              containerStyle={{
                display: "flex",
                flexDirection: "row",
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
            />
          </div>
        </div>

        {/* <img src={screwTL} className="screw screw-tl" alt="" />
      <img src={screwTR} className="screw screw-tr" alt="" />
      <img src={screwBL} className="screw screw-bl" alt="" />
      <img src={screwBR} className="screw screw-br" alt="" />
      <img src={holeThingy} className="hole-thingy" alt="" /> */}
      </div>
    </>
  );
}

export default InputDevice;
