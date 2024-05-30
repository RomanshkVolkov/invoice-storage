'use client';
import { DateRangePicker, RangeValue } from '@nextui-org/react';
import React from 'react';
import { today, getLocalTimeZone, CalendarDate } from '@internationalized/date';
import { usePathname, useRouter } from 'next/navigation';

export default function DateFilter() {
  const { replace } = useRouter();
  const pathname = usePathname();
  let [value, setValue] = React.useState({
    start: today(getLocalTimeZone()).add({ weeks: -1 }),
    end: today(getLocalTimeZone()),
  });
  const handleChange = (e: RangeValue<CalendarDate>) => {
    setValue(e);
    const { start, end } = e;
    const startDate = `${start.year}-${start.month}-${start.day}`;
    const endDate = `${end.year}-${end.month}-${end.day}`;
    replace(`${pathname}?startDate=${startDate}&endDate=${endDate}`);
  };
  return (
    <DateRangePicker
      className="h-full max-w-[350px] md:w-[250px]"
      value={value}
      onChange={handleChange}
    />
  );
}
