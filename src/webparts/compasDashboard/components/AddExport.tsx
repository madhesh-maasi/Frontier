import * as React from "react";
import classes from "./Header.module.scss";
import {
  AddBox,
  FilterTiltShift,
  FilterTiltShiftSharp,
} from "@material-ui/icons"; 

const ExcelFileButton = require("../../../../src/ExternalRef/img/ExcelFileButton.svg");
const BannerBg = require("../../../../src/ExternalRef/img/VisualHeader.jpg");
const AddBtn = require("../../../../src/ExternalRef/img/AddBtn.png");

const AddExport = (props) => {
  // Add button
  const Add = () => {
    props.Panel(true);
    props.Edit(false, null);
  };

  return (
    <div className={classes.headerSection}>
      {/* banner Section*/}
      <div
        className={classes.bannerSection}
        style={{
          backgroundImage: `url(${BannerBg})`,
          backgroundSize: "cover",
          width: "100%",
          height: "185px",
        }}
      >
        {props.Admin ? (
          <div className={classes.actions}>
            <img src={`${AddBtn}`} onClick={Add} alt="add btn" />
            {/* <button className={classes.addProject} onClick={Add}>
            <AddBox
              style={{ width: "20px", height: "20px", marginRight: "10px" }}
            />{" "}
            ADD PROJECT
          </button> */}
            <button className={classes.Export}>
              <img src={`${ExcelFileButton}`} alt="ExcelFileButton" />
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default AddExport;
