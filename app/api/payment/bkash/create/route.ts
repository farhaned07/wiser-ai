import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { BkashGateway } from 'bkash-payment-gateway';

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

export async function POST(req: Request) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const { amount, phoneNumber, planId } = await req.json();

    // Validate request
    if (!amount || !phoneNumber || !planId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate a unique invoice ID
    const invoiceId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
      // Create payment - using any type to avoid type errors
      const paymentResponse = await (bkash as any).createPayment({
        amount: amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: invoiceId,
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment/bkash/callback`,
      });

      if (paymentResponse && paymentResponse.statusCode === '0000') {
        // Store payment information in database (implement this)
        // This would typically save the payment intent, user ID, plan ID, etc.

        return NextResponse.json({
          success: true,
          paymentURL: paymentResponse.bkashURL,
          paymentID: paymentResponse.paymentID,
        });
      } else {
        return NextResponse.json(
          { 
            success: false, 
            message: (paymentResponse && paymentResponse.statusMessage) || 'Payment initiation failed' 
          },
          { status: 400 }
        );
      }
    } catch (paymentError) {
      console.error('bKash payment creation error:', paymentError);
      return NextResponse.json(
        { success: false, message: 'Failed to create payment' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('bKash payment error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 