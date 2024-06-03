export interface User {
  id: number;
  email: string;
  password: string;
  type: {
    id: number;
    name: string;
  };
  otp?: number;
  otpExpireDate?: Date;
}

export interface Provider {
  id: number;
  rfc: string;
  name: string;
  zipcode: number | null;
  user: User;
}
