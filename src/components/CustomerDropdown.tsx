import { ChangeEvent, JSX, useEffect, useState } from 'react';

interface CustomerDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

function CustomerDropdown({
  value,
  options,
  onChange,
  disabled = false
}: CustomerDropdownProps): JSX.Element {
  const [searchValue, setSearchValue] = useState<string>(value);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const normalizedSearch = searchValue.trim().toLowerCase();
  const filteredOptions = options.filter((customerId) =>
    customerId.toLowerCase().includes(normalizedSearch)
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(event.target.value);
    setIsOpen(true);
  };

  const handleSelect = (customerId: string): void => {
    setSearchValue(customerId);
    setIsOpen(false);
    onChange(customerId);
  };

  const handleBlur = (): void => {
    window.setTimeout(() => {
      setIsOpen(false);
      setSearchValue(value);
    }, 120);
  };

  return (
    <label className="filter-card filter-card--search">
      <span className="filter-card__label">Customer Id Optional</span>
      <div className="search-select">
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
          placeholder="All customers"
          disabled={disabled}
        />

        {isOpen && !disabled ? (
          <div className="search-select__menu">
            <button
              type="button"
              className={`search-select__option ${value === '' ? 'is-active' : ''}`}
              onMouseDown={() => handleSelect('')}
            >
              All Customers
            </button>
            {filteredOptions.length > 0 ? (
              filteredOptions.slice(0, 8).map((customerId) => (
                <button
                  key={customerId}
                  type="button"
                  className={`search-select__option ${customerId === value ? 'is-active' : ''}`}
                  onMouseDown={() => handleSelect(customerId)}
                >
                  {customerId}
                </button>
              ))
            ) : (
              <div className="search-select__empty">No matching customer id</div>
            )}
          </div>
        ) : null}
      </div>
    </label>
  );
}

export default CustomerDropdown;
