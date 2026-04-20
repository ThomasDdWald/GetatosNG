import { Router } from 'express';
import { dpoService } from '../services/dpoService.js';
const router = Router();
// Create payment for a booking
router.post('/create-payment', async (req, res) => {
    try {
        const { bookingId, amount, currency, customerEmail, customerName, tourName } = req.body;
        if (!bookingId || !amount || !customerEmail || !customerName) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['bookingId', 'amount', 'customerEmail', 'customerName']
            });
        }
        const result = await dpoService.createPayment({
            amount,
            currency: currency || 'USD',
            customerEmail,
            customerName,
            tourName: tourName || 'Safari Booking',
            bookingId: bookingId.toString()
        });
        if (result.success) {
            res.json({
                success: true,
                transactionId: result.transId,
                redirectUrl: result.redirectUrl
            });
        }
        else {
            res.status(400).json({
                success: false,
                error: result.resultExplanation
            });
        }
    }
    catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({ error: error.message || 'Payment creation failed' });
    }
});
// DPO webhook callback
router.post('/payment-webhook', async (req, res) => {
    try {
        const { CompanyToken, TransactionId, PaymentStatus, PaymentId, Amount, Currency } = req.body;
        const signature = req.headers['x-dpo-signature'];
        // Verify webhook signature
        if (signature && !dpoService.verifyWebhook(req.body, signature)) {
            console.error('Invalid webhook signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }
        // Handle different payment statuses
        switch (PaymentStatus) {
            case '000': // Successful
                console.log(`Payment successful for transaction ${TransactionId}: ${Amount} ${Currency}`);
                // Update booking payment status in database
                // await updateBookingPaymentStatus(TransactionId, 'paid')
                break;
            case '001': // Pending
                console.log(`Payment pending for transaction ${TransactionId}`);
                break;
            case '002': // Failed
                console.log(`Payment failed for transaction ${TransactionId}`);
                break;
            default:
                console.log(`Unknown payment status ${PaymentStatus} for transaction ${TransactionId}`);
        }
        res.json({ received: true });
    }
    catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: error.message });
    }
});
// Check payment status
router.get('/payment-status/:transactionId', async (req, res) => {
    try {
        const { transactionId } = req.params;
        const status = await dpoService.getPaymentStatus(transactionId);
        if (status) {
            res.json({
                success: true,
                status: status.PaymentStatus,
                data: status
            });
        }
        else {
            res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }
    }
    catch (error) {
        console.error('Payment status error:', error);
        res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=payment.js.map