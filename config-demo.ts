// Demo configuration for testing without API quota issues
// Copy this to config.ts if you want to test the UI without API calls

export const config = {
  // Demo mode - no real API calls
  openaiApiKey: 'demo-mode',
  
  // Supabase Configuration (your actual keys)
  supabaseUrl: 'https://ohapbwabvlfaiqciqufc.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oYXBid2FidmxmYWlxY2lxdWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMzkwMTEsImV4cCI6MjA3MjcxNTAxMX0.sGJPLl1UsCpK37KuKMnKBCp4bxXGQ_YpcXH15unkiO0',
  
  // AI Configuration
  aiEndpoint: 'https://api.openai.com/v1/chat/completions',
  aiModel: 'gpt-3.5-turbo',
};
