import { LockClosedIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Form from './login-form';

export default function LoginCard() {
  return (
    <div className="w-full max-w-[400px]">
      <div className="w-full rounded-xl border bg-white p-8 shadow-lg">
        <p className="mb-8 text-center text-gray-500">¡Bienvenido!</p>

        <div>
          <div className="mb-6 flex items-center">
            <LockClosedIcon width={30} className="mr-2 text-primary-500" />
            <h2 className="text-2xl">Ingresa tus credenciales</h2>
          </div>
          <Form />
        </div>
        <Image
          src="/receipt.jpg"
          sizes="100vw"
          width={100}
          height={100}
          style={{
            width: '100%',
            height: 'auto',
          }}
          alt="Mano sosteniendo un recibo"
        />
      </div>
    </div>
  );
}
