// Copy this file to config.ts and fill in your actual API keys
// This file is ignored by git for security

export const config = {
  // AI API Configuration
  // Get your OpenAI API key from: https://platform.openai.com/api-keys
  openaiApiKey: 'your_openai_api_key_here',
  
  // Alternative AI providers (uncomment and configure as needed)
  // anthropicApiKey: 'your_anthropic_api_key_here',
  // googleAiApiKey: 'your_google_ai_api_key_here',
  
  // Supabase Configuration
  // Get these from your Supabase project settings: https://supabase.com/dashboard
  supabaseUrl: 'your_supabase_project_url_here',
  supabaseAnonKey: 'your_supabase_anon_key_here',
  
  // Optional: Custom AI endpoint (if using a different provider)
  aiEndpoint: 'https://api.openai.com/v1/chat/completions',
  
  // AI Model Configuration
  aiModel: 'gpt-3.5-turbo', // or 'gpt-4', 'claude-3-sonnet', etc.
};
