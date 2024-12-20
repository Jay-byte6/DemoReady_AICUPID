export interface CompatibilityDetails {
  strengths: string[];
  challenges: string[];
  tips: string[];
  long_term_prediction: string;
}

export interface CompatibilityScore {
  score: number;
  insights: string[];
  details: CompatibilityDetails;
  overall?: number;
  emotional?: number;
  intellectual?: number;
  lifestyle?: number;
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
  id: string;
  user_id: string;
  cupid_id: string;
  fullname: string;
  age: number;
  location: string;
  gender: string;
  occupation: string;
  relationship_history: string;
  lifestyle: string;
  interests?: string[];
  profile_image: string | null;
  created_at: string;
  updated_at: string;
  matching_preferences?: any;
  notification_preferences?: any;
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

export interface NegativePersona {
  id?: string;
  user_id: string;
  emotional_weaknesses: {
    traits: string[];
  };
  social_weaknesses: {
    traits: string[];
  };
  lifestyle_weaknesses: {
    traits: string[];
  };
  relational_weaknesses: {
    traits: string[];
  };
  summary: string;
  created_at?: string;
  updated_at?: string;
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
  target_user?: {
    id: string;
    full_name: string;
    age?: number;
    location?: string;
    avatar_url?: string;
    interests?: string[];
  };
  compatibility_score: number;
  strengths: string[];
  challenges: string[];
  tips: string[];
  long_term_prediction: string;
  is_favorite?: boolean;
  created_at?: string;
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

export interface ChatRoom {
  room_id: string;
  participants: string[];
  created_at: string;
} 