import * as React from "react";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import PersonOutlineOutlined from "@material-ui/icons/PersonOutlineOutlined";
import SettingsOutlined from "@material-ui/icons/SettingsOutlined";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  OutlinedInput,
  TextField,
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import classes from "./TopFilter.module.scss";
import { useState, useEffect, useRef } from "react";
import { get } from "@microsoft/sp-lodash-subset";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { mergeStyles, DatePicker } from "office-ui-fabric-react";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
// import { DatePicker } from "@fluentui/react";

const resetIcon = require("../../../ExternalRef/img/ResetIcon.svg");
const filterIcon = require("../../../ExternalRef/img/filterIcon.png");
const searchIcon = require("../../../ExternalRef/img/searchDark.png");

let filterData = {
  ID: 0,
  Status: ["IN PROGRESS", "WAITING FOR FEEDBACK", "LEAD"],
  Priority: null,
  Name: "",
  EngagementType: "",
  EngagementSubType: "",
  UnitName: "",
  CreationDate: null,
  CountryIBVT: "",
  Requestor: "",
  LastModifiedDate: null,
};

let filterId = [];
let multiPeopleData = [];
let projectsId = [];
let arrCountries = [];
let arrEngTypes = [];
let arrEngSubTypes = [];
let arrStatusType = [];
let arrIDNumber = [];
let arrPriority = [];
const datePickerClass = mergeStyles({
  // selectors: { "> *": { marginBottom: 15 } },

  selectors: {
    ".ms-TextField-fieldGroup": {
      border: "1px solid #c4c4c4",
      height: "3.6rem",
      borderRadius: "7px",
    },
    ".ms-TextField-field": {
      height: "3.6rem",
    },
  },
});
const TopFilter = (props: any) => {
  const [filterArr, setFilterArr] = useState(filterData);
  const [arrOfId, setArrOfId] = useState([]);
  const [countryChoice, setCountryChoice] = useState(arrCountries);
  const [engTypeChoice, setEngTypeChoice] = useState(arrEngTypes);
  const [engSubTypeChoice, setEngSubTypeChoice] = useState(arrEngSubTypes);
  const [statusTypeChoice, setStatusType] = useState(arrStatusType);
  const [idNumberChoice, setIdNumberChoice] = useState(arrIDNumber);
  const [priorityChoice, setPriorityChoice] = useState(arrPriority);
  const [expandFilter, setExpandFilter] = useState(false);
  const [value, setvalue] = useState(filterArr.Status.join(","));

  const handleOnchange = (val) => {
    console.log(val);
    let arrSelectedStatus = val.split(",")[0] != "" ? val.split(",") : [];
    getOnChange("Status", arrSelectedStatus);
    setvalue(filterArr.Status.join(","));
  };

  // UseRef Section
  const ProjectName = useRef("");

  // Life Cycle of Onload
  useEffect(() => {
    setFilterArr(filterData);
    props.sp.web.lists
      .getByTitle("Countries")
      .items.get()
      .then((cLi) => {
        arrCountries = cLi.map((li) => {
          return li.Title;
        });
        setCountryChoice(arrCountries);
      })
      .then(() => {
        props.sp.web.lists
          .getByTitle("Engagement types")
          .items.get()
          .then((cLi) => {
            arrEngTypes = cLi.map((li) => {
              return li.Title;
            });
            setEngTypeChoice(arrEngTypes);
          });
      })
      .then(() => {
        props.sp.web.lists
          .getByTitle("Engagement subtypes")
          .items.get()
          .then((cLi) => {
            arrEngSubTypes = cLi.map((li) => {
              return li.Title;
            });
            setEngSubTypeChoice(arrEngSubTypes);
          });
      })
      .then(() => {
        props.sp.web.lists
          .getByTitle("Status types")
          .items.get()
          .then((cLi) => {
            arrStatusType = cLi.map((li) => ({
              label: (
                <div
                  style={{
                    color:
                      li.Title.toLowerCase() == "in progress"
                        ? "#359942"
                        : li.Title.toLowerCase() == "waiting for feedback"
                        ? "#f5944e"
                        : li.Title.toLowerCase() == "lead"
                        ? "#f24998"
                        : li.Title.toLowerCase() == "parked"
                        ? "#999999"
                        : li.Title.toLowerCase() == "closed"
                        ? "#1c75bc"
                        : li.Title.toLowerCase() == "canceled"
                        ? "#7e2e7a"
                        : "#000",
                  }}
                >
                  {li.Title}
                </div>
              ),
              value: li.Title,
            }));
            setStatusType(arrStatusType);
          });
      })
      .then(() => {
        props.sp.web.lists
          .getByTitle("Priorities")
          .items.get()
          .then((pLi) => {
            arrPriority = pLi.map((li) => {
              return li.Title;
            });
            setPriorityChoice(arrPriority);
          });
      });
    props.sp.web.lists
      .getByTitle("Projects")
      .items.top(2000)
      .select("*", "CASUser/Title", "CASUser/ID", "CASUser/EMail")
      .expand("CASUser")
      .get()
      .then((response) => {
        console.log(response);
        arrIDNumber = response.map((res) => res.ID);
        for (let i = 0; i < response.length; i++) {
          filterId.push(response[i].Id);
          if (response.length == i + 1) {
            setArrOfId(filterId);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    getOnChange("Status", ["IN PROGRESS", "WAITING FOR FEEDBACK", "LEAD"]);
  }, []);

  // getOncange function
  const getOnChange = (key, data) => {
    filterArr[key] = data;
    setFilterArr({ ...filterArr });
    props.filterdata(filterArr);
  };

  return (
    <div className={classes.filterSectionCover}>
      <div className={classes.filterSection}>
        <div className={classes.filterSectionTop}>
          {/* Project Name Section */}
          <div className={classes.filterInput}>
            <InputLabel>Project Name:</InputLabel>
            <TextField
              value={filterArr.Name}
              id="input-with-icon-textfield"
              className={classes.prName}
              style={{ width: "399px", height: "61px", marginRight: "5px" }}
              label=""
              InputLabelProps={{ shrink: false }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {/* <SearchOutlined /> */}
                    <div className={classes.searchIcon}>
                      <img src={`${searchIcon}`} />
                    </div>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                ProjectName.current = e.target.value;
                getOnChange("Name", ProjectName.current);
              }}
              variant="outlined"
            />
          </div>
          {/* Priority Section */}
          <div className={classes.filterInput}>
            <InputLabel>Priority:</InputLabel>
            <div className="ddSelect">
              <Select
                labelId="demo-simple-select-label"
                style={{
                  width: "123px",
                  height: "56px",
                  borderRadius: "7px",
                  marginRight: "5px",
                }}
                value={filterArr.Priority}
                onChange={(e) => {
                  getOnChange("Priority", e.target.value);
                }}
                id="demo-simple-select"
                variant="outlined"
                labelWidth={0}
                className={classes.priority}
              >
                {priorityChoice.map((pChoices) => (
                  <MenuItem value={pChoices}>{pChoices}</MenuItem>
                ))}
              </Select>
            </div>
          </div>
          {/* Country/IBVT Section */}
          <div className={classes.filterInput}>
            <InputLabel>Country/IBVT:</InputLabel>
            <div className="ddSelect">
              <Select
                labelId="demo-simple-select-label"
                style={{
                  width: "236px",
                  height: "56px",
                  borderRadius: "7px",
                  marginRight: "5px",
                }}
                id="demo-simple-select"
                value={filterArr.CountryIBVT}
                label="Age"
                onChange={(e) => {
                  getOnChange("CountryIBVT", e.target.value);
                }}
                variant="outlined"
                labelWidth={0}
                className={classes.country}
              >
                {countryChoice.map((cchoice, i) => (
                  <MenuItem key={i} value={cchoice}>
                    {cchoice}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          {/* Organization Unit Section */}
          <div className={classes.filterInput}>
            <InputLabel>Organization Unit:</InputLabel>
            <TextField
              className={classes.OrgUnit}
              id="input-with-icon-textfield"
              style={{ width: "260px", height: "61px", marginRight: "5px" }}
              label=""
              InputLabelProps={{ shrink: false }}
              value={filterArr.UnitName}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {/* <SearchOutlined /> */}
                    <div className={classes.searchIcon}>
                      <img src={`${searchIcon}`} />
                    </div>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              onChange={(e) => {
                getOnChange("UnitName", e.target.value);
              }}
            />
          </div>
          {/* Requestor People Section */}
          <div
            className={`${classes.filterInput} ${classes.RequestorFilter} PeoplePicker`}
          >
            <InputLabel>Requestor People</InputLabel>
            <PeoplePicker
              styles={{ root: { marginTop: -4 } }}
              context={props.context}
              personSelectionLimit={1}
              showtooltip={true}
              disabled={false}
              showHiddenInUI={false}
              principalTypes={[PrincipalType.User]}
              resolveDelay={1000}
              onChange={(e) => {
                console.log(e);
                e.length > 0
                  ? getOnChange("Requestor", e[0].secondaryText)
                  : getOnChange("Requestor", "");
              }}
              defaultSelectedUsers={[filterArr.Requestor]}
              required={true}
            />
          </div>
          {/* Engagement Type Section */}
          <div className={classes.filterInput}>
            <InputLabel>Engagement type</InputLabel>
            <div className="ddSelect">
              <Select
                className={classes.engType}
                labelId="demo-simple-select-label"
                style={{
                  width: "236px",
                  height: "56px",
                  borderRadius: "7px",
                  marginRight: "5px",
                }}
                id="demo-simple-select"
                label="Age"
                value={filterArr.EngagementType}
                onChange={(e) => {
                  getOnChange("EngagementType", e.target.value);
                }}
                variant="outlined"
                labelWidth={0}
              >
                {engTypeChoice.map((choice) => (
                  <MenuItem value={choice}>{choice}</MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <div className={classes.filterInput}>
            <img
              src={`${filterIcon}`}
              alt={`FilterIcon`}
              width={27}
              height={27}
              onClick={() => setExpandFilter(!expandFilter)}
              style={{ marginTop: "40px", cursor: "pointer" }}
            />
          </div>
        </div>
        {expandFilter && (
          <div className={classes.filterSectionTop}>
            <div className={classes.filterInput}>
              <InputLabel>Engagement subtype</InputLabel>
              <div className="ddSelect">
                <Select
                  className={classes.engSubType}
                  style={{
                    width: "236px",
                    height: "56px",
                    borderRadius: "7px",
                    marginRight: "5px",
                  }}
                  id=""
                  value={filterArr.EngagementSubType}
                  onChange={(e) => {
                    getOnChange("EngagementSubType", e.target.value);
                  }}
                  variant="outlined"
                  labelWidth={0}
                >
                  {engSubTypeChoice.map((choice) => (
                    <MenuItem value={choice}>{choice}</MenuItem>
                  ))}
                </Select>
              </div>
            </div>
            {/* Status Type Section */}
            <div className={`${classes.filterInput} ${classes.multiSelect}`}>
              <InputLabel style={{ marginBottom: "0.75rem" }}>
                Status Type:
              </InputLabel>

              <>
                <MultiSelect
                  className={classes.stsType}
                  defaultValue={value}
                  onChange={handleOnchange}
                  options={statusTypeChoice}
                />
              </>
            </div>
            {/* ID Number  Section */}
            <div className={classes.filterInput}>
              <InputLabel>ID Number:</InputLabel>
              <div className="ddSelect">
                <Select
                  className={classes.IdNum}
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  // multiple
                  // value={projectsId}
                  style={{
                    width: "220px",
                    height: "56px",
                    borderRadius: "7px",
                    marginRight: "5px",
                  }}
                  value={filterArr.ID}
                  onChange={(e) => {
                    getOnChange("ID", e.target.value);
                  }}
                  variant="outlined"
                  labelWidth={0}
                >
                  {arrOfId.map((valueData, index) => {
                    return <MenuItem value={valueData}>{valueData}</MenuItem>;
                  })}
                </Select>
              </div>
            </div>
            {/* Creation Date Section */}
            <div className={classes.filterInput}>
              <InputLabel>Creation Date:</InputLabel>

              <DatePicker
                id="datepicker"
                className={`${classes.datepicker} ${datePickerClass}`}
                style={{
                  width: "350px",
                  height: "56px",
                  borderRadius: "7px",
                  marginRight: "5px",
                  // border: "1px solid #E4E4E4",
                }}
                // styles={{
                //   root: {
                //     border: "none",
                //     selectors: {
                //       ".ms-TextField-fieldGroup": {
                //         border: "1px solid #c4c4c4",
                //         height: "3.6rem",
                //         borderRadius: "7px",
                //       },
                //       ".ms-TextField-field": {
                //         height: "3.6rem",
                //       },
                //     },
                //   },
                // }}
                // styles={{ customeDatepickerStyle }}
                formatDate={(date: Date): string => {
                  let arrDate = date.toLocaleDateString().split("/");
                  let selectedDate = `${
                    +arrDate[0] < 10 ? "0" + arrDate[0] : arrDate[0]
                  }/${+arrDate[1] < 10 ? "0" + arrDate[1] : arrDate[1]}/${
                    arrDate[2]
                  }`;
                  return selectedDate;
                }}
                value={filterArr.CreationDate ? filterArr.CreationDate : null}
                onSelectDate={(selectedDate) => {
                  getOnChange(
                    "CreationDate",
                    selectedDate
                      ? (filterArr.CreationDate = selectedDate)
                      : (filterArr.CreationDate = null)
                  );
                }}
              />
            </div>
            {/* Last Modified Date Section */}
            <div className={classes.filterInput}>
              <InputLabel>Last Modified Date:</InputLabel>

              <DatePicker
                id="datepicker"
                className={`${classes.datepicker} ${datePickerClass}`}
                style={{
                  width: "350px",
                  height: "56px",
                  borderRadius: "7px",
                  marginRight: "5px",
                  // border: "1px solid #E4E4E4",
                }}
                // styles={{ customeDatepickerStyle }}
                // styles={{
                //   root: {
                //     border: "none",
                //     selectors: {
                //       ".ms-TextField-fieldGroup": {
                //         border: "1px solid #c4c4c4",
                //         height: "3.6rem",
                //         borderRadius: "7px",
                //       },
                //       ".ms-TextField-field": {
                //         height: "3.6rem",
                //       },
                //     },
                //   },
                // }}
                formatDate={(date: Date): string => {
                  let arrDate = date.toLocaleDateString().split("/");
                  let selectedDate = `${
                    +arrDate[0] < 10 ? "0" + arrDate[0] : arrDate[0]
                  }/${+arrDate[1] < 10 ? "0" + arrDate[1] : arrDate[1]}/${
                    arrDate[2]
                  }`;
                  return selectedDate;
                }}
                value={
                  filterArr.LastModifiedDate ? filterArr.LastModifiedDate : null
                }
                onSelectDate={(selectedDate) => {
                  getOnChange(
                    "LastModifiedDate",
                    selectedDate
                      ? (filterArr.LastModifiedDate = selectedDate)
                      : (filterArr.LastModifiedDate = null)
                  );
                }}
              />
            </div>
            <div>
              <img
                className={classes.ResetIcon}
                src={`${resetIcon}`}
                style={{ marginTop: "10px" }}
                alt="reset"
                onClick={() => {
                  filterData = {
                    ID: 0,
                    Status: [],
                    Priority: null,
                    Name: "",
                    EngagementType: "",
                    EngagementSubType: "",
                    UnitName: "",
                    CreationDate: null,
                    CountryIBVT: "",
                    Requestor: "",
                    LastModifiedDate: null,
                  };
                  setFilterArr({ ...filterData });
                  props.filterdata({
                    ID: 0,
                    Status: [],
                    Priority: null,
                    Name: "",
                    EngagementType: "",
                    EngagementSubType: "",
                    UnitName: "",
                    CreationDate: null,
                    CountryIBVT: "",
                    Requestor: "",
                    LastModifiedDate: null,
                  });
                  setvalue("");
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopFilter;
