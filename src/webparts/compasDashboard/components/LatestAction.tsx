import * as React from "react";
import {
  TextField,
  Typography,
  Box,
  Tab,
  Tabs,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import { Mail, Send, Cancel } from "@material-ui/icons";
import classes from "./LatestAction.module.scss";
import { Persona, PersonaSize } from "office-ui-fabric-react";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const moreIcon = require("../../../ExternalRef/img/more.png");
const clockIcon = require("../../../ExternalRef/img/clock.png");
const Postmsg = require("../../../ExternalRef/img/Postmsg.png");
const Postmail = require("../../../ExternalRef/img/Postmail.png");

let latestId;
let editId;
let isSendMail = false;

const LatestAction = (props) => {
  const [timeNow, setTimeNow] = useState(
    `${
      +new Date().toLocaleDateString().split("/")[0] < 10
        ? "0" + new Date().toLocaleDateString().split("/")[0]
        : new Date().toLocaleDateString().split("/")[0]
    }/${
      +new Date().toLocaleDateString().split("/")[1] < 10
        ? "0" + new Date().toLocaleDateString().split("/")[1]
        : new Date().toLocaleDateString().split("/")[1]
    }/${
      new Date().toLocaleDateString().split("/")[2]
    } - ${new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`
  );
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState("");
  const [postedMsgs, setPostedMsgs] = useState([]);
  const [curUser, setCurUser] = useState({ Id: 0, Title: "", Email: "" });
  const [updateID, setUpdateID] = useState(0);
  const [renderLi, setRenderLi] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  useEffect(() => {
    latestId = 0;
    if (props.Latest.key != 0) latestId = props.Latest.key;
  }, [props.Latest.key]);

  useEffect(() => {
    editId = 0;
    if (props.Edit.item != null) {
      editId = props.Edit.item;
    }

    props.sp.web.currentUser.get().then((userRes) => {
      setCurUser({
        Id: userRes.Id,
        Title: userRes.Title,
        Email: userRes.Email,
      });
    });

    (props.Edit.flagEdit || latestId != 0) &&
      props.sp.web.lists
        .getByTitle("Actions")
        .items.select("*", "CASAuthor/Title", "CASAuthor/EMail", "CASRef/ID")
        .expand("CASRef", "CASAuthor")
        .filter(`CASRefId eq '${latestId != 0 ? latestId : props.Edit.item}'`)
        .orderBy("Modified", false)
        .get()
        .then((res) => {
          console.log(res);
          setPostedMsgs([]);
          setPostedMsgs(
            res.map((li, i) => ({
              Author: li.CASAuthor.Title,
              AuthorEmail: li.CASAuthor.EMail,
              Text: li.CASText,
              Modified: li.Modified,
              showOption: false,
              isEdit: false,
              Id: i + 1,
              liID: li.ID,
            }))
          );
          console.log(postedMsgs);
        })
        .catch((err) => console.log(err));
    setRenderLi(false);
  }, [renderLi]);

  // Add a message function
  const AddNewMessage = () => {
    console.log(newMessage);
    newMessage != ""
      ? props.sp.web.lists
          .getByTitle("Actions")
          .items.add({
            Title: props.Edit.Title,
            CASRefId: latestId != 0 ? latestId : props.Edit.item,
            CASText: newMessage,
            CASAuthorId: curUser.Id,
          })
          .then((res) => {
            isSendMail ? sendMail() : "";
            console.log(res),
              setNewMessage(""),
              setRenderLi(true),
              props.renderProject();
          })
          .catch((err) => console.log(err))
      : alertify.error("Please add comments");
  };

  const UpdateMessage = (message) => {
    props.sp.web.lists
      .getByTitle("Actions")
      .items.getById(updateID)
      .update({
        CASText: message,
      })
      .then((res) => {
        setUpdateID(0);
        setRenderLi(true);
        setNewMessage("");
        props.renderProject();
      });
  };
  const DeleteMessage = (ID) => {
    props.sp.web.lists
      .getByTitle("Actions")
      .items.getById(ID)
      .delete()
      .then(() => {
        alertify.success("Message Deleted successfully");
      })
      .catch((err) => console.log(err));
    setRenderLi(true);
    props.renderProject();
  };
  setInterval(() => {
    setTimeNow(
      `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );
  }, 100000);
  const sendMail = () => {
    return (window.location.href = `mailto:?subject=${props.Edit.Title}&body=${newMessage}`);
  };
  return (
    <>
      <div className={classes.titleTwo}>
        Today is <span className={classes.timeNowBold}>{timeNow}</span>
      </div>
      {/* Message */}
      {props.Admin && (
        <>
          <div className={classes.panelInput}>
            <InputLabel className={classes.inpLabel}>
              Type a message:{" "}
            </InputLabel>
            <TextField
              value={
                // props.editLatest.text == "" ? newMessage : props.editLatest.text
                newMessage
              }
              disabled={
                !props.Admin
                  ? true
                  : latestId != 0
                  ? false
                  : editId != 0
                  ? isUpdating
                    ? true
                    : false
                  : true
              }
              className={classes.msgL}
              id="typeArea"
              variant="outlined"
              placeholder={`Text here`}
              onChange={(e) => {
                setNewMessage(e.target.value);
              }}
              style={{
                border: "3px solid #00a0df",
                borderRadius: "7px",
                outline: "none",
              }}
              InputLabelProps={{ shrink: false }}
              multiline
            />
          </div>
          <div className={classes.msgActions}>
            <button
              className={`${classes.msgBtn} ${classes.msgBtn1}`}
              onClick={() => {
                isSendMail = true;
                AddNewMessage();
              }}
            >
              Post message and send update via email
              <img style={{ padding: "0px 0px 0px 10px" }} src={`${Postmail}`} />
              {/* <Mail style={{ color: "#707070", marginLeft: "10px" }} /> */}
            </button>
            <button
              className={`${classes.msgBtn} ${classes.msgBtn2}`}
              onClick={() => {
                isSendMail = false;
                AddNewMessage();
              }}
            >
              Post message
              <img style={{ padding: "0px 0px 0px 10px" }} src={`${Postmsg}`} />
              {/* <Send
                style={{
                  color: "#fff",
                  backgroundColor: "#00a0df",
                  padding: "3px 9px",
                  borderRadius: "50%",
                }}
              /> */}
            </button>
          </div>
        </>
      )}
      <div className={classes.titleTwo}>Latest messages:</div>

      <div>
        {postedMsgs.length > 0 &&
          postedMsgs.map((msg, i) => (
            <div className={classes.postedMessages} key={i + 1}>
              <div className={classes.Message}>
                <div className={classes.MsgHeader}>
                  <div className={classes.userName}>
                    <Persona
                      styles={{ root: { width: 40 } }}
                      imageUrl={
                        "/_layouts/15/userphoto.aspx?size=S&username=" +
                        // peopleIcon.EMail
                        msg.AuthorEmail
                      }
                      size={PersonaSize.size32}
                    />
                    <div>{msg.Author}</div>
                  </div>
                  <div className={classes.ModifiedDate}>
                    <img src={`${clockIcon}`} width={12} height={12} />
                    {`${
                      +new Date(msg.Modified)
                        .toLocaleDateString()
                        .split("/")[0] < 10
                        ? "0" +
                          new Date(msg.Modified)
                            .toLocaleDateString()
                            .split("/")[0]
                        : new Date(msg.Modified)
                            .toLocaleDateString()
                            .split("/")[0]
                    }/${
                      +new Date(msg.Modified)
                        .toLocaleDateString()
                        .split("/")[1] < 10
                        ? "0" +
                          new Date(msg.Modified)
                            .toLocaleDateString()
                            .split("/")[1]
                        : new Date(msg.Modified)
                            .toLocaleDateString()
                            .split("/")[1]
                    }/${
                      new Date(msg.Modified).toLocaleDateString().split("/")[2]
                    } - ${new Date(msg.Modified).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                    {/* {`${new Date(msg.Modified).toLocaleDateString()} ${new Date(
                      msg.Modified
                    ).toLocaleTimeString()}`} */}
                    <span
                      className={classes.optImgSection}
                      style={{ width: 20 }}
                    >
                      {curUser.Email == msg.AuthorEmail &&
                        props.Admin &&
                        postedMsgs.every((data) => data.isEdit == false) && (
                          <>
                            <img
                              width={16}
                              height={16}
                              src={`${moreIcon}`}
                              alt="more"
                              onClick={() => {
                                postedMsgs.forEach((pM) => {
                                  pM.showOption ? (pM.showOption = false) : "";
                                });
                                postedMsgs.filter(
                                  (pM) => pM.Id == msg.Id
                                )[0].showOption = true;
                                setPostedMsgs([...postedMsgs]);
                              }}
                            />
                            {msg.showOption ? (
                              <div className={classes.optionSection}>
                                <div
                                  style={{
                                    borderBottom: "1px solid #cacaca",
                                  }}
                                  onClick={() => {
                                    postedMsgs.filter(
                                      (pM) => pM.Id == msg.Id
                                    )[0].showOption = false;
                                    postedMsgs.filter(
                                      (pM) => pM.Id == msg.Id
                                    )[0].isEdit = true;
                                    setEditingMessage(
                                      postedMsgs.filter(
                                        (pM) => pM.Id == msg.Id
                                      )[0].Text
                                    );
                                    setPostedMsgs([...postedMsgs]);
                                    // setNewMessage(
                                    //   postedMsgs.filter(
                                    //     (pM) => pM.Id == msg.Id
                                    //   )[0].Text
                                    // );
                                    setUpdateID(
                                      postedMsgs.filter(
                                        (pM) => pM.Id == msg.Id
                                      )[0].liID
                                    );
                                    setNewMessage("");
                                    setIsUpdating(true);
                                    // document
                                    //   .querySelector("#typeArea")
                                    //   ["focus"]();
                                  }}
                                >
                                  Edit
                                </div>
                                <div
                                  onClick={() => {
                                    let deleteID = postedMsgs.filter(
                                      (pM) => pM.Id == msg.Id
                                    )[0].liID;
                                    DeleteMessage(deleteID);
                                  }}
                                >
                                  Cancel
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </>
                        )}
                    </span>
                  </div>
                </div>
                <div className={classes.content}>
                  {msg.isEdit ? (
                    <div className={classes.EditMessage}>
                      <TextField
                        onChange={(e) => {
                          setEditingMessage(e.target.value);
                          console.log(
                            postedMsgs.every((data) => data.isEdit == false)
                          );
                        }}
                        multiline
                        maxRows={4}
                        style={{ width: "100%" }}
                        value={editingMessage}
                        id="standard-basic"
                        label=""
                        variant="standard"
                      />
                      <div className={classes.editMessageIcons}>
                        <Send
                          style={{ color: "#00a0df" }}
                          className={classes.editMsgIcons}
                          onClick={() => {
                            UpdateMessage(editingMessage);
                            setIsUpdating(false);
                          }}
                        />
                        <Cancel
                          style={{ color: "#df0000" }}
                          className={classes.editMsgIcons}
                          onClick={() => {
                            setRenderLi(true);
                            props.renderProject();
                            setIsUpdating(false);
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    msg.Text
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
export default LatestAction;
