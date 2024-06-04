'use client';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Select, SelectItem, Selection } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CompanyFilter({
  options,
}: {
  options: { label: string; value: string }[];
}) {
  const searchparams = useSearchParams();
  const { replace } = useRouter();
  const handleOnChange = (keys: Selection) => {
    const value = Array.from(keys)[0];
    const params = new URLSearchParams(searchparams);
    params.set('company', value.toString());
    replace(`?${params.toString()}`);
  };

  return (
    <Select
      placeholder="Selecciona una empresa"
      onSelectionChange={handleOnChange}
      className="h-full w-full md:w-[350px]"
      startContent={<BuildingOfficeIcon className="h-6 w-6 text-gray-500" />}
    >
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
}
