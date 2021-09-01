import React, { createContext, useContext, useEffect, useState } from "react";

export const sidebarContext = createContext({
  toggle: false,
  setToggle: (payload: boolean) => {},
});

export const useSidebarContext = () => useContext(sidebarContext);

export const SidebarManager = ({ children }) => {
  const [toggle, setToggle] = useState(false);

  let toggleState: boolean = JSON.parse(localStorage.getItem("isToggle"));

  useEffect(() => {
    if (toggleState !== toggle) {
      setToggle(toggleState);
    }
  }, [toggleState, toggle]);

  return (
    <sidebarContext.Provider
      value={{
        toggle,
        setToggle: (val) => {
          setToggle(val);
          localStorage.setItem("isToggle", JSON.stringify(val));
        },
      }}
    >
      {children}
    </sidebarContext.Provider>
  );
};
