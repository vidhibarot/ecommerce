export default interface userAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  phoneno:string;
  roleId: number;
  status:string;
  createdAt?: Date; // ✅ add this
  updatedAt?: Date; // (optional) also add this if your model includes it
}
