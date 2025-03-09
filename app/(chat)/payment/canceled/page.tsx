import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentCanceledPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Canceled</h1>
          <p className="text-muted-foreground mb-6">
            Your payment has been canceled. No charges have been made.
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