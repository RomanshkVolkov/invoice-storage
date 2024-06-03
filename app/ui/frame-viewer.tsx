'use client';

export default function FrameViewer({
  src,
  type,
}: {
  src: string;
  type: 'pdf' | 'xml';
}) {
  return (
    <iframe
      itemType={type === 'pdf' ? 'application/pdf' : 'text/xml'}
      src={src}
      className="h-screen w-full bg-background"
      onClick={(e) => e.stopPropagation()}
    />
  );
}
