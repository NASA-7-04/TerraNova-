import React from 'react';

export const RadioButton = ({ label, name, value, checked, onChange }) => (
    <label style={{ marginRight: '1rem' }}>
        <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            style={{ marginRight: '0.5rem' }}
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
                width : "1rem",
                height : "1rem"
             }}
        />
        {label}
    </label>
);