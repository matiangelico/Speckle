import React from 'react';

const DescriptorSelection = ({ descriptorList, selectedDescriptors, descriptorParams, onDescriptorChange, onParamChange }) => {
    console.log("descriptorList en DescriptorSelection", descriptorList);
    console.log("selectedDescriptros en DescriptorSelection", selectedDescriptors);
    console.log("descriptorParams en DescriptorSelection", descriptorParams);
    console.log("onDescriptorChange en DescriptorSelection", onDescriptorChange);
    console.log("onParamChange en DescriptorSelection", onParamChange);
    
    return (
        <div>
            {descriptorList.map(descriptor => (
                <div key={descriptor._id}> {/* Cambié key a descriptor._id si está disponible */}
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
                            {descriptorParams[descriptor.name] && Object.keys(descriptorParams[descriptor.name]).map(key => {
                                const param = descriptorParams[descriptor.name][key]; // Obtener el parámetro
                                return (
                                    <div key={param.paramName}>
                                        <label>
                                            {param.paramName}:
                                            <input
                                                type="text"
                                                value={param.value} // Usar el valor por defecto
                                                onChange={(e) => onParamChange(descriptor.name, param.paramName, e.target.value)}
                                            />
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DescriptorSelection;
