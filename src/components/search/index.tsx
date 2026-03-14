import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { InputAdornment, TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

interface SearchBarProps extends Omit<TextFieldProps, 'variant'> {
  debounceMs?: number;
  onDebouncedChange?: (value: string) => void;
  showSearchIcon?: boolean;
}

const SearchBar = ({
  debounceMs = 400,
  onChange,
  onDebouncedChange,
  showSearchIcon = true,
  fullWidth = true,
  value,
  InputProps,
  ...textFieldProps
}: SearchBarProps): JSX.Element => {
  const [inputValue, setInputValue] = useState(String(value ?? ''));
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setInputValue(String(value ?? ''));
  }, [value]);

  useEffect(
    () => () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    },
    []
  );

  const handleChange: NonNullable<TextFieldProps['onChange']> = (event) => {
    const nextValue = event.target.value;
    setInputValue(nextValue);
    onChange?.(event);

    if (!onDebouncedChange) {
      return;
    }

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      onDebouncedChange(nextValue);
    }, debounceMs);
  };

  const startAdornment = showSearchIcon ? (
    <InputAdornment position="start">
      <SearchRoundedIcon color="action" />
    </InputAdornment>
  ) : null;

  return (
    <TextField
      {...textFieldProps}
      fullWidth={fullWidth}
      onChange={handleChange}
      value={inputValue}
      InputProps={{
        ...InputProps,
        startAdornment: startAdornment ?? InputProps?.startAdornment,
      }}
    />
  );
};

export default SearchBar;
