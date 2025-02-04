# AI CUPID - AI-Powered Dating App

AI CUPID is a modern dating application that uses artificial intelligence to provide smart matching and personality analysis for users.

## Features

- Smart Matching with AI-powered compatibility scoring
- Personality Analysis and Insights
- Real-time Chat
- User Profiles with CUPID ID
- Secure Authentication

## Tech Stack

- React + TypeScript
- Supabase (Database & Authentication)
- OpenAI API Integration
- Tailwind CSS
- Vite

## Getting Started

1. Clone the repository
```bash
git clone [your-repository-url]
cd aicupid
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
- Copy `.env.example` to `.env`
- Fill in your environment variables

4. Run the development server
```bash
npm run dev
```

## Database Setup

1. Create a Supabase project
2. Run the migration scripts in the `sql` directory in order
3. Set up the required policies and functions

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_OPENAI_API_KEY`: Your OpenAI API key

## License

[Your chosen license]
