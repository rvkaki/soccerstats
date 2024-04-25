import React, { FC, ChangeEvent } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const Select: FC<SelectProps> = ({ options, onChange }) => {
  return (
    <select
      onChange={onChange}
      className="bg-transparent border-[1px] rounded-md px-3 py-1 border-gray-600 text-base leading-6 sm:text-sm sm:leading-5"
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
