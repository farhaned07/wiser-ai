import { cookies } from 'next/headers';

import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { generateUUID } from '@/lib/utils';
import { LanguageType } from '@/components/language-selector';

// Always use Mistral AI model for Bangla optimization
const BANGLA_OPTIMIZED_MODEL = 'mistral';

export default async function Page() {
  const id = generateUUID();

  const cookieStore = await cookies();
  const languageTypeFromCookie = cookieStore.get('language-preference');
  const selectedLanguageType = (languageTypeFromCookie?.value || 'bangla') as LanguageType;

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedChatModel={BANGLA_OPTIMIZED_MODEL}
        selectedVisibilityType="private"
        selectedLanguageType={selectedLanguageType}
        isReadonly={false}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
