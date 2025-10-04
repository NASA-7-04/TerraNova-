import React, { forwardRef, useState, useImperativeHandle, useEffect } from "react";
import { CheckboxButton, CheckboxButtonWithDescription, IconButton1, IconButton2, TextButton1 } from "../ui/Buttons";
import { DropdownMenu } from "../ui/MiscellaneousUIElements";
import { MenuContext } from "./WhiteFrameOnRight";




export const WelcomeWindow = forwardRef(({visible }, ref) => {
    const { setPlanet, planet, activeMenu, setActiveMenu } = React.useContext(MenuContext);

    if (!visible) {
        return null;
    }
    return (
        <>
            <div  ref={ref}>
                <h1 style={{}}>Choose Your Destination</h1>
            </div>

            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.1rem",
            }}>
                <CheckboxButtonWithDescription
                    description={"Show Fast Travel Locations"}
                />
                <CheckboxButtonWithDescription
                    description={"Show Habitable Zones"}
                />
            </div>

            <DropdownMenu name={"Planets"} onChange= {(value) => {setPlanet(value)}}>
                <TextButton1 label={"Kepler-22b"}></TextButton1>
                <TextButton1 label={"Trappist-1e"}></TextButton1>
                <TextButton1 label={"Kepler-452b"}></TextButton1>
                <TextButton1 label={"Proxima Centauri b"}></TextButton1>
                <TextButton1 label={"55 Cancri e"}></TextButton1>
            </DropdownMenu>

            <IconButton2 label={"View Details"} icon={"fa-solid fa-paper-plane"}
                onClick={() => {setActiveMenu("PlanetSelection")}}></IconButton2>
        </>
    )
})

