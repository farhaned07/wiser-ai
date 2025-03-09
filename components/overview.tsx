import { motion } from 'framer-motion';
import Link from 'next/link';

import { MessageIcon } from './icons';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <div className="flex flex-row justify-center gap-4 items-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">উইজার এআই</div>
          <MessageIcon size={32} />
        </div>
        
        <p className="text-xl bangla-text">
          উইজার এআই হল একটি উন্নত বাংলা-ইংরেজি চ্যাটবট যা মিস্ট্রাল এআই মডেল ব্যবহার করে বাংলা ভাষায় প্রাকৃতিক কথোপকথন সরবরাহ করে।
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left bangla-text">
          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">বাংলা ভাষা সমর্থন</h3>
            <p>বাংলা ভাষায় প্রাকৃতিক কথোপকথন এবং উন্নত ভাষা বোঝার ক্ষমতা</p>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">বিকাশ পেমেন্ট</h3>
            <p>সহজ বিকাশ পেমেন্ট ইন্টিগ্রেশন সহ প্রিমিয়াম প্ল্যান</p>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">মাল্টিমিডিয়া সমর্থন</h3>
            <p>ছবি এবং ফাইল আপলোড করে প্রশ্ন করার সুবিধা</p>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">দ্রুত প্রতিক্রিয়া</h3>
            <p>অপ্টিমাইজড মডেল ব্যবহার করে দ্রুত এবং সঠিক উত্তর</p>
          </div>
        </div>
        
        <p className="bangla-text">
          <Link
            href="/premium"
            className="font-medium text-primary hover:underline"
          >
            প্রিমিয়াম প্ল্যান
          </Link>{' '}
          এ আপগ্রেড করে আরও বৈশিষ্ট্য উপভোগ করুন।
        </p>
      </div>
    </motion.div>
  );
};
