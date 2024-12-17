import { supabase } from '../lib/supabase';
import { SmartMatch, UserProfile, CompatibilityDetails } from '../types';
import { generatePersonaAnalysis } from './openai';

export const findCompatibleMatches = async (userId: string): Promise<SmartMatch[]> => {
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

    // Calculate compatibility for each potential match
    const matches: SmartMatch[] = await Promise.all(
      potentialMatches.map(async (match) => {
        const compatibility = await generatePersonaAnalysis({
          user1: userProfile,
          user2: match
        });

        return {
          profile: match,
          compatibility_score: compatibility.score || 0,
          compatibility_details: {
            strengths: compatibility.strengths || [],
            challenges: compatibility.challenges || [],
            tips: compatibility.tips || [],
            long_term_prediction: compatibility.long_term_prediction || ''
          },
          request_status: {
            persona_view: 'NONE',
            chat: 'NONE'
          },
          is_favorite: false
        };
      })
    );

    return matches;
  } catch (error) {
    console.error('Error finding compatible matches:', error);
    throw error;
  }
};

export const findMatchByCupidId = async (userId: string, cupidId: string): Promise<SmartMatch> => {
  try {
    const { data: match, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('cupid_id', cupidId)
      .single();

    if (error) throw error;

    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) throw profileError;

    const compatibility = await generatePersonaAnalysis({
      user1: userProfile,
      user2: match
    });

    return {
      profile: match,
      compatibility_score: compatibility.score || 0,
      compatibility_details: {
        strengths: compatibility.strengths || [],
        challenges: compatibility.challenges || [],
        tips: compatibility.tips || [],
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