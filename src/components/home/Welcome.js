import React, { forwardRef, useState, useImperativeHandle } from "react";
import { CheckboxButton, CheckboxButtonWithDescription, IconButton1, IconButton2, TextButton1 } from "../ui/Buttons";
import { DropdownMenu } from "../ui/MiscellaneousUIElements";



const LoadPlanetInformation = (name) => {

}


const WelcomeWindow = forwardRef(({ }, ref) => {
    const DropdownMenuRef = React.useRef();
    const ViewDetailsButtonRef = React.useRef();

    useImperativeHandle(ref, () => ({

    }));

    return (
        <>
            <div style={{
            }}>
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

            <DropdownMenu name={"Planets"} ref={DropdownMenuRef}>
                <TextButton1 label={"Kepler-22b"}></TextButton1>
                <TextButton1 label={"Trappist-1e"}></TextButton1>
                <TextButton1 label={"Kepler-452b"}></TextButton1>
                <TextButton1 label={"Proxima Centauri b"}></TextButton1>
                <TextButton1 label={"55 Cancri e"}></TextButton1>
            </DropdownMenu>

            <IconButton2 label={"View Details"} icon={"fa-solid fa-paper-plane"}
                onClick={() => {console.log(DropdownMenuRef.current)}} ref={ViewDetailsButtonRef}></IconButton2>
        </>
    )
})

export default WelcomeWindow;
