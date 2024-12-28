import { supabase } from '../lib/supabase';
import { 
  UserProfile, 
  PersonaAnalysis, 
  PersonaAspect, 
  AspectType, 
  CompatibilityScore,
  PositivePersona,
  NegativePersona,
  SmartMatch,
  NotificationData
} from '../types';
import { generateDetailedPersonaAnalysis, analyzeDetailedCompatibility } from './openai';

interface StoredCompatibilityScore {
  overall_score: number;
  emotional_score: number;
  intellectual_score: number;
  lifestyle_score: number;
  summary: string;
  strengths: string[];
  challenges: string[];
  tips: string[];
  long_term_prediction: string;
}

interface PersonaVersion {
  id: string;
  user_id: string;
  version: number;
  positive_aspects: any[];
  negative_aspects: any[];
  trigger_type: 'AUTO' | 'MANUAL' | 'PROFILE_UPDATE' | 'PERSONALITY_TEST';
  created_at: string;
  profile_snapshot: Partial<UserProfile>;
  personality_snapshot: any;
}

export const profileService = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Supabase error fetching profile:', error);
        return null;
      }

      if (!data) {
        console.log('No profile found, creating default profile for user:', userId);
        // Create a default profile with minimal required fields
        const defaultProfile = {
          user_id: userId,
          cupid_id: `CUPID-${userId.substring(0, 6).toUpperCase()}`,
          fullname: '',
          age: 0,
          location: '',
          gender: '',
          occupation: '',
          relationship_history: '',
          lifestyle: '',
          profile_image: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert(defaultProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating default profile:', createError);
          return null;
        }

        // Generate initial persona analysis for the new profile
        await this.generateAndStorePersonaAnalysis(userId);
        return newProfile;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      console.log('Updating profile for user:', userId);
      
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
        return null;
      }

      // Check if relevant fields changed and trigger persona generation
      const relevantFieldsChanged = this.haveRelevantFieldsChanged(
        existingProfile,
        { ...existingProfile, ...profile },
        null,
        null
      );

      if (relevantFieldsChanged) {
        // Trigger persona generation in the background
        this.generateAndStorePersonaAnalysis(userId, true, 'PROFILE_UPDATE')
          .catch(error => console.error('Error generating persona after profile update:', error));
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  },

  async generateAndStorePersonaAnalysis(userId: string, forceRegenerate: boolean = false, triggerType: 'AUTO' | 'MANUAL' | 'PROFILE_UPDATE' | 'PERSONALITY_TEST' = 'AUTO'): Promise<PersonaAnalysis | null> {
    try {
      // Show loading indicator
      this.notifyPersonaGenerationStatus('start');
      
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile) {
        console.warn('Profile not found for user:', userId);
        this.notifyPersonaGenerationStatus('error', 'Profile not found');
        return null;
      }

      // Generate new persona analysis using OpenAI
      console.log('Generating new persona analysis using OpenAI');
      let personaAnalysis = await generateDetailedPersonaAnalysis(
        userProfile,
        {
          messages: [],
          aiChat: [],
          personalityData: null
        }
      );

      if (!personaAnalysis || !personaAnalysis.positivePersona || !personaAnalysis.negativePersona) {
        console.warn('Failed to generate complete persona analysis');
        this.notifyPersonaGenerationStatus('error', 'Failed to generate analysis');
        return null;
      }

      // Delete existing aspects first
      const { error: deleteError } = await supabase
        .from('persona_aspects')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error deleting existing aspects:', deleteError);
        this.notifyPersonaGenerationStatus('error', 'Failed to update persona');
        return null;
      }

      // Generate unique IDs for each aspect
      const timestamp = new Date().toISOString();
      
      // Helper function to ensure arrays are properly formatted for JSONB
      const formatArrayField = (field: any[]): any[] => {
        if (!Array.isArray(field)) return [];
        return field.map(item => {
          if (typeof item === 'string') return item;
          return String(item);
        });
      };

      // Prepare aspects with proper data formatting
      const aspects = [
        // Positive aspects
        {
          user_id: userId,
          aspect_type: 'personality_traits',
          traits: formatArrayField(personaAnalysis.positivePersona.personality_traits.traits),
          examples: formatArrayField(personaAnalysis.positivePersona.personality_traits.examples),
          summary: personaAnalysis.positivePersona.personality_traits.summary || '',
          intensity: personaAnalysis.positivePersona.personality_traits.intensity || 0,
          is_positive: true,
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          user_id: userId,
          aspect_type: 'core_values',
          traits: formatArrayField(personaAnalysis.positivePersona.core_values.traits),
          examples: formatArrayField(personaAnalysis.positivePersona.core_values.examples),
          summary: personaAnalysis.positivePersona.core_values.summary || '',
          intensity: personaAnalysis.positivePersona.core_values.intensity || 0,
          is_positive: true,
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          user_id: userId,
          aspect_type: 'behavioral_traits',
          traits: formatArrayField(personaAnalysis.positivePersona.behavioral_traits.traits),
          examples: formatArrayField(personaAnalysis.positivePersona.behavioral_traits.examples),
          summary: personaAnalysis.positivePersona.behavioral_traits.summary || '',
          intensity: personaAnalysis.positivePersona.behavioral_traits.intensity || 0,
          is_positive: true,
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          user_id: userId,
          aspect_type: 'hobbies_interests',
          traits: formatArrayField(personaAnalysis.positivePersona.hobbies_interests.traits),
          examples: formatArrayField(personaAnalysis.positivePersona.hobbies_interests.examples),
          summary: personaAnalysis.positivePersona.hobbies_interests.summary || '',
          intensity: personaAnalysis.positivePersona.hobbies_interests.intensity || 0,
          is_positive: true,
          created_at: timestamp,
          updated_at: timestamp
        },
        // Negative aspects
        {
          user_id: userId,
          aspect_type: 'emotional_aspects',
          traits: formatArrayField(personaAnalysis.negativePersona.emotional_aspects.traits),
          examples: formatArrayField(personaAnalysis.negativePersona.emotional_aspects.examples),
          summary: personaAnalysis.negativePersona.emotional_aspects.summary || '',
          intensity: personaAnalysis.negativePersona.emotional_aspects.intensity || 0,
          is_positive: false,
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          user_id: userId,
          aspect_type: 'social_aspects',
          traits: formatArrayField(personaAnalysis.negativePersona.social_aspects.traits),
          examples: formatArrayField(personaAnalysis.negativePersona.social_aspects.examples),
          summary: personaAnalysis.negativePersona.social_aspects.summary || '',
          intensity: personaAnalysis.negativePersona.social_aspects.intensity || 0,
          is_positive: false,
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          user_id: userId,
          aspect_type: 'lifestyle_aspects',
          traits: formatArrayField(personaAnalysis.negativePersona.lifestyle_aspects.traits),
          examples: formatArrayField(personaAnalysis.negativePersona.lifestyle_aspects.examples),
          summary: personaAnalysis.negativePersona.lifestyle_aspects.summary || '',
          intensity: personaAnalysis.negativePersona.lifestyle_aspects.intensity || 0,
          is_positive: false,
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          user_id: userId,
          aspect_type: 'relational_aspects',
          traits: formatArrayField(personaAnalysis.negativePersona.relational_aspects.traits),
          examples: formatArrayField(personaAnalysis.negativePersona.relational_aspects.examples),
          summary: personaAnalysis.negativePersona.relational_aspects.summary || '',
          intensity: personaAnalysis.negativePersona.relational_aspects.intensity || 0,
          is_positive: false,
          created_at: timestamp,
          updated_at: timestamp
        }
      ];

      // Log the data being stored
      console.log('Storing persona aspects:', JSON.stringify(aspects, null, 2));

      // Store all aspects
      const { error: insertError } = await supabase
        .from('persona_aspects')
        .insert(aspects);

      if (insertError) {
        console.error('Error storing persona aspects:', insertError);
        this.notifyPersonaGenerationStatus('error', 'Failed to store persona');
        return null;
      }

      // Notify completion
      this.notifyPersonaGenerationStatus('complete');
      return personaAnalysis;
    } catch (error) {
      console.error('Error generating and storing persona analysis:', error);
      this.notifyPersonaGenerationStatus('error', 'Generation failed');
      return null;
    }
  },

  notifyPersonaGenerationStatus(status: 'start' | 'complete' | 'error', message?: string) {
    // Dispatch custom event for UI updates
    const event = new CustomEvent('personaGenerationStatus', {
      detail: { status, message }
    });
    window.dispatchEvent(event);
  },

  async shouldRegeneratePersona(userId: string): Promise<boolean> {
    try {
      // Get latest persona version
      const { data: latestVersion } = await supabase
        .from('persona_versions')
        .select('created_at, profile_snapshot, personality_snapshot')
        .eq('user_id', userId)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (!latestVersion) return true;

      // Get current profile and personality data
      const [profile, personalityData] = await Promise.all([
        this.getUserProfile(userId),
        supabase
          .from('user_profiles')
          .select('personality_data')
          .eq('user_id', userId)
          .single()
      ]);

      if (!profile) return true;

      // Compare relevant fields
      const relevantFieldsChanged = this.haveRelevantFieldsChanged(
        latestVersion.profile_snapshot,
        profile,
        latestVersion.personality_snapshot,
        personalityData?.data?.personality_data
      );

      return relevantFieldsChanged;
    } catch (error) {
      console.error('Error checking persona regeneration:', error);
      return false;
    }
  },

  haveRelevantFieldsChanged(oldProfile: any, newProfile: any, oldPersonality: any, newPersonality: any): boolean {
    const relevantFields = [
      'fullname',
      'age',
      'location',
      'occupation',
      'relationship_history',
      'lifestyle',
      'interests'
    ];

    // Check profile changes
    const profileChanged = relevantFields.some(field => 
      JSON.stringify(oldProfile?.[field]) !== JSON.stringify(newProfile?.[field])
    );

    // Check personality data changes
    const personalityChanged = JSON.stringify(oldPersonality) !== JSON.stringify(newPersonality);

    return profileChanged || personalityChanged;
  },

  createDefaultPersonaAspect(): PersonaAspect {
    return {
      traits: [],
      examples: [],
      summary: null,
      intensity: 0
    };
  },

  async getPersonaAnalysis(userId: string): Promise<PersonaAnalysis | null> {
    try {
      // First check if user profile exists
      const profile = await this.getUserProfile(userId);
      if (!profile) {
        console.warn('User profile not found:', userId);
        return null;
      }

      // Get all persona aspects
      const { data: aspects, error } = await supabase
        .from('persona_aspects')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching persona aspects:', error);
        return null;
      }

      if (!aspects || aspects.length === 0) {
        console.log('No existing analysis found, generating new one...');
        return await this.generateAndStorePersonaAnalysis(userId);
      }

      // Transform aspects into PersonaAnalysis structure
      const positiveAspects = aspects.filter(a => a.is_positive);
      const negativeAspects = aspects.filter(a => !a.is_positive);

      const transformedAnalysis: PersonaAnalysis = {
        positivePersona: {
          personality_traits: this.transformStoredAspect(positiveAspects.find(a => a.aspect_type === 'personality_traits')),
          core_values: this.transformStoredAspect(positiveAspects.find(a => a.aspect_type === 'core_values')),
          behavioral_traits: this.transformStoredAspect(positiveAspects.find(a => a.aspect_type === 'behavioral_traits')),
          hobbies_interests: this.transformStoredAspect(positiveAspects.find(a => a.aspect_type === 'hobbies_interests'))
        },
        negativePersona: {
          emotional_aspects: this.transformStoredAspect(negativeAspects.find(a => a.aspect_type === 'emotional_aspects')),
          social_aspects: this.transformStoredAspect(negativeAspects.find(a => a.aspect_type === 'social_aspects')),
          lifestyle_aspects: this.transformStoredAspect(negativeAspects.find(a => a.aspect_type === 'lifestyle_aspects')),
          relational_aspects: this.transformStoredAspect(negativeAspects.find(a => a.aspect_type === 'relational_aspects'))
        }
      };

      return transformedAnalysis;
    } catch (error) {
      console.error('Error getting persona analysis:', error);
      return null;
    }
  },

  transformStoredAspect(aspect: any): PersonaAspect {
    if (!aspect) {
      return {
        traits: [],
        examples: [],
        summary: null,
        intensity: 0
      };
    }

    return {
      traits: Array.isArray(aspect.traits) ? aspect.traits : [],
      examples: Array.isArray(aspect.examples) ? aspect.examples : [],
      summary: aspect.summary || null,
      intensity: typeof aspect.intensity === 'number' ? aspect.intensity : 0
    };
  },

  createPersonaAspect(userId: string, aspectType: AspectType, aspect: PersonaAspect, isPositive: boolean) {
    return {
      user_id: userId,
      aspect_type: aspectType,
      traits: aspect.traits,
      examples: aspect.examples,
      summary: aspect.summary,
      intensity: aspect.intensity,
      is_positive: isPositive
    };
  },

  async getCompatibilityAnalysis(userId: string, targetUserId: string): Promise<CompatibilityScore | null> {
    try {
      // First check if we have a stored compatibility score
      const { data: storedScore } = await supabase
        .from('compatibility_scores')
        .select('*')
        .eq('user_id', userId)
        .eq('target_user_id', targetUserId)
        .single();

      if (storedScore) {
        return this.transformAIResponseToCompatibilityScore(storedScore as StoredCompatibilityScore);
      }

      // If no stored score, generate a new one
      const [userProfile, targetProfile] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserProfile(targetUserId)
      ]);

      if (!userProfile || !targetProfile) {
        console.warn('One or both profiles not found');
        return null;
      }

      const [userPersona, targetPersona] = await Promise.all([
        this.getPersonaAnalysis(userId),
        this.getPersonaAnalysis(targetUserId)
      ]);

      const compatibilityScore = await analyzeDetailedCompatibility(
        userProfile,
        targetProfile,
        userPersona && targetPersona ? {
          persona1: userPersona,
          persona2: targetPersona
        } : undefined
      );

      // Store the new compatibility score
      if (compatibilityScore) {
        const { error: storeError } = await supabase
          .from('compatibility_scores')
          .upsert({
            user_id: userId,
            target_user_id: targetUserId,
            overall_score: compatibilityScore.overall,
            emotional_score: compatibilityScore.emotional,
            intellectual_score: compatibilityScore.intellectual,
            lifestyle_score: compatibilityScore.lifestyle,
            summary: compatibilityScore.summary,
            strengths: compatibilityScore.strengths,
            challenges: compatibilityScore.challenges,
            tips: compatibilityScore.tips,
            long_term_prediction: compatibilityScore.long_term_prediction,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (storeError) {
          console.error('Error storing compatibility score:', storeError);
        }
      }

      return compatibilityScore;
    } catch (error) {
      console.error('Error getting compatibility analysis:', error);
      return null;
    }
  },

  transformAIResponseToCompatibilityScore(analysis: StoredCompatibilityScore): CompatibilityScore {
    return {
      overall: analysis.overall_score,
      emotional: analysis.emotional_score,
      intellectual: analysis.intellectual_score,
      lifestyle: analysis.lifestyle_score,
      summary: analysis.summary,
      strengths: analysis.strengths,
      challenges: analysis.challenges,
      tips: analysis.tips,
      long_term_prediction: analysis.long_term_prediction
    };
  },

  async findTopMatches(userId: string): Promise<SmartMatch[]> {
    try {
      // First try to get stored matches
      const { data: storedMatches, error: storedError } = await supabase
        .from('smart_matches')
        .select('*')
        .eq('user_id', userId)
        .order('compatibility_score', { ascending: false })
        .limit(20);

      if (storedError) {
        console.error('Error fetching stored matches:', storedError);
      }

      // Get all profiles except the user's own profile
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          user_id,
          cupid_id,
          fullname,
          age,
          location,
          occupation,
          profile_image,
          visibility_settings
        `)
        .neq('user_id', userId);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return [];
      }

      // Filter out profiles where visibility is turned off
      const visibleProfiles = (profiles || []).filter(profile => {
        if (!profile.visibility_settings) return true;
        return profile.visibility_settings.master_visibility !== false && 
               profile.visibility_settings.smart_matching_visible !== false;
      });

      // Get favorites
      const { data: favorites } = await supabase
        .from('favorite_profiles')
        .select('favorite_user_id')
        .eq('user_id', userId);

      const favoriteIds = new Set(favorites?.map(f => f.favorite_user_id) || []);

      // If we have stored matches and they're not too old, use them
      if (storedMatches && storedMatches.length > 0) {
        const oldestMatch = storedMatches.reduce((oldest, current) => {
          return new Date(current.last_updated) < new Date(oldest.last_updated) ? current : oldest;
        }, storedMatches[0]);

        // Transform stored matches into SmartMatch format
        const transformedMatches: SmartMatch[] = storedMatches
          .map(match => {
            const profile = visibleProfiles.find(p => p.user_id === match.target_user_id);
            if (!profile) return null;

            const smartMatch: SmartMatch = {
              profile: {
                id: profile.id,
                user_id: profile.user_id,
                cupid_id: profile.cupid_id,
                fullname: profile.fullname,
                age: profile.age,
                location: profile.location,
                occupation: profile.occupation,
                profile_image: profile.profile_image
              },
              compatibility_score: match.compatibility_score,
              compatibility_details: {
                strengths: match.strengths || [],
                challenges: match.challenges || [],
                tips: match.tips || [],
                long_term_prediction: match.long_term_prediction || ''
              },
              is_favorite: favoriteIds.has(profile.user_id),
              last_updated: match.last_updated
            };
            return smartMatch;
          })
          .filter((match): match is SmartMatch => match !== null);

        if (transformedMatches.length > 0) {
          return transformedMatches;
        }
      }

      // Generate new matches
      const matchPromises = visibleProfiles.map(async (profile) => {
        try {
          const compatibilityScore = await this.getCompatibilityAnalysis(userId, profile.user_id);
          if (!compatibilityScore) return null;

          // Store the match in Supabase
          const { error: insertError } = await supabase
            .from('smart_matches')
            .upsert({
              user_id: userId,
              target_user_id: profile.user_id,
              compatibility_score: compatibilityScore.overall,
              strengths: compatibilityScore.strengths,
              challenges: compatibilityScore.challenges,
              tips: compatibilityScore.tips,
              long_term_prediction: compatibilityScore.long_term_prediction,
              last_updated: new Date().toISOString()
            });

          if (insertError) {
            console.error('Error storing match:', insertError);
          }

          const match: SmartMatch = {
            profile: {
              id: profile.id,
              user_id: profile.user_id,
              cupid_id: profile.cupid_id || undefined,
              fullname: profile.fullname,
              age: profile.age,
              location: profile.location,
              occupation: profile.occupation,
              profile_image: profile.profile_image
            },
            compatibility_score: compatibilityScore.overall,
            compatibility_details: {
              strengths: compatibilityScore.strengths,
              challenges: compatibilityScore.challenges,
              tips: compatibilityScore.tips,
              long_term_prediction: compatibilityScore.long_term_prediction
            },
            is_favorite: favoriteIds.has(profile.user_id),
            last_updated: new Date().toISOString()
          };
          return match;
        } catch (error) {
          console.error(`Error getting compatibility for profile ${profile.id}:`, error);
          return null;
        }
      });

      const matches = await Promise.all(matchPromises);

      // Filter out null results, sort by compatibility score, and take top 20
      return matches
        .filter((match): match is SmartMatch => match !== null)
        .sort((a, b) => b.compatibility_score - a.compatibility_score)
        .slice(0, 20);
    } catch (error) {
      console.error('Error finding top matches:', error);
      return [];
    }
  },

  async toggleFavorite(userId: string, targetUserId: string, isFavorite: boolean): Promise<boolean> {
    try {
      if (isFavorite) {
        // Add to favorites
        const { error: insertError } = await supabase
          .from('favorite_profiles')
          .insert({
            user_id: userId,
            favorite_user_id: targetUserId,
            created_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error adding favorite:', insertError);
          return false;
        }

        // Ensure compatibility analysis is stored
        const compatibilityScore = await this.getCompatibilityAnalysis(userId, targetUserId);
        if (compatibilityScore) {
          await supabase
            .from('smart_matches')
            .upsert({
              user_id: userId,
              target_user_id: targetUserId,
              compatibility_score: compatibilityScore.overall,
              strengths: compatibilityScore.strengths,
              challenges: compatibilityScore.challenges,
              tips: compatibilityScore.tips,
              long_term_prediction: compatibilityScore.long_term_prediction,
              last_updated: new Date().toISOString()
            });
        }
      } else {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from('favorite_profiles')
          .delete()
          .eq('user_id', userId)
          .eq('favorite_user_id', targetUserId);

        if (deleteError) {
          console.error('Error removing favorite:', deleteError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  },

  async getNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  async createNotification(notification: NotificationData): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.user_id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data || {},
          read: false,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating notification:', error);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
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

      if (error) {
        console.error('Error marking notification as read:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return null;
    }
  },

  async updateNotificationPreferences(userId: string, preferences: Record<string, boolean>) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          notification_preferences: preferences
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
      console.error('Error updating notification preferences:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return null;
    }
  },

  async getFavoriteProfiles(userId: string): Promise<SmartMatch[]> {
    try {
      // Get favorite profile IDs
      const { data: favorites, error: favoritesError } = await supabase
        .from('favorite_profiles')
        .select('favorite_user_id')
        .eq('user_id', userId);

      if (favoritesError) {
        console.error('Error fetching favorites:', favoritesError);
        return [];
      }

      if (!favorites || favorites.length === 0) {
        return [];
      }

      // Get profiles for favorites
      const favoriteIds = favorites.map(f => f.favorite_user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          user_id,
          cupid_id,
          fullname,
          age,
          location,
          occupation,
          profile_image
        `)
        .in('user_id', favoriteIds);

      if (profilesError) {
        console.error('Error fetching favorite profiles:', profilesError);
        return [];
      }

      // Get stored compatibility scores
      const { data: storedMatches, error: matchesError } = await supabase
        .from('smart_matches')
        .select('*')
        .eq('user_id', userId)
        .in('target_user_id', favoriteIds);

      if (matchesError) {
        console.error('Error fetching stored matches:', matchesError);
      }

      // Create a map of stored matches for quick lookup
      const matchesMap = new Map(storedMatches?.map(m => [m.target_user_id, m]) || []);

      // Transform profiles into SmartMatch format
      const matchPromises = profiles.map(async (profile) => {
        try {
          // Check for stored compatibility data first
          const storedMatch = matchesMap.get(profile.user_id);
          let compatibilityScore;

          if (storedMatch) {
            compatibilityScore = {
              overall: storedMatch.compatibility_score,
              strengths: storedMatch.strengths,
              challenges: storedMatch.challenges,
              tips: storedMatch.tips,
              long_term_prediction: storedMatch.long_term_prediction
            };
          } else {
            // Generate and store new compatibility data
            compatibilityScore = await this.getCompatibilityAnalysis(userId, profile.user_id);
            if (compatibilityScore) {
              await supabase
                .from('smart_matches')
                .upsert({
                  user_id: userId,
                  target_user_id: profile.user_id,
                  compatibility_score: compatibilityScore.overall,
                  strengths: compatibilityScore.strengths,
                  challenges: compatibilityScore.challenges,
                  tips: compatibilityScore.tips,
                  long_term_prediction: compatibilityScore.long_term_prediction,
                  last_updated: new Date().toISOString()
                });
            }
          }

          if (!compatibilityScore) return null;

          const match: SmartMatch = {
            profile: {
              id: profile.id,
              user_id: profile.user_id,
              cupid_id: profile.cupid_id,
              fullname: profile.fullname,
              age: profile.age,
              location: profile.location,
              occupation: profile.occupation,
              profile_image: profile.profile_image
            },
            compatibility_score: compatibilityScore.overall,
            compatibility_details: {
              strengths: compatibilityScore.strengths,
              challenges: compatibilityScore.challenges,
              tips: compatibilityScore.tips,
              long_term_prediction: compatibilityScore.long_term_prediction
            },
            is_favorite: true,
            last_updated: storedMatch?.last_updated || new Date().toISOString()
          };
          return match;
        } catch (error) {
          console.error(`Error getting compatibility for profile ${profile.id}:`, error);
          return null;
        }
      });

      const matches = await Promise.all(matchPromises);

      // Filter out null results and sort by compatibility score
      return matches
        .filter((match): match is SmartMatch => match !== null)
        .sort((a, b) => b.compatibility_score - a.compatibility_score);
    } catch (error) {
      console.error('Error getting favorite profiles:', error);
      return [];
    }
  },

  async getPositivePersona(userId: string): Promise<PositivePersona | null> {
    try {
      console.log('Fetching positive persona for user:', userId);
      const { data: aspects, error } = await supabase
        .from('persona_aspects')
        .select('*')
        .eq('user_id', userId)
        .eq('is_positive', true);

      if (error) {
        console.error('Error fetching positive persona:', error);
        return null;
      }

      if (!aspects || aspects.length === 0) {
        console.log('No positive persona found');
        return null;
      }

      return {
        personality_traits: this.transformStoredAspect(aspects.find(a => a.aspect_type === 'personality_traits')),
        core_values: this.transformStoredAspect(aspects.find(a => a.aspect_type === 'core_values')),
        behavioral_traits: this.transformStoredAspect(aspects.find(a => a.aspect_type === 'behavioral_traits')),
        hobbies_interests: this.transformStoredAspect(aspects.find(a => a.aspect_type === 'hobbies_interests'))
      };
    } catch (error) {
      console.error('Error getting positive persona:', error);
      return null;
    }
  },

  async getNegativePersona(userId: string): Promise<NegativePersona | null> {
    try {
      console.log('Fetching negative persona for user:', userId);
      const { data: aspects, error } = await supabase
        .from('persona_aspects')
        .select('*')
        .eq('user_id', userId)
        .eq('is_positive', false);

      if (error) {
        console.error('Error fetching negative persona:', error);
        return null;
      }

      if (!aspects || aspects.length === 0) {
        console.log('No negative persona found');
        return null;
      }

      return {
        emotional_aspects: this.transformStoredAspect(aspects.find(a => a.aspect_type === 'emotional_aspects')),
        social_aspects: this.transformStoredAspect(aspects.find(a => a.aspect_type === 'social_aspects')),
        lifestyle_aspects: this.transformStoredAspect(aspects.find(a => a.aspect_type === 'lifestyle_aspects')),
        relational_aspects: this.transformStoredAspect(aspects.find(a => a.aspect_type === 'relational_aspects'))
      };
    } catch (error) {
      console.error('Error getting negative persona:', error);
      return null;
    }
  },

  async savePersonalityAnalysis(userId: string, data: any): Promise<boolean> {
    try {
      console.log('Saving personality analysis for user:', userId);
      
      // First get existing personality data
      const { data: existingData } = await supabase
        .from('user_profiles')
        .select('personality_data')
        .eq('user_id', userId)
        .single();

      // Update the profile with personality data
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          personality_data: data,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (profileError) {
        console.error('Error saving personality data to profile:', profileError);
        return false;
      }

      // Check if personality data changed significantly
      const personalityChanged = JSON.stringify(existingData?.personality_data) !== JSON.stringify(data);

      if (personalityChanged) {
        // Trigger persona generation in the background
        this.generateAndStorePersonaAnalysis(userId, true, 'PERSONALITY_TEST')
          .catch(error => console.error('Error generating persona after personality test:', error));
      }

      return true;
    } catch (error) {
      console.error('Error saving personality analysis:', error);
      return false;
    }
  }
};

export default profileService; 