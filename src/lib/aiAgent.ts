import axios from 'axios';
import { config } from '../config';
import { config } from '../../config';

// Rate limiting helper
class RateLimiter {
  private lastRequestTime = 0;
  private readonly minInterval = 2000; // 2 seconds between requests

  async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }
}

const rateLimiter = new RateLimiter();

export async function askAI(question: string, documentContent?: string, fileName?: string): Promise<string> {
  // Check if Gemini API key is configured
  if (!config.googleAiApiKey || config.googleAiApiKey === 'your_google_ai_api_key_here') {
    throw new Error('Google AI API key not configured. Please add your Gemini API key to the config.ts file.');
  }

  // Demo mode - return mock response
  if (config.googleAiApiKey === 'demo-mode') {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return `This is a demo response for your question: "${question}". 

In a real implementation, this would be answered using AI based on the document content.

To get real AI responses, please:
1. Add your Google AI API key to config.ts
2. Ensure you have sufficient API credits
3. Set up proper billing on your Google AI account.`;
  }

  // Check if API key is valid (not placeholder)
  if (config.googleAiApiKey.includes('your_') || config.googleAiApiKey.length < 20) {
    throw new Error('Please configure a valid Google AI API key in config.ts');
  }

  interface GeminiResponse {
    candidates: {
      content: {
        parts: {
          text: string;
        }[];
      };
    }[];
    error?: {
      message: string;
      status: string;
    };
  }

  try {
    // Apply rate limiting
    await rateLimiter.waitIfNeeded();

    // Create a comprehensive prompt with document content
    let systemPrompt = 'You are a helpful assistant that answers questions based on the provided document content. ';
    
    if (documentContent) {
      // Limit document content to prevent token limits
      const maxContentLength = 8000; // Limit content to prevent API limits
      const truncatedContent = documentContent.length > maxContentLength 
        ? documentContent.substring(0, maxContentLength) + '... [Content truncated]'
        : documentContent;
        
      systemPrompt += `\n\nDocument Content (from file: ${fileName || 'uploaded file'}):\n${truncatedContent}\n\n`;
      systemPrompt += 'Please answer the user\'s question based on the information in the document above. ';
      systemPrompt += 'If the answer is not found in the document, please say so clearly. ';
      systemPrompt += 'Provide specific references to the document content when possible.';
    } else {
      systemPrompt += 'Please answer the user\'s question to the best of your ability.';
    }

    const response = await axios.post<GeminiResponse>(
      `${config.aiEndpoint}?key=${config.googleAiApiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser Question: ${question}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000, // Reduced to prevent rate limits
          topP: 0.8,
          topK: 10
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.error) {
      throw new Error(`Gemini API Error: ${response.data.error.message}`);
    }

    if (!response.data.candidates || response.data.candidates.length === 0) {
      throw new Error('No response generated from Gemini API');
    }

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      if (axiosError.response?.status === 401) {
        throw new Error('Invalid API key. Please check your Google AI API key in config.ts');
      } else if (axiosError.response?.status === 429) {
        // Rate limit exceeded - provide helpful message
        throw new Error('API rate limit exceeded. Please wait a few minutes before asking another question. You can also try with a smaller document or shorter questions.');
      } else if (axiosError.response?.data?.error?.message) {
        throw new Error(`Gemini API Error: ${axiosError.response.data.error.message}`);
      }
    }
    throw new Error(`Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
