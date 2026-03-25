import { ChangeEvent, JSX } from 'react';

interface StateDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

function StateDropdown({
  value,
  options,
  onChange,
  disabled = false
}: StateDropdownProps): JSX.Element {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onChange(event.target.value);
  };

  return (
    <label className="filter-card">
      <span className="filter-card__label">State</span>
      <select value={value} onChange={handleChange} disabled={disabled || options.length === 0}>
        {options.length === 0 ? (
          <option value="">No states available</option>
        ) : (
          options.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))
        )}
      </select>
    </label>
  );
}

export default StateDropdown;
