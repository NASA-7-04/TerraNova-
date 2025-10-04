import React, { forwardRef, useState, useImperativeHandle } from "react";
import { CheckboxButton, CheckboxButtonWithDescription, IconButton1, IconButton2, IconButton3, TextButton1 } from "../ui/Buttons";
import { DropdownMenu } from "../ui/MiscellaneousUIElements";
import { MenuContext } from "./WhiteFrameOnRight";

export const PlanetSelection = forwardRef(({  visible }, ref) => {
    const { setPlanet, planet, activeMenu, setActiveMenu } = React.useContext(MenuContext);

    if (!visible) {
        return null;
    }
    return (
        <>
            <IconButton3 label={"Back"} icon={"fa-solid fa-arrow-left"} onClick={() => {setActiveMenu("WelcomeWindow")}}></IconButton3>
            <div style={{
            }} ref={ref}>
                <h1 style={{}}>{planet || "Unknown"}</h1>
            </div><span>{null || "No description available."}</span><div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.1rem",
                color: "gray",
            }}>
                <a>● Difficulty : EASY</a>
                <a>● Temperature : -15 - 35 ºC</a>
                <a>● Type : G</a>
            </div><IconButton2 label={"Choose Destination"} icon={"fa-solid fa-paper-plane"} onClick={() => { }}></IconButton2>
        </>
    )
})


