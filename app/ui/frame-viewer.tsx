'use client';

import Link from 'next/link';
import { Link as LinkComponent } from '@nextui-org/react';

export default function FrameViewer({
  src,
  type,
}: {
  src: string;
  type: 'application/pdf' | 'text/xml';
}) {
  return (
    <>
      <LinkComponent
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        as={Link}
        aria-label="open file in new window"
      >
        <h1 className="text-center text-lg text-primary">
          Abrir en nueva ventana
        </h1>
      </LinkComponent>
      <iframe
        id={`frame-viewer-${type}-${src.split('/').pop()}`}
        itemType={type}
        src={src}
        className="h-screen w-full bg-background"
        onClick={(e) => e.stopPropagation()}
        loading="eager"
      />
    </>
  );
}
