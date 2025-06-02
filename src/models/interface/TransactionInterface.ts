export default interface transactionAttribute {
  id?: number;
  orderId: number;
  amount:string;
  transationId: string;
  paymentId: string;
  paymentMethod: string;
  status: string;
}
