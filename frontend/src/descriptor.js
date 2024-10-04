// Descriptor.js
import React from 'react';

const Descriptor = ({ name, checked, onChange }) => {
    return (
        <label>
            <input 
                type="checkbox" 
                name={name} 
                checked={checked} 
                onChange={onChange} 
            />
            {name}
        </label>
    );
};

export default Descriptor;
