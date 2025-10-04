import React from 'react';

export const RadioButton = ({ label, name, value, checked, onChange }) => (
    <label style={{ marginRight: '1rem' }}>
        <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            style={{ 
                marginRight: '0.5rem',
                width : "1.5rem",
                height : "1.5rem"
             }}
        />
        {label}
    </label>
);

export const CheckboxButton = ({ label, name, value, checked, onChange }) => (
    <label style={{ marginRight: '1rem' }}>
        <input
            type="checkbox"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            style={{ 
                width : "1.5rem",
                height : "1.5rem"
             }}
        />
        {label}
    </label>
);

export const CheckboxButtonWithDescription = ({ label, description, name, value, checked, onChange }) => (
    <div style = {{
        display : "flex",
        alignItems : "center",
    }}>
        <CheckboxButton label={label} name={name} value={value} checked={checked} onChange={onChange} />
        <span>{description}</span>
    </div>
);