import { auth } from '@/auth';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();
  const isAdmin = session?.user?.type.name.toLowerCase() === 'admin';

  return (
    <main>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-lg">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Bienvenido al Dashboard
          </h1>
          <p className="mb-4 text-gray-600">
            {`Este es tu centro de control principal. Desde aquí puedes gestionar
            tus facturas ${isAdmin ? 'y proveedores ' : ''} de manera eficiente. Utiliza el menú
            lateral para navegar a las diferentes secciones.`}
          </p>
          <p className="text-gray-600">
            Si necesitas ayuda o soporte, no dudes en ponerte en contacto con
            nuestro equipo.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-lg">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                Facturas
              </h2>
              <p className="text-gray-600">
                Sube y valida tus archivos XML de facturas para obtener
                información específica rápidamente.
              </p>
            </div>

            <Link
              href="/dashboard/invoices"
              className="mt-4 flex items-center  text-primary hover:underline"
            >
              Ir a facturas
              <ArrowTopRightOnSquareIcon className="ml-2 inline-block w-6" />
            </Link>
          </div>

          {isAdmin && (
            <div className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-lg">
              <div>
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                  Proveedores
                </h2>
                <p className="text-gray-600">
                  Gestiona tus proveedores y asigna roles de administrador según
                  sea necesario.
                </p>
              </div>

              <Link
                href="/dashboard/providers"
                className="mt-4 flex items-center  text-primary hover:underline"
              >
                Ir a proveedores
                <ArrowTopRightOnSquareIcon className="ml-2 inline-block w-6" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
