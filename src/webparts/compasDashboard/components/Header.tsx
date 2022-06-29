import * as React from "react";
import classes from "./Header.module.scss";
import { useState, useEffect } from "react";
import {
  AddBox,
  FilterTiltShift,
  FilterTiltShiftSharp,
} from "@material-ui/icons";
import {
  IPersonaSharedProps,
  Persona,
  PersonaSize,
  PersonaPresence,
} from "office-ui-fabric-react/lib/Persona";

const Logo = require("../../../ExternalRef/img/Logo.png");
let objUserDetails = {
  Email: "",
  Title: "",
  JobTitle: "",
};

const Header = (props) => {
  const [userDetails, setUserDetails] = useState(objUserDetails);

  useEffect(() => {
    props.sp.web.currentUser
      .get()
      .then((resp) => {
        objUserDetails.Email = resp.Email;
        objUserDetails.Title = resp.Title;
        setUserDetails({ ...objUserDetails });
      })
      .then(() => {
        props.sp.profiles.myProperties.get().then((profiles) => {
          console.log(profiles);
          objUserDetails.JobTitle = profiles.Title;
          setUserDetails({ ...objUserDetails });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className={classes.headerSection}>
      {/* logo Section */}
      <div className={classes.logoSection}>
        <div className="logo">
          <img src={`${Logo}`} width={235} height={87} />
        </div>
        <div className={classes.Profile}>
          <div className={classes.userDetails}>
            <span className={classes.userRole}>{userDetails.JobTitle}</span>
            <span className={classes.userName}>{userDetails.Title}</span>
          </div>
          <div className={classes.profilePicture}>
            <Persona
              imageUrl={
                "/_layouts/15/userphoto.aspx?size=S&username=" +
                userDetails.Email
              }
              size={PersonaSize.size72}
            />
          </div>
        </div>
      </div>

      {/* banner Section*/}
      {/* <div
        className={classes.bannerSection}
        style={{
          backgroundImage: `url(${BannerBg})`,
          backgroundSize: "cover",
          width: "100%",
          height: "185px",
        }}
      >
        <div className={classes.actions}>
          <button className={classes.addProject}>
            <AddBox
              style={{ width: "20px", height: "20px", marginRight: "10px" }}
            />{" "}
            ADD PROJECT
          </button>
          <button className={classes.Export}>
            <img src={`${ExcelFileButton}`} alt="ExcelFileButton" />
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Header;
