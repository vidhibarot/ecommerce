export default interface transactionAttribute {
  id?: number;
  orderId: number;
  transationId: string;
  paymentId: string;
  paymentMethod: string;
  status: string;
}
