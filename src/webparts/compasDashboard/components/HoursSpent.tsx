import * as React from "react";
import classes from "./HoursSpent.module.scss";
import { Add } from "@material-ui/icons";
import { TextField, InputLabel } from "@material-ui/core";
import { DatePicker } from "office-ui-fabric-react";
import { useState, useEffect } from "react";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { Done } from "@material-ui/icons";

const moreIcon = require("../../../ExternalRef/img/more.png");

let latestId;
let EditId;

const InitialTime = {
  hours: null,
  Date: null,
  comName: "",
};

let dropValue = [];

let edit = [];
let setdata = [];

const HoursSpent = (props: any) => {
  const [hoursSec, setHoursSec] = useState(0);
  const [addNewAATLO, setAddNewAATLO] = useState(InitialTime);
  const [addNewJJ, setAddNewJJ] = useState(InitialTime);
  const [editHour, setEditHour] = useState(0);
  const [editValue, setEditValue] = useState(false);
  const [hoursSpentArr, setHoursSpentArr] = useState([]);
  const [addData, setAddData] = useState(false);
  const [addAALTO, setAddAALTO] = useState(0);
  const [addJOHN, setAddJOHN] = useState(0);
  const [totAdd, setTotAdd] = useState(0);
  const [listData, setListData] = useState(InitialTime);
  const [reEnter, setReEnter] = useState(true);
  const [show, setShow] = useState([false, 0]);
  // const [showOption, setShowOption] = useState(true);

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
      .then(() => {
        props.Edit.item != null
          ? props.sp.web.lists
              .getByTitle("Spent time")
              .items.select("*", "CASRef/ID")
              .filter(`CASRefId eq '${props.Edit.item}'`)
              .expand("CASRef")
              .orderBy("Modified", false)
              .get()
              .then((response) => {
                console.log(response);
                let hoursArr = [];
                hoursArr = response.map((res) => ({
                  Hours: res.CASHours ? res.CASHours : null,
                  Date: res.CASDate ? new Date(res.CASDate) : null,
                  Company: res.CASCompany,
                  spentId: res.Id,
                  isEdit: false,
                  showOption: false,
                }));
                setHoursSpentArr([]);
                setHoursSpentArr([...hoursArr]);
                setAddData(true);
              })
              .catch((error) => {
                console.log(error);
              })
          : [];
      })
      .catch((error) => {
        console.log(error);
      });
    setReEnter(false);
  }, [reEnter]);

  useEffect(() => {
    let AALTOAdd = 0;
    let JOHNSONAdd = 0;
    let Total = 0;
    hoursSpentArr.map((e) => {
      if (e.Company == "AALTO") {
        AALTOAdd = AALTOAdd + e.Hours;
        setAddAALTO(0);
        setAddAALTO(AALTOAdd);
      } else {
        JOHNSONAdd = JOHNSONAdd + e.Hours;
        setAddJOHN(0);
        setAddJOHN(JOHNSONAdd);
      }
      Total = AALTOAdd + JOHNSONAdd;
      setTotAdd(0);
      setTotAdd(Total);
    });
    setAddData(false);
  }, [addData]);

  // GetDatas section
  const GetDatas = () => {
    let isValue = addNewAATLO.comName == "AALTO" ? ValitationAA() : ValitationJJ();
    if (addNewAATLO.comName == "AALTO" && isValue) {
      AddHours();
    }
    if (addNewJJ.comName == "JOHNSON & JOHNSON" && isValue){
      AddHours();
    }
  };

  // Valition on AALTO Section
  const ValitationAA = () => {
    let isCheck = true;
    if (!addNewAATLO.hours) {
      isCheck = false;
      alertify.error("Please add Hour");
    } else if (!addNewAATLO.Date) {
      isCheck = false;
      alertify.error("Please add Date");
    }
    return isCheck;
  };

  // Valition on JOHNSON & JOHNSON Section
  const ValitationJJ = () => {
    let isCheck = true;
    if (!addNewJJ.hours){
      isCheck = false;
      alertify.error("Please add Hour");
    } else if (!addNewJJ.Date){
      isCheck = false;
      alertify.error("Please add Date");
    }
    return isCheck;
  }

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
              alertify.success("Record submitted successfully");
              addNewAATLO.hours = "";
              addNewAATLO.Date = null;
              setAddNewAATLO({
                ...addNewAATLO,
              });
              setReEnter(true);
            })
        : addNewJJ.comName == data &&
            props.sp.web.lists
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
                alertify.success("Record submitted successfully");
                addNewJJ.hours = "";
                addNewJJ.Date = null;
                setAddNewJJ({
                  ...addNewJJ,
                });
                setReEnter(true);
              })
    });
  };

  // getEdit function
  const getEdit = (data) => {
    console.log(data);
    let dataId = data.pop();
    let editOp = data.some((e) => e == dataId);
    if (editOp) {
      setdata = [];
      setdata.push(false, 0);
      setShow(setdata);
      data.pop();
    } else {
      setdata = [];
      setdata.push(true, dataId);
      setShow(setdata);
      data.push(dataId);
    }
  };

  // Save Data function
  const SaveData = (data) => {
    props.sp.web.lists
      .getByTitle("Spent time")
      .items.getById(data)
      .update({
        CASHours: listData.hours,
        CASDate: listData.Date,
      })
      .then((e) => {
        console.log(e);
        alertify.success("Record submitted successfully");
        setReEnter(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Delete function
  const getDelete = (data) => {
    props.sp.web.lists
      .getByTitle("Spent time")
      .items.getById(data)
      .delete()
      .then((e) => {
        console.log(e);
        setReEnter(true);
      })
      .catch((err) => {
        console.log(err);
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

            {/* AALTO Company Button Section */}
            <button
              disabled={hoursSec != 0 ? false : editHour == 0 ? true : false}
              className={classes.AddBtn}
              onClick={() => GetDatas()}
            >
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

            {/* JOHNSON & JOHNSON Company Button Section */}
            <button
              disabled={hoursSec != 0 ? false : editHour == 0 ? true : false}
              className={classes.AddBtn}
              onClick={() => AddHours()}
            >
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
          {/* AALTO Company Section */}
          <div className={classes.o1}>
            {hoursSpentArr.map((e) => {
              return (
                <>
                  {e.Company == "AALTO" && (
                    <div className={classes.inpField}>
                      <div>
                        <TextField
                          disabled={!e.isEdit}
                          className={classes.inpt3}
                          value={e.isEdit ? listData.hours : e.Hours}
                          onChange={(e) => {
                            listData.hours = e.target.value;
                            setListData({ ...listData });
                          }}
                        />
                      </div>
                      <div>
                        <DatePicker
                          disabled={!e.isEdit}
                          className={classes.datet3}
                          formatDate={(date: Date): string => {
                            return (
                              date.getFullYear() + "/" + (date.getMonth() + 1)
                            );
                          }}
                          onSelectDate={(date) => {
                            listData.Date = date.toISOString();
                            setListData({ ...listData });
                          }}
                          value={
                            listData.Date ? new Date(listData.Date) : e.Date
                          }
                        />
                      </div>
                      <div className={classes.options}>
                        {!e.isEdit ? (
                          <>
                            {hoursSpentArr.every(
                              (data) => data.isEdit == false
                            ) && (
                              <img
                                style={{ cursor: "pointer" }}
                                src={`${moreIcon}`}
                                width={18}
                                height={20}
                                alt="more"
                                onClick={() => {
                                  hoursSpentArr.forEach((row) => {
                                    row.showOption = false;
                                  });
                                  hoursSpentArr.filter(
                                    (row) => row.spentId == e.spentId
                                  )[0].showOption = true;
                                  setHoursSpentArr([...hoursSpentArr]);
                                }}
                              />
                            )}
                            {e.showOption ? (
                              <div className={classes.optionSection}>
                                <div
                                  style={{
                                    borderBottom: "1px solid #cacaca",
                                  }}
                                  onClick={() => {
                                    hoursSpentArr.forEach((row) => {
                                      row.showOption = false;
                                    });
                                    hoursSpentArr.filter(
                                      (row) => row.spentId == e.spentId
                                    )[0].isEdit = true;
                                    setHoursSpentArr([...hoursSpentArr]);
                                    listData.Date = e.Date;
                                    listData.hours = e.hours;
                                    setListData({ ...listData });
                                  }}
                                >
                                  Edit
                                </div>
                                <div onClick={() => getDelete(e.spentId)}>
                                  Cancel
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </>
                        ) : (
                          <Done
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              SaveData(e.spentId);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </>
              );
            })}
            {addAALTO}
            <span>AAlto tot.h</span>
          </div>

          {/* JOHNSON & JOHNSON Company Section */}
          <div className={classes.o1}>
            {hoursSpentArr.map((e) => {
              return (
                <>
                  {e.Company == "JOHNSON & JOHNSON" && (
                    <div className={classes.inpField}>
                      <div>
                        <TextField
                          disabled={!e.isEdit}
                          className={classes.inpt3}
                          value={e.isEdit ? listData.hours : e.Hours}
                          onChange={(e) => {
                            listData.hours = e.target.value;
                            setListData({ ...listData });
                          }}
                        />
                      </div>
                      <div>
                        <DatePicker
                          disabled={!e.isEdit}
                          className={classes.datet3}
                          formatDate={(date: Date): string => {
                            return (
                              date.getFullYear() + "/" + (date.getMonth() + 1)
                            );
                          }}
                          onSelectDate={(date) => {
                            listData.Date = date.toISOString();
                            setListData({ ...listData });
                          }}
                          value={
                            listData.Date ? new Date(listData.Date) : e.Date
                          }
                        />
                      </div>
                      <div className={classes.options}>
                        {!e.isEdit ? (
                          <>
                            {hoursSpentArr.every(
                              (data) => data.isEdit == false
                            ) && (
                              <img
                                style={{ cursor: "pointer" }}
                                src={`${moreIcon}`}
                                width={18}
                                height={20}
                                alt="more"
                                onClick={() => {
                                  hoursSpentArr.forEach((row) => {
                                    row.showOption = false;
                                  });
                                  hoursSpentArr.filter(
                                    (row) => row.spentId == e.spentId
                                  )[0].showOption = true;
                                  setHoursSpentArr([...hoursSpentArr]);
                                }}
                              />
                            )}
                            {e.showOption ? (
                              <div className={classes.optionSection}>
                                <div
                                  style={{
                                    borderBottom: "1px solid #cacaca",
                                  }}
                                  onClick={() => {
                                    hoursSpentArr.forEach((row) => {
                                      row.showOption = false;
                                    });
                                    hoursSpentArr.filter(
                                      (row) => row.spentId == e.spentId
                                    )[0].isEdit = true;
                                    setHoursSpentArr([...hoursSpentArr]);
                                    listData.Date = e.Date;
                                    listData.hours = e.hours;
                                    setListData({ ...listData });
                                  }}
                                >
                                  Edit
                                </div>
                                <div onClick={() => getDelete(e.spentId)}>
                                  Cancel
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </>
                        ) : (
                          <Done
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              SaveData(e.spentId);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </>
              );
            })}
            {addJOHN}
            <span>J&J tot.h </span>
          </div>
        </div>

        <div className={classes.outputs} style={{ border: "none" }}>
          <div className={classes.o2}>
            {totAdd}
            <span>tot.h </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default HoursSpent;
