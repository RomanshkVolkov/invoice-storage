import { Button, Input } from '@nextui-org/react';
import { LockClosedIcon } from '@heroicons/react/24/outline';

export default function LoginForm() {
  return (
    <div className="w-full max-w-[400px]">
      <h1 className="mb-4 text-center text-4xl text-primary-400">
        Invoice Storage
      </h1>
      <p className="mb-8 text-center text-gray-500">¡Bienvenido!</p>
      <div className="w-full rounded-xl border bg-white px-8 py-12 shadow-lg">
        <div className="mb-6 flex items-center">
          <LockClosedIcon width={30} className="mr-2 text-primary-400" />
          <h2 className="text-2xl">Ingresa tus credenciales</h2>
        </div>

        <form>
          <Input label="Email" type="email" className="mb-4" />
          <Input label="Password" type="password" className="mb-6" />
          <Button color="primary" className="m-auto block w-full" size="lg">
            Acceder
          </Button>
        </form>
      </div>
    </div>
  );
}
