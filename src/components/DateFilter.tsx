import { ChangeEvent, JSX } from 'react';

interface DateFilterProps {
  label: string;
  value: string;
  minDate?: string;
  maxDate?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function DateFilter({
  label,
  value,
  minDate,
  maxDate,
  onChange,
  disabled = false
}: DateFilterProps): JSX.Element {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return (
    <label className="filter-card">
      <span className="filter-card__label">{label}</span>
      <input
        type="date"
        value={value}
        min={minDate}
        max={maxDate}
        onChange={handleChange}
        disabled={disabled}
      />
    </label>
  );
}

export default DateFilter;
