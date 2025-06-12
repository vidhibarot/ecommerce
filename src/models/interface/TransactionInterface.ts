export default interface transactionAttribute {
  id?: number;
  orderId: string;
  amount: string;
  transationId: string;
  paymentId: string;
  paymentMethod: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
