import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OpenAI API key is not set in environment variables. Some features may not work properly.');
}

// Create OpenAI instance with error handling
let openaiInstance: OpenAI | null = null;
try {
  openaiInstance = new OpenAI({
    apiKey: apiKey || '',
    dangerouslyAllowBrowser: true
  });
} catch (error) {
  console.error('Error initializing OpenAI:', error);
}

export const openai = openaiInstance;

// Utility function to check if OpenAI is available
const isOpenAIAvailable = () => {
  if (!openaiInstance) {
    console.warn('OpenAI is not initialized. Some features may not work properly.');
    return false;
  }
  return true;
};

export const generatePersonaAnalysis = async (personalityData: any) => {
  try {
    if (!isOpenAIAvailable()) {
      return {
        positive_persona: {
          personality_traits: {},
          core_values: {},
          behavioral_traits: {},
          hobbies_interests: {},
          summary: "OpenAI service is not available"
        },
        negative_persona: {
          emotional_weaknesses: {},
          social_weaknesses: {},
          intellectual_weaknesses: {},
          lifestyle_weaknesses: {},
          relational_weaknesses: {},
          summary: "OpenAI service is not available"
        }
      };
    }

    console.log('Generating persona analysis for:', personalityData);
    
    const prompt = `
      Based on the following user data, generate a detailed personality analysis with both positive and negative traits:
      ${JSON.stringify(personalityData, null, 2)}

      Please provide:
      1. Positive Personality Analysis including:
         - Personality traits with examples
         - Core values
         - Behavioral traits with examples
         - Hobbies and interests
      
      2. Negative Personality Analysis including:
         - Emotional weaknesses with examples
         - Social weaknesses with examples
         - Intellectual weaknesses with examples
         - Lifestyle weaknesses with examples
         - Relational weaknesses with examples
      
      3. A concise summary of overall traits

      Format the response as a JSON object with the following structure:
      {
        "positive_persona": {
          "personality_traits": {},
          "core_values": {},
          "behavioral_traits": {},
          "hobbies_interests": {},
          "summary": ""
        },
        "negative_persona": {
          "emotional_weaknesses": {},
          "social_weaknesses": {},
          "intellectual_weaknesses": {},
          "lifestyle_weaknesses": {},
          "relational_weaknesses": {},
          "summary": ""
        }
      }
    `;

    const response = await openai!.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert personality analyst and relationship counselor.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    console.log('Generated persona analysis:', response.choices[0].message.content);
    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating persona analysis:', error);
    return {
      positive_persona: {
        personality_traits: {},
        core_values: {},
        behavioral_traits: {},
        hobbies_interests: {},
        summary: "Error generating analysis"
      },
      negative_persona: {
        emotional_weaknesses: {},
        social_weaknesses: {},
        intellectual_weaknesses: {},
        lifestyle_weaknesses: {},
        relational_weaknesses: {},
        summary: "Error generating analysis"
      }
    };
  }
};

export const analyzeCompatibility = async (user1Data: any, user2Data: any) => {
  try {
    if (!openaiInstance) {
      throw new Error('OpenAI is not initialized');
    }

    const prompt = `
      Analyze the compatibility between these two users:
      User 1: ${JSON.stringify(user1Data, null, 2)}
      User 2: ${JSON.stringify(user2Data, null, 2)}

      Please provide:
      1. Overall compatibility score (percentage)
      2. Detailed compatibility insights including:
         - Strengths in their relationship
         - Potential challenges
         - Long-term relationship prediction
      3. Individual challenges for each person
      4. Specific tips to improve compatibility

      Format the response as a JSON object with the following structure:
      {
        "compatibility_score": number,
        "strengths": {},
        "challenges": {},
        "long_term_prediction": "",
        "improvement_tips": {}
      }
    `;

    const response = await openaiInstance.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert relationship counselor specializing in compatibility analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error analyzing compatibility:', error);
    throw error;
  }
};

export const generateImprovementTips = async (compatibilityData: any) => {
  try {
    if (!openaiInstance) {
      throw new Error('OpenAI is not initialized');
    }

    const prompt = `
      Based on this compatibility analysis:
      ${JSON.stringify(compatibilityData, null, 2)}

      Generate detailed, actionable tips for improving the relationship in these areas:
      1. Communication
      2. Understanding each other's needs
      3. Managing differences
      4. Building trust
      5. Long-term growth

      Format the response as a JSON object with tips categorized by area.
    `;

    const response = await openaiInstance.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert relationship counselor specializing in relationship improvement strategies.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating improvement tips:', error);
    throw error;
  }
};

export const generateAIPersona = async (personalityData: any) => {
  try {
    if (!isOpenAIAvailable()) {
      return {
        personality_traits: {},
        core_values: {},
        behavioral_traits: {},
        hobbies_interests: {},
        summary: "OpenAI service is not available"
      };
    }

    const prompt = `
      Based on the following user data, generate a positive AI persona:
      ${JSON.stringify(personalityData, null, 2)}

      Please provide:
      - Personality traits with examples
      - Core values
      - Behavioral traits with examples
      - Hobbies and interests
      - A concise summary

      Format the response as a JSON object.
    `;

    const response = await openai!.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert personality analyst.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating AI persona:', error);
    return {
      personality_traits: {},
      core_values: {},
      behavioral_traits: {},
      hobbies_interests: {},
      summary: "Error generating analysis"
    };
  }
};

export const generateNegativePersona = async (personalityData: any) => {
  try {
    if (!isOpenAIAvailable()) {
      return {
        emotional_weaknesses: {},
        social_weaknesses: {},
        intellectual_weaknesses: {},
        lifestyle_weaknesses: {},
        relational_weaknesses: {},
        summary: "OpenAI service is not available"
      };
    }

    const prompt = `
      Based on the following user data, generate a negative persona analysis:
      ${JSON.stringify(personalityData, null, 2)}

      Please provide:
      - Emotional weaknesses with examples
      - Social weaknesses with examples
      - Intellectual weaknesses with examples
      - Lifestyle weaknesses with examples
      - Relational weaknesses with examples
      - A concise summary

      Format the response as a JSON object.
    `;

    const response = await openai!.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert personality analyst.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating negative persona:', error);
    return {
      emotional_weaknesses: {},
      social_weaknesses: {},
      intellectual_weaknesses: {},
      lifestyle_weaknesses: {},
      relational_weaknesses: {},
      summary: "Error generating analysis"
    };
  }
};