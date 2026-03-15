import React from 'react';

const SliderInput = ({ label, name, min, max, value, onChange, unit, step = 1 }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={name} className="text-gray-700 font-medium">
          {label}
        </label>
        <span className="text-rose-600 font-semibold">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        id={name}
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
        style={{
          background: `linear-gradient(to right, #e11d48 0%, #e11d48 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
        }}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default SliderInput;
