export interface CompatibilityDetails {
  summary: string;
  strengths: string[];
  challenges: string[];
  tips: string[];
  long_term_prediction: string;
  emotional: number;
  intellectual: number;
  lifestyle: number;
}

export interface CompatibilityScore {
  overall: number;
  emotional: number;
  intellectual: number;
  lifestyle: number;
  summary: string;
  strengths: string[];
  challenges: string[];
  tips: string[];
  long_term_prediction: string;
}

export interface Profile {
  cupidId: string;
  personalInfo: {
    fullName: string;
    age: number;
    gender: string;
    location: string;
    occupation: string;
    relationshipHistory: string;
    lifestyle: string;
  };
  preferences: {
    interests: string[];
    minAge?: number;
    maxAge?: number;
    preferredDistance?: string;
    educationPreference?: string;
  };
  psychologicalProfile: {
    extroversion: number;
    openness: number;
    agreeableness: number;
    conscientiousness: number;
    emotionalStability: number;
    communicationStyle: string;
    conflictResolution: string;
  };
  relationshipGoals: {
    relationshipType: string;
    timeline: string;
    familyPlans: string;
    relationshipValues: string;
  };
  behavioralInsights: {
    loveLanguage: string;
    socialBattery: string;
    stressResponse: string;
    decisionMaking: string;
  };
  dealbreakers: {
    dealbreakers: string[];
    customDealbreakers?: string;
    dealbreakersFlexibility: string;
  };
  createdAt: string;
  lastUpdated: string;
}

export interface MatchedProfile extends Profile {
  compatibility: CompatibilityScore;
  image: string;
  strengths?: string[];
  challenges?: string[];
}

export interface AIPersona {
  id: string;
  traits: string[];
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  email?: string;
  profile_image?: string;
  fullname?: string;
  cupid_id?: string;
  visibility_settings?: {
    persona_visible?: boolean;
    smart_matching_visible?: boolean;
    profile_visible?: boolean;
  };
  notification_preferences?: {
    new_match?: boolean;
    new_message?: boolean;
    profile_view?: boolean;
    email_notifications?: boolean;
  };
  personality_traits?: string[];
  relationship_history?: string;
  lifestyle?: string;
  personalInfo?: any;
  preferences?: any;
  psychologicalProfile?: any;
  relationshipGoals?: any;
  behavioralInsights?: any;
  dealbreakers?: any;
}

export interface PersonaTrait {
  description: string;
  examples: string[];
  strengths: string[];
  growth_areas: string[];
}

export interface NegativePersonaTrait {
  traits: string[];
  impact_areas: string[];
  improvement_suggestions: string[];
}

export interface PersonaAspect {
  type: AspectType;
  traits: string[];
  description: string;
}

export interface PositivePersona {
  personality_traits: PersonaAspect;
  core_values: PersonaAspect;
  behavioral_traits: PersonaAspect;
  hobbies_interests: PersonaAspect;
}

export interface NegativePersona {
  id: string;
  traits: string[];
  description: string;
}

export interface PersonaAnalysis {
  id: string;
  aspects: PersonaAspect[];
}

export interface MatchRequest {
  id: string;
  requester_id: string;
  target_id: string;
  request_type: 'PERSONA_VIEW' | 'CHAT';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  created_at: string;
  updated_at: string;
}

export interface FavoriteProfile {
  id: string;
  user_id: string;
  favorite_user_id: string;
  created_at: string;
  profile?: UserProfile;
  compatibility_insights?: {
    id: string;
    compatibility_score: number;
    summary: string;
    long_term_prediction: string;
    strengths: string[];
    challenges: string[];
    individual_challenges: {
      user_challenges: string[];
      target_challenges: string[];
    };
    improvement_tips: string[];
    last_generated_at: string;
    needs_update: boolean;
  };
}

export interface CompatibilityInsight {
  id: string;
  user_id: string;
  target_user_id: string;
  compatibility_score: number;
  summary: string;
  long_term_prediction: string;
  strengths: string[];
  challenges: string[];
  individual_challenges: {
    user_challenges: string[];
    target_challenges: string[];
  };
  improvement_tips: string[];
  last_generated_at: string;
  needs_update: boolean;
  created_at: string;
  updated_at: string;
}

export interface RelationshipInsight {
  id: string;
  user_id: string;
  partner_id: string;
  status: 'VIEWING' | 'CHATTING' | 'DATING' | 'ENDED';
  compatibility_score: number;
  interaction_metrics: {
    chat_frequency: number;
    response_time: number;
    engagement_level: number;
  };
  created_at: string;
  updated_at: string;
}

export interface SmartMatch {
  id: string;
  user_id: string;
  match_id: string;
  compatibility_score: number;
  compatibility_details: CompatibilityDetails;
  profile: SmartMatchProfile;
  status: string;
}

export interface SmartMatchProfile extends UserProfile {
  compatibility_score?: number;
  match_status?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
}

export interface NotificationData {
  id: string;
  user_id: string;
  type: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface ChatRoom {
  room_id: string;
  participants: string[];
  created_at: string;
}

export type AspectType = 'emotional' | 'intellectual' | 'social' | 'behavioral';

export interface PersonaAspectData extends PersonaAspect {
  aspect_type: AspectType;
  is_positive: boolean;
  user_id: string;
}

export interface ProfileSections {
  personalInfo: Record<string, any>;
  preferences: Record<string, any>;
  psychologicalProfile: Record<string, any>;
  relationshipGoals: Record<string, any>;
  behavioralInsights: Record<string, any>;
  dealbreakers: Record<string, any>;
}

export interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp?: string;
} 