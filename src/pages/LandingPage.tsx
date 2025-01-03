import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Heart, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGenderSelect = (gender: string) => {
    localStorage.setItem('selectedGender', gender);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-pink-500">AI CUPID</div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-pink-500">Home</a>
              <a href="#" className="text-gray-600 hover:text-pink-500">About Us</a>
              <a href="#" className="text-gray-600 hover:text-pink-500">What We Do</a>
              <button 
                onClick={() => navigate('/login')}
                className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Find your soulmate<br />
              <span className="text-pink-500">with AI precision</span>
            </h1>
            <p className="text-gray-600 mb-8">
              Our AI-powered matchmaking analyzes personality traits, behaviors, and compatibility patterns to find your perfect match with unprecedented accuracy.
            </p>
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => handleGenderSelect('male')}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold flex items-center"
              >
                I am a Man →
              </button>
              <button
                onClick={() => handleGenderSelect('female')}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold flex items-center"
              >
                I am a Woman →
              </button>
            </div>
            <a href="#how-it-works" className="text-pink-500 hover:text-pink-600">
              Learn more about how it works →
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Image grid will be added here */}
          </div>
        </div>

        {/* AI-Powered Matchmaking Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-2">AI-Powered Matchmaking</h2>
          <p className="text-center text-gray-600 mb-12">Experience the future of finding love with our cutting-edge technology</p>
          
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="mb-4">
                <Brain className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600 mb-4">Advanced algorithms process thousands of data points to find your ideal match.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-pink-500">98%</div>
                  <div className="text-sm text-gray-500">Match Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-500">10K+</div>
                  <div className="text-sm text-gray-500">Data Points</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="mb-4">
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compatibility Score</h3>
              <p className="text-gray-600 mb-4">Deep psychological profiling ensures genuine compatibility.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-pink-500">95%</div>
                  <div className="text-sm text-gray-500">Personality Match</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-500">89%</div>
                  <div className="text-sm text-gray-500">Values Alignment</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="mb-4">
                <Sparkles className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Relationship Insights</h3>
              <p className="text-gray-600 mb-4">Comprehensive analysis of relationship dynamics and potential.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-pink-500">94%</div>
                  <div className="text-sm text-gray-500">Connection Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-500">97%</div>
                  <div className="text-sm text-gray-500">Emotional Bond</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Impact Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative">
                <div className="w-24 h-24 mx-auto border-4 border-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-pink-500">98%</span>
                </div>
              </div>
              <p className="mt-4 text-gray-600">Match Success Rate</p>
            </div>
            <div className="text-center">
              <div className="relative">
                <div className="w-24 h-24 mx-auto border-4 border-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-pink-500">92%</span>
                </div>
              </div>
              <p className="mt-4 text-gray-600">Long-term Relationships</p>
            </div>
            <div className="text-center">
              <div className="relative">
                <div className="w-24 h-24 mx-auto border-4 border-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-pink-500">96%</span>
                </div>
              </div>
              <p className="mt-4 text-gray-600">User Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="relative">
                <div className="w-24 h-24 mx-auto border-4 border-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-pink-500">89%</span>
                </div>
              </div>
              <p className="mt-4 text-gray-600">First Date Success</p>
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section className="py-16 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-12">Our Technology Stack</h2>
          <div className="grid grid-cols-3 gap-8 px-8">
            <div>
              <h3 className="text-xl font-semibold text-pink-500 mb-4">AI & Machine Learning</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>Neural Networks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>Natural Language Processing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>Pattern Recognition</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>Sentiment Analysis</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-pink-500 mb-4">Psychology Integration</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>Behavioral Analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>Personality Profiling</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>Emotional Intelligence</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>Relationship Dynamics</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-pink-500 mb-4">Data Processing</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>Real-time Analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>Predictive Modeling</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>Behavioral Patterns</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>Compatibility Scoring</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-2">Success Stories</h2>
          <p className="text-center text-gray-600 mb-12">Real couples who found love through AI Cupid</p>
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Sarah & Mike, 28</h3>
                  <p className="text-gray-600">New York, NY</p>
                </div>
                <div className="text-pink-500">Together 3 years</div>
              </div>
              <p className="text-gray-600 mb-4">
                "AI Cupid's personality matching was spot on! We connected instantly over our shared love for adventure and photography. Now married for 2 years!"
              </p>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Perfect Match</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Adventure Lovers</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Married</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-lg">David & Emma, 32</h3>
                  <p className="text-gray-600">San Francisco, CA</p>
                </div>
                <div className="text-pink-500">Engaged</div>
              </div>
              <p className="text-gray-600 mb-4">
                "The AI understood our values and life goals perfectly. Now planning our wedding for next spring!"
              </p>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Value Match</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Both Lovers</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Engaged</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-lg">James & Lisa, 35</h3>
                  <p className="text-gray-600">Chicago, IL</p>
                </div>
                <div className="text-pink-500">Dating 1 year</div>
              </div>
              <p className="text-gray-600 mb-4">
                "We both work in creative fields and AI Cupid matched us based on our artistic passions. We've been inseparable since our first date."
              </p>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Creative Souls</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Artists</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Perfect Match</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Alex & Jordan, 29</h3>
                  <p className="text-gray-600">Austin, TX</p>
                </div>
                <div className="text-pink-500">Together 2 years</div>
              </div>
              <p className="text-gray-600 mb-4">
                "The compatibility analysis was incredibly accurate. We share the same values, goals, and even have matching quirky interests!"
              </p>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Shared Values</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Tech Industry</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Living Together</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Maria & Tom, 31</h3>
                  <p className="text-gray-600">Seattle, WA</p>
                </div>
                <div className="text-pink-500">Married 1 year</div>
              </div>
              <p className="text-gray-600 mb-4">
                "We were both looking for someone who shared our passion for environmental causes. AI Cupid brought us together and we're now working on sustainability projects together!"
              </p>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Eco Warriors</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Shared Mission</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Married</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Rachel & Chris, 27</h3>
                  <p className="text-gray-600">Boston, MA</p>
                </div>
                <div className="text-pink-500">Dating 8 months</div>
              </div>
              <p className="text-gray-600 mb-4">
                "As busy medical professionals, we needed a dating service that understood our schedules. AI Cupid matched us perfectly based on our lifestyle compatibility."
              </p>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Medical Field</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Busy Professionals</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Perfect Timing</span>
              </div>
            </div>
          </div>
        </section>

        {/* How AI Cupid Works Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-2">How AI Cupid Works</h2>
          <p className="text-center text-gray-600 mb-12">Four simple steps to find your perfect match</p>
          
          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">
                01
              </div>
              <h3 className="font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">Sign up and complete your detailed profile with photos and basic information.</p>
            </div>

            <div className="text-center">
              <div className="bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">
                02
              </div>
              <h3 className="font-semibold mb-2">Take the Test</h3>
              <p className="text-gray-600">Complete our comprehensive personality assessment and activity preferences.</p>
            </div>

            <div className="text-center">
              <div className="bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">
                03
              </div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">Our AI analyzes your profile, behavior, and compatibility patterns.</p>
            </div>

            <div className="text-center">
              <div className="bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">
                04
              </div>
              <h3 className="font-semibold mb-2">Meet Matches</h3>
              <p className="text-gray-600">Connect with highly compatible matches and start your journey.</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to find your perfect match?</h2>
          <h3 className="text-2xl text-pink-500 mb-8">Start your journey today.</h3>
          <div className="flex justify-center space-x-4">
            <button className="bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600">
              Get Started
            </button>
            <button className="border-2 border-pink-500 text-pink-500 px-8 py-3 rounded-full font-semibold hover:bg-pink-50">
              Learn More
            </button>
          </div>
        </section>

        {/* Why Choose AI Cupid Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-2">Why Choose AI Cupid?</h2>
          <p className="text-center text-gray-600 mb-12">Experience the perfect blend of technology and romance with our advanced AI-powered matchmaking platform</p>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-start mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-4">AI-Powered Matching</h3>
                  <p className="text-gray-600 mb-6">Our sophisticated algorithms analyze multiple dimensions of compatibility using advanced machine learning.</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto border-4 border-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-pink-500">98%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Match Accuracy</p>
                    </div>
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto border-4 border-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-pink-500">95%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">User Satisfaction</p>
                    </div>
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto border-4 border-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-pink-500">92%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Long-term Success</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-2">Key Benefits</h4>
                      <ul className="space-y-2 text-gray-600 text-sm">
                        <li>• Deep personality analysis</li>
                        <li>• Behavioral pattern matching</li>
                        <li>• Value alignment scoring</li>
                        <li>• Communication style analysis</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Technology</h4>
                      <ul className="space-y-2 text-gray-600 text-sm">
                        <li>• Neural networks for pattern recognition</li>
                        <li>• Natural language processing</li>
                        <li>• Sentiment analysis</li>
                        <li>• Machine learning optimization</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-start mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-4">Personality Analysis</h3>
                  <p className="text-gray-600 mb-6">Deep psychological insights through comprehensive psychometric testing and behavioral analysis.</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto border-4 border-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-pink-500">96%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Profile Accuracy</p>
                    </div>
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto border-4 border-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-pink-500">94%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Trait Recognition</p>
                    </div>
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto border-4 border-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-pink-500">90%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Growth Insights</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-2">Key Benefits</h4>
                      <ul className="space-y-2 text-gray-600 text-sm">
                        <li>• Comprehensive trait assessment</li>
                        <li>• Emotional intelligence mapping</li>
                        <li>• Attachment style analysis</li>
                        <li>• Growth potential identification</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Technology</h4>
                      <ul className="space-y-2 text-gray-600 text-sm">
                        <li>• Psychological models integration</li>
                        <li>• Behavioral pattern analysis</li>
                        <li>• Cognitive processing assessment</li>
                        <li>• Emotional response mapping</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-start mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-4">Activity Tracking</h3>
                  <p className="text-gray-600 mb-6">Smart lifestyle compatibility matching based on real-world behaviors and interests.</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto border-4 border-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-pink-500">93%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Interest Match</p>
                    </div>
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto border-4 border-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-pink-500">91%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Activity Sync</p>
                    </div>
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto border-4 border-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-pink-500">89%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Lifestyle Fit</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-2">Key Benefits</h4>
                      <ul className="space-y-2 text-gray-600 text-sm">
                        <li>• Real-time activity monitoring</li>
                        <li>• Interest compatibility scoring</li>
                        <li>• Lifestyle pattern analysis</li>
                        <li>• Shared experience matching</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Technology</h4>
                      <ul className="space-y-2 text-gray-600 text-sm">
                        <li>• Real-time data processing</li>
                        <li>• Activity pattern recognition</li>
                        <li>• Contextual analysis</li>
                        <li>• Behavioral clustering</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-start mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-4">Real-time Updates</h3>
                  <p className="text-gray-600 mb-6">Instant notifications and dynamic matching based on continuous learning and adaptation.</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto border-4 border-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-pink-500">97%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Response Time</p>
                    </div>
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto border-4 border-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-pink-500">94%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Update Accuracy</p>
                    </div>
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto border-4 border-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-pink-500">92%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Match Relevance</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-2">Key Benefits</h4>
                      <ul className="space-y-2 text-gray-600 text-sm">
                        <li>• Instant match notifications</li>
                        <li>• Dynamic profile updates</li>
                        <li>• Real-time compatibility adjustments</li>
                        <li>• Continuous learning system</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Technology</h4>
                      <ul className="space-y-2 text-gray-600 text-sm">
                        <li>• Real-time event processing</li>
                        <li>• Dynamic scoring algorithms</li>
                        <li>• Adaptive learning systems</li>
                        <li>• Predictive analytics</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage; 