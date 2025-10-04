import React, { forwardRef, useState, useImperativeHandle } from "react";
import { CheckboxButton, CheckboxButtonWithDescription, IconButton1, IconButton2, TextButton1 } from "../ui/Buttons";
import { DropdownMenu } from "../ui/MiscellaneousUIElements";

export const OpenPlanetSelectionWindow = () => {
    
}

export const PlanetSelection = forwardRef(({ name, description }, ref) => {

    const handleSelectPlanet = (planetName) => {

    };

    useImperativeHandle(ref, () => ({
        handleSelectPlanet: () => handleSelectPlanet(""),
    }));

    return (
        <>
            <div style={{}}>
                <h1 style={{}}>{name || "Unknown"}</h1>
            </div><span>{description || "No description available."}</span><div style={{
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


