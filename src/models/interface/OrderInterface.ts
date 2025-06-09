export default interface orderAttribute {
  id?: number;
  orderId: string;
  userId: number;
  // productId: number;
  customerName: string;
  email: string;
  phoneno: string;
  address: string;
  // quantity: number;
  // price: number;
  deliveryCharges: number;
  totalAmount: number;
  status?: string;
  createdAt?: Date; // ✅ add this
  updatedAt?: Date; // (optional) also add this if your model includes it
}
