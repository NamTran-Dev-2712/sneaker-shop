export interface HandleVnPayReturnResponse {
  orderId: number | null;
  vnPayTxnRef: string;
  status: string;
  paymentStatus: string | null;
  message: string;
}
