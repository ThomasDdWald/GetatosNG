interface PaymentRequest {
    amount: number;
    currency: string;
    customerEmail: string;
    customerName: string;
    tourName: string;
    bookingId: string;
}
interface PaymentResponse {
    success: boolean;
    transId?: string;
    redirectUrl?: string;
    result?: string;
    resultExplanation?: string;
}
export declare class DPOService {
    private config;
    private baseUrl;
    constructor();
    /**
     * Generate signature for DPO API requests
     */
    private generateSignature;
    /**
     * Create a payment request to DPO
     */
    createPayment(payment: PaymentRequest): Promise<PaymentResponse>;
    /**
     * Verify DPO payment callback (webhook)
     */
    verifyWebhook(data: any, signature: string): boolean;
    /**
     * Get payment status from DPO
     */
    getPaymentStatus(transactionId: string): Promise<any>;
}
export declare const dpoService: DPOService;
export {};
//# sourceMappingURL=dpoService.d.ts.map