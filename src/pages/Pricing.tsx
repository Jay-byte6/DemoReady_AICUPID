import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingTier = ({ 
  name, 
  price, 
  features, 
  accuracy, 
  recommended = false 
}: { 
  name: string; 
  price: string; 
  features: string[]; 
  accuracy: string;
  recommended?: boolean;
}) => (
  <div className={`relative bg-white rounded-2xl shadow-xl ${recommended ? 'border-2 border-pink-500' : ''}`}>
    {recommended && (
      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
        <span className="bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Most Popular
        </span>
      </div>
    )}
    <div className="p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
      <div className="flex items-baseline text-gray-900">
        <span className="text-5xl font-extrabold tracking-tight">{price}</span>
        {price !== 'Free' && <span className="ml-1 text-2xl font-medium">/month</span>}
      </div>
      <p className="mt-4 text-sm text-gray-500">AI Matching Accuracy: {accuracy}</p>
      <ul className="mt-6 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex space-x-3">
            <Check className="h-5 w-5 text-pink-500" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/signup"
        className={`mt-8 block w-full py-3 px-6 rounded-lg text-center font-medium ${
          recommended
            ? 'bg-pink-600 text-white hover:bg-pink-700'
            : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
        }`}
      >
        Get Started
      </Link>
    </div>
  </div>
);

const Pricing = () => {
  const tiers = [
    {
      name: "Cupid's Arrow",
      price: "Free",
      accuracy: "75% Accuracy",
      features: [
        "Basic profile creation",
        "5 matches per day",
        "Basic compatibility score",
        "Basic chat functionality",
        "View public profiles",
        "Limited personality insights"
      ]
    },
    {
      name: "Love Oracle",
      price: "$14.99",
      accuracy: "85% Accuracy",
      features: [
        "Unlimited matches",
        "Enhanced compatibility analysis",
        "Talk to Cupid AI advisor",
        "Cross-hypothetical questions",
        "Read receipts in chat",
        "Hide online status",
        "See who liked your profile"
      ],
      recommended: true
    },
    {
      name: "Soulmate Seeker",
      price: "$29.99",
      accuracy: "92% Accuracy",
      features: [
        "Advanced AI personality insights",
        "Horoscope compatibility analysis",
        "Social media personality analysis",
        "Detailed compatibility reports",
        "Video chat capability",
        "Advanced matching filters",
        "Profile boost (2x visibility)"
      ]
    },
    {
      name: "Divine Match",
      price: "$49.99",
      accuracy: "98% Accuracy",
      features: [
        "Ultra-precise matching algorithm",
        "Dedicated AI relationship counselor",
        "Exclusive singles events access",
        "Verified profile badge",
        "Custom AI matchmaking",
        "Professional profile writing",
        "Personal relationship manager"
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-b from-pink-50 to-white py-24 px-4 sm:px-6 lg:px-8 mt-16 ml-64">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Choose Your Perfect Match Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Find your soulmate with our AI-powered matching plans
          </p>
        </div>
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <PricingTier key={tier.name} {...tier} />
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            All plans include 24/7 support and a 30-day satisfaction guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 