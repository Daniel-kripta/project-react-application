import { useState, useEffect } from "react";

// Retrasa la actualización de un valor para ahorrar peticiones a la API:
// solo actualiza cuando se deja de escribir durante `delay` milisegundos.
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
