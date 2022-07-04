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
      { header: "Cross charge information", key: "CrossChargeInfo", width: 25 },
      // { header: "Created Date", key: "createddate", width: 25 },
      { header: "Total", key: "total", width: 25 },
      { header: "January AALTO", key: "JanuaryAALTO", width: 25 },
      { header: "January JOHNSON & JOHNSON", key: "JanuaryJJ", width: 25 },
      { header: "February AALTO", key: "FebruaryAALTO", width: 25 },
      { header: "February JOHNSON & JOHNSON", key: "FebruaryJJ", width: 25 },
      { header: "March AALTO", key: "MarchAALTO", width: 25 },
      { header: "March JOHNSON & JOHNSON", key: "MarchJJ", width: 25 },
      { header: "April AALTO", key: "AprilAALTO", width: 25 },
      { header: "April JOHNSON & JOHNSON", key: "AprilJJ", width: 25 },
      { header: "May AALTO", key: "MayAALTO", width: 25 },
      { header: "May JOHNSON & JOHNSON", key: "MayJJ", width: 25 },
      { header: "June AALTO", key: "JuneAALTO", width: 25 },
      { header: "June JOHNSON & JOHNSON", key: "JuneJJ", width: 25 },
      { header: "July AALTO", key: "JulyAALTO", width: 25 },
      { header: "July JOHNSON & JOHNSON", key: "JulyJJ", width: 25 },
      { header: "August AALTO", key: "AugustAALTO", width: 25 },
      { header: "August JOHNSON & JOHNSON", key: "AugustJJ", width: 25 },
      { header: "September AALTO", key: "SeptemberAALTO", width: 25 },
      { header: "September JOHNSON & JOHNSON", key: "SeptemberJJ", width: 25 },
      { header: "October AALTO", key: "OctoberAALTO", width: 25 },
      { header: "October JOHNSON & JOHNSON", key: "OctoberJJ", width: 25 },
      { header: "November AALTO", key: "NovemberAALTO", width: 25 },
      { header: "November JOHNSON & JOHNSON", key: "NovemberJJ", width: 25 },
      { header: "December AALTO", key: "DecemberAALTO", width: 25 },
      { header: "December JOHNSON & JOHNSON", key: "DecemberJJ", width: 25 },
    ];
    arrExport.forEach((item) => {
      let userNames =
        item.Requestor.length > 0
          ? item.Requestor.map((reqstr) => reqstr.Name).join(",")
          : "";
      let Total = item.filteredSpentData
        ? item.filteredSpentData
            .map((item) => item.CASHours)
            .reduce((prev, curr) => prev + curr, 0)
        : 0;

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
        total: item.filteredSpentData
          ? item.filteredSpentData
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        JanuaryAALTO: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 0 && d.CASCompany == "AALTO"
                );
              })
              .map((items) => items.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        JanuaryJJ: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 0 &&
                  d.CASCompany == "JOHNSON and JOHNSON"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        FebruaryAALTO: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 1 && d.CASCompany == "AALTO"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        FebruaryJJ: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 1 &&
                  d.CASCompany == "JOHNSON and JOHNSON"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        MarchAALTO: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 2 && d.CASCompany == "AALTO"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        MarchJJ: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 2 &&
                  d.CASCompany == "JOHNSON and JOHNSON"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        AprilAALTO: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 3 && d.CASCompany == "AALTO"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        AprilJJ: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 3 &&
                  d.CASCompany == "JOHNSON and JOHNSON"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        MayAALTO: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 4 && d.CASCompany == "AALTO"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        MayJJ: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 4 &&
                  d.CASCompany == "JOHNSON and JOHNSON"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        JuneAALTO: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 5 && d.CASCompany == "AALTO"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        JuneJJ: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 5 &&
                  d.CASCompany == "JOHNSON and JOHNSON"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        JulyAALTO: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 6 && d.CASCompany == "AALTO"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        JulyJJ: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 6 &&
                  d.CASCompany == "JOHNSON and JOHNSON"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        AugustAALTO: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 7 && d.CASCompany == "AALTO"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        AugustJJ: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 7 &&
                  d.CASCompany == "JOHNSON and JOHNSON"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        SeptemberAALTO: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 8 && d.CASCompany == "AALTO"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        SeptemberJJ: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 8 &&
                  d.CASCompany == "JOHNSON and JOHNSON"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        OctoberAALTO: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 9 && d.CASCompany == "AALTO"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        OctoberJJ: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 9 &&
                  d.CASCompany == "JOHNSON and JOHNSON"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        NovemberAALTO: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 10 &&
                  d.CASCompany == "AALTO"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        NovemberJJ: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 10 &&
                  d.CASCompany == "JOHNSON and JOHNSON"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        DecemberAALTO: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 11 &&
                  d.CASCompany == "AALTO"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
        DecemberJJ: item.filteredSpentData
          ? item.filteredSpentData
              .filter((d) => {
                return (
                  new Date(d.CASDate).getMonth() == 11 &&
                  d.CASCompany == "JOHNSON and JOHNSON"
                );
              })
              .map((item) => item.CASHours)
              .reduce((prev, curr) => prev + curr, 0)
          : 0,
      });
    });
    [
      "A1",
      "B1",
      "C1",
      "D1",
      "E1",
      "F1",
      "G1",
      "H1",
      "I1",
      "J1",
      "K1",
      "L1",
      "M1",
      "N1",
      "O1",
      "P1",
      "Q1",
      "R1",
      "S1",
      "T1",
      "U1",
      "V1",
      "W1",
      "X1",
      "Y1",
      "Z1",
      "AA1",
      "AB1",
      "AC1",
      "AD1",
      "AE1",
      "AF1",
      "AG1",
      "AH1"
    ].map((key) => {
      worksheet.getCell(key).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "00e8d1" },
      };
    });
    
    [
      "A1",
      "B1",
      "C1",
      "D1",
      "E1",
      "F1",
      "G1",
      "H1",
      "I1",
      "J1",
      "K1",
      "L1",
      "M1",
      "N1",
      "O1",
      "P1",
      "Q1",
      "R1",
      "S1",
      "T1",
      "U1",
      "V1",
      "W1",
      "X1",
      "Y1",
      "Z1",
      "AA1",
      "AB1",
      "AC1",
      "AD1",
      "AE1",
      "AF1",
      "AG1",
      "AH1"
    ].map((key) => {
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
