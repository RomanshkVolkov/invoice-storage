import { ArrowDownCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import { toast } from 'sonner';

export default function DownloadFiles({
  uuids,
  selected,
}: {
  uuids: string[];
  selected: Set<string[]> | 'all';
}) {
  const handleDownload = async () => {
    try {
      const isAll = (selected as 'all') === 'all';
      const values = isAll ? uuids : selected;
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Array.from(values as Set<string[]>)),
      });

      if (!response.ok) {
        throw new Error('Error al descargar');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoices.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error(error);
      throw new Error('Error al descargar');
    }
  };

  const actionDownload = () => {
    toast.promise(handleDownload(), {
      icon: <ArrowDownCircleIcon className="w-6" />,
      loading: 'Descargando facturas...',
      success: 'Se descargaron las facturas correctamente',
      error: 'Error al descargar',
    });
  };

  return (
    <div className="flex w-full justify-start">
      <Button variant="light" onClick={actionDownload}>
        <ArrowDownCircleIcon className="w-6" />
        <p>Descargar</p>
      </Button>
    </div>
  );
}
