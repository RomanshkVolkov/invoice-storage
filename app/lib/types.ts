export interface User {
  id: number;
  name: string;
  type: {
    id: number;
    name: string;
  };
  rfc: string;
  password: string;
}
