import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentErrorPage({
  searchParams,
}: {
  searchParams: { reason?: string };
}) {
  const errorReason = searchParams.reason || 'unknown-error';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
          <p className="text-muted-foreground mb-6">
            {errorReason === 'missing-payment-id'
              ? 'Payment ID is missing. Please try again.'
              : errorReason === 'verification-failed'
              ? 'Payment verification failed. Please try again.'
              : errorReason === 'verification-error'
              ? 'Error verifying payment. Please try again.'
              : 'An error occurred during payment processing. Please try again.'}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link href="/premium" passHref>
            <Button className="w-full">Try Again</Button>
          </Link>
          <Link href="/" passHref>
            <Button variant="outline" className="w-full">
              Go to Chat
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 