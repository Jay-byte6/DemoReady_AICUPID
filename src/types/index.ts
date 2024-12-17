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
  details: CompatibilityDetails;
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
  fullname: string | null;
  age: number | null;
  gender: string | null;
  location: string | null;
  occupation: string | null;
  relationship_history: string | null;
  lifestyle: string | null;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
  persona?: AIPersona;
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
  profile: UserProfile;
  compatibility_score: number;
  compatibility_details: CompatibilityDetails;
  request_status?: {
    persona_view: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
    chat: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  };
  is_favorite: boolean;
}

export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
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