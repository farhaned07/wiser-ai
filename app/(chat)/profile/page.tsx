import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="text-lg">{session.user.name || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="text-lg">{session.user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Your current plan and payment information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Current Plan</h3>
                <p className="text-lg">Free Plan</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Features</h3>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Basic AI chat functionality</li>
                  <li>Limited responses per day</li>
                  <li>Standard response time</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/premium">
              <Button>Upgrade to Premium</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Language Preferences</CardTitle>
            <CardDescription>Configure your language settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Default Language</h3>
                <p className="text-lg">English</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You can change the language in the chat interface at any time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 