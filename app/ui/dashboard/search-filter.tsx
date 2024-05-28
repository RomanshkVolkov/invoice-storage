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
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.isPropagationStopped();
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
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
      label={label}
      variant="underlined"
      onChange={handleOnChange}
      endContent={
        <Button variant="light" isIconOnly onClick={handleClearInput}>
          <XMarkIcon className="w-5" />
        </Button>
      }
    />
  );
}
