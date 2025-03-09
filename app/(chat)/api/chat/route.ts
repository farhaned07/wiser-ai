import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';
import { auth } from '@/app/(auth)/auth';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { isProductionEnvironment } from '@/lib/constants';
import { NextResponse } from 'next/server';
import { myProvider } from '@/lib/ai/providers';
import { correctBanglaResponse } from '@/lib/ai/bangla-correction';
import { LanguageType } from '@/components/language-selector';
import { getFromCache, setInCache } from '@/lib/cache/redis';

export const maxDuration = 60;

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const json = await req.json();
  const { messages, id, selectedChatModel, selectedLanguageType } = json;

  // Check if response is cached in Redis
  const cacheKey = `chat:${id}:${messages[messages.length - 1].content}:${selectedChatModel}:${selectedLanguageType}`;
  try {
    const cachedResponse = await getFromCache(cacheKey);
    if (cachedResponse) {
      return new Response(cachedResponse);
    }
  } catch (error) {
    console.warn('Redis cache retrieval error:', error);
    // Continue without cache
  }

  const userId = session.user.id;
  const mostRecentUserMessage = getMostRecentUserMessage(messages);

  if (!mostRecentUserMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const title = await generateTitleFromUserMessage(mostRecentUserMessage.content);

  const chat = await getChatById({ id });

  if (!chat) {
    await saveChat({
      id,
      title,
      userId,
      createdAt: new Date(),
    });
  }

  // Customize system prompt based on language preference
  let customSystemPrompt = systemPrompt;
  if (selectedLanguageType === 'bangla') {
    customSystemPrompt = `${systemPrompt}\n\nRespond in fluent Bangla using the standard Dhaka dialect. Your responses should be natural and culturally appropriate for Bangladesh.`;
  }

  const { dataStream, dataStreamResponse } = createDataStreamResponse({
    experimental_streamData: true,
  });

  const tools = [
    createDocument({ session, dataStream }),
    updateDocument({ session, dataStream }),
    requestSuggestions({ session, dataStream }),
    getWeather(),
  ];

  streamText({
    model: myProvider.languageModel(selectedChatModel),
    system: customSystemPrompt,
    messages: messages.slice(0, -1),
    prompt: mostRecentUserMessage.content,
    tools,
    experimental_streamData: true,
    onStreamStart: async () => {
      await saveMessages({
        chatId: id,
        messages: [mostRecentUserMessage],
        userId,
      });
    },
    onStreamEnd: async (completion) => {
      // Process Bangla responses if needed
      let finalResponse = completion;
      if (selectedLanguageType === 'bangla') {
        finalResponse = await correctBanglaResponse(completion);
      }

      // Cache the response in Redis
      try {
        await setInCache(cacheKey, finalResponse, 3600); // Cache for 1 hour
      } catch (error) {
        console.warn('Redis cache storage error:', error);
        // Continue without caching
      }

      await saveMessages({
        chatId: id,
        messages: [
          {
            id: generateUUID(),
            role: 'assistant',
            content: finalResponse,
          },
        ],
        userId,
      });
    },
  }).pipeThrough(dataStream.writable);

  return dataStreamResponse;
}

export async function DELETE(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing chat ID', { status: 400 });
  }

  try {
    await deleteChatById({ id, userId: session.user.id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
