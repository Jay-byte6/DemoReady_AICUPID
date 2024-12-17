import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import PersonalInfo from '../components/analysis/PersonalInfo';
import Preferences from '../components/analysis/Preferences';
import PsychologicalProfile from '../components/analysis/PsychologicalProfile';
import RelationshipGoals from '../components/analysis/RelationshipGoals';
import BehavioralInsights from '../components/analysis/BehavioralInsights';
import Dealbreakers from '../components/analysis/Dealbreakers';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/supabaseService';

const steps = [
  { id: 1, name: 'Personal Information', key: 'personalInfo' },
  { id: 2, name: 'Preferences', key: 'preferences' },
  { id: 3, name: 'Psychological Profile', key: 'psychologicalProfile' },
  { id: 4, name: 'Relationship Goals', key: 'relationshipGoals' },
  { id: 5, name: 'Behavioral Insights', key: 'behavioralInsights' },
  { id: 6, name: 'Dealbreakers', key: 'dealbreakers' }
];

const PersonalityAnalysis = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    personalInfo: {},
    preferences: {},
    psychologicalProfile: {},
    relationshipGoals: {},
    behavioralInsights: {},
    dealbreakers: {}
  });

  // Load existing data when component mounts
  useEffect(() => {
    const loadExistingData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        // Load user profile
        const userProfile = await profileService.getUserProfile(user.id);
        if (userProfile) {
          setFormData(prev => ({
            ...prev,
            personalInfo: userProfile
          }));
        }

        // Load personality analysis
        const analysis = await profileService.getPersonalityAnalysis(user.id);
        if (analysis) {
          setFormData(prev => ({
            ...prev,
            preferences: analysis.preferences || {},
            psychologicalProfile: analysis.psychological_profile || {},
            relationshipGoals: analysis.relationship_goals || {},
            behavioralInsights: analysis.behavioral_insights || {},
            dealbreakers: analysis.dealbreakers || {}
          }));
        }
      } catch (err: any) {
        console.error('Error loading data:', err);
        setError('Failed to load your profile data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingData();
  }, [user]);

  const validateCurrentSection = () => {
    const currentSection = steps[currentStep - 1];
    const sectionData = formData[currentSection.key as keyof typeof formData];
    
    if (!sectionData || Object.keys(sectionData).length === 0) {
      setError(`Please complete all fields in ${currentSection.name}`);
      return false;
    }
    return true;
  };

  const saveCurrentSection = async () => {
    if (!user) return false;

    try {
      setIsSaving(true);
      setError(null);

      const currentSection = steps[currentStep - 1];

      if (currentSection.key === 'personalInfo') {
        // Update user profile
        await profileService.updateUserProfile(user.id, {
          ...formData.personalInfo,
          updated_at: new Date().toISOString()
        });
      } else {
        // Save current section to personality analysis
        const analysisData: any = {};
        const dbKey = currentSection.key === 'psychologicalProfile' 
          ? 'psychological_profile' 
          : currentSection.key === 'relationshipGoals'
          ? 'relationship_goals'
          : currentSection.key === 'behavioralInsights'
          ? 'behavioral_insights'
          : currentSection.key;
        
        analysisData[dbKey] = formData[currentSection.key as keyof typeof formData];

        await profileService.savePersonalityAnalysis(user.id, {
          ...analysisData,
          updated_at: new Date().toISOString()
        });
      }

      return true;
    } catch (err: any) {
      console.error('Error saving section:', err);
      setError(err.message || 'Failed to save your data. Please try again.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    if (!validateCurrentSection()) return;

    // Save current section data
    const saved = await saveCurrentSection();
    if (!saved) return;

    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    setError(null);
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to submit your profile');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);

      // Validate current section
      if (!validateCurrentSection()) {
        return;
      }

      // Save final section
      const saved = await saveCurrentSection();
      if (!saved) return;

      // Navigate to smart matching
      navigate('/smart-matching');
    } catch (error: any) {
      console.error('Submission error:', error);
      setError(error.message || 'Error saving profile. Please try again.');
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
    setError(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfo data={formData.personalInfo} updateData={(data) => updateFormData('personalInfo', data)} />;
      case 2:
        return <Preferences data={formData.preferences} updateData={(data) => updateFormData('preferences', data)} />;
      case 3:
        return <PsychologicalProfile data={formData.psychologicalProfile} updateData={(data) => updateFormData('psychologicalProfile', data)} />;
      case 4:
        return <RelationshipGoals data={formData.relationshipGoals} updateData={(data) => updateFormData('relationshipGoals', data)} />;
      case 5:
        return <BehavioralInsights data={formData.behavioralInsights} updateData={(data) => updateFormData('behavioralInsights', data)} />;
      case 6:
        return <Dealbreakers data={formData.dealbreakers} updateData={(data) => updateFormData('dealbreakers', data)} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Personality Analysis</h1>
        <p className="text-gray-600">Complete this comprehensive assessment to find your perfect match</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.id < currentStep
                    ? 'bg-green-500 text-white'
                    : step.id === currentStep
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              {step.id !== steps.length && (
                <div
                  className={`h-1 w-12 md:w-24 ${
                    step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          {steps.map((step) => (
            <div key={step.id} className="w-24 text-center">
              {step.name}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1 || isSaving}
          className={`flex items-center px-6 py-3 rounded-lg ${
            currentStep === 1 || isSaving
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </button>
        
        {currentStep === steps.length ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isSaving}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
            <Check className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={isSaving}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isSaving ? 'Saving...' : 'Next'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PersonalityAnalysis;