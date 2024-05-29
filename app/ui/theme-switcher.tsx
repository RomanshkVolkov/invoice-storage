'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Switch } from '@nextui-org/react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Switch
      defaultSelected
      size="lg"
      aria-label="Automatic updates"
      isSelected={theme === 'dark'}
      onValueChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      startContent={<SunIcon className="h-6 w-6" />}
      endContent={<MoonIcon className="h-6 w-6" />}
    />
  );
}
