import OpenAI from 'openai';
import { AIPersona, NegativePersona } from '../types';

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

const generateDummyPersonaData = () => {
  const positivePersona: AIPersona = {
    user_id: '',
    personality_traits: {
      examples: [
        'Naturally empathetic and understanding',
        'Strong sense of responsibility',
        'Adaptable to new situations',
        'Creative problem solver'
      ]
    },
    core_values: {
      examples: [
        'Honesty and integrity',
        'Personal growth',
        'Family and relationships',
        'Work-life balance'
      ]
    },
    behavioral_traits: {
      examples: [
        'Good listener',
        'Patient with others',
        'Organized and methodical',
        'Team player'
      ]
    },
    hobbies_interests: {
      examples: [
        'Reading and self-improvement',
        'Outdoor activities',
        'Creative arts',
        'Social gatherings'
      ]
    },
    summary: 'A well-rounded individual with strong interpersonal skills and a commitment to personal growth.'
  };

  const negativePersona: NegativePersona = {
    user_id: '',
    emotional_weaknesses: {
      traits: [
        'Can be overly sensitive to criticism',
        'Sometimes struggles with anxiety',
        'Tendency to overthink decisions',
        'Occasional mood swings'
      ]
    },
    social_weaknesses: {
      traits: [
        'Can be reserved in large groups',
        'Sometimes avoids confrontation',
        'Takes time to open up to new people',
        'Occasional difficulty with small talk'
      ]
    },
    lifestyle_weaknesses: {
      traits: [
        'Procrastination tendencies',
        'Irregular sleep schedule',
        'Sometimes neglects exercise',
        'Can be too focused on work'
      ]
    },
    relational_weaknesses: {
      traits: [
        'Can be too accommodating',
        'Difficulty expressing needs',
        'Sometimes avoids difficult conversations',
        'Can be overly cautious in relationships'
      ]
    },
    summary: 'Areas for growth include managing emotional sensitivity, improving work-life balance, and developing more assertive communication skills.'
  };

  return { positivePersona, negativePersona };
};

export const generatePersonaAnalysis = async (personalityData: any) => {
  try {
    if (!isOpenAIAvailable()) {
      const { positivePersona, negativePersona } = generateDummyPersonaData();
      return {
        positive_persona: positivePersona,
        negative_persona: negativePersona
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

interface UserData {
  profile: any;
  analysis: any;
}

interface CompatibilityInput {
  user1: UserData;
  user2: UserData;
}

export const analyzeCompatibility = async (input: CompatibilityInput) => {
  try {
    const { user1, user2 } = input;

    // Generate more realistic dummy data for testing
    return {
      compatibility_score: 0.87,
      strengths: [
        'Both share a deep appreciation for intellectual conversations',
        'Complementary communication styles - one is a good listener, the other expressive',
        'Similar values regarding family and long-term commitment',
        'Shared interest in personal growth and self-improvement',
        'Compatible life goals and career aspirations'
      ],
      challenges: [
        'Different approaches to handling stress and conflict',
        'Varying social energy levels - one more extroverted than the other',
        'Different financial management styles',
        'Contrasting preferences for leisure activities'
      ],
      improvement_tips: [
        'Schedule regular date nights to maintain connection',
        'Practice active listening during disagreements',
        'Find compromise in social activities that suit both energy levels',
        'Create a shared financial plan that respects both styles',
        'Develop shared hobbies while respecting individual interests'
      ],
      long_term_prediction: 'This match shows exceptional potential for a fulfilling long-term relationship. The complementary personality traits and shared core values provide a strong foundation. While there are areas that need attention, the willingness to grow together suggests a promising future. With open communication and mutual understanding, this could develop into a deeply satisfying partnership.'
    };
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
      const { positivePersona } = generateDummyPersonaData();
      return positivePersona;
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
      const { negativePersona } = generateDummyPersonaData();
      return negativePersona;
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