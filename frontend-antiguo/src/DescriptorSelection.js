import React from 'react';

const DescriptorSelection = ({ descriptorList, selectedDescriptors, descriptorParams, onDescriptorChange, onParamChange }) => {
    return (
        <div>
            {descriptorList.map((descriptor, index) => (
                <div key={index}>
                    <label>
                        <input 
                            type="checkbox" 
                            name={descriptor.name} 
                            checked={selectedDescriptors[descriptor.name] || false} 
                            onChange={onDescriptorChange} 
                        />
                        {descriptor.name}
                    </label>
                    {selectedDescriptors[descriptor.name] && descriptor.params && descriptor.params.length > 0 && (
                        <div>
                            {descriptor.params.map((param, i) => (
                                <div key={i}>
                                    <label>{param}:</label>
                                    <input 
                                        type="text" 
                                        value={descriptorParams[descriptor.name]?.[param] || ''} 
                                        onChange={(e) => onParamChange(descriptor.name, param, e.target.value)} 
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DescriptorSelection;


