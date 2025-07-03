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
    // 1. Personality
    {
      id: 1,
      category: 'Personality',
      question: 'I enjoy taking on leadership roles',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 2,
      category: 'Personality',
      question: 'I am comfortable with uncertainty and change',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    // 2. Learning Style
    {
      id: 3,
      category: 'Learning Style',
      question: 'I learn best through visual aids and diagrams',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 4,
      category: 'Learning Style',
      question: 'I prefer hands-on learning experiences',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    // 3. Career Interests
    {
      id: 5,
      category: 'Career Interests',
      question: 'Which activity sounds most appealing?',
      options: ['Designing a new product', 'Leading a team project', 'Conducting research', 'Performing for an audience', 'Teaching others'],
      type: 'single'
    },
    {
      id: 6,
      category: 'Career Interests',
      question: 'I am interested in careers that involve technology and innovation',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    // 4. Cognitive Abilities
    {
      id: 7,
      category: 'Cognitive Abilities',
      question: 'I excel at creative problem-solving',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 8,
      category: 'Cognitive Abilities',
      question: 'I have strong analytical and logical thinking skills',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 9,
      category: 'Cognitive Abilities',
      question: 'I am good at recognizing patterns and connections',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    // 5. Emotional Intelligence
    {
      id: 10,
      category: 'Emotional Intelligence',
      question: 'I am aware of my own emotions and their impact on others',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 11,
      category: 'Emotional Intelligence',
      question: 'I can easily understand others\' emotions and perspectives',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    // More learning style/career/cognitive/emotional/personality
    {
      id: 12,
      category: 'Learning Style',
      question: 'I learn better when I can teach others what I\'ve learned',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 13,
      category: 'Career Interests',
      question: 'I am interested in careers that involve helping people',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 14,
      category: 'Personality',
      question: 'I am motivated by competition',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
    {
      id: 15,
      category: 'Cognitive Abilities',
      question: 'I excel at multitasking and managing multiple projects',
      options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      type: 'scale'
    },
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
    // Simple scoring algorithm for 8 questions
    let leadership = 0;
    let visual = 0;
    let handsOn = 0;
    let creative = 0;
    let analytical = 0;
    let techInterest = 0;
    let emotional = 0;
    let preferredActivity = '';

    Object.entries(answers).forEach(([questionId, answer]) => {
      const qId = parseInt(questionId);
      const value = typeof answer === 'string' ? 
        (answer.includes('Strongly Agree') ? 5 : 
         answer.includes('Agree') ? 4 : 
         answer.includes('Neutral') ? 3 : 
         answer.includes('Disagree') ? 2 : 1) : 3;
      switch (qId) {
        case 1: leadership = value; break;
        case 2: visual = value; break;
        case 3: preferredActivity = answer; break;
        case 4: creative = value; break;
        case 5: emotional = value; break;
        case 6: handsOn = value; break;
        case 7: techInterest = value; break;
        case 8: analytical = value; break;
      }
    });

    // Strengths
    const strengths = [];
    if (leadership >= 4) strengths.push('Leadership');
    if (visual >= 4) strengths.push('Visual Learning');
    if (handsOn >= 4) strengths.push('Hands-on Learning');
    if (creative >= 4) strengths.push('Creative Problem Solving');
    if (analytical >= 4) strengths.push('Analytical Thinking');
    if (emotional >= 4) strengths.push('Emotional Intelligence');
    if (techInterest >= 4) strengths.push('Tech Interest');

    // Recommendations
    const recommendations = [];
    if (leadership >= 4) recommendations.push('Consider leading group projects or clubs.');
    if (visual >= 4) recommendations.push('Use diagrams and visual aids in your studies.');
    if (handsOn >= 4) recommendations.push('Engage in hands-on projects and experiments.');
    if (creative >= 4) recommendations.push('Pursue creative challenges and competitions.');
    if (analytical >= 4) recommendations.push('Explore STEM fields and logic puzzles.');
    if (techInterest >= 4) recommendations.push('Look into coding, robotics, or tech clubs.');
    if (emotional >= 4) recommendations.push('Mentor or support peers in your community.');

    // Learning Style
    let learningStyle = 'Balanced';
    if (visual >= 4 && handsOn >= 4) learningStyle = 'Visual & Hands-on';
    else if (visual >= 4) learningStyle = 'Visual';
    else if (handsOn >= 4) learningStyle = 'Hands-on';

    // Career Suggestions
    const careerSuggestions = [];
    if (techInterest >= 4) careerSuggestions.push('Software Engineering', 'Product Design', 'Robotics');
    if (creative >= 4) careerSuggestions.push('Product Design', 'Entrepreneur', 'Artist');
    if (analytical >= 4) careerSuggestions.push('Research Scientist', 'Engineer', 'Data Analyst');
    if (leadership >= 4) careerSuggestions.push('Team Lead', 'Project Manager');
    if (preferredActivity) careerSuggestions.push(preferredActivity);

    // Personality Type
    let personalityType = 'Well-rounded';
    if (leadership >= 4 && creative >= 4) personalityType = 'Creative Leader';
    else if (analytical >= 4 && techInterest >= 4) personalityType = 'Analytical Technologist';
    else if (emotional >= 4) personalityType = 'Empathetic Communicator';

    return {
      strengths: strengths.length ? strengths : ['Curiosity'],
      recommendations: recommendations.length ? recommendations : ['Explore a variety of learning opportunities.'],
      learningStyle,
      careerSuggestions: careerSuggestions.length ? careerSuggestions : ['Explore different fields to find your passion.'],
      personalityType
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
              Your personalized report has been generated. You can view your recommendations and answers in your profile.
            </p>
            <Button size="lg" onClick={() => navigate('/profile')}>
              Go to Profile
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="mt-10 text-left max-w-2xl mx-auto">
              <PsychometricReportDisplay answers={answers} questions={questions} report={generateReport(answers)} />
            </div>
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

function PsychometricReportDisplay({ answers, questions, report }: { answers: Record<number, any>, questions: Question[], report: any }) {
  const [showAnswers, setShowAnswers] = useState(false);
  return (
    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg mt-8">
      <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-4">Your Personalized Recommendations</h3>
      <div className="mb-2 text-purple-700 dark:text-purple-300">
        <span className="font-medium">Strengths:</span>
        <ul className="list-disc ml-6 text-purple-700 dark:text-purple-300">
          {report.strengths.map((s: string, i: number) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
      <div className="mb-2 text-purple-700 dark:text-purple-300">
        <span className="font-medium">Recommendations:</span>
        <ul className="list-disc ml-6 text-purple-700 dark:text-purple-300">
          {report.recommendations.map((r: string, i: number) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
      <div className="mb-2 text-purple-700 dark:text-purple-300">
        <span className="font-medium">Learning Style:</span> {report.learningStyle}
      </div>
      <div className="mb-2 text-purple-700 dark:text-purple-300">
        <span className="font-medium">Career Suggestions:</span>
        <ul className="list-disc ml-6 text-purple-700 dark:text-purple-300">
          {report.careerSuggestions.map((c: string, i: number) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
      <div className="mb-2 text-purple-700 dark:text-purple-300">
        <span className="font-medium">Personality Type:</span> {report.personalityType}
      </div>
      <div className="mt-6">
        <Button variant="outline" onClick={() => setShowAnswers(v => !v)}>
          {showAnswers ? 'Hide Answers' : 'Show My Answers'}
        </Button>
        {showAnswers && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">Your Answers by Question</h4>
            <ul className="space-y-2 text-purple-700 dark:text-purple-300">
              {questions.map(q => (
                <li key={q.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 text-purple-700 dark:text-purple-300">
                  <div className="font-medium">{q.question}</div>
                  <div>Your answer: <span className="font-semibold">{answers[q.id] ?? <span className="italic">No answer</span>}</span></div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}