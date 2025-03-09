import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentFailedPage() {
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
          <p className="text-muted-foreground mb-6">
            Your payment could not be processed. Please check your payment details and try again.
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