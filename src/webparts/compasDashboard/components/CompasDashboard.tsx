import * as React from "react";
import styles from "./CompasDashboard.module.scss";
import { ICompasDashboardProps } from "./ICompasDashboardProps";
import { escape } from "@microsoft/sp-lodash-subset";
import App from "./App";
import "../../../ExternalRef/css/style.scss";
import { sp } from "@pnp/pnpjs";
export default class CompasDashboard extends React.Component<
  ICompasDashboardProps,
  {}
> {
  constructor(prop: ICompasDashboardProps, state: {}) {
    super(prop);
    sp.setup({
      spfxContext: this.props.context,
    });
  }
  public render(): React.ReactElement<ICompasDashboardProps> {
    return (
      <App className="CompasProject" context={this.props.context} sp={sp} />
    );
  }
}
