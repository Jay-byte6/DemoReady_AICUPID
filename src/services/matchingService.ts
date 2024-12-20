import { supabase } from '../lib/supabase';
import { SmartMatch, UserProfile, CompatibilityDetails } from '../types';
import { analyzeCompatibility } from './openai';

// Dummy data generator for testing
const generateDummyCompatibility = () => ({
  compatibility_score: Math.floor(Math.random() * 41) + 60, // Random score between 60-100
  strengths: [
    "Similar communication styles",
    "Shared life goals",
    "Complementary personalities"
  ],
  challenges: [
    "Different social preferences",
    "Varying schedules"
  ],
  improvement_tips: [
    "Schedule regular quality time",
    "Practice active listening",
    "Share new experiences together"
  ],
  long_term_prediction: "Strong potential for a lasting connection based on shared values and goals."
});

const getStoredCompatibility = async (userId: string, matchId: string) => {
  const { data, error } = await supabase
    .from('compatibility_analysis')
    .select('*')
    .eq('user_id', userId)
    .eq('match_id', matchId)
    .single();

  if (error) return null;
  return data;
};

const storeCompatibility = async (userId: string, matchId: string, compatibilityData: any) => {
  const { error } = await supabase
    .from('compatibility_analysis')
    .upsert({
      user_id: userId,
      match_id: matchId,
      compatibility_score: compatibilityData.compatibility_score,
      strengths: compatibilityData.strengths,
      challenges: compatibilityData.challenges,
      improvement_tips: compatibilityData.improvement_tips,
      long_term_prediction: compatibilityData.long_term_prediction,
      last_updated: new Date().toISOString()
    });

  if (error) {
    console.error('Error storing compatibility data:', error);
    throw error;
  }
};

const findCompatibleMatches = async (userId: string): Promise<SmartMatch[]> => {
  try {
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) throw profileError;

    // Get all potential matches
    const { data: potentialMatches, error: matchError } = await supabase
      .from('user_profiles')
      .select('*')
      .neq('user_id', userId);

    if (matchError) throw matchError;

    // Get all stored compatibility analyses
    const { data: storedAnalyses, error: analysesError } = await supabase
      .from('compatibility_analysis')
      .select('*')
      .eq('user_id', userId);

    if (analysesError) throw analysesError;

    const storedAnalysesMap = new Map(
      storedAnalyses?.map(analysis => [analysis.match_id, analysis]) || []
    );

    // Calculate compatibility for each potential match
    const matches: SmartMatch[] = await Promise.all(
      potentialMatches.map(async (match) => {
        const storedAnalysis = storedAnalysesMap.get(match.user_id);
        let compatibility;

        if (storedAnalysis) {
          // Use stored analysis
          compatibility = {
            compatibility_score: storedAnalysis.compatibility_score,
            strengths: storedAnalysis.strengths,
            challenges: storedAnalysis.challenges,
            improvement_tips: storedAnalysis.improvement_tips,
            long_term_prediction: storedAnalysis.long_term_prediction,
            last_updated: storedAnalysis.last_updated
          };
        } else {
          // Use dummy data for testing
          compatibility = generateDummyCompatibility();
          await storeCompatibility(userId, match.user_id, compatibility);
        }

        return {
          profile: match,
          compatibility_score: compatibility.compatibility_score || 0,
          compatibility_details: {
            strengths: compatibility.strengths || [],
            challenges: compatibility.challenges || [],
            tips: compatibility.improvement_tips || [],
            long_term_prediction: compatibility.long_term_prediction || ''
          },
          request_status: {
            persona_view: 'NONE',
            chat: 'NONE'
          },
          is_favorite: false,
          last_updated: compatibility.last_updated
        };
      })
    );

    return matches;
  } catch (error) {
    console.error('Error finding compatible matches:', error);
    throw error;
  }
};

// Add a function to refresh all compatibility analyses
const refreshAllCompatibilityAnalyses = async (userId: string): Promise<void> => {
  try {
    const { data: potentialMatches, error: matchError } = await supabase
      .from('user_profiles')
      .select('*')
      .neq('user_id', userId);

    if (matchError) throw matchError;

    // Use dummy data for testing
    await Promise.all(
      potentialMatches.map(async (match) => {
        const compatibility = generateDummyCompatibility();
        await storeCompatibility(userId, match.user_id, compatibility);
      })
    );
  } catch (error) {
    console.error('Error refreshing all compatibility analyses:', error);
    throw error;
  }
};

const findMatchByCupidId = async (userId: string, cupidId: string): Promise<SmartMatch> => {
  try {
    const { data: match, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('cupid_id', cupidId)
      .single();

    if (error) throw error;

    // Check for stored compatibility first
    const storedCompatibility = await getStoredCompatibility(userId, match.user_id);
    let compatibility;

    if (storedCompatibility) {
      compatibility = {
        compatibility_score: storedCompatibility.compatibility_score,
        strengths: storedCompatibility.strengths,
        challenges: storedCompatibility.challenges,
        improvement_tips: storedCompatibility.improvement_tips,
        long_term_prediction: storedCompatibility.long_term_prediction
      };
    } else {
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      // Generate new analysis only if not found in storage
      compatibility = await analyzeCompatibility(userProfile, match);
      await storeCompatibility(userId, match.user_id, compatibility);
    }

    return {
      profile: match,
      compatibility_score: compatibility.compatibility_score || 0,
      compatibility_details: {
        strengths: compatibility.strengths || [],
        challenges: compatibility.challenges || [],
        tips: compatibility.improvement_tips || [],
        long_term_prediction: compatibility.long_term_prediction || ''
      },
      request_status: {
        persona_view: 'NONE',
        chat: 'NONE'
      },
      is_favorite: false
    };
  } catch (error) {
    console.error('Error finding match by CUPID ID:', error);
    throw error;
  }
};

// Add a function to force refresh compatibility analysis
const refreshCompatibilityAnalysis = async (userId: string, matchId: string): Promise<void> => {
  try {
    const [userProfile, match] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('user_id', userId).single(),
      supabase.from('user_profiles').select('*').eq('user_id', matchId).single()
    ]);

    if (userProfile.error) throw userProfile.error;
    if (match.error) throw match.error;

    const compatibility = await analyzeCompatibility(userProfile.data, match.data);
    await storeCompatibility(userId, matchId, compatibility);
  } catch (error) {
    console.error('Error refreshing compatibility analysis:', error);
    throw error;
  }
};

const findTopMatches = async (userId: string): Promise<SmartMatch[]> => {
  const matches = await findCompatibleMatches(userId);
  return matches.sort((a, b) => b.compatibility_score - a.compatibility_score);
};

export const matchingService = {
  findCompatibleMatches,
  findMatchByCupidId,
  findTopMatches,
  refreshCompatibilityAnalysis,
  refreshAllCompatibilityAnalyses
};