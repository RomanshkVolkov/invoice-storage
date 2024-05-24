import { login } from './lib/database/user';
import { executeStoredProcedure } from './lib/database/stored-procedures';

export default async function Home() {
  const simulateLogin = await login('root@dwit.com', 'root');
  console.log(simulateLogin);
  return (
    <main>
      <h1>Stored Procedures</h1>
      <p>
        Stored procedures are a way to store SQL queries in the database and
        execute them from the application.
      </p>
      <p>
        They can be used to encapsulate complex logic, improve performance, and
        reduce network traffic.
      </p>
      <p>
        Here is an example of how to execute a stored procedure using Prisma:
      </p>
    </main>
  );
}
