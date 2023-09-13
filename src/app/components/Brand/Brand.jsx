import React from "react";
import { MatxLogo } from "../index";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import useSettings from "../../hooks/useSettings";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  brand: {
    padding: "20px 18px 20px 29px",
  },
  hideOnCompact: {
    display: "none",
  },
}));

const Brand = ({ children }) => {
  const history = useHistory();
  const classes = useStyles();
  const { settings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;

  return (
    <div className={clsx("flex items-center justify-between", classes.brand)}>
      <div
        className="flex items-center"
        style={{ cursor: "pointer" }}
        onClick={() => history.push("/dashboard")}
      >
        {/* <img height="45px" src="/Logo.png" alt="" /> */}
        <span
          className={clsx({
            "text-28 ml-2 font-medium sidenavHoverShow": true,
            [classes.hideOnCompact]: mode === "compact",
          })}
        >
          {/* <img height="45px" src="/Logo.png" alt="logo" /> */}
          Dropify
        </span>
      </div>
      <div
        className={clsx({
          sidenavHoverShow: true,
          [classes.hideOnCompact]: mode === "compact",
        })}
      >
        {children || null}
      </div>
    </div>
  );
};

export default Brand;
