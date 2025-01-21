import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import type { UserProfile } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateChatResponse = async (userMessage: string, userProfile: UserProfile) => {
  try {
    if (!userProfile) {
      throw new Error('No user profile provided');
    }

    // For demo purposes - specific response for CUPID-FNABY3
    if (userProfile.cupid_id === 'CUPID-FNABY3') {
      if (userMessage.toLowerCase().includes('surprise') && userMessage.toLowerCase().includes('birthday')) {
        return "Plan to cut a cake at her Mommy's place or Plan to cut a cake in the moving Train. She will love it as she is an enthusiast";
      }
    }

    // Create a context string from the user profile
    const personaContext = `
      Name: ${userProfile.name}
      Age: ${userProfile.age}
      Location: ${userProfile.location}
      Bio: ${userProfile.bio}
      Interests: ${userProfile.interests?.join(', ')}
    `;

    const systemMessage = `You are a helpful AI assistant with access to this user's profile information:
    ${personaContext}
    
    Provide helpful, friendly responses based on this profile information. Keep responses concise and relevant.
    If asked about surprises or gifts, suggest thoughtful ideas based on their interests and profile.
    If you don't have enough information to answer a question, politely say so.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try asking something else.";
  } catch (error) {
    console.error('Error generating chat response:', error);
    return "I'm sorry, I encountered an error while generating a response. Please try again.";
  }
};

export async function analyzeDetailedCompatibility(
  userProfile: UserProfile,
  targetProfile: UserProfile
): Promise<string> {
  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `You are an AI compatibility analyst. Analyze the compatibility between two users based on their profiles.
          Consider their interests, values, and lifestyle preferences.`
      },
      {
        role: "user",
        content: `Compare these two profiles:
          User 1: ${JSON.stringify(userProfile)}
          User 2: ${JSON.stringify(targetProfile)}`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "Unable to analyze compatibility at this time.";
  } catch (error) {
    console.error('Error analyzing compatibility:', error);
    throw new Error('Failed to analyze compatibility');
  }
}

export async function generateDetailedPersonaAnalysis(
  profile: UserProfile,
  additionalData?: {
    messages: any[];
    aiChat: any[];
    personalityData: any;
  }
): Promise<any> {
  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `You are an AI personality analyst. Analyze the user profile and generate a detailed persona analysis including positive and negative traits.
          Consider their interests, values, lifestyle preferences, and behavioral patterns.
          Format the response as a structured analysis with clear sections for positive and negative aspects.`
      },
      {
        role: "user",
        content: `Analyze this profile and generate a detailed persona:
          ${JSON.stringify(profile)}
          ${additionalData ? `Additional context: ${JSON.stringify(additionalData)}` : ''}`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "Unable to generate persona analysis at this time.";
  } catch (error) {
    console.error('Error generating detailed persona analysis:', error);
    throw new Error('Failed to generate detailed persona analysis');
  }
}
