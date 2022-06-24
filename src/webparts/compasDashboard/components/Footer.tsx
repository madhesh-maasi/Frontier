import * as React from "react";
import styles from "./Footer.module.scss";

const Footer = (props) => {
  return (
    <div>
      <div className={styles.footer}>
        <div className={styles.footerLinks}>
          <li>
            <a href="#">COPYRIGHTS</a>
          </li>
          <li>
            <a href="#">PRIVACY POLICY</a>
          </li>
          <li>
            <a href="#">LEGAL NOTICE</a>
          </li>
        </div>

        <div className={styles.footerContent}>
          <p>
            © Janssen Global Services, LLC, 2012-2022. All Rights Reserved. Your
            Use Of Information On This Site Is Subject To The Terms Of Our Legal
            Notice. Please See Our Privacy Policy. This Site Is Published By
            Janssen Global Services, LLC, Which Is Solely Responsible For Its
            Contents. Capitalized Product Names Aretrademarks Of Johnson &
            Johnson Or Its Affiliated Companies. This Information Is Intended
            For A Global Audience. Information Specific To Individualcountries
            Is Identified Where It Appears. All Third-Party Trademarks Used
            Herein Are Registered Trademarks Of Their Respective Owners. Last
            Updated: January 21, 2022
          </p>
        </div>
      </div>
    </div>
  );
};
export default Footer;
