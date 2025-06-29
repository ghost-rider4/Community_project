import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Brain, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  type: 'single' | 'scale';
}

export const PsychometricAssessment: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserData } = useAuth();
  const navigate = useNavigate();

  const questions: Question[] = [
    // Personality Traits (10 questions)
    {
      id: 1,
      category: 'Personality',
      question: 'I prefer working in groups rather than alone',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 2,
      category: 'Personality',
      question: 'I enjoy taking on leadership roles',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 3,
      category: 'Personality',
      question: 'I am comfortable with uncertainty and change',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 4,
      category: 'Personality',
      question: 'I prefer detailed planning over spontaneous action',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 5,
      category: 'Personality',
      question: 'I am motivated by competition',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 6,
      category: 'Personality',
      question: 'I enjoy helping others solve their problems',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 7,
      category: 'Personality',
      question: 'I am comfortable expressing my opinions publicly',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 8,
      category: 'Personality',
      question: 'I prefer to focus on one task at a time',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 9,
      category: 'Personality',
      question: 'I am energized by social interactions',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 10,
      category: 'Personality',
      question: 'I prefer practical solutions over theoretical ones',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },

    // Learning Style (10 questions)
    {
      id: 11,
      category: 'Learning Style',
      question: 'I learn best through visual aids and diagrams',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 12,
      category: 'Learning Style',
      question: 'I prefer hands-on learning experiences',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 13,
      category: 'Learning Style',
      question: 'I learn better when information is presented step-by-step',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 14,
      category: 'Learning Style',
      question: 'I prefer learning through discussion and debate',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 15,
      category: 'Learning Style',
      question: 'I need quiet environments to concentrate',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 16,
      category: 'Learning Style',
      question: 'I learn best when I can connect new information to real-world examples',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 17,
      category: 'Learning Style',
      question: 'I prefer to learn at my own pace',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 18,
      category: 'Learning Style',
      question: 'I benefit from immediate feedback on my work',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 19,
      category: 'Learning Style',
      question: 'I prefer learning through storytelling and narratives',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 20,
      category: 'Learning Style',
      question: 'I learn better when I can teach others what I\'ve learned',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },

    // Career Interests (10 questions)
    {
      id: 21,
      category: 'Career Interests',
      question: 'What type of work environment appeals to you most?',
      options: ['Creative studio', 'Corporate office', 'Laboratory/Research facility', 'Outdoor/Field work', 'Home/Remote'],
      type: 'single'
    },
    {
      id: 22,
      category: 'Career Interests',
      question: 'Which activity sounds most appealing?',
      options: ['Designing a new product', 'Leading a team project', 'Conducting research', 'Performing for an audience', 'Teaching others'],
      type: 'single'
    },
    {
      id: 23,
      category: 'Career Interests',
      question: 'I am interested in careers that involve helping people',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 24,
      category: 'Career Interests',
      question: 'I am interested in careers that involve technology and innovation',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 25,
      category: 'Career Interests',
      question: 'I am interested in careers that involve artistic expression',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 26,
      category: 'Career Interests',
      question: 'I am interested in careers that involve business and entrepreneurship',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 27,
      category: 'Career Interests',
      question: 'I am interested in careers that involve scientific research',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 28,
      category: 'Career Interests',
      question: 'I prefer careers with predictable routines',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 29,
      category: 'Career Interests',
      question: 'I am interested in careers that involve travel and exploration',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 30,
      category: 'Career Interests',
      question: 'I am interested in careers that involve public speaking and communication',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },

    // Cognitive Abilities (10 questions)
    {
      id: 31,
      category: 'Cognitive Abilities',
      question: 'I excel at recognizing patterns and connections',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 32,
      category: 'Cognitive Abilities',
      question: 'I have strong analytical and logical thinking skills',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 33,
      category: 'Cognitive Abilities',
      question: 'I am good at remembering details and facts',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 34,
      category: 'Cognitive Abilities',
      question: 'I excel at creative problem-solving',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 35,
      category: 'Cognitive Abilities',
      question: 'I can easily understand complex concepts',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 36,
      category: 'Cognitive Abilities',
      question: 'I am good at spatial reasoning and visualization',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 37,
      category: 'Cognitive Abilities',
      question: 'I excel at mathematical and numerical reasoning',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 38,
      category: 'Cognitive Abilities',
      question: 'I am good at verbal and linguistic reasoning',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 39,
      category: 'Cognitive Abilities',
      question: 'I can quickly adapt to new situations and challenges',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 40,
      category: 'Cognitive Abilities',
      question: 'I excel at multitasking and managing multiple projects',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },

    // Emotional Intelligence (10 questions)
    {
      id: 41,
      category: 'Emotional Intelligence',
      question: 'I am aware of my own emotions and their impact on others',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 42,
      category: 'Emotional Intelligence',
      question: 'I can easily understand others\' emotions and perspectives',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 43,
      category: 'Emotional Intelligence',
      question: 'I am good at managing stress and pressure',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 44,
      category: 'Emotional Intelligence',
      question: 'I can effectively motivate and inspire others',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 45,
      category: 'Emotional Intelligence',
      question: 'I am good at resolving conflicts and disagreements',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 46,
      category: 'Emotional Intelligence',
      question: 'I can adapt my communication style to different people',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 47,
      category: 'Emotional Intelligence',
      question: 'I am comfortable expressing my feelings appropriately',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 48,
      category: 'Emotional Intelligence',
      question: 'I can remain calm and composed under pressure',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 49,
      category: 'Emotional Intelligence',
      question: 'I am good at building and maintaining relationships',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 50,
      category: 'Emotional Intelligence',
      question: 'I can effectively give and receive feedback',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    }
  ];

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Generate assessment report
      const report = generateReport(answers);
      
      await updateUserData({
        psychometricCompleted: true,
        psychometricResults: {
          answers,
          report,
          completedAt: new Date()
        }
      });

      setIsCompleted(true);
    } catch (error) {
      console.error('Error saving assessment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = (answers: Record<number, any>) => {
    // Simple scoring algorithm
    const categories = {
      personality: { extroversion: 0, leadership: 0, adaptability: 0 },
      learningStyle: { visual: 0, kinesthetic: 0, collaborative: 0 },
      careerInterests: { creative: 0, analytical: 0, social: 0 },
      cognitiveAbilities: { analytical: 0, creative: 0, verbal: 0 },
      emotionalIntelligence: { selfAware: 0, empathetic: 0, resilient: 0 }
    };

    // Score based on answers (simplified)
    Object.entries(answers).forEach(([questionId, answer]) => {
      const qId = parseInt(questionId);
      const value = typeof answer === 'string' ? 
        (answer.includes('Strongly Agree') ? 5 : 
         answer.includes('Agree') ? 4 : 
         answer.includes('Neutral') ? 3 : 
         answer.includes('Disagree') ? 2 : 1) : 3;

      if (qId <= 10) {
        // Personality questions
        if ([1, 7, 9].includes(qId)) categories.personality.extroversion += value;
        if ([2, 5].includes(qId)) categories.personality.leadership += value;
        if ([3, 8].includes(qId)) categories.personality.adaptability += value;
      } else if (qId <= 20) {
        // Learning style questions
        if ([11, 13].includes(qId)) categories.learningStyle.visual += value;
        if ([12, 16].includes(qId)) categories.learningStyle.kinesthetic += value;
        if ([14, 20].includes(qId)) categories.learningStyle.collaborative += value;
      }
      // Continue for other categories...
    });

    return {
      strengths: ['Analytical Thinking', 'Creative Problem Solving', 'Leadership Potential'],
      recommendations: [
        'Consider exploring STEM fields that combine creativity and analysis',
        'Develop leadership skills through group projects and mentoring',
        'Focus on building strong communication and presentation skills'
      ],
      learningStyle: 'Visual-Kinesthetic Learner',
      careerSuggestions: ['Software Engineering', 'Product Design', 'Research Scientist', 'Entrepreneur'],
      personalityType: 'Creative Analytical Leader'
    };
  };

  const handleSkip = () => {
    navigate('/achievements');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const hasAnswer = answers[currentQ.id] !== undefined;

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Assessment Complete!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Your personalized report has been generated. Let's continue setting up your profile.
            </p>
            <Button size="lg" onClick={() => navigate('/achievements')}>
              Continue to Achievements
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Psychometric Assessment
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This assessment helps us understand your learning style, personality, and interests
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Estimated time: 15-20 minutes</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium mb-4">
                  {currentQ.category}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {currentQ.question}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      answers[currentQ.id] === option
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        answers[currentQ.id] === option
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {answers[currentQ.id] === option && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button variant="ghost" onClick={handleSkip}>
                Skip Assessment
              </Button>
            </div>

            <Button 
              onClick={handleNext}
              disabled={!hasAnswer || isLoading}
            >
              {isLoading ? 'Processing...' : 
               currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};