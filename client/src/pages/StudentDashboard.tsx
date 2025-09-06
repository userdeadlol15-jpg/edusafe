import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useQuiz } from '../contexts/QuizContext';
import { useVideo } from '../contexts/VideoContext';
import { 
  FaTrophy, 
  FaPlay, 
  FaCalendarAlt, 
  FaPhone, 
  FaGraduationCap,
  FaChartLine,
  FaFire,
  FaShieldAlt,
  FaExclamationTriangle
} from 'react-icons/fa';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 2rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 3rem;
`;

const WelcomeText = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: ${props => props.theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const StatIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.color}20;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const Section = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CardIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.color}20;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const CardTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const CardButton = styled.button`
  background: ${props => props.theme.colors.gradient};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Badge = styled.div<{ type: string }>`
  background: ${props => {
    switch (props.type) {
      case 'expert': return props.theme.colors.success;
      case 'advanced': return props.theme.colors.info;
      case 'intermediate': return props.theme.colors.warning;
      default: return props.theme.colors.textMuted;
    }
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { quizzes, attempts, badges, fetchQuizzes, fetchAttempts, fetchBadges } = useQuiz();
  const { videos, progress, fetchVideos, fetchProgress } = useVideo();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalVideos: 0,
    completedVideos: 0,
  });

  useEffect(() => {
    fetchQuizzes();
    fetchAttempts();
    fetchBadges();
    fetchVideos();
    fetchProgress();
  }, []);

  useEffect(() => {
    if (attempts.length > 0) {
      const completedQuizzes = attempts.length;
      const totalScore = attempts.reduce((sum, attempt) => sum + attempt.percentage, 0);
      const averageScore = Math.round(totalScore / completedQuizzes);
      
      setStats(prev => ({
        ...prev,
        totalQuizzes: quizzes.length,
        completedQuizzes,
        averageScore,
      }));
    }
  }, [attempts, quizzes.length]);

  useEffect(() => {
    if (videos.length > 0 && progress.length > 0) {
      const completedVideos = progress.filter(p => p.completed).length;
      
      setStats(prev => ({
        ...prev,
        totalVideos: videos.length,
        completedVideos,
      }));
    }
  }, [videos.length, progress]);

  const recentQuizzes = quizzes.slice(0, 3);
  const recentVideos = videos.slice(0, 3);

  return (
    <DashboardContainer>
      <Container>
        <Header>
          <WelcomeText>Welcome back, {user?.name}!</WelcomeText>
          <Subtitle>Ready to learn about disaster preparedness?</Subtitle>
        </Header>

        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatIcon color="#00ff88">
              <FaTrophy />
            </StatIcon>
            <StatValue>{stats.completedQuizzes}</StatValue>
            <StatLabel>Quizzes Completed</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatIcon color="#0080ff">
              <FaChartLine />
            </StatIcon>
            <StatValue>{stats.averageScore}%</StatValue>
            <StatLabel>Average Score</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatIcon color="#ff0080">
              <FaPlay />
            </StatIcon>
            <StatValue>{stats.completedVideos}</StatValue>
            <StatLabel>Videos Watched</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatIcon color="#ffaa00">
              <FaShieldAlt />
            </StatIcon>
            <StatValue>{badges.length}</StatValue>
            <StatLabel>Badges Earned</StatLabel>
          </StatCard>
        </StatsGrid>

        <Section>
          <SectionTitle>
            <FaGraduationCap />
            Recent Quizzes
          </SectionTitle>
          <CardsGrid>
            {recentQuizzes.map((quiz, index) => (
              <Card
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <CardHeader>
                  <CardIcon color="#00ff88">
                    <FaTrophy />
                  </CardIcon>
                  <div>
                    <CardTitle>{quiz.title}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardButton>
                  <FaPlay />
                  Take Quiz
                </CardButton>
                <BadgeContainer>
                  <Badge type={quiz.difficulty}>{quiz.difficulty}</Badge>
                  <Badge type="category">{quiz.category}</Badge>
                </BadgeContainer>
              </Card>
            ))}
          </CardsGrid>
        </Section>

        <Section>
          <SectionTitle>
            <FaPlay />
            Learning Videos
          </SectionTitle>
          <CardsGrid>
            {recentVideos.map((video, index) => (
              <Card
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <CardHeader>
                  <CardIcon color="#0080ff">
                    <FaPlay />
                  </CardIcon>
                  <div>
                    <CardTitle>{video.title}</CardTitle>
                    <CardDescription>{video.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardButton>
                  <FaPlay />
                  Watch Video
                </CardButton>
                <BadgeContainer>
                  <Badge type="category">{video.category}</Badge>
                  <Badge type="duration">{Math.round(video.duration / 60)} min</Badge>
                </BadgeContainer>
              </Card>
            ))}
          </CardsGrid>
        </Section>

        <Section>
          <SectionTitle>
            <FaTrophy />
            Your Badges
          </SectionTitle>
          <BadgeContainer>
            {badges.map((badge, index) => (
              <Badge key={badge.id} type={badge.badge_type}>
                {badge.badge_type} - {badge.quiz?.title}
              </Badge>
            ))}
            {badges.length === 0 && (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                Complete quizzes to earn badges!
              </p>
            )}
          </BadgeContainer>
        </Section>
      </Container>
    </DashboardContainer>
  );
};

export default StudentDashboard;
