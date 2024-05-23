import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { executeStoredProcedure } from './lib/database/stored-procedures';

export default async function Home() {
  const data = await executeStoredProcedure('sp_web_login', {
    email: 'root@dwit.com',
  });
  console.log(data);
  const user = data[0];
  return (
    <main>
      {Object.keys(user).map((key, i) => (
        <span key={`${key}_${i}`}>
          {key}: {user[key] || ''}
          <br />
        </span>
      ))}
    </main>
  );
}
