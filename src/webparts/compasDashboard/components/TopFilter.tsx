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
import { FilterTiltShiftOutlined } from "@material-ui/icons";
import { useState, useEffect, useRef } from "react";
import { get } from "@microsoft/sp-lodash-subset";
import {
  IPersonaSharedProps,
  Persona,
  PersonaSize,
  PersonaPresence,
} from "office-ui-fabric-react/lib/Persona";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import {
  DatePicker,
  IStyleFunction,
  mergeStyles,
} from "office-ui-fabric-react";

const resetIcon = require("../../../ExternalRef/img/ResetIcon.svg");
const filterIcon = require("../../../ExternalRef/img/filterIcon.png");
let objectArray: [
  { key: "Option 1"; cat: "Group 1" },
  { key: "Option 2"; cat: "Group 1" },
  { key: "Option 3"; cat: "Group 1" },
  { key: "Option 4"; cat: "Group 2" },
  { key: "Option 5"; cat: "Group 2" },
  { key: "Option 6"; cat: "Group 2" },
  { key: "Option 7"; cat: "Group 2" }
];

let filterData = {
  ID: 0,
  Status: "",
  Priority: null,
  Name: "",
  EngagementType: "",
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
let arrStatusType = [];
let arrIDNumber = [];
let arrPriority = [];
const datePickerClass = mergeStyles({
  border: "1px solid #E4E4E4",
  selectors: { "> *": { marginBottom: 15 } },
});
const TopFilter = (props: any) => {
  const [filterArr, setFilterArr] = useState(filterData);
  const [arrOfId, setArrOfId] = useState([]);
  const [countryChoice, setCountryChoice] = useState(arrCountries);
  const [engTypeChoice, setEngTypeChoice] = useState(arrEngTypes);
  const [statusTypeChoice, setStatusType] = useState(arrStatusType);
  const [idNumberChoice, setIdNumberChoice] = useState(arrIDNumber);
  const [priorityChoice, setPriorityChoice] = useState(arrPriority);
  const [expandFilter, setExpandFilter] = useState(false);
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
          .getByTitle("Status types")
          .items.get()
          .then((cLi) => {
            arrStatusType = cLi.map((li) => {
              return li.Title;
            });
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
      .items.select("*", "CASUser/Title", "CASUser/ID", "CASUser/EMail")
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
              style={{ width: "399px", height: "61px", marginRight: "10px" }}
              label=""
              InputLabelProps={{ shrink: false }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchOutlined />
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
                  marginRight: "10px",
                }}
                value={filterArr.Priority}
                onChange={(e) => {
                  getOnChange("Priority", e.target.value);
                }}
                id="demo-simple-select"
                variant="outlined"
                labelWidth={0}
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
                  marginRight: "10px",
                }}
                id="demo-simple-select"
                value={filterArr.CountryIBVT}
                label="Age"
                onChange={(e) => {
                  getOnChange("CountryIBVT", e.target.value);
                }}
                variant="outlined"
                labelWidth={0}
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
              id="input-with-icon-textfield"
              style={{ width: "260px", height: "61px", marginRight: "10px" }}
              label=""
              InputLabelProps={{ shrink: false }}
              value={filterArr.UnitName}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchOutlined />
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
                labelId="demo-simple-select-label"
                style={{
                  width: "236px",
                  height: "56px",
                  borderRadius: "7px",
                  marginRight: "10px",
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
            {/* Status Type Section */}
            <div className={classes.filterInput}>
              <InputLabel>Status Type:</InputLabel>
              <div className="ddSelect">
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  style={{
                    width: "399px",
                    height: "56px",
                    borderRadius: "7px",
                    marginRight: "10px",
                  }}
                  label="Age"
                  value={filterArr.Status}
                  // multiple = {true}
                  onChange={(e) => {
                    getOnChange("Status", e.target.value);
                  }}
                  variant="outlined"
                  labelWidth={0}
                >
                  {statusTypeChoice.map((choice) => (
                    <MenuItem value={choice}>{choice}</MenuItem>
                  ))}
                </Select>
              </div>
            </div>
            {/* ID Number  Section */}
            <div className={classes.filterInput}>
              <InputLabel>ID Number:</InputLabel>
              <div className="ddSelect">
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  // multiple
                  // value={projectsId}
                  style={{
                    width: "220px",
                    height: "56px",
                    borderRadius: "7px",
                    marginRight: "10px",
                  }}
                  value={filterArr.ID}
                  onChange={(e) => {
                    // let arrValue = projectsId.findIndex((value) => value == e.target.value);
                    // if (arrValue >= 0) {
                    //   projectsId.splice(arrValue, 1);
                    // } else {
                    //   projectsId.push(e.target.value);
                    // }
                    // projectsId.push(e.target.value);
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
              {/* <TextField
            id="date"
            type="date"
            style={{
              width: "399px",
              height: "56px",
              borderRadius: "7px",
              marginRight: "10px",
            }}
            defaultValue={(date) => {
              filterArr.CreationDate
                ? (date = filterArr.CreationDate)
                : (date = null);
            }}
            value={filterArr.CreationDate ? filterArr.CreationDate : null}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(selectedDate) => {
              getOnChange(
                "CreationDate",
                selectedDate
                  ? (filterArr.CreationDate = new Date(
                      selectedDate.target.value
                    ).toLocaleDateString())
                  : (filterArr.CreationDate = null)
              );
            }}
            variant="outlined"
          /> */}
              <DatePicker
                className={`TopFilterDatePicker ${datePickerClass}`}
                style={{
                  width: "399px",
                  height: "56px",
                  borderRadius: "7px",
                  marginRight: "10px",
                  border: "1px solid #E4E4E4",
                }}
                formatDate={(date: Date): string => {
                  return (
                    date.getDate() +
                    "/" +
                    (date.getMonth() + 1) +
                    "/" +
                    date.getFullYear()
                  );
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
              {/* <TextField
            id="date"
            type="date"
            style={{
              width: "399px",
              height: "56px",
              borderRadius: "7px",
              marginRight: "10px",
            }}
            defaultValue={
              filterArr.LastModifiedDate ? filterArr.LastModifiedDate : null
            }
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(selectedDate) => {
              getOnChange(
                "LastModifiedDate",
                selectedDate
                  ? (filterArr.LastModifiedDate = new Date(
                      selectedDate.target.value
                    ).toLocaleDateString())
                  : (filterArr.LastModifiedDate = null)
              );
              console.log(filterData);
            }}
            variant="outlined"
          /> */}
              <DatePicker
                className="TopFilterDatePicker"
                style={{
                  width: "399px",
                  height: "56px",
                  borderRadius: "7px",
                  marginRight: "10px",
                }}
                formatDate={(date: Date): string => {
                  return (
                    date.getDate() +
                    "/" +
                    (date.getMonth() + 1) +
                    "/" +
                    date.getFullYear()
                  );
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
                    Status: "",
                    Priority: null,
                    Name: "",
                    EngagementType: "",
                    UnitName: "",
                    CreationDate: null,
                    CountryIBVT: "",
                    Requestor: "",
                    LastModifiedDate: null,
                  };
                  setFilterArr({ ...filterData });
                  props.filterdata({
                    ID: 0,
                    Status: "",
                    Priority: null,
                    Name: "",
                    EngagementType: "",
                    UnitName: "",
                    CreationDate: null,
                    CountryIBVT: "",
                    Requestor: "",
                    LastModifiedDate: null,
                  });
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
