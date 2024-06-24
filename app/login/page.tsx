import LoginCard from '../ui/login/login-card';
import { authenticate } from '../lib/actions/auth.actions';

export default function Login() {
  return (
    <main className="flex h-screen items-center justify-center">
      <LoginCard />
    </main>
  );
}
