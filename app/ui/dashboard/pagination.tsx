'use client';

import { Pagination as NextPagination } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages = 1 }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || 1;
  const { push } = useRouter();

  const handleChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    push(`${pathname}?${params.toString()}`);
  };

  return (
    <NextPagination
      total={totalPages}
      initialPage={1}
      page={+page}
      showControls={totalPages > 1}
      onChange={handleChange}
    />
  );
}
