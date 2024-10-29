import React from 'react';

const DescriptorSelection = ({ descriptorList, selectedDescriptors, descriptorParams, onDescriptorChange, onParamChange }) => {
    console.log("descruotorList en DescriptorSelection",descriptorList);
    return (
        <div>
            {descriptorList.map(descriptor => (
                <div key={descriptor.name}>
                    <label>
                        <input
                            type="checkbox"
                            name={descriptor.name}
                            checked={selectedDescriptors[descriptor.name] || false}
                            onChange={onDescriptorChange}
                        />
                        {descriptor.name}
                    </label>
                    {selectedDescriptors[descriptor.name] && (
                        <div>
                            {descriptor.params.map(param => (
                                <div key={param.paramName}>
                                    <label>{param.value.paramName}:</label>
                                    <input
                                        type="text"
                                        value={descriptorParams[descriptor.name]?.[param.value.paramName] || ''} // Acceder al valor correcto
                                        onChange={(e) => onParamChange(descriptor.name, param.value.paramName, e.target.value)}
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
