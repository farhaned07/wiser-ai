# Bangla-English AI Chatbot with bKash Payment

A Next.js-based AI chatbot with Bangla-English language support, user authentication, and bKash payment integration.

## Features

- **Dual Language Support**: Seamlessly switch between Bangla and English
- **User Authentication**: Secure login with Google OAuth and email/password
- **Premium Subscriptions**: bKash payment integration for premium features
- **Responsive UI**: Mobile-friendly interface with modern design
- **Performance Optimized**: Redis caching and Vercel Edge Functions

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Vercel Edge Functions
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js
- **AI**: Mistral 7B API
- **Caching**: Redis (optional)
- **Payment**: bKash Payment Gateway
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Redis (optional, for caching)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bangla-english-ai-chatbot.git
   cd bangla-english-ai-chatbot
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your API keys and configuration.

4. Run database migrations:
   ```bash
   pnpm db:migrate
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

1. Push your code to GitHub.

2. Create a new project on [Vercel](https://vercel.com).

3. Connect your GitHub repository.

4. Configure the following environment variables in Vercel:
   - `OPENAI_API_KEY`
   - `MISTRAL_API_KEY`
   - `AUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `BKASH_APP_KEY`
   - `BKASH_APP_SECRET`
   - `BKASH_USERNAME`
   - `BKASH_PASSWORD`
   - `BKASH_SANDBOX_MODE`
   - `NEXT_PUBLIC_APP_URL`

5. Add Vercel Postgres and Vercel Blob storage to your project.

6. Deploy your application.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Vercel AI SDK](https://sdk.vercel.ai/)
- [Next.js](https://nextjs.org/)
- [Mistral AI](https://mistral.ai/)
- [bKash Payment Gateway](https://developer.bkash.com/)
