export interface CompatibilityDetails {
  strengths: string[];
  challenges: string[];
  tips: string[];
  long_term_prediction: string;
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
  id?: string;
  user_id: string;
  personality_traits: {
    examples: string[];
  };
  core_values: {
    examples: string[];
  };
  behavioral_traits: {
    examples: string[];
  };
  hobbies_interests: {
    examples: string[];
  };
  summary: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id?: string;
  user_id: string;
  fullname: string;
  age: number;
  gender: string;
  location: string;
  occupation: string;
  relationship_history: string;
  lifestyle: string;
  profile_image: string | null;
  cupid_id: string;
  created_at?: string;
  updated_at?: string;
  visibility_settings?: {
    smart_matching_visible: boolean;
    profile_image_visible: boolean;
    occupation_visible: boolean;
    contact_visible: boolean;
    master_visibility: boolean;
  };
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
  traits: string[];
  examples: string[];
  summary: string | null;
  intensity?: number;
}

export interface PositivePersona {
  personality_traits: PersonaAspect;
  core_values: PersonaAspect;
  behavioral_traits: PersonaAspect;
  hobbies_interests: PersonaAspect;
}

export interface NegativePersona {
  emotional_aspects: PersonaAspect;
  social_aspects: PersonaAspect;
  lifestyle_aspects: PersonaAspect;
  relational_aspects: PersonaAspect;
}

export interface PersonaAnalysis {
  positivePersona: PositivePersona;
  negativePersona: NegativePersona;
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

export interface SmartMatchProfile {
  id: string;
  user_id: string;
  cupid_id?: string;
  fullname: string;
  age?: number;
  gender?: string;
  location?: string;
  occupation?: string;
  relationship_history?: string;
  lifestyle?: string;
  profile_image?: string | null;
  interests?: string[];
  visibility_settings?: {
    smart_matching_visible?: boolean;
    profile_image_visible?: boolean;
    occupation_visible?: boolean;
    contact_visible?: boolean;
    master_visibility?: boolean;
  };
}

export interface SmartMatch {
  id?: string;
  user_id?: string;
  profile: UserProfile;
  compatibility_score: number;
  compatibility_details: {
    summary: string;
    strengths: string[];
    challenges: string[];
    tips: string[];
    long_term_prediction: string;
  };
  request_status?: {
    persona_view: string;
    chat: string;
  };
  is_favorite?: boolean;
  last_updated?: string;
}

export interface Message {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
  sender?: {
    fullname: string;
    profile_image: string | null;
  };
}

export interface NotificationData {
  user_id: string;
  type: 'MATCH_REQUEST' | 'CHAT_REQUEST' | 'PROFILE_VIEW' | 'SYSTEM' | 'NEW_MATCH' | 'NEW_MESSAGE';
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface ChatRoom {
  room_id: string;
  participants: string[];
  created_at: string;
}

export type AspectType = 
  | 'personality_traits'
  | 'core_values'
  | 'behavioral_traits'
  | 'hobbies_interests'
  | 'emotional_aspects'
  | 'social_aspects'
  | 'lifestyle_aspects'
  | 'relational_aspects';

export interface PersonaAspectData extends PersonaAspect {
  aspect_type: AspectType;
  is_positive: boolean;
  user_id: string;
} 