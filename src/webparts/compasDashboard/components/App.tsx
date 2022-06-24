import * as React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Pagination from "@material-ui/lab/Pagination";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import { TableContainer } from "@material-ui/core";
import classes from "./App.module.scss";
import Header from "./Header";
import TopFilter from "./TopFilter";
import Panel from "./Panel";
import AddExport from "./AddExport";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import {
  IPersonaSharedProps,
  Persona,
  PersonaSize,
  PersonaPresence,
} from "office-ui-fabric-react/lib/Persona";
import { people } from "office-ui-fabric-react";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import BorderColorOutlined from "@material-ui/icons/BorderColorOutlined";

const sortIcon = require("../../../ExternalRef/img/sort.png");
const editIcon = require("../../../ExternalRef/img/EditIcon.png");
const searchIcon = require("../../../ExternalRef/img/searchIcon.png");

const objFilterVal = {
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

let arrCountries = [];
let ArrProjectData = [];
let arrActionData = [];

let objSorted = {
  ID: "",
  Status: "",
  Priority: "",
  Name: "",
  EngagementType: "",
  UnitName: "",
  CreationDate: "",
  CountryIBVT: "",
};

const firstIndex = 0;
let pageSize = 21;

const App = (props: any) => {
  const [tableData, setTableData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterPriority, setFilterPriority] = useState([]);
  const [filterCountry, setFilterCountry] = useState([]);
  const [filterUnit, setFilterUnit] = useState([]);
  const [actionData, setActionDate] = useState([]);
  const [filterValue, setFilterValues] = useState(objFilterVal);
  const [renderTable, setRenderTable] = useState(false);
  const [countryChoice, setCountryChoice] = useState(arrCountries);
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState({
    flagEdit: false,
    item: null,
    Title: "",
  });
  const [sorted, setSorted] = useState(objSorted);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(tableData.slice(firstIndex, pageSize));
  const [callList, setCallList] = useState(true);
  const getModalResponse = (res) => {
    setShowModal(res);
  };

  const Edit = (key, IdValue, data) => {
    setShowModal(true);
    setShowEdit({ flagEdit: key, item: IdValue, Title: data });
  };

  // Life Cycle of Onload
  useEffect(() => {
    // Actions List Call
    setRenderTable(false);
    props.sp.web.lists
      .getByTitle("Actions")
      .items.select("*", "CASRef/ID", "CASAuthor/EMail", "CASAuthor/Title")
      .expand("CASRef", "CASAuthor")
      .orderBy("Modified", false)
      .get()
      .then((response) => {
        console.log(response);
        arrActionData = response.map((res) => {
          return {
            Title: res.Title ? res.Title : "",
            Text: res.CASText ? res.CASText : "",
            Author: res.CASAuthor ? res.CASAuthor.EMail : "",
            AuthorName: res.CASAuthor ? res.CASAuthor.Title : "",
            Ref: res.CASRef ? res.CASRef.ID : 0,
            Created: res.Created ? res.Created : null,
            Modified: res.Modified ? res.Modified : null,
          };
        });
        console.log(arrActionData);
      })
      .then(async () => {
        await props.sp.web.lists
          .getByTitle("Countries")
          .items.get()
          .then((cLi) => {
            arrCountries = cLi.map((li) => {
              return li.Title ? li.Title : "";
            });
            setCountryChoice(arrCountries);
          });
        await props.sp.web.lists
          .getByTitle("Projects")
          .items.select(
            "*",
            "CASUser/Title",
            "CASUser/ID",
            "CASUser/EMail",
            "CASCountry/Title",
            "CASEngType/Title",
            "CASPriority/Title",
            "CASStatus/Title"
          )
          .expand(
            "CASUser",
            "CASCountry",
            "CASEngType",
            "CASPriority",
            "CASStatus"
          )
          .orderBy("Modified", false)

          .get()
          .then(async (response) => {
            console.log(response);
            ArrProjectData = await response.map((item) => {
              let filteredComments = arrActionData.filter(
                (aData) => aData.Ref == item.ID
              );
              let requestorMails = [];
              if (item.CASUser) {
                item.CASUser.forEach((user) => {
                  requestorMails.push(user.EMail);
                });
              }
              return {
                ID: item.ID ? item.ID : 0,
                LatestComment: filteredComments ? filteredComments[0] : [],
                Status: item.CASStatus.Title ? item.CASStatus.Title : "",
                Priority: item.CASPriority.Title ? item.CASPriority.Title : "",
                Name: item.Title ? item.Title : "",
                EngagementType: item.CASEngType.Title
                  ? item.CASEngType.Title
                  : "",
                UnitName: item.CASOrgUnit ? item.CASOrgUnit : "",
                CreationDate: new Date(item.Modified),
                CountryIBVT: item.CASCountry.Title ? item.CASCountry.Title : "",
                Requestor: requestorMails,
                LastModifiedDate: new Date(item.Modified),
              };
            });
            console.log(ArrProjectData);
            setRenderTable(true);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    setCallList(false);
  }, [callList]);

  useEffect(() => {
    console.log(ArrProjectData);
    if (
      filterValue.ID == 0 &&
      filterValue.Status == "" &&
      filterValue.Priority == null &&
      filterValue.Name == "" &&
      filterValue.EngagementType == "" &&
      filterValue.UnitName == "" &&
      filterValue.CreationDate == null &&
      filterValue.CountryIBVT == "" &&
      filterValue.Requestor == "" &&
      filterValue.LastModifiedDate == null
    ) {
      setTableData(ArrProjectData);
      setData(tableData.slice(0, pageSize));
    } else {
      let arrFilteredData = ArrProjectData.filter((fItem) =>
        fItem.Name.toLowerCase().includes(filterValue.Name.toLowerCase())
      );
      arrFilteredData = arrFilteredData.filter((fItem) =>
        filterValue.Priority ? fItem.Priority == filterValue.Priority : true
      );
      arrFilteredData = arrFilteredData.filter((fItem) =>
        filterValue.CountryIBVT
          ? fItem.CountryIBVT == filterValue.CountryIBVT
          : true
      );
      arrFilteredData = arrFilteredData.filter((fItem) =>
        fItem.UnitName.toLowerCase().includes(
          filterValue.UnitName.toLowerCase()
        )
      );
      arrFilteredData = arrFilteredData.filter((fItem) =>
        filterValue.Requestor
          ? fItem.Requestor.some(
              (userMail) => userMail == filterValue.Requestor
            )
          : true
      );
      arrFilteredData = arrFilteredData.filter((fItem) =>
        filterValue.EngagementType
          ? filterValue.EngagementType == fItem.EngagementType
          : true
      );
      arrFilteredData = arrFilteredData.filter((fItem) =>
        filterValue.Status ? filterValue.Status == fItem.Status : true
      );
      arrFilteredData = arrFilteredData.filter((fItem) =>
        filterValue.ID != 0 ? filterValue.ID == fItem.ID : true
      );
      arrFilteredData = arrFilteredData.filter((fItem) =>
        filterValue.CreationDate && filterValue.CreationDate != "Invalid Date"
          ? new Date(filterValue.CreationDate).toLocaleDateString() ==
            new Date(fItem.CreationDate).toLocaleDateString()
          : true
      );
      arrFilteredData = arrFilteredData.filter((fItem) =>
        filterValue.LastModifiedDate &&
        filterValue.LastModifiedDate != "Invalid Date"
          ? new Date(filterValue.LastModifiedDate).toLocaleDateString() ==
            new Date(fItem.LastModifiedDate).toLocaleDateString()
          : true
      );
      console.log(filterValue);
      console.log("in Else");
      setTableData(arrFilteredData);
      setData(tableData.slice(0, pageSize));
    }
    setRenderTable(false);
  }, [renderTable]);

  // get on Filter Items
  const getFilterItems = (data) => {
    console.log(data);
    setFilterValues({ ...data });
    setRenderTable(true);
  };

  const handleChange = (event, value) => {
    setPage(value);
    setData(
      tableData.slice(firstIndex + pageSize * (value - 1), pageSize * value)
    );
    console.log(Math.ceil(tableData.length / pageSize));
  };

  const renderList = () => {
    setCallList(true);
  };

  return (
    <>
      <Header sp={props.sp} />
      <div style={{ position: "relative" }}>
        {showModal && (
          <Panel
            Panel={getModalResponse}
            Edit={showEdit}
            context={props.context}
            sp={props.sp}
            renderProject={renderList}
          />
        )}
        <AddExport Panel={getModalResponse} Edit={Edit} />
        <TopFilter
          context={props.context}
          sp={props.sp}
          filterdata={getFilterItems}
          data={ArrProjectData}
        />
        <TableContainer
          style={{ width: "98%", margin: "auto", padding: "2rem" }}
        >
          <Table className={classes.projectTable}>
            <TableHead>
              <TableRow>
                <TableCell
                  onClick={() => {
                    objSorted.ID == "ascending" || objSorted.ID == ""
                      ? (objSorted = {
                          ID: "descending",
                          Status: "",
                          Priority: "",
                          Name: "",
                          EngagementType: "",
                          UnitName: "",
                          CreationDate: "",
                          CountryIBVT: "",
                        })
                      : (objSorted = {
                          ID: "ascending",
                          Status: "",
                          Priority: "",
                          Name: "",
                          EngagementType: "",
                          UnitName: "",
                          CreationDate: "",
                          CountryIBVT: "",
                        });
                    setTableData([
                      ...tableData.sort((a, b) =>
                        objSorted.ID == "ascending" || objSorted.ID == ""
                          ? b.ID - a.ID
                          : a.ID - b.ID
                      ),
                    ]);
                    setData(tableData.slice(0, pageSize));
                    // setRenderTable(true);
                  }}
                >
                  <div style={{ color: "#7d7d7d", display: "flex" }}>
                    ID{" "}
                    <div>
                      <img height="10" width="10" src={`${sortIcon}`} />
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  onClick={() => {
                    objSorted.Status == "ascending" || objSorted.Status == ""
                      ? (objSorted = {
                          ID: "",
                          Status: "descending",
                          Priority: "",
                          Name: "",
                          EngagementType: "",
                          UnitName: "",
                          CreationDate: "",
                          CountryIBVT: "",
                        })
                      : (objSorted = {
                          ID: "",
                          Status: "ascending",
                          Priority: "",
                          Name: "",
                          EngagementType: "",
                          UnitName: "",
                          CreationDate: "",
                          CountryIBVT: "",
                        });
                    setTableData([
                      ...tableData.sort((a, b) =>
                        objSorted.Status == "ascending" ||
                        objSorted.Status == ""
                          ? b.Status.toLowerCase().localeCompare(
                              a.Status.toLowerCase()
                            )
                          : a.Status.toLowerCase().localeCompare(
                              b.Status.toLowerCase()
                            )
                      ),
                    ]);
                    setData(tableData.slice(0, pageSize));
                  }}
                >
                  <div style={{ color: "#7d7d7d", display: "flex" }}>
                    Status{" "}
                    <div>
                      <img height="10" width="10" src={`${sortIcon}`} />
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  onClick={() => {
                    objSorted.Priority == "ascending" ||
                    objSorted.Priority == ""
                      ? (objSorted = {
                          ID: "",
                          Status: "",
                          Priority: "descending",
                          Name: "",
                          EngagementType: "",
                          UnitName: "",
                          CreationDate: "",
                          CountryIBVT: "",
                        })
                      : (objSorted = {
                          ID: "",
                          Status: "",
                          Priority: "ascending",
                          Name: "",
                          EngagementType: "",
                          UnitName: "",
                          CreationDate: "",
                          CountryIBVT: "",
                        });
                    setTableData([
                      ...tableData.sort((a, b) =>
                        objSorted.Priority == "ascending" ||
                        objSorted.Priority == ""
                          ? b.Priority - a.Priority
                          : a.Priority - b.Priority
                      ),
                    ]);
                    setData(tableData.slice(0, pageSize));
                  }}
                >
                  <div style={{ color: "#7d7d7d", display: "flex" }}>
                    Priority{" "}
                    <div>
                      <img height="10" width="10" src={`${sortIcon}`} />
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  onClick={() => {
                    objSorted.Name == "ascending" || objSorted.Name == ""
                      ? (objSorted = {
                          ID: "",
                          Status: "",
                          Priority: "",
                          Name: "descending",
                          EngagementType: "",
                          UnitName: "",
                          CreationDate: "",
                          CountryIBVT: "",
                        })
                      : (objSorted = {
                          ID: "",
                          Status: "",
                          Priority: "",
                          Name: "ascending",
                          EngagementType: "",
                          UnitName: "",
                          CreationDate: "",
                          CountryIBVT: "",
                        });
                    setTableData([
                      ...tableData.sort((a, b) =>
                        objSorted.Name == "ascending" || objSorted.Name == ""
                          ? b.Name.toLowerCase().localeCompare(
                              a.Name.toLowerCase()
                            )
                          : a.Name.toLowerCase().localeCompare(
                              b.Name.toLowerCase()
                            )
                      ),
                    ]);
                    setData(tableData.slice(0, pageSize));
                  }}
                >
                  <div style={{ color: "#7d7d7d", display: "flex" }}>
                    Name{" "}
                    <div>
                      <img height="10" width="10" src={`${sortIcon}`} />
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  onClick={() => {
                    objSorted.EngagementType == "ascending" ||
                    objSorted.EngagementType == ""
                      ? (objSorted = {
                          ID: "",
                          Status: "",
                          Priority: "",
                          Name: "",
                          EngagementType: "descending",
                          UnitName: "",
                          CreationDate: "",
                          CountryIBVT: "",
                        })
                      : (objSorted = {
                          ID: "",
                          Status: "",
                          Priority: "",
                          Name: "",
                          EngagementType: "ascending",
                          UnitName: "",
                          CreationDate: "",
                          CountryIBVT: "",
                        });
                    setTableData([
                      ...tableData.sort((a, b) =>
                        objSorted.EngagementType == "ascending" ||
                        objSorted.EngagementType == ""
                          ? b.EngagementType.toLowerCase().localeCompare(
                              a.EngagementType.toLowerCase()
                            )
                          : a.EngagementType.toLowerCase().localeCompare(
                              b.EngagementType.toLowerCase()
                            )
                      ),
                    ]);
                    setData(tableData.slice(0, pageSize));
                  }}
                >
                  <div style={{ color: "#7d7d7d", display: "flex" }}>
                    Engagement type{" "}
                    <div>
                      <img height="10" width="10" src={`${sortIcon}`} />
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  onClick={() => {
                    objSorted.UnitName == "ascending" ||
                    objSorted.UnitName == ""
                      ? (objSorted = {
                          ID: "",
                          Status: "",
                          Priority: "",
                          Name: "",
                          EngagementType: "",
                          UnitName: "descending",
                          CreationDate: "",
                          CountryIBVT: "",
                        })
                      : (objSorted = {
                          ID: "",
                          Status: "",
                          Priority: "",
                          Name: "",
                          EngagementType: "",
                          UnitName: "ascending",
                          CreationDate: "",
                          CountryIBVT: "",
                        });
                    setTableData([
                      ...tableData.sort((a, b) =>
                        objSorted.UnitName == "ascending" ||
                        objSorted.UnitName == ""
                          ? b.UnitName.toLowerCase().localeCompare(
                              a.UnitName.toLowerCase()
                            )
                          : a.UnitName.toLowerCase().localeCompare(
                              b.UnitName.toLowerCase()
                            )
                      ),
                    ]);
                    setData(tableData.slice(0, pageSize));
                  }}
                >
                  <div style={{ color: "#7d7d7d", display: "flex" }}>
                    Unit Name{" "}
                    <div>
                      <img height="10" width="10" src={`${sortIcon}`} />
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  onClick={() => {
                    objSorted.CreationDate == "ascending" ||
                    objSorted.CreationDate == ""
                      ? (objSorted = {
                          ID: "",
                          Status: "",
                          Priority: "",
                          Name: "",
                          EngagementType: "",
                          UnitName: "",
                          CreationDate: "descending",
                          CountryIBVT: "",
                        })
                      : (objSorted = {
                          ID: "",
                          Status: "",
                          Priority: "",
                          Name: "",
                          EngagementType: "",
                          UnitName: "",
                          CreationDate: "ascending",
                          CountryIBVT: "",
                        });
                    setTableData([
                      ...tableData.sort((a, b) =>
                        objSorted.CreationDate == "ascending" ||
                        objSorted.CreationDate == ""
                          ? Date.parse(a.CreationDate) -
                            Date.parse(b.CreationDate)
                          : Date.parse(b.CreationDate) -
                            Date.parse(a.CreationDate)
                      ),
                    ]);
                    setData(tableData.slice(0, pageSize));
                  }}
                >
                  <div style={{ color: "#7d7d7d", display: "flex" }}>
                    Creation Date{" "}
                    <div>
                      <img height="10" width="10" src={`${sortIcon}`} />
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  onClick={() => {
                    objSorted.CountryIBVT == "ascending" ||
                    objSorted.CountryIBVT == ""
                      ? (objSorted = {
                          ID: "",
                          Status: "",
                          Priority: "",
                          Name: "",
                          EngagementType: "",
                          UnitName: "",
                          CreationDate: "",
                          CountryIBVT: "descending",
                        })
                      : (objSorted = {
                          ID: "",
                          Status: "",
                          Priority: "",
                          Name: "",
                          EngagementType: "",
                          UnitName: "",
                          CreationDate: "",
                          CountryIBVT: "ascending",
                        });
                    setTableData([
                      ...tableData.sort((a, b) =>
                        objSorted.CountryIBVT == "ascending" ||
                        objSorted.CountryIBVT == ""
                          ? b.CountryIBVT.toLowerCase().localeCompare(
                              a.CountryIBVT.toLowerCase()
                            )
                          : a.CountryIBVT.toLowerCase().localeCompare(
                              b.CountryIBVT.toLowerCase()
                            )
                      ),
                    ]);
                    setData(tableData.slice(0, pageSize));
                  }}
                >
                  <div style={{ color: "#7d7d7d", display: "flex" }}>
                    Country/IBVT{" "}
                    <div>
                      <img height="10" width="10" src={`${sortIcon}`} />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ color: "#7d7d7d", display: "flex" }}>
                    Requestor{" "}
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ color: "#7d7d7d", display: "flex" }}>
                    Latest action{" "}
                    <div>
                      <img height="10" width="10" src={`${sortIcon}`} />
                    </div>
                  </div>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <>
                {data.length > 0 &&
                  data.map((row, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell style={{ width: "20px" }}>
                          <div className={classes.TableID}> {row.ID}</div>
                        </TableCell>
                        <TableCell style={{ width: "100px" }}>
                          <div className={classes.statusSection}>
                            {row.Status && (
                              <div
                                className={classes.statusCircle}
                                style={{
                                  background:
                                    row.Status.toLowerCase() == "in progress"
                                      ? "#359942"
                                      : row.Status.toLowerCase() ==
                                        "waiting for feedback"
                                      ? "#f5944e"
                                      : row.Status.toLowerCase() == "lead"
                                      ? "#f24998"
                                      : row.Status.toLowerCase() == "parked"
                                      ? "#999999"
                                      : row.Status.toLowerCase() == "closed"
                                      ? "#1c75bc"
                                      : row.Status.toLowerCase() == "canceled"
                                      ? "#7e2e7a"
                                      : "#000",
                                }}
                              ></div>
                            )}
                            <div
                              className={classes.statusName}
                              style={{
                                color:
                                  row.Status.toLowerCase() == "in progress"
                                    ? "#359942"
                                    : row.Status.toLowerCase() ==
                                      "waiting for feedback"
                                    ? "#f5944e"
                                    : row.Status.toLowerCase() == "lead"
                                    ? "#f24998"
                                    : row.Status.toLowerCase() == "parked"
                                    ? "#999999"
                                    : row.Status.toLowerCase() == "closed"
                                    ? "#1c75bc"
                                    : row.Status.toLowerCase() == "canceled"
                                    ? "#7e2e7a"
                                    : "#000",
                              }}
                            >
                              {row.Status}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell
                          style={{
                            width: 50,
                          }}
                        >
                          {row.Priority}
                        </TableCell>
                        <TableCell style={{ fontSize: 20, width: 250 }}>
                          <div className={`${classes.bold} ${classes.PName}`}>
                            {row.Name}
                          </div>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#707070",
                            width: 150,
                          }}
                        >
                          <div className={classes.bold}>
                            {row.EngagementType}
                          </div>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#707070",
                            width: 130,
                          }}
                        >
                          <div className={classes.bold}>{row.UnitName}</div>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: 14,
                            color: "#707070",
                            width: 150,
                          }}
                        >
                          {/* {new Date(row.CreationDate).getDate() +
                          "/" +
                          (new Date(row.CreationDate).getMonth() + 1) +
                          "/" +
                          new Date(row.CreationDate).getFullYear()} */}
                          {/* {DateFormatter(row.CreationDate)} */}
                          <div className={classes.normal}>
                            {new Date(row.CreationDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: 14,
                            color: "#707070",
                            width: 100,
                          }}
                        >
                          <div className={classes.normal}>
                            {row.CountryIBVT}
                          </div>
                        </TableCell>
                        <TableCell
                          style={{
                            width: 60,
                            padding: 0,
                          }}
                        >
                          <div className={classes.PeopleIcons}>
                            {row.Requestor.map((peopleIcon, i) =>
                              i < 3 ? (
                                <Persona
                                  styles={{
                                    root: {
                                      width: 48,
                                      position: "relative",
                                      zIndex: 3 - i,
                                      left: i * -20,
                                    },
                                  }}
                                  imageUrl={
                                    "/_layouts/15/userphoto.aspx?size=S&username=" +
                                    // peopleIcon.EMail
                                    peopleIcon
                                  }
                                />
                              ) : (
                                ""
                              )
                            )}
                            {row.Requestor.length > 3 ? (
                              <div
                                style={{
                                  width: 48,
                                  height: 48,
                                  position: "relative",
                                  left: -53,
                                  borderRadius: "50%",
                                  fontSize: "1.5rem",
                                  fontWeight: "bold",
                                  color: "#fff",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  backgroundColor: "#00e8d1",
                                }}
                              >
                                +{row.Requestor.length - 3}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: 14,
                            color: "#707070",
                            width: 420,
                          }}
                        >
                          {row.LatestComment && (
                            <div className={classes.LatestActionInLi}>
                              <div className={classes.LAHeader}>
                                <div className={classes.LADp}>
                                  {row.LatestComment && (
                                    <Persona
                                      size={PersonaSize.size32}
                                      styles={{
                                        root: {
                                          marginRight: "0.5rem",
                                        },
                                      }}
                                      imageUrl={
                                        "/_layouts/15/userphoto.aspx?size=S&username=" +
                                        // peopleIcon.EMail
                                        row.LatestComment.Author
                                      }
                                    />
                                  )}
                                </div>
                                <div className={classes.LAUserName}>
                                  {row.LatestComment &&
                                    row.LatestComment.AuthorName}
                                </div>
                                <div className={classes.LAPostedTime}>
                                  {row.LatestComment &&
                                    new Date(
                                      row.LatestComment.Modified
                                    ).toLocaleDateString()}
                                </div>
                              </div>
                              <div
                                className={`${classes.LABody} ${classes.normal}`}
                              >
                                {row.LatestComment &&
                                row.LatestComment.Text.length > 145
                                  ? `${row.LatestComment.Text.substr(
                                      0,
                                      144
                                    )} . . .`
                                  : row.LatestComment && row.LatestComment.Text}
                              </div>
                              <div>
                                <div
                                  style={{
                                    width: "2rem",
                                    height: "2rem",
                                    borderRadius: "50%",
                                    marginLeft: "auto",
                                  }}
                                >
                                  <img
                                    src={`${searchIcon}`}
                                    width={26}
                                    height={26}
                                    style={{ transform: "rotate(90deg)" }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell style={{ width: 100 }}>
                          <div
                            style={{
                              width: "3rem",
                              height: "3rem",
                              borderRadius: "50%",
                              margin: "auto",
                            }}
                          >
                            <img
                              style={{ cursor: "pointer" }}
                              src={`${editIcon}`}
                              width={39}
                              height={39}
                              onClick={() => Edit(true, row.ID, row.Name)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </>
            </TableBody>
          </Table>
          {data.length == 0 && (
            <div className={classes.noDataFound}>No data found</div>
          )}
        </TableContainer>
        <Pagination
          count={Math.ceil(tableData.length / pageSize)}
          page={page}
          onChange={handleChange}
          className={classes.pagination}
        />
      </div>
      <Footer />
    </>
  );
};
export default App;
