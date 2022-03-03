import React, { useEffect } from "react";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from "./NarbarElements";
import { useTranslation } from "react-i18next";
import LanguageSwitcherSelector from "./LanguageSwitcherSelector";
import ButtonConnectMetamask from "./ButtonConnectMetamask";

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <>
      <Nav>
        <NavLink to="/">
          <img
            src="images/logo.jpg"
            alt="logo"
            width={50}
            height={50}
          />
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to="/lottery" activeStyle>
            {t("Lottery")}
          </NavLink>
          <NavLink to="/about">
            {t("About")}
          </NavLink>
        </NavMenu>
        <NavBtn>
          <LanguageSwitcherSelector/>
          <ButtonConnectMetamask/>
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;
