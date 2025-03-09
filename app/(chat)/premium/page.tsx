'use client';

import { BkashPayment } from '@/components/bkash-payment';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PremiumPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isActivating, setIsActivating] = useState(false);

  const handlePaymentSuccess = async (planId: string) => {
    setIsActivating(true);
    try {
      // In a real implementation, this would call your API to activate the premium plan
      const response = await fetch('/api/premium/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('প্রিমিয়াম প্ল্যান সফলভাবে সক্রিয় করা হয়েছে!');
        router.push('/chat');
      } else {
        toast.error(data.message || 'প্ল্যান সক্রিয় করতে ব্যর্থ হয়েছে');
      }
    } catch (error) {
      console.error('Activation error:', error);
      toast.error('প্ল্যান সক্রিয় করার সময় একটি ত্রুটি ঘটেছে');
    } finally {
      setIsActivating(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg bangla-text">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 bangla-text">প্রিমিয়াম প্ল্যান অ্যাক্সেস করতে লগইন করুন</h1>
          <p className="mb-6 text-muted-foreground bangla-text">
            আমাদের প্রিমিয়াম প্ল্যান অ্যাক্সেস করতে এবং উন্নত বৈশিষ্ট্য উপভোগ করতে আপনার অ্যাকাউন্টে লগইন করুন।
          </p>
          <Button 
            onClick={() => router.push('/login')}
            className="w-full bangla-text"
          >
            লগইন করুন
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 bangla-text">উইজার এআই প্রিমিয়াম</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto bangla-text">
            আমাদের প্রিমিয়াম প্ল্যানে আপগ্রেড করুন এবং উন্নত বৈশিষ্ট্য, দ্রুত প্রতিক্রিয়া সময় এবং আরও অনেক কিছু অ্যাক্সেস করুন।
          </p>
        </div>

        <BkashPayment onSuccess={handlePaymentSuccess} />

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center bangla-text">প্রিমিয়াম সদস্যদের জন্য বৈশিষ্ট্য</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              title="উন্নত বাংলা প্রতিক্রিয়া"
              description="আমাদের উন্নত বাংলা ভাষা মডেল ব্যবহার করে আরও সঠিক এবং প্রাকৃতিক প্রতিক্রিয়া পান।"
              icon={
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
              }
            />
            <FeatureCard 
              title="অগ্রাধিকার সাপোর্ট"
              description="প্রিমিয়াম সদস্যদের জন্য অগ্রাধিকার সাপোর্ট এবং দ্রুত প্রতিক্রিয়া সময়।"
              icon={
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              }
            />
            <FeatureCard 
              title="ফাইল আপলোড"
              description="ডকুমেন্ট এবং ইমেজ আপলোড করুন এবং সেগুলি সম্পর্কে প্রশ্ন করুন।"
              icon={
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              }
            />
            <FeatureCard 
              title="কাস্টম ডায়ালেক্ট"
              description="বিভিন্ন বাংলা ডায়ালেক্ট অপশন থেকে বেছে নিন।"
              icon={
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
              }
            />
            <FeatureCard 
              title="অসীমিত কথোপকথন"
              description="দৈনিক সীমা ছাড়াই অসীমিত কথোপকথন করুন।"
              icon={
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              }
            />
            <FeatureCard 
              title="এপিআই অ্যাক্সেস"
              description="এন্টারপ্রাইজ প্ল্যানে আমাদের এপিআই অ্যাক্সেস করুন।"
              icon={
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className="mr-4 p-2 bg-primary/10 rounded-full">
          {icon}
        </div>
        <h3 className="text-lg font-semibold bangla-text">{title}</h3>
      </div>
      <p className="text-muted-foreground bangla-text">{description}</p>
    </div>
  );
} 