'use client';

import { useMemo } from 'react';
import { Pagination } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaginationCustom({
  limit,
  items,
}: {
  limit: number;
  items: number;
}) {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const { replace } = useRouter();

  const handleChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    replace(`?${params.toString()}`);
  };

  const paginationComponent = useMemo(() => {
    const total = Math.ceil(items / limit);
    return (
      <Pagination
        total={total}
        initialPage={1}
        page={Number(page || 1)}
        variant="bordered"
        showControls
        onChange={handleChange}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, page]);

  return (
    <div className="mr-4 mt-4 flex justify-end">{paginationComponent}</div>
  );
}
