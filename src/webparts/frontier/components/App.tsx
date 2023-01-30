import * as React from "react";
import styles from "./Frontier.module.scss";
import { useState, useEffect } from "react";

interface IFrontierDatas {
  Color: any;
  LinkName: string;
  Url: any;
}

const App = (props: any) => {
  /* Variable-Declaration start */
  let FrontierObject: IFrontierDatas = {
    Color: "",
    LinkName: "",
    Url: null,
  };
  /* Variable-Declaration end */

  /* State-Declaration start */
  const [masterObject, setMasterObject] =
    useState<IFrontierDatas>(FrontierObject);
  /* State-Declaration end */

  /* Function-Declaration start */
  const getErrorFunction = async (error: any) => {
    console.log(error);
  };

  const getMasterRecord = async () => {
    await props.sp.web.lists
      .getByTitle("Custom Quick Link")
      .items.get()
      .then((response: any) => {
        if (response.length > 0) {
          response;
        }
      })
      .catch((error: any) => {
        getErrorFunction(error);
      });
  };
  /* Function-Declaration end */

  /* LifeCycle-Declaration start */
  useEffect(() => {
    getMasterRecord();
  }, []);
  /* LifeCycle-Declaration end */

  return <div>Deva</div>;
};

export default App;
