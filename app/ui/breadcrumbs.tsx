'use client';

import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/react';

interface BreadCrumbProps {
  items: {
    label: string;
    href: string;
  }[];
}
export default function CustomBreadcrumbs({ items }: BreadCrumbProps) {
  return (
    <Breadcrumbs variant="solid">
      {items.map((item, index) => (
        <BreadcrumbItem key={index} href={item.href}>
          {item.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}
