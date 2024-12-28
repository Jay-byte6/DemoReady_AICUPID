import OpenAI from 'openai';
import { UserProfile, PersonaAnalysis, PersonaAspect, CompatibilityScore } from '../types';

// Get API key from environment variable with Vite prefix
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const DEBUG = true; // Enable debug mode

// Debug logging
if (DEBUG) {
  console.log('OpenAI Configuration:', {
    apiKeyAvailable: !!OPENAI_API_KEY,
    apiKeyLength: OPENAI_API_KEY?.length || 0
  });
}

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key is not set. Persona analysis features will not work.');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const COMPATIBILITY_WEIGHTS = {
  values_alignment: 0.30,
  personality_compatibility: 0.25,
  emotional_intelligence: 0.20,
  lifestyle_match: 0.15,
  goals_alignment: 0.10
};

// Keep existing function for backward compatibility
export const generatePersonaAnalysis = async (data: { user1: any, user2: any }) => {
  try {
    const prompt = `Analyze the compatibility between these two individuals:
    Person 1: ${JSON.stringify(data.user1)}
    Person 2: ${JSON.stringify(data.user2)}
    
    Provide:
    1. Overall compatibility score (0-100)
    2. Key strengths
    3. Potential challenges
    4. Tips for better understanding
    5. Long-term relationship prediction`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "You are an expert relationship counselor." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');
    return transformAIResponseToCompatibilityScore(analysis);
  } catch (error) {
    console.error('Error generating compatibility analysis:', error);
    throw error;
  }
};

interface ChatHistory {
  messages: string[];
  aiChat: string[];
  personalityData?: any;
}

export async function generateDetailedPersonaAnalysis(
  profile: UserProfile,
  chatHistory: ChatHistory
): Promise<PersonaAnalysis | null> {
  try {
    if (DEBUG) {
      console.log('Generating persona analysis for profile:', {
        id: profile.id,
        hasApiKey: !!OPENAI_API_KEY,
        hasChatHistory: !!chatHistory,
        profileData: profile
      });
    }

    // Enhanced profile validation
    if (!profile || !profile.id || !profile.fullname) {
      console.warn('Insufficient profile data for analysis:', profile);
      return createDefaultErrorResponse('Insufficient profile data');
    }

    // Ensure OpenAI API key is available
    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return createDefaultErrorResponse('API configuration error');
    }

    const sanitizedProfile = {
      id: profile.id,
      fullname: profile.fullname,
      occupation: profile.occupation || '',
      location: profile.location || '',
      age: profile.age || null,
      relationship_history: profile.relationship_history || '',
      lifestyle: profile.lifestyle || '',
      interests: profile.interests || []
    };

    const prompt = `As an expert psychologist and relationship counselor, analyze this person's profile and provide a detailed personality assessment in JSON format. Consider all available information:

Profile Information:
${JSON.stringify(sanitizedProfile, null, 2)}

${chatHistory ? `Chat History & Interactions:
${JSON.stringify(chatHistory, null, 2)}` : ''}

Analyze and provide insights in the following structured format:

{
  "positivePersona": {
    "personality_traits": {
      "traits": ["List 5-7 key personality traits"],
      "examples": ["Provide specific examples from profile/chat for each trait"],
      "summary": "Comprehensive personality summary",
      "intensity": 75
    },
    "core_values": {
      "traits": ["List 4-6 fundamental values"],
      "examples": ["Real examples demonstrating each value"],
      "summary": "Analysis of value system",
      "intensity": 80
    },
    "behavioral_traits": {
      "traits": ["List 5-7 behavioral patterns"],
      "examples": ["Specific situations showing each behavior"],
      "summary": "Overall behavioral analysis",
      "intensity": 70
    },
    "hobbies_interests": {
      "traits": ["List all identified interests"],
      "examples": ["How they pursue each interest"],
      "summary": "Analysis of personal interests",
      "intensity": 85
    }
  },
  "negativePersona": {
    "emotional_aspects": {
      "traits": ["List 3-5 emotional growth areas"],
      "examples": ["Specific situations showing each aspect"],
      "summary": "Analysis of emotional challenges",
      "intensity": 60
    },
    "social_aspects": {
      "traits": ["List 3-5 social growth areas"],
      "examples": ["Examples of social interaction patterns"],
      "summary": "Analysis of social challenges",
      "intensity": 55
    },
    "lifestyle_aspects": {
      "traits": ["List 3-5 lifestyle challenges"],
      "examples": ["Real examples of each challenge"],
      "summary": "Analysis of lifestyle improvements",
      "intensity": 50
    },
    "relational_aspects": {
      "traits": ["List 3-5 relationship growth areas"],
      "examples": ["Specific relationship patterns"],
      "summary": "Analysis of relationship challenges",
      "intensity": 65
    }
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { 
          role: "system", 
          content: "You are an expert psychologist and relationship counselor with deep expertise in personality analysis. Provide detailed, evidence-based analysis in valid JSON format. Always include both positive and negative aspects of personality."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: "json_object" }
    });

    if (!completion.choices[0]?.message?.content) {
      console.warn('No content in OpenAI response');
      return createDefaultErrorResponse('Analysis generation failed');
    }

    const analysis = JSON.parse(completion.choices[0].message.content);
    
    // Validate the analysis structure
    if (!isValidAnalysis(analysis)) {
      console.warn('Invalid analysis structure received:', analysis);
      return createDefaultErrorResponse('Invalid analysis format');
    }

    return transformAIResponseToPersonaAnalysis(analysis);
  } catch (error) {
    console.error('Error in generateDetailedPersonaAnalysis:', error);
    if (DEBUG) {
      const err = error as Error;
      console.log('Error details:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
    }
    return createDefaultErrorResponse('Error generating analysis');
  }
}

// Helper function to create default error response
function createDefaultErrorResponse(errorMessage: string): PersonaAnalysis {
  const defaultAspect = {
    traits: [],
    examples: [],
    summary: errorMessage,
    intensity: 0
  };

  return {
    positivePersona: {
      personality_traits: defaultAspect,
      core_values: defaultAspect,
      behavioral_traits: defaultAspect,
      hobbies_interests: defaultAspect
    },
    negativePersona: {
      emotional_aspects: defaultAspect,
      social_aspects: defaultAspect,
      lifestyle_aspects: defaultAspect,
      relational_aspects: defaultAspect
    }
  };
}

// Helper function to validate analysis structure
function isValidAnalysis(analysis: any): boolean {
  const hasPositivePersona = analysis?.positivePersona && 
    analysis.positivePersona.personality_traits?.traits?.length > 0 &&
    analysis.positivePersona.core_values?.traits?.length > 0 &&
    analysis.positivePersona.behavioral_traits?.traits?.length > 0 &&
    analysis.positivePersona.hobbies_interests?.traits?.length > 0;

  const hasNegativePersona = analysis?.negativePersona &&
    analysis.negativePersona.emotional_aspects?.traits?.length > 0 &&
    analysis.negativePersona.social_aspects?.traits?.length > 0 &&
    analysis.negativePersona.lifestyle_aspects?.traits?.length > 0 &&
    analysis.negativePersona.relational_aspects?.traits?.length > 0;

  if (!hasPositivePersona || !hasNegativePersona) {
    console.warn('Invalid analysis structure:', {
      hasPositivePersona,
      hasNegativePersona,
      analysis: JSON.stringify(analysis, null, 2)
    });
    return false;
  }

  return true;
}

// New enhanced compatibility analysis
export const analyzeDetailedCompatibility = async (
  profile1: UserProfile,
  profile2: UserProfile,
  personas?: { persona1: PersonaAnalysis, persona2: PersonaAnalysis }
): Promise<CompatibilityScore> => {
  try {
    const prompt = `As an expert relationship counselor, analyze the compatibility between these two individuals considering these weights:
- Values Alignment (30%): Core values, beliefs, and principles
- Personality Compatibility (25%): Character traits and behavioral patterns
- Emotional Intelligence (20%): Emotional understanding and support
- Lifestyle Match (15%): Daily routines and habits
- Goals Alignment (10%): Future aspirations and plans

Person 1:
${JSON.stringify(profile1, null, 2)}

Person 2:
${JSON.stringify(profile2, null, 2)}

${personas ? `Detailed Personas:
${JSON.stringify(personas, null, 2)}` : ''}

Provide analysis in the following format:
{
  "overall_score": 85,
  "emotional_score": 80,
  "intellectual_score": 90,
  "lifestyle_score": 75,
  "summary": "Overall compatibility summary",
  "strengths": ["strength1", "strength2"],
  "challenges": ["challenge1", "challenge2"],
  "tips": ["tip1", "tip2"],
  "long_term_prediction": "Detailed prediction of relationship potential"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { 
          role: "system", 
          content: "You are an expert relationship counselor specializing in compatibility analysis. Provide analysis in valid JSON format only. Do not include any additional text or explanations outside the JSON object."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No content in OpenAI response');
    }

    const analysis = JSON.parse(completion.choices[0].message.content);
    return transformAIResponseToCompatibilityScore(analysis);
  } catch (error) {
    console.error('Error analyzing compatibility:', error);
    return {
      overall: 0,
      emotional: 0,
      intellectual: 0,
      lifestyle: 0,
      summary: 'Unable to analyze compatibility at this time',
      strengths: [],
      challenges: [],
      tips: [],
      long_term_prediction: ''
    };
  }
};

function transformAIResponseToPersonaAnalysis(aiResponse: any): PersonaAnalysis {
  // Add debug logging
  console.log('Transforming AI response:', JSON.stringify(aiResponse, null, 2));

  const defaultAspect = {
    traits: [],
    examples: [],
    summary: 'Not available',
    intensity: 50
  };

  const result = {
    positivePersona: {
      personality_traits: transformAspect(aiResponse?.positivePersona?.personality_traits || defaultAspect),
      core_values: transformAspect(aiResponse?.positivePersona?.core_values || defaultAspect),
      behavioral_traits: transformAspect(aiResponse?.positivePersona?.behavioral_traits || defaultAspect),
      hobbies_interests: transformAspect(aiResponse?.positivePersona?.hobbies_interests || defaultAspect)
    },
    negativePersona: {
      emotional_aspects: transformAspect(aiResponse?.negativePersona?.emotional_aspects || defaultAspect),
      social_aspects: transformAspect(aiResponse?.negativePersona?.social_aspects || defaultAspect),
      lifestyle_aspects: transformAspect(aiResponse?.negativePersona?.lifestyle_aspects || defaultAspect),
      relational_aspects: transformAspect(aiResponse?.negativePersona?.relational_aspects || defaultAspect)
    }
  };

  // Add debug logging for the result
  console.log('Transformed result:', JSON.stringify(result, null, 2));

  return result;
}

function transformAIResponseToCompatibilityScore(aiResponse: any): CompatibilityScore {
  return {
    overall: aiResponse.overall_score || 0,
    emotional: aiResponse.emotional_score || 0,
    intellectual: aiResponse.intellectual_score || 0,
    lifestyle: aiResponse.lifestyle_score || 0,
    summary: aiResponse.summary || '',
    strengths: aiResponse.strengths || [],
    challenges: aiResponse.challenges || [],
    tips: aiResponse.tips || [],
    long_term_prediction: aiResponse.long_term_prediction || ''
  };
}

function transformAspect(aspect: any): PersonaAspect {
  return {
    traits: aspect?.traits || [],
    examples: aspect?.examples || [],
    summary: aspect?.summary || null,
    intensity: aspect?.intensity
  };
}

export default {
  generatePersonaAnalysis,
  generateDetailedPersonaAnalysis,
  analyzeDetailedCompatibility
};