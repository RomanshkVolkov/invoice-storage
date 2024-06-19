'use client';

import { useMemo } from 'react';
import { Pagination as NextPagination } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({
  limit,
  items,
}: {
  limit: number;
  items: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const { push } = useRouter();

  const handleChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    push(`${pathname}?${params.toString()}`);
  };

  const paginationComponent = useMemo(() => {
    const total = Math.ceil(items / limit);
    return (
      <NextPagination
        total={total || 1}
        initialPage={1}
        page={Number(page || 1)}
        variant="bordered"
        showControls={total > 1}
        onChange={handleChange}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, page]);

  return <div className="mt-4 flex justify-center">{paginationComponent}</div>;
}
