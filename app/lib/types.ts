export interface User {
  id: number;
  email: string;
  password: string;
  type: {
    id: number;
    name: string;
  };
}

export interface Provider {
  id: number;
  rfc: string;
  name: string;
  zipcode: number | null;
  user: User;
  [key: string]: any;
}
