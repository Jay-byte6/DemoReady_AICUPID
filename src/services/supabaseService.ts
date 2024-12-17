import { supabase } from '../lib/supabase';
import { generatePersonaAnalysis, analyzeCompatibility } from './openai';

export const analyzeCompatibilityByCupidId = async (userId: string, cupidId: string) => {
  try {
    // Get target profile
    const { data: targetProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('cupid_id', cupidId)
      .single();

    if (profileError) throw profileError;

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (userError) throw userError;

    // Calculate compatibility
    const compatibility = await generatePersonaAnalysis({
      user1: userProfile,
      user2: targetProfile
    });

    return {
      targetProfile,
      compatibility: {
        score: compatibility.score || 0,
        insights: compatibility.strengths || [],
        details: {
          strengths: compatibility.strengths || [],
          challenges: compatibility.challenges || [],
          tips: compatibility.tips || [],
          long_term_prediction: compatibility.long_term_prediction || ''
        }
      }
    };
  } catch (error) {
    console.error('Error analyzing compatibility:', error);
    throw error;
  }
};

export const profileService = {
  async getUserProfile(userId: string) {
    try {
      console.log('Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Supabase error fetching profile:', error);
        throw error;
      }

      console.log('Fetched profile data:', data);
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(userId: string, profile: any) {
    try {
      console.log('Updating profile for user:', userId);
      console.log('Profile data to update:', profile);
      
      // First check if profile exists
      const existingProfile = await this.getUserProfile(userId);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...profile,
          id: existingProfile?.id || undefined,
          created_at: existingProfile?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating profile:', error);
        throw error;
      }

      console.log('Profile updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  async getPersonalityAnalysis(userId: string) {
    try {
      console.log('Fetching personality analysis for user:', userId);
      const { data, error } = await supabase
        .from('personality_analysis')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase error fetching analysis:', error);
        throw error;
      }

      console.log('Fetched personality analysis:', data);
      return data;
    } catch (error) {
      console.error('Error getting personality analysis:', error);
      throw error;
    }
  },

  async savePersonalityAnalysis(userId: string, analysis: any) {
    try {
      console.log('Saving personality analysis for user:', userId);
      console.log('Analysis data to save:', analysis);
      
      // First get the user profile to get its ID
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile) {
        throw new Error('User profile not found');
      }

      // First check if analysis exists
      const existingAnalysis = await this.getPersonalityAnalysis(userId);
      
      const { data, error } = await supabase
        .from('personality_analysis')
        .upsert({
          user_id: userId,
          profile_id: userProfile.id,
          ...analysis,
          id: existingAnalysis?.id || undefined,
          created_at: existingAnalysis?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error saving analysis:', error);
        throw error;
      }

      console.log('Analysis saved successfully:', data);

      // Generate and save AI personas
      const personalityData = {
        profile: userProfile,
        analysis: data
      };

      console.log('Generating AI personas with data:', personalityData);
      const personas = await generatePersonaAnalysis(personalityData);

      // Save positive persona
      await this.savePositivePersona(userId, personas.positive_persona);
      
      // Save negative persona
      await this.saveNegativePersona(userId, personas.negative_persona);

      return data;
    } catch (error) {
      console.error('Error saving personality analysis:', error);
      throw error;
    }
  },

  async getPositivePersona(userId: string) {
    try {
      console.log('Fetching positive persona for user:', userId);
      const { data, error } = await supabase
        .from('positive_personas')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase error fetching positive persona:', error);
        throw error;
      }

      if (!data) {
        console.log('No positive persona found');
        return null;
      }

      // Transform the data to ensure correct structure
      const transformedData = {
        ...data,
        personality_traits: {
          examples: Array.isArray(data.personality_traits) ? 
            data.personality_traits : 
            Array.isArray(data.personality_traits?.examples) ? 
              data.personality_traits.examples : []
        },
        core_values: {
          examples: Array.isArray(data.core_values) ? 
            data.core_values : 
            Array.isArray(data.core_values?.examples) ? 
              data.core_values.examples : []
        },
        behavioral_traits: {
          examples: Array.isArray(data.behavioral_traits) ? 
            data.behavioral_traits : 
            Array.isArray(data.behavioral_traits?.examples) ? 
              data.behavioral_traits.examples : []
        },
        hobbies_interests: {
          examples: Array.isArray(data.hobbies_interests) ? 
            data.hobbies_interests : 
            Array.isArray(data.hobbies_interests?.examples) ? 
              data.hobbies_interests.examples : []
        }
      };

      console.log('Transformed positive persona:', JSON.stringify(transformedData, null, 2));
      return transformedData;
    } catch (error) {
      console.error('Error getting positive persona:', error);
      throw error;
    }
  },

  async savePositivePersona(userId: string, persona: any) {
    try {
      console.log('Saving positive persona for user:', userId);
      console.log('Raw persona data to save:', JSON.stringify(persona, null, 2));
      
      // Transform the data structure
      const structuredPersona = {
        user_id: userId,
        personality_traits: {
          examples: Array.isArray(persona.personality_traits) ? 
            persona.personality_traits : 
            Array.isArray(persona.personality_traits?.examples) ? 
              persona.personality_traits.examples : []
        },
        core_values: {
          examples: Array.isArray(persona.core_values) ? 
            persona.core_values : 
            Array.isArray(persona.core_values?.examples) ? 
              persona.core_values.examples : []
        },
        behavioral_traits: {
          examples: Array.isArray(persona.behavioral_traits) ? 
            persona.behavioral_traits : 
            Array.isArray(persona.behavioral_traits?.examples) ? 
              persona.behavioral_traits.examples : []
        },
        hobbies_interests: {
          examples: Array.isArray(persona.hobbies_interests) ? 
            persona.hobbies_interests : 
            Array.isArray(persona.hobbies_interests?.examples) ? 
              persona.hobbies_interests.examples : []
        },
        summary: typeof persona.summary === 'string' ? persona.summary : ''
      };

      console.log('Structured positive persona data:', JSON.stringify(structuredPersona, null, 2));
      
      const existingPersona = await this.getPositivePersona(userId);
      
      const { data, error } = await supabase
        .from('positive_personas')
        .upsert({
          ...structuredPersona,
          id: existingPersona?.id || undefined,
          created_at: existingPersona?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error saving positive persona:', error);
        throw error;
      }

      console.log('Positive persona saved successfully:', JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error('Error saving positive persona:', error);
      throw error;
    }
  },

  async getNegativePersona(userId: string) {
    try {
      console.log('Fetching negative persona for user:', userId);
      const { data, error } = await supabase
        .from('negative_personas')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase error fetching negative persona:', error);
        throw error;
      }

      if (!data) {
        console.log('No negative persona found');
        return null;
      }

      // Transform the data to ensure correct structure
      const transformedData = {
        ...data,
        emotional_weaknesses: {
          traits: Array.isArray(data.emotional_weaknesses) ? 
            data.emotional_weaknesses : 
            Array.isArray(data.emotional_weaknesses?.traits) ? 
              data.emotional_weaknesses.traits : []
        },
        social_weaknesses: {
          traits: Array.isArray(data.social_weaknesses) ? 
            data.social_weaknesses : 
            Array.isArray(data.social_weaknesses?.traits) ? 
              data.social_weaknesses.traits : []
        },
        lifestyle_weaknesses: {
          traits: Array.isArray(data.lifestyle_weaknesses) ? 
            data.lifestyle_weaknesses : 
            Array.isArray(data.lifestyle_weaknesses?.traits) ? 
              data.lifestyle_weaknesses.traits : []
        },
        relational_weaknesses: {
          traits: Array.isArray(data.relational_weaknesses) ? 
            data.relational_weaknesses : 
            Array.isArray(data.relational_weaknesses?.traits) ? 
              data.relational_weaknesses.traits : []
        }
      };

      console.log('Transformed negative persona:', JSON.stringify(transformedData, null, 2));
      return transformedData;
    } catch (error) {
      console.error('Error getting negative persona:', error);
      throw error;
    }
  },

  async saveNegativePersona(userId: string, persona: any) {
    try {
      console.log('Saving negative persona for user:', userId);
      console.log('Raw persona data to save:', JSON.stringify(persona, null, 2));
      
      // Transform the data structure
      const structuredPersona = {
        user_id: userId,
        emotional_weaknesses: {
          traits: Array.isArray(persona.emotional_weaknesses) ? 
            persona.emotional_weaknesses : 
            Array.isArray(persona.emotional_weaknesses?.traits) ? 
              persona.emotional_weaknesses.traits : []
        },
        social_weaknesses: {
          traits: Array.isArray(persona.social_weaknesses) ? 
            persona.social_weaknesses : 
            Array.isArray(persona.social_weaknesses?.traits) ? 
              persona.social_weaknesses.traits : []
        },
        lifestyle_weaknesses: {
          traits: Array.isArray(persona.lifestyle_weaknesses) ? 
            persona.lifestyle_weaknesses : 
            Array.isArray(persona.lifestyle_weaknesses?.traits) ? 
              persona.lifestyle_weaknesses.traits : []
        },
        relational_weaknesses: {
          traits: Array.isArray(persona.relational_weaknesses) ? 
            persona.relational_weaknesses : 
            Array.isArray(persona.relational_weaknesses?.traits) ? 
              persona.relational_weaknesses.traits : []
        },
        summary: typeof persona.summary === 'string' ? persona.summary : ''
      };

      console.log('Structured negative persona data:', JSON.stringify(structuredPersona, null, 2));
      
      const existingPersona = await this.getNegativePersona(userId);
      
      const { data, error } = await supabase
        .from('negative_personas')
        .upsert({
          ...structuredPersona,
          id: existingPersona?.id || undefined,
          created_at: existingPersona?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error saving negative persona:', error);
        throw error;
      }

      console.log('Negative persona saved successfully:', JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error('Error saving negative persona:', error);
      throw error;
    }
  },

  async getCompatibilityScore(userId: string, targetUserId: string) {
    try {
      const { data, error } = await supabase
        .from('compatibility_scores')
        .select('*')
        .eq('user_id', userId)
        .eq('target_user_id', targetUserId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error getting compatibility score:', error);
      throw error;
    }
  },

  async calculateCompatibility(userId: string, targetUserId: string) {
    try {
      // Get both user profiles and their analyses
      const [user1Profile, user2Profile, user1Analysis, user2Analysis] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserProfile(targetUserId),
        this.getPersonalityAnalysis(userId),
        this.getPersonalityAnalysis(targetUserId)
      ]);

      const user1Data = { profile: user1Profile, analysis: user1Analysis };
      const user2Data = { profile: user2Profile, analysis: user2Analysis };

      // Generate compatibility analysis
      const compatibilityResult = await analyzeCompatibility(user1Data, user2Data);

      // Save compatibility score
      const { data, error } = await supabase
        .from('compatibility_scores')
        .upsert({
          user_id: userId,
          target_user_id: targetUserId,
          compatibility_score: compatibilityResult.compatibility_score,
          strengths: compatibilityResult.strengths,
          challenges: compatibilityResult.challenges,
          long_term_prediction: compatibilityResult.long_term_prediction,
          improvement_tips: compatibilityResult.improvement_tips,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error calculating compatibility:', error);
      throw error;
    }
  },

  async findTopMatches(userId: string, limit = 20) {
    try {
      // Get current user's profile and preferences
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile) throw new Error('User profile not found');

      const preferences = userProfile.matching_preferences || {};
      
      // Get all users except the current user with basic filtering
      let query = supabase
        .from('user_profiles')
        .select('*')
        .neq('user_id', userId);

      // Apply age filter if set
      if (preferences.min_age) {
        query = query.gte('age', preferences.min_age);
      }
      if (preferences.max_age) {
        query = query.lte('age', preferences.max_age);
      }

      // Apply education level filter if set
      if (preferences.education_level) {
        query = query.eq('education_level', preferences.education_level);
      }

      // Apply relationship type filter if set
      if (preferences.relationship_type) {
        query = query.eq('relationship_type', preferences.relationship_type);
      }

      const { data: users, error: usersError } = await query;

      if (usersError) throw usersError;

      // Calculate compatibility with each user
      const compatibilityPromises = users.map(async (user) => {
        const compatibility = await this.calculateCompatibility(userId, user.user_id);
        
        // Check deal breakers
        const hasDealBreaker = preferences.deal_breakers?.some(dealBreaker => 
          user.dealbreakers?.includes(dealBreaker)
        );

        return {
          user,
          compatibility,
          hasDealBreaker
        };
      });

      const results = await Promise.all(compatibilityPromises);

      // Filter and sort results
      return results
        .filter(result => !result.hasDealBreaker) // Remove matches with deal breakers
        .sort((a, b) => b.compatibility.compatibility_score - a.compatibility.compatibility_score)
        .slice(0, limit);
    } catch (error) {
      console.error('Error finding top matches:', error);
      throw error;
    }
  },

  // Notification methods
  async getNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  },

  async markNotificationAsRead(notificationId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async updateNotificationPreferences(userId: string, preferences: any) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          notification_preferences: preferences
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  },

  async updateMatchingPreferences(userId: string, preferences: any) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          matching_preferences: preferences
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating matching preferences:', error);
      throw error;
    }
  },

  // Stream Chat methods
  async getStreamChatToken(userId: string) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('stream_chat_token')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      if (!profile?.stream_chat_token) {
        // Generate new token if not exists
        // Note: Implementation depends on your Stream Chat setup
        throw new Error('Stream Chat token not found');
      }

      return profile.stream_chat_token;
    } catch (error) {
      console.error('Error getting Stream Chat token:', error);
      throw error;
    }
  },

  async uploadProfileImage(userId: string, file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `profile-pictures/${userId}/avatar.${fileExt}`;

      // Upload the file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-content')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-content')
        .getPublicUrl(filePath);

      // Update the user profile with the new image URL
      const { data: profile, error: updateError } = await supabase
        .from('user_profiles')
        .update({ profile_image: publicUrl })
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) throw updateError;

      return profile;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  },

  async deleteProfileImage(userId: string) {
    try {
      // Delete the file from storage
      const { error: deleteError } = await supabase.storage
        .from('user-content')
        .remove([`profile-pictures/${userId}/avatar`]);

      if (deleteError) throw deleteError;

      // Update the user profile to remove the image URL
      const { data: profile, error: updateError } = await supabase
        .from('user_profiles')
        .update({ profile_image: null })
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) throw updateError;

      return profile;
    } catch (error) {
      console.error('Error deleting profile image:', error);
      throw error;
    }
  },

  async getFavoriteProfiles(userId: string) {
    try {
      const { data, error } = await supabase
        .from('favorite_profiles')
        .select(`
          *,
          favorite_user:favorite_user_id(
            id,
            user_profiles!inner(*)
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting favorite profiles:', error);
      return [];
    }
  },

  async toggleFavoriteProfile(userId: string, favoriteUserId: string) {
    try {
      // Check if already favorited
      const { data: existing } = await supabase
        .from('favorite_profiles')
        .select('id')
        .eq('user_id', userId)
        .eq('favorite_user_id', favoriteUserId)
        .single();

      if (existing) {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from('favorite_profiles')
          .delete()
          .eq('id', existing.id);

        if (deleteError) throw deleteError;
        return false; // Not favorited anymore
      } else {
        // Add to favorites
        const { error: insertError } = await supabase
          .from('favorite_profiles')
          .insert({
            user_id: userId,
            favorite_user_id: favoriteUserId
          });

        if (insertError) throw insertError;
        return true; // Now favorited
      }
    } catch (error) {
      console.error('Error toggling favorite profile:', error);
      throw error;
    }
  },

  async createMatchRequest(userId: string, targetUserId: string, requestType: 'PERSONA_VIEW' | 'CHAT') {
    try {
      // Check if request already exists
      const { data: existing } = await supabase
        .from('match_requests')
        .select('*')
        .eq('requester_id', userId)
        .eq('target_id', targetUserId)
        .eq('request_type', requestType)
        .eq('status', 'PENDING')
        .maybeSingle();

      if (existing) return existing;

      const { data, error } = await supabase
        .from('match_requests')
        .insert({
          requester_id: userId,
          target_id: targetUserId,
          request_type: requestType,
          status: 'PENDING'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating match request:', error);
      throw error;
    }
  },

  async updateMatchRequest(requestId: string, status: 'APPROVED' | 'REJECTED') {
    try {
      const { data, error } = await supabase
        .from('match_requests')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating match request:', error);
      throw error;
    }
  },

  async getMatchRequests(userId: string, type: 'received' | 'sent') {
    try {
      const { data, error } = await supabase
        .from('match_requests')
        .select(`
          *,
          requester:requester_id(
            id,
            user_profiles!inner(*)
          ),
          target:target_id(
            id,
            user_profiles!inner(*)
          )
        `)
        .eq(type === 'received' ? 'target_id' : 'requester_id', userId)
        .eq('status', 'PENDING');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting match requests:', error);
      throw error;
    }
  },

  async getRelationshipInsights(userId: string) {
    try {
      const { data, error } = await supabase
        .from('relationship_insights')
        .select(`
          *,
          partner:partner_id(
            id,
            user_profiles!inner(*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting relationship insights:', error);
      throw error;
    }
  },

  async updateRelationshipStatus(userId: string, partnerId: string, status: 'VIEWING' | 'CHATTING' | 'DATING' | 'ENDED') {
    try {
      const { data: existing } = await supabase
        .from('relationship_insights')
        .select('*')
        .eq('user_id', userId)
        .eq('partner_id', partnerId)
        .maybeSingle();

      const { data, error } = await supabase
        .from('relationship_insights')
        .upsert({
          id: existing?.id,
          user_id: userId,
          partner_id: partnerId,
          status,
          updated_at: new Date().toISOString(),
          created_at: existing?.created_at || new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating relationship status:', error);
      throw error;
    }
  },

  analyzeCompatibilityByCupidId
};

export default profileService; 