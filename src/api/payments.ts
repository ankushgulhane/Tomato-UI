import { api } from './client';
import type { PaymentRequest, PaymentResponse } from '../types/dto';

export const processPayment = (body: PaymentRequest) =>
  api.post<PaymentResponse>('/api/payments/mock', body).then((r) => r.data);
