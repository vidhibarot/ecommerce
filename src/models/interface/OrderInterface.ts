export default interface orderAttribute {
  id?: number;
  userId: number;
  productId: number;
  customerName: string;
  email: string;
  phoneno: string;
  address: string;
  quantity: number;
  price: number;
  deliveryCharges: number;
  totalAmount: number;
  status?: string;
}
