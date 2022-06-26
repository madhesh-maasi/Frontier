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
import { Mail, Send } from "@material-ui/icons";
import classes from "./LatestAction.module.scss";
import { Persona, PersonaSize } from "office-ui-fabric-react";

const moreIcon = require("../../../ExternalRef/img/more.png");

let latestId;
let editId;

const LatestAction = (props) => {
  const [timeNow, setTimeNow] = useState(
    `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`
  );
  const [newMessage, setNewMessage] = useState("");
  const [postedMsgs, setPostedMsgs] = useState([]);
  const [curUser, setCurUser] = useState({ Id: 0, Title: "", Email: "" });
  const [updateID, setUpdateID] = useState(0);
  const [renderLi, setRenderLi] = useState(true);
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

    props.Edit.flagEdit &&
      props.sp.web.lists
        .getByTitle("Actions")
        .items.select("*", "CASAuthor/Title", "CASAuthor/EMail", "CASRef/ID")
        .expand("CASRef", "CASAuthor")
        .filter(`CASRefId eq '${props.Edit.item}'`)
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
              Id: i + 1,
              liID: li.ID,
            }))
          );
          console.log(postedMsgs);
        })
        .catch((err) => console.log(err));
    setRenderLi(false);
  }, [props.Edit.flagEdit, renderLi]);

  // Add a message function
  const AddNewMessage = () => {
    console.log(newMessage);
    newMessage != ""
      ? props.sp.web.lists
          .getByTitle("Actions")
          .items.add({
            Title: props.Edit.Title,
            CASRefId: props.Edit.item,
            CASText: newMessage,
            CASAuthorId: curUser.Id,
          })
          .then(
            (res) =>
              setPostedMsgs([
                ...[
                  {
                    Author: curUser.Title,
                    AuthorEmail: curUser.Email,
                    Text: newMessage,
                    Modified: new Date(),
                  },
                  ...postedMsgs,
                ],
              ]),
            setNewMessage(""),
            setRenderLi(true)
          )

          .catch((err) => console.log(err))
      : alert("please add comments");
  };
  const UpdateMessage = () => {
    props.sp.web.lists
      .getByTitle("Actions")
      .items.getById(updateID)
      .update({
        CASText: newMessage,
      })
      .then((err) => console.log(err));
    setUpdateID(0);
    setRenderLi(true);
    setNewMessage("");
  };
  setInterval(() => {
    setTimeNow(
      `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );
  }, 100000);

  return (
    <>
      <div className={classes.titleTwo}>
        Today is <b>{timeNow}</b>
      </div>
      {/* Message */}
      <div className={classes.panelInput}>
        <InputLabel className={classes.inpLabel}>
          Type a message:{" "}
          {latestId != 0 ? latestId : editId != 0 ? editId : null}
        </InputLabel>
        <TextField
          value={newMessage}
          disabled={latestId != 0 ? false : editId != 0 ? false : true}
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
          onClick={() =>
            (window.location.href = `mailto:?subject=${props.Edit.Title}&body=${newMessage}`)
          }
        >
          Post message and send update via email{" "}
          <Mail style={{ color: "#707070", marginLeft: "10px" }} />
        </button>
        <button
          className={`${classes.msgBtn} ${classes.msgBtn2}`}
          onClick={() => {
            console.log(props.Edit.item);
            // console.log(props.forAction);
            updateID == 0 ? AddNewMessage() : UpdateMessage();
          }}
        >
          Post message
          <Send
            style={{
              color: "#fff",
              backgroundColor: "#00a0df",
              padding: "3px 9px",
              borderRadius: "50%",
            }}
          />
        </button>
      </div>
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
                    {`${new Date(msg.Modified).toLocaleDateString()} ${new Date(
                      msg.Modified
                    ).toLocaleTimeString()}`}
                    <span
                      className={classes.optImgSection}
                      style={{ width: 20 }}
                    >
                      {curUser.Email == msg.AuthorEmail && (
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
                                  setNewMessage(
                                    postedMsgs.filter(
                                      (pM) => pM.Id == msg.Id
                                    )[0].Text
                                  );
                                  setUpdateID(
                                    postedMsgs.filter(
                                      (pM) => pM.Id == msg.Id
                                    )[0].liID
                                  );
                                  document
                                    .querySelector("#typeArea")
                                    ["focus"]();
                                }}
                              >
                                Edit
                              </div>
                              <div
                                onClick={() => {
                                  postedMsgs.filter(
                                    (pM) => pM.Id == msg.Id
                                  )[0].showOption = false;
                                  setPostedMsgs([...postedMsgs]);
                                  setUpdateID(0);
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
                <div className={classes.content}>{msg.Text}</div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
export default LatestAction;