import * as React from "react";
import classes from "./HoursSpent.module.scss";
import { Add } from "@material-ui/icons";
import { TextField, InputLabel } from "@material-ui/core";
import { DatePicker } from "office-ui-fabric-react";
import { useState, useEffect } from "react";

let latestId;
let EditId;
const InitialTime = {
  hours: null,
  Date: null,
  comName: "",
};
let dropValue = [];

const HoursSpent = (props: any) => {
  const [hoursSec, setHoursSec] = useState(0);
  const [addNewAATLO, setAddNewAATLO] = useState(InitialTime);
  const [addNewJJ, setAddNewJJ] = useState(InitialTime);
  const [editHour, setEditHour] = useState(0);
  const [editValue, setEditValue] = useState(false);
  const [hoursSpentArr, setHoursSpentArr] = useState([]);

  // Life Cycle of onload
  useEffect(() => {
    setAddNewAATLO({
      hours: null,
      Date: null,
      comName: "",
    });
    setAddNewJJ({
      hours: null,
      Date: null,
      comName: "",
    });

    latestId = 0;
    EditId = 0;
    if (props.Latest.key != 0 || props.Edit.item != null) {
      latestId = props.Latest.key;
      EditId = props.Edit.item;
      setHoursSec(latestId);
      setEditHour(EditId);
    } else {
      setHoursSec(latestId);
      setEditHour(EditId);
    }

    // Dropdown value taken
    props.sp.web.lists
      .getByTitle("Spent time")
      .fields.getByInternalNameOrTitle("CASCompany")()
      .then((response) => {
        console.log(response);
        dropValue = [];
        dropValue = response.Choices;
      })
      .catch((error) => {
        console.log(error);
      });
    setEditValue(true);
  }, []);

  useEffect(() => {
    props.Edit.item != null
      ? props.sp.web.lists
          .getByTitle("Spent time")
          .items.select("*", "CASRef/ID")
          .filter(`CASRefId eq '${props.Edit.item}'`)
          .expand("CASRef")
          .get()
          .then((response) => {
            console.log(response);
            let hoursArr = [];
            hoursArr = response.map((res) => ({
              Hours: res.CASHours ? res.CASHours.toString() : null,
              Date: res.CASDate
                ? new Date(res.CASDate).getFullYear() +
                  "/" +
                  new Date(res.CASDate).getMonth()
                : null,
              Company: res.CASCompany,
            }));
            setHoursSpentArr(hoursArr);
          })
          .catch((error) => {
            console.log(error);
          })
      : [];
  }, [editValue]);

  // Hours Add function
  const AddHours = () => {
    dropValue.map((data) => {
      return addNewAATLO.comName == data
        ? props.sp.web.lists
            .getByTitle("Spent time")
            .items.add({
              Title:
                hoursSec != 0
                  ? props.Latest.text
                  : editHour == 0
                  ? true
                  : props.Edit.Title,
              CASHours: addNewAATLO.hours ? addNewAATLO.hours : null,
              CASDate: addNewAATLO.Date ? addNewAATLO.Date : null,
              CASCompany: addNewAATLO.comName ? addNewAATLO.comName : "",
              CASRefId:
                hoursSec != 0
                  ? props.Latest.key
                  : editHour == 0
                  ? true
                  : props.Edit.item,
            })
            .then((response) => {
              console.log(response);
              setAddNewAATLO({
                hours: null,
                Date: null,
                comName: "",
              });
            })
        : addNewJJ.comName == data
        ? props.sp.web.lists
            .getByTitle("Spent time")
            .items.add({
              Title:
                hoursSec != 0
                  ? props.Latest.text
                  : editHour == 0
                  ? true
                  : props.Edit.Title,
              CASHours: addNewJJ.hours ? addNewJJ.hours : null,
              CASDate: addNewJJ.Date ? addNewJJ.Date : null,
              CASCompany: addNewJJ.comName ? addNewJJ.comName : "",
              CASRefId:
                hoursSec != 0
                  ? props.Latest.key
                  : editHour == 0
                  ? true
                  : props.Edit.item,
            })
            .then((response) => {
              console.log(response);
              setAddNewJJ({
                hours: null,
                Date: null,
                comName: "",
              });
            })
        : alert("Please add Details");
    });
  };

  return (
    <>
      <div className={classes.contentTop}>
        <div className={classes["c1"]}>
          <div
            className={classes.title3}
            style={{ transform: "translateY(-6px)" }}
          >
            AALTO
          </div>

          <div className={classes.inputs}>
            {/* AALTO Company section hr */}
            <div className={classes.inpField}>
              <InputLabel className={classes.inpLabel}>Hours Spent:</InputLabel>
              <TextField
                disabled={hoursSec != 0 ? false : editHour == 0 ? true : false}
                className={classes.inpt3}
                id="standard-basic"
                variant="outlined"
                placeholder={`0,0h`}
                type="number"
                InputLabelProps={{ shrink: false }}
                value={addNewAATLO.hours}
                onChange={(e) => {
                  addNewAATLO.hours = e.target.value;
                  addNewAATLO.comName = "AALTO";
                  setAddNewAATLO({ ...addNewAATLO });
                }}
              />
            </div>

            {/* AALTO Company section Date */}
            <div className={classes.inpField}>
              <InputLabel className={classes.inpLabel}>yyyy/mm:</InputLabel>
              <DatePicker
                disabled={hoursSec != 0 ? false : editHour == 0 ? true : false}
                className={classes.datet3}
                placeholder={`0000/00`}
                formatDate={(date: Date): string => {
                  return date.getFullYear() + "/" + (date.getMonth() + 1);
                }}
                value={addNewAATLO.Date ? new Date(addNewAATLO.Date) : null}
                onSelectDate={(e) => {
                  addNewAATLO.Date = e.toISOString();
                  setAddNewAATLO({ ...addNewAATLO });
                }}
              />
            </div>
          </div>
        </div>
        <div className={classes["c1"]}>
          <div className={classes.title3}>JOHNSON & JOHNSON</div>

          <div className={classes.inputs}>
            {/* JOHNSON & JOHNSON Company section hr */}
            <div className={classes.inpField}>
              <InputLabel className={classes.inpLabel}>Hours Spent:</InputLabel>
              <TextField
                disabled={hoursSec != 0 ? false : editHour == 0 ? true : false}
                className={classes.inpt3}
                id="standard-basic"
                variant="outlined"
                placeholder={`0,0h`}
                type="number"
                InputLabelProps={{ shrink: false }}
                value={addNewJJ.hours}
                onChange={(e) => {
                  addNewJJ.hours = e.target.value;
                  addNewJJ.comName = "JOHNSON & JOHNSON";
                  setAddNewJJ({ ...addNewJJ });
                }}
              />
            </div>

            {/* JOHNSON & JOHNSON Company section Date */}
            <div className={classes.inpField}>
              <InputLabel className={classes.inpLabel}>yyyy/mm:</InputLabel>
              <DatePicker
                disabled={hoursSec != 0 ? false : editHour == 0 ? true : false}
                className={classes.datet3}
                placeholder={`0000/00`}
                formatDate={(date: Date): string => {
                  return date.getFullYear() + "/" + (date.getMonth() + 1);
                }}
                value={addNewJJ.Date ? new Date(addNewJJ.Date) : null}
                onSelectDate={(e) => {
                  addNewJJ.Date = e.toISOString();
                  setAddNewJJ({ ...addNewJJ });
                }}
              />
            </div>

            {/* Button Section */}
            <button className={classes.AddBtn} onClick={() => AddHours()}>
              <Add
                style={{
                  backgroundColor: "transparent",
                  borderRadius: "50%",
                  width: "40px",
                  border: "1px solid",
                  padding: "0px 6px",
                  marginLeft: "10px",
                  marginTop: "40px",
                  transform: "scale(1.2)",
                }}
              />
            </button>
          </div>
        </div>{" "}
      </div>

      <div className={classes.contentBottom}>
        <div className={classes.outputs}>
          {hoursSpentArr.map((e) => {
            return (
              <>
                {e.Company == addNewAATLO.comName ? (
                  <div className={classes.o1}>
                    <div>
                      <span>{e.Hours}</span>
                      {"     "}
                      <span>{e.Date}</span>
                    </div>
                    0,00
                    <span>AAlto tot.h </span>
                  </div>
                ) : (
                  <div className={classes.o1}>
                    <div>
                      <span>{e.Hours}</span>
                      {"     "}
                      <span>{e.Date}</span>
                    </div>
                    0,00
                    <span>J&J tot.h </span>
                  </div>
                )}
              </>
            );
          })}
        </div>

        <div className={classes.outputs} style={{ border: "none" }}>
          <div className={classes.o2}>
            0,00
            <span>tot.h </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default HoursSpent;
