import * as React from "react";
import styles from "./Frontier.module.scss";
import { useState, useEffect } from "react";
import { FontSizes } from "@uifabric/styling";

interface IFrontierDatas {
  Color: any;
  LinkName: string;
  Url: any;
  BGColor:string;
}

let arrMasterObject: IFrontierDatas[] = [];

const App = (props: any) => {
  /* Variable-Declaration start */
  let FrontierObject: IFrontierDatas[] = [
    {
      Color: "",
      LinkName: "",
      Url: null,
      BGColor:""
    },
  ];
  /* Variable-Declaration end */

  /* State-Declaration start */
  const [masterObject, setMasterObject] =
    useState<IFrontierDatas[]>(FrontierObject);
  const [hoverElement, setHoverElement] = useState<number>(0);
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
        arrMasterObject = [];
        if (response.length > 0) {
          response.forEach((data: any) =>
            arrMasterObject.push({
              Color: data.Title ? data.Title : "#fff",
              LinkName: data.Url.Description ? data.Url.Description : "",
              Url: data.Url.Url ? data.Url.Url : "",
              BGColor: data.BGColor ? data.BGColor : "#ffffff"
            })
          );
        }
        setMasterObject([...arrMasterObject]);
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

  return (
    <div style={{ minHeight: "460px" }}>
      <div
        style={{
          margin: "10px 30px",
          fontSize: "18px",
          fontWeight: 500,
        }}
      >
        {props.Title}
      </div>
      {masterObject.length > 0 ? (
        masterObject.map((row: IFrontierDatas, i: number) => {
          return (
            <>
              <div
                onMouseEnter={() => {
                  setHoverElement(i + 1);
                }}
                onMouseLeave={() => {
                  setHoverElement(0);
                }}
                style={{
                  margin: "10px",
                  height: "40px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: 600,
                  cursor: "pointer",
                  background:`${row.BGColor}`,
                  color:`${row.Color}`,
                  border:
                    hoverElement === i + 1
                      ? `2px solid #3b4e55`
                      : `2px solid ${row.Color}`,
                  //color: hoverElement === i + 1 ? ("#fff") : (`${row.Color}`),
                  //background: hoverElement === i + 1 ?  `${row.BGColor}` : "#fff",
                }}
                onClick={() => window.open(row.Url)}
              >
                {row.LinkName}
              </div>
            </>
          );
        })
      ) : (
        <div>No data found !!!</div>
      )}
    </div>
  );
};

export default App;
