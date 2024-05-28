'use client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Input } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
interface Props {
  data: {
    key: string;
    label: string;
  };
}

export default function SearchFilter({ data }: Props) {
  const { key, label } = data;
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleOnChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClearInput = () => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Input
      className="max-w-[350px]"
      size="sm"
      label={label}
      defaultValue={searchParams.get(key)?.toString()}
      onChange={(e) => handleOnChange(e.target.value)}
      onClear={handleClearInput}
      isClearable
    />
  );
}
