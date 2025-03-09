import { BkashPayment } from '@/components/bkash-payment';
import { redirect } from 'next/navigation';
import { auth } from '@/app/(auth)/auth';

export default async function PremiumPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login');
  }

  const handlePaymentSuccess = (planId: string) => {
    // This function will be called after successful payment
    // It will be handled client-side in the BkashPayment component
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Upgrade to Premium</h1>
          <p className="text-muted-foreground">
            Unlock advanced features and enhance your AI assistant experience
          </p>
        </div>

        <BkashPayment onSuccess={handlePaymentSuccess} />

        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">Premium Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">Advanced Bangla Support</h3>
              <p className="text-muted-foreground">
                Enhanced Bangla language processing with support for regional dialects and cultural nuances.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">Faster Response Times</h3>
              <p className="text-muted-foreground">
                Priority processing ensures you get responses faster than standard users.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">Unlimited File Uploads</h3>
              <p className="text-muted-foreground">
                Upload and process larger files with higher limits than free accounts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 