import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  created_at: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  answers: number[];
  score: number;
  percentage: number;
  completed_at: string;
  quiz: Quiz;
}

interface Badge {
  id: string;
  user_id: string;
  badge_type: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  quiz_id: string;
  earned_at: string;
  quiz: Quiz;
}

interface QuizContextType {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  attempts: QuizAttempt[];
  badges: Badge[];
  loading: boolean;
  fetchQuizzes: () => Promise<void>;
  fetchQuiz: (id: string) => Promise<void>;
  submitQuiz: (quizId: string, answers: number[]) => Promise<{ score: number; percentage: number; badges: string[] }>;
  fetchAttempts: () => Promise<void>;
  fetchBadges: () => Promise<void>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/quizzes');
      setQuizzes(response.data.quizzes);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuiz = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/quizzes/${id}`);
      setCurrentQuiz(response.data.quiz);
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async (quizId: string, answers: number[]) => {
    try {
      const response = await axios.post(`/quizzes/${quizId}/submit`, { answers });
      const { score, percentage, badges: newBadges } = response.data;
      
      // Refresh attempts and badges
      await fetchAttempts();
      await fetchBadges();
      
      return { score, percentage, badges: newBadges };
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      throw error;
    }
  };

  const fetchAttempts = async () => {
    try {
      const response = await axios.get('/quizzes/user/attempts');
      setAttempts(response.data.attempts);
    } catch (error) {
      console.error('Failed to fetch attempts:', error);
    }
  };

  const fetchBadges = async () => {
    try {
      const response = await axios.get('/quizzes/user/badges');
      setBadges(response.data.badges);
    } catch (error) {
      console.error('Failed to fetch badges:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchQuizzes();
    fetchAttempts();
    fetchBadges();
  }, []);

  const value: QuizContextType = {
    quizzes,
    currentQuiz,
    attempts,
    badges,
    loading,
    fetchQuizzes,
    fetchQuiz,
    submitQuiz,
    fetchAttempts,
    fetchBadges,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
