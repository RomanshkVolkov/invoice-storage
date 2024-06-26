import { getUsers } from '@/app/lib/database/user';
import CreateLinkButton from '@/app/ui/dashboard/create-button';
import SearchFilter from '@/app/ui/dashboard/search-filter';
import UsersTable from '@/app/ui/dashboard/users/table';

export default async function Page() {
  const users = await getUsers();

  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl">Usuarios</h1>
        <CreateLinkButton href="/dashboard/users/create">
          Crear usuario
        </CreateLinkButton>
      </div>
      <div className="mb-4">
        <SearchFilter data={{ key: 'query', label: 'Buscar' }} />
      </div>
      <UsersTable users={users!} />
    </main>
  );
}
