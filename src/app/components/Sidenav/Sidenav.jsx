import React, { Fragment, useState } from "react";
import Scrollbar from "react-perfect-scrollbar";
import { navigations } from "../../navigations";
import { MatxVerticalNav } from "../index";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import useSettings from "../../hooks/useSettings";
import jwtDecode from "jwt-decode";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  scrollable: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  sidenavMobileOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100vw",
    background: "rgba(0, 0, 0, 0.54)",
    zIndex: -1,
    [theme.breakpoints.up("lg")]: {
      display: "none",
    },
  },
}));

const Sidenav = ({ children }) => {
  const classes = useStyles();
  const { settings, updateSettings } = useSettings();

  const updateSidebarMode = (sidebarSettings) => {
    let activeLayoutSettingsName = settings.activeLayout + "Settings";
    let activeLayoutSettings = settings[activeLayoutSettingsName];

    updateSettings({
      ...settings,
      [activeLayoutSettingsName]: {
        ...activeLayoutSettings,
        leftSidebar: {
          ...activeLayoutSettings.leftSidebar,
          ...sidebarSettings,
        },
      },
    });
  };
  const token = localStorage.getItem("accessToken");
  const decode = jwtDecode(token);

  const [userRole, setUserRole] = useState(decode.data?.role);
  const [menuItems, setMenuItems] = useState(
    JSON.parse(localStorage.getItem("menuList"))
  );

  //   const menuItems = [
  //     {
  //       name: "Dashboard",
  //     },
  //     {
  //       name: "Orders",
  //       subMenuList: ["Pos Order", "Order list"],
  //     },
  //   ];

  let result =
    menuItems?.length > 0
      ? navigations.filter((o1) => menuItems.some((o2) => o1.name === o2.name))
      : navigations;

  if (menuItems?.length > 0) {
    result.forEach((item, index) => {
      let indexf = menuItems.findIndex((el) => el.name === item?.name);
      let res = result[indexf].children?.filter((f) =>
        menuItems[index].subMenuList.includes(f.name)
      );
      result[indexf]["children"] = res;
    });
  }

  return (
    <Fragment>
      <Scrollbar
        options={{ suppressScrollX: true }}
        className={clsx("relative px-4", classes.scrollable)}
      >
        {children}
        <MatxVerticalNav items={result} />
      </Scrollbar>

      <div
        onClick={() => updateSidebarMode({ mode: "close" })}
        className={classes.sidenavMobileOverlay}
      />
    </Fragment>
  );
};

export default Sidenav;
