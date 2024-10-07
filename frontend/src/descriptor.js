// descriptor.js
import React from 'react';

const Descriptor = ({ name, checked, onChange }) => {
    return (
        <div>
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
            />
            <label>{name}</label>
        </div>
    );
};

export default Descriptor;

