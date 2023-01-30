import * as React from "react";
import { IFrontierProps } from "./IFrontierProps";
import App from "./App";
import "../../../ExternalRef/css/style.css";
import { sp } from "@pnp/sp";

export default class Frontier extends React.Component<IFrontierProps, {}> {
  constructor(prop: IFrontierProps, state: {}) {
    super(prop);
    sp.setup({
      spfxContext: this.props.context,
    });
  }
  public render(): React.ReactElement<IFrontierProps> {
    return <App context={this.props.context} sp={sp} />;
  }
}
