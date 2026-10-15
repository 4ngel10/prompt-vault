import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTheme() {
  const [dark, setDark] = useLocalStorage('pv-dark', false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#1E1E34' : '#FFFFFF');
  }, [dark]);

  return [dark, () => setDark(d => !d)];
}
