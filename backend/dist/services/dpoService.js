import axios from 'axios';
import crypto from 'crypto';
export class DPOService {
    constructor() {
        this.baseUrl = 'https://directpay.live';
        this.config = {
            companyToken: process.env.DPO_COMPANY_TOKEN || '',
            serviceType: process.env.DPO_SERVICE_TYPE || '',
            defaultCurrency: process.env.DPO_DEFAULT_CURRENCY || 'USD'
        };
    }
    /**
     * Generate signature for DPO API requests
     */
    generateSignature(data) {
        const hash = crypto.createHash('sha256');
        hash.update(data);
        return hash.digest('hex').toUpperCase();
    }
    /**
     * Create a payment request to DPO
     */
    async createPayment(payment) {
        try {
            const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', ' ').split('.')[0];
            const transId = `BOOK-${payment.bookingId}-${Date.now()}`;
            // Create payment reference data
            const referenceData = [
                this.config.companyToken,
                payment.bookingId,
                transId,
                payment.amount.toFixed(2),
                payment.currency,
                timestamp
            ].join('');
            const signature = this.generateSignature(referenceData);
            // Frontend URLs for payment return
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            // DPO API request
            const response = await axios.post(`${this.baseUrl}/api/v2/payment`, {
                CompanyToken: this.config.companyToken,
                ServiceType: this.config.serviceType,
                PaymentAmount: payment.amount.toFixed(2),
                Currency: payment.currency,
                CustomerEmail: payment.customerEmail,
                CustomerName: payment.customerName,
                PaymentDescription: `Booking for ${payment.tourName}`,
                TransactionId: transId,
                RedirectUrl: `${frontendUrl}/payment/success?transactionId=${transId}`,
                BackUrl: `${frontendUrl}/payment/cancel?transactionId=${transId}`,
                Timestamp: timestamp,
                Signature: signature
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data && response.data.result === '000') {
                return {
                    success: true,
                    transId: transId,
                    redirectUrl: response.data.redirectUrl
                };
            }
            else {
                return {
                    success: false,
                    result: response.data?.result,
                    resultExplanation: response.data?.resultExplanation || 'Payment initialization failed'
                };
            }
        }
        catch (error) {
            console.error('DPO Payment Error:', error.message);
            return {
                success: false,
                result: '999',
                resultExplanation: error.message || 'Payment service unavailable'
            };
        }
    }
    /**
     * Verify DPO payment callback (webhook)
     */
    verifyWebhook(data, signature) {
        // Verify webhook signature
        const expectedSignature = this.generateSignature(data.CompanyToken + data.TransactionId + data.PaymentStatus);
        return expectedSignature === signature.toUpperCase();
    }
    /**
     * Get payment status from DPO
     */
    async getPaymentStatus(transactionId) {
        try {
            const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', ' ').split('.')[0];
            const signatureData = this.config.companyToken + transactionId + timestamp;
            const signature = this.generateSignature(signatureData);
            const response = await axios.post(`${this.baseUrl}/api/v2/query`, {
                CompanyToken: this.config.companyToken,
                TransactionId: transactionId,
                Timestamp: timestamp,
                Signature: signature
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (error) {
            console.error('DPO Query Error:', error.message);
            return null;
        }
    }
}
export const dpoService = new DPOService();
//# sourceMappingURL=dpoService.js.map