import React from "react";
import { useState } from "react";

export const DropdownMenu = ({ name, value, onChange, children }) => {
    const [selectedLabel, setSelectedLabel] = useState(null);


    const handleItemClick = (childOnClick, label, button) => {
        if (childOnClick) childOnClick();

        setSelectedLabel(label);
    };
    
    return (
    <div style={{
        display: "flex",
        flexDirection: "column",
        height: "50%",
    }}>
        <div style={{
            backgroundColor: "rgba(1,1,1,0)",
            padding: "1rem",
        }}>

            <h1 style={{color : "black", margin : 0}}>{name}</h1>
        </div>
        <div style={{
            backgroundColor: "rgba(248, 248, 248, 1)",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            overflowY : "scroll",
        }}>
            {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;

            const { onClick, label, isSelected} = child.props;
            const isActive = selectedLabel === label;

            return React.cloneElement(child, {
              onClick: (event) => handleItemClick(onClick, label, child),
              props: {...child.props },
              isSelected: isActive
            });
          })}
        </div>
    </div>
)};
