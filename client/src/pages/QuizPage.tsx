import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuiz } from '../contexts/QuizContext';
import { 
  FaArrowLeft, 
  FaCheck, 
  FaTimes, 
  FaTrophy, 
  FaStar,
  FaClock,
  FaQuestionCircle
} from 'react-icons/fa';

const QuizContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 2rem;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  padding: 0.75rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.surfaceLight};
    transform: translateX(-3px);
  }
`;

const QuizTitle = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const QuizDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

const ProgressBar = styled.div`
  background: ${props => props.theme.colors.surfaceLight};
  border-radius: ${props => props.theme.borderRadius.full};
  height: 8px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  background: ${props => props.theme.colors.gradient};
  height: 100%;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const QuestionCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.lg};
  margin-bottom: 2rem;
`;

const QuestionNumber = styled.div`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuestionText = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 2rem;
  line-height: 1.4;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionButton = styled.button<{ selected?: boolean; correct?: boolean; wrong?: boolean }>`
  background: ${props => {
    if (props.correct) return props.theme.colors.success + '20';
    if (props.wrong) return props.theme.colors.error + '20';
    if (props.selected) return props.theme.colors.primary + '20';
    return props.theme.colors.surfaceLight;
  }};
  border: 2px solid ${props => {
    if (props.correct) return props.theme.colors.success;
    if (props.wrong) return props.theme.colors.error;
    if (props.selected) return props.theme.colors.primary;
    return props.theme.colors.border;
  }};
  color: ${props => {
    if (props.correct) return props.theme.colors.success;
    if (props.wrong) return props.theme.colors.error;
    return props.theme.colors.text;
  }};
  padding: 1rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const OptionIcon = styled.div<{ correct?: boolean; wrong?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => {
    if (props.correct) return props.theme.colors.success;
    if (props.wrong) return props.theme.colors.error;
    return props.theme.colors.border;
  }};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
`;

const SubmitButton = styled.button`
  background: ${props => props.theme.colors.gradient};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ResultCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.xl};
`;

const ResultIcon = styled.div<{ score: number }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${props => {
    if (props.score >= 90) return props.theme.colors.success;
    if (props.score >= 70) return props.theme.colors.info;
    if (props.score >= 50) return props.theme.colors.warning;
    return props.theme.colors.error;
  }};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
`;

const ResultTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const ResultScore = styled.div`
  font-size: 3rem;
  font-weight: 700;
  background: ${props => props.theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
`;

const ResultDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

const BadgeEarned = styled.div`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-weight: 600;
  margin-bottom: 1rem;
  display: inline-block;
`;

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentQuiz, submitQuiz, fetchQuiz } = useQuiz();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    percentage: number;
    badges: string[];
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchQuiz(id);
    }
  }, [id, fetchQuiz]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (currentQuiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!currentQuiz) return;
    
    setSubmitting(true);
    try {
      const result = await submitQuiz(currentQuiz.id, selectedAnswers);
      setResult(result);
      setShowResult(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseResult = () => {
    setShowResult(false);
    navigate('/dashboard');
  };

  if (!currentQuiz) {
    return (
      <QuizContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h2>Loading Quiz...</h2>
          </div>
        </Container>
      </QuizContainer>
    );
  }

  const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100;
  const currentQ = currentQuiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === currentQuiz.questions.length - 1;
  const canSubmit = selectedAnswers.length === currentQuiz.questions.length;

  return (
    <QuizContainer>
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/dashboard')}>
            <FaArrowLeft />
            Back to Dashboard
          </BackButton>
          <div>
            <QuizTitle>{currentQuiz.title}</QuizTitle>
            <QuizDescription>{currentQuiz.description}</QuizDescription>
          </div>
        </Header>

        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>

        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionNumber>
              <FaQuestionCircle />
              Question {currentQuestion + 1} of {currentQuiz.questions.length}
            </QuestionNumber>
            
            <QuestionText>{currentQ.question}</QuestionText>
            
            <OptionsList>
              {currentQ.options.map((option, index) => (
                <OptionButton
                  key={index}
                  selected={selectedAnswers[currentQuestion] === index}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <OptionIcon>
                    {String.fromCharCode(65 + index)}
                  </OptionIcon>
                  {option}
                </OptionButton>
              ))}
            </OptionsList>
          </QuestionCard>
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            style={{
              background: 'transparent',
              border: '1px solid #333',
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
              opacity: currentQuestion === 0 ? 0.5 : 1,
            }}
          >
            Previous
          </button>

          {isLastQuestion ? (
            <SubmitButton
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
            >
              <FaTrophy />
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </SubmitButton>
          ) : (
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              style={{
                background: '#00ff88',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: selectedAnswers[currentQuestion] === undefined ? 'not-allowed' : 'pointer',
                opacity: selectedAnswers[currentQuestion] === undefined ? 0.5 : 1,
              }}
            >
              Next
            </button>
          )}
        </div>

        <AnimatePresence>
          {showResult && result && (
            <ResultModal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseResult}
            >
              <ResultCard
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ResultIcon score={result.percentage}>
                  <FaTrophy />
                </ResultIcon>
                
                <ResultTitle>
                  {result.percentage >= 90 ? 'Excellent!' :
                   result.percentage >= 70 ? 'Great Job!' :
                   result.percentage >= 50 ? 'Good Work!' : 'Keep Learning!'}
                </ResultTitle>
                
                <ResultScore>{result.percentage}%</ResultScore>
                
                <ResultDescription>
                  You scored {result.score} out of {currentQuiz.questions.length} questions correctly.
                </ResultDescription>

                {result.badges.length > 0 && (
                  <BadgeEarned>
                    🏆 New Badge Earned: {result.badges[0]}
                  </BadgeEarned>
                )}

                <SubmitButton onClick={handleCloseResult}>
                  Continue
                </SubmitButton>
              </ResultCard>
            </ResultModal>
          )}
        </AnimatePresence>
      </Container>
    </QuizContainer>
  );
};

export default QuizPage;
