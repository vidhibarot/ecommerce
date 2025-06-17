export default interface transactionAttribute {
  id?: number;
  orderId: string;
  amount: string;
  transationId: string;
  paymentId: string;
  paymentMethod: string;
  refundId?:string;
  refundAmount?:string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
