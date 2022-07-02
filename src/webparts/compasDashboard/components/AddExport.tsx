import * as React from "react";
import classes from "./Header.module.scss";
import {
  AddBox,
  FilterTiltShift,
  FilterTiltShiftSharp,
} from "@material-ui/icons";
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
const ExcelFileButton = require("../../../../src/ExternalRef/img/ExcelFileButton.svg");
const BannerBg = require("../../../../src/ExternalRef/img/VisualHeader.jpg");
const AddBtn = require("../../../../src/ExternalRef/img/AddBtn.png");

const AddExport = (props) => {
  // Add button
  const Add = () => {
    props.Panel(true);
    props.Edit(false, null);
  };
  const genrateExcel = () => {
    console.log(props.exportData);
    let arrExport = props.exportData;
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("My Sheet");
    worksheet.columns = [
      { header: "ID", key: "id", width: 25 },
      { header: "Name", key: "name", width: 60 },
      { header: "Priority", key: "priority", width: 25 },
      { header: "Country/IBVT", key: "country", width: 25 },
      { header: "Organization Unit", key: "unitname", width: 25 },
      { header: "Requestor", key: "requestor", width: 75 },
      { header: "Engagement Type", key: "engagementtype", width: 25 },
      { header: "Status", key: "status", width: 25 },
      // { header: "Created Date", key: "createddate", width: 25 },
      { header: "Cross charge information", key: "CrossChargeInfo", width: 25 },
    ];
    arrExport.forEach((item) => {
      let userNames =
        item.Requestor.length > 0
          ? item.Requestor.map((reqstr) => reqstr.Name).join(",")
          : "";

      worksheet.addRow({
        id: item.ID,
        status: item.Status,
        priority: item.Priority,
        name: item.Name,
        engagementtype: item.EngagementType,
        unitname: item.UnitName,
        // createddate: new Date(item.CreationDate).toLocaleDateString(),
        country: item.CountryIBVT,
        requestor: userNames,
        CrossChargeInfo: item.CrossChargeInfo,
      });
    });
    ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1"].map((key) => {
      worksheet.getCell(key).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "00e8d1" },
      };
    });
    ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1"].map((key) => {
      worksheet.getCell(key).color = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF" },
      };
    });
    workbook.xlsx
      .writeBuffer()
      .then((buffer) =>
        FileSaver.saveAs(
          new Blob([buffer]),
          `Compas${new Date().toLocaleString()}.xlsx`
        )
      )
      .catch((err) => console.log("Error writing excel export", err));
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
        <div className={classes.actions}>
          <div>
            {props.Admin ? (
              <img src={`${AddBtn}`} onClick={Add} alt="add btn" />
            ) : (
              ""
            )}
          </div>
          <button className={classes.Export}>
            <img
              src={`${ExcelFileButton}`}
              alt="ExcelFileButton"
              onClick={genrateExcel}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExport;
