import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import { fireworks } from '@ai-sdk/fireworks';
import { mistral } from '@ai-sdk/mistral';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model-small': chatModel,
        'chat-model-large': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
        'mistral': chatModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model-small': mistral('mistral-7b-instruct'),
        'chat-model-large': mistral('mistral-large-latest'),
        'chat-model-reasoning': wrapLanguageModel({
          model: mistral('mistral-7b-instruct'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': mistral('mistral-large-latest'),
        'artifact-model': mistral('mistral-7b-instruct'),
        'mistral': mistral('mistral-7b-instruct'),
      },
      imageModels: {
        'small-model': openai.image('dall-e-2'),
        'large-model': openai.image('dall-e-3'),
      },
    });
