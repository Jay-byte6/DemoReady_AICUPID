import { supabase } from '../lib/supabase';
import { openai } from './openai';
import type { SmartMatch, UserProfile, CompatibilityDetails } from '../types';
import { profileService } from './supabaseService';

// Utility function to check if OpenAI is available
const isOpenAIAvailable = () => {
  if (!openai) {
    console.warn('OpenAI is not initialized. Using fallback compatibility scoring.');
    return false;
  }
  return true;
};

export const matchingService = {
  async findTopMatches(userId: string, limit: number = 20): Promise<SmartMatch[]> {
    try {
      // Get user's profile and personality analysis
      const userProfile = await profileService.getUserProfile(userId);
      if (!userProfile) throw new Error('User profile not found');

      const userPersonality = await profileService.getPersonalityAnalysis(userId);
      if (!userPersonality) throw new Error('User personality analysis not found');

      // Get potential matches (excluding the user)
      const { data: potentialMatches, error: matchError } = await supabase
        .from('user_profiles')
        .select(`
          *,
          personality_analysis!profile_id(*)
        `)
        .neq('user_id', userId)
        .limit(limit);

      if (matchError) throw matchError;
      if (!potentialMatches) return [];

      // Get user's favorites
      const userFavorites = await profileService.getFavoriteProfiles(userId);
      const favoriteIds = userFavorites.map(f => f.favorite_user_id);

      // Calculate compatibility for each potential match
      const matchPromises = potentialMatches.map(async (match) => {
        const compatibilityScore = await this.calculateCompatibilityScore(
          userPersonality,
          match.personality_analysis
        );

        const compatibilityDetails = await this.generateCompatibilityInsights(
          userPersonality,
          match.personality_analysis,
          compatibilityScore
        );

        return {
          profile: match,
          compatibility_score: compatibilityScore,
          compatibility_details: compatibilityDetails,
          is_favorite: favoriteIds.includes(match.user_id)
        };
      });

      const matches = await Promise.all(matchPromises);

      // Sort by compatibility score (highest first)
      return matches.sort((a, b) => b.compatibility_score - a.compatibility_score);
    } catch (error) {
      console.error('Error finding matches:', error);
      throw error;
    }
  },

  async calculateCompatibilityScore(
    userPersonality: any,
    matchPersonality: any
  ): Promise<number> {
    try {
      if (!isOpenAIAvailable()) {
        // Fallback compatibility calculation
        return 75; // Default compatibility score
      }

      const prompt = `
        Analyze the compatibility between two people based on their personality traits and preferences:

        Person 1:
        ${JSON.stringify(userPersonality)}

        Person 2:
        ${JSON.stringify(matchPersonality)}

        Calculate a compatibility score between 0 and 100 based on:
        1. Personality trait alignment
        2. Communication style compatibility
        3. Relationship goals alignment
        4. Values and interests overlap
        5. Emotional intelligence compatibility

        Return only the numeric score.
      `;

      const response = await openai!.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a relationship compatibility expert." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 10
      });

      const score = parseFloat(response.choices[0].message.content || "0");
      return Math.min(Math.max(score, 0), 100); // Ensure score is between 0 and 100
    } catch (error) {
      console.error('Error calculating compatibility score:', error);
      return 75; // Default fallback score
    }
  },

  async generateCompatibilityInsights(
    userPersonality: any,
    matchPersonality: any,
    compatibilityScore: number
  ): Promise<CompatibilityDetails> {
    try {
      if (!isOpenAIAvailable()) {
        // Return default insights
        return {
          strengths: ['Similar values and interests', 'Compatible communication styles'],
          challenges: ['Different approaches to conflict resolution'],
          tips: ['Focus on open communication', 'Respect differences'],
          long_term_prediction: 'Positive potential with effort from both parties'
        };
      }

      const prompt = `
        Analyze the compatibility between two people and provide detailed insights:

        Person 1:
        ${JSON.stringify(userPersonality)}

        Person 2:
        ${JSON.stringify(matchPersonality)}

        Compatibility Score: ${compatibilityScore}

        Provide:
        1. 3-4 key relationship strengths
        2. 2-3 potential challenges
        3. 3-4 specific tips for a successful relationship
        4. A brief prediction about long-term compatibility

        Format the response as a JSON object with these keys:
        {
          "strengths": [],
          "challenges": [],
          "tips": [],
          "long_term_prediction": ""
        }
      `;

      const response = await openai!.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a relationship compatibility expert." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const insights = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        strengths: insights.strengths || [],
        challenges: insights.challenges || [],
        tips: insights.tips || [],
        long_term_prediction: insights.long_term_prediction || ""
      };
    } catch (error) {
      console.error('Error generating compatibility insights:', error);
      return {
        strengths: ['Similar values and interests', 'Compatible communication styles'],
        challenges: ['Different approaches to conflict resolution'],
        tips: ['Focus on open communication', 'Respect differences'],
        long_term_prediction: 'Positive potential with effort from both parties'
      };
    }
  }
};