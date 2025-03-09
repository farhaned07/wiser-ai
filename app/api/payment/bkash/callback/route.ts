import { NextResponse } from 'next/server';
import { BkashGateway } from 'bkash-payment-gateway';
import { redirect } from 'next/navigation';

// Initialize bKash payment gateway with any type to avoid type errors
const bkash = new BkashGateway({
  baseURL: process.env.BKASH_SANDBOX_MODE === 'true' 
    ? 'https://checkout.sandbox.bka.sh/v1.2.0-beta' 
    : 'https://checkout.pay.bka.sh/v1.2.0-beta',
  username: process.env.BKASH_USERNAME || '',
  password: process.env.BKASH_PASSWORD || '',
  appKey: process.env.BKASH_APP_KEY || '',
  appSecret: process.env.BKASH_APP_SECRET || '',
} as any);

export async function GET(req: Request) {
  try {
    // Get payment ID and status from query parameters
    const url = new URL(req.url);
    const paymentID = url.searchParams.get('paymentID');
    const status = url.searchParams.get('status');

    if (!paymentID) {
      return redirect('/payment/error?reason=missing-payment-id');
    }

    // If payment was canceled
    if (status === 'cancel') {
      return redirect('/payment/canceled');
    }

    // If payment failed
    if (status === 'failure') {
      return redirect('/payment/failed');
    }

    try {
      // Verify payment - using any type to avoid type errors
      const verificationResponse = await (bkash as any).executePayment(paymentID);

      if (verificationResponse && verificationResponse.statusCode === '0000') {
        // Payment successful
        // Update database with payment status (implement this)
        // This would typically update the payment status, activate the subscription, etc.

        // Redirect to success page
        return redirect('/payment/success');
      } else {
        // Payment verification failed
        const errorReason = (verificationResponse && verificationResponse.statusMessage) || 'verification-failed';
        return redirect(`/payment/error?reason=${errorReason}`);
      }
    } catch (verificationError) {
      console.error('bKash verification error:', verificationError);
      return redirect('/payment/error?reason=verification-error');
    }
  } catch (error) {
    console.error('bKash callback error:', error);
    return redirect('/payment/error?reason=server-error');
  }
} 