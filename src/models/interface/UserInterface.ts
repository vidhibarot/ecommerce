export default interface userAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  phoneno: string;
  roleId: number;
  otp?: string | null;
  otp_expire_time?: Date | null;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
