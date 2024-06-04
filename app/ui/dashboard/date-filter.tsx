'use client';

import React from 'react';
import { DateRangePicker, RangeValue } from '@nextui-org/react';
import { today, getLocalTimeZone, CalendarDate } from '@internationalized/date';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function DateFilter() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const [value, setValue] = React.useState(() => {
    const start = startDate
      ? stringToCalendarDate(startDate)
      : today(getLocalTimeZone()).add({ weeks: -1 });
    const end = endDate
      ? stringToCalendarDate(endDate)
      : today(getLocalTimeZone());
    return { start, end };
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
      aria-label="Date range picker"
    />
  );
}

function stringToCalendarDate(date: string): CalendarDate {
  const [year, month, day] = date.split('-').map(Number);
  return new CalendarDate(year, month, day);
}
