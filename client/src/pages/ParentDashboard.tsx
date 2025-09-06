import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaUsers, 
  FaChartLine, 
  FaTrophy, 
  FaPlay,
  FaCalendarAlt,
  FaPhone,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaGraduationCap
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
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const Card = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
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

const ProgressBar = styled.div`
  background: ${props => props.theme.colors.surfaceLight};
  border-radius: ${props => props.theme.borderRadius.full};
  height: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  background: ${props => props.theme.colors.gradient};
  height: 100%;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
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

const AlertCard = styled.div<{ type: 'info' | 'warning' | 'success' }>`
  background: ${props => {
    switch (props.type) {
      case 'warning': return props.theme.colors.warning + '20';
      case 'success': return props.theme.colors.success + '20';
      default: return props.theme.colors.info + '20';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'warning': return props.theme.colors.warning + '40';
      case 'success': return props.theme.colors.success + '40';
      default: return props.theme.colors.info + '40';
    }
  }};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AlertIcon = styled.div<{ type: 'info' | 'warning' | 'success' }>`
  color: ${props => {
    switch (props.type) {
      case 'warning': return props.theme.colors.warning;
      case 'success': return props.theme.colors.success;
      default: return props.theme.colors.info;
    }
  }};
  font-size: 1.2rem;
`;

const AlertText = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  line-height: 1.4;
`;

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      studentId: 'STU001',
      grade: '10th Grade',
      progress: 75,
      completedQuizzes: 8,
      totalQuizzes: 12,
      badges: ['intermediate', 'advanced'],
      lastActivity: '2024-01-12T14:30:00Z',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      studentId: 'STU002',
      grade: '8th Grade',
      progress: 60,
      completedQuizzes: 5,
      totalQuizzes: 10,
      badges: ['intermediate'],
      lastActivity: '2024-01-11T16:45:00Z',
    },
  ]);

  const [alerts] = useState([
    {
      id: 1,
      type: 'warning' as const,
      title: 'Upcoming Drill',
      message: 'Earthquake drill scheduled for January 15th at 10:00 AM',
      timestamp: '2024-01-10T09:00:00Z',
    },
    {
      id: 2,
      type: 'success' as const,
      title: 'Achievement Unlocked',
      message: 'Alex completed the Fire Safety Quiz with 95% score!',
      timestamp: '2024-01-12T14:30:00Z',
    },
    {
      id: 3,
      type: 'info' as const,
      title: 'New Learning Content',
      message: 'New video on flood preparedness is now available',
      timestamp: '2024-01-13T08:00:00Z',
    },
  ]);

  const [upcomingDrills] = useState([
    {
      id: 1,
      title: 'Earthquake Drill - Building A',
      date: '2024-01-15T10:00:00Z',
      location: 'Building A - Ground Floor',
      type: 'earthquake',
    },
    {
      id: 2,
      title: 'Fire Safety Drill - Building B',
      date: '2024-01-20T14:00:00Z',
      location: 'Building B - All Floors',
      type: 'fire',
    },
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <DashboardContainer>
      <Container>
        <Header>
          <WelcomeText>Parent Dashboard</WelcomeText>
          <Subtitle>Track your children's disaster preparedness progress</Subtitle>
        </Header>

        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatIcon color="#00ff88">
              <FaUsers />
            </StatIcon>
            <StatValue>{children.length}</StatValue>
            <StatLabel>Children Registered</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatIcon color="#0080ff">
              <FaChartLine />
            </StatIcon>
            <StatValue>{Math.round(children.reduce((sum, child) => sum + child.progress, 0) / children.length)}%</StatValue>
            <StatLabel>Average Progress</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatIcon color="#ff0080">
              <FaTrophy />
            </StatIcon>
            <StatValue>{children.reduce((sum, child) => sum + child.badges.length, 0)}</StatValue>
            <StatLabel>Total Badges Earned</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatIcon color="#ffaa00">
              <FaCalendarAlt />
            </StatIcon>
            <StatValue>{upcomingDrills.length}</StatValue>
            <StatLabel>Upcoming Drills</StatLabel>
          </StatCard>
        </StatsGrid>

        <Section>
          <SectionTitle>
            <FaExclamationTriangle />
            Recent Alerts
          </SectionTitle>
          {alerts.map((alert, index) => (
            <AlertCard
              key={alert.id}
              type={alert.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <AlertIcon type={alert.type}>
                {alert.type === 'warning' ? <FaExclamationTriangle /> :
                 alert.type === 'success' ? <FaCheckCircle /> : <FaPhone />}
              </AlertIcon>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                  {alert.title}
                </div>
                <AlertText>{alert.message}</AlertText>
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                  {getTimeAgo(alert.timestamp)}
                </div>
              </div>
            </AlertCard>
          ))}
        </Section>

        <Section>
          <SectionTitle>
            <FaUsers />
            Your Children's Progress
          </SectionTitle>
          <CardsGrid>
            {children.map((child, index) => (
              <Card
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <CardHeader>
                  <div>
                    <CardTitle>{child.name}</CardTitle>
                    <CardDescription>
                      {child.studentId} • {child.grade}
                    </CardDescription>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    Last active: {getTimeAgo(child.lastActivity)}
                  </div>
                </CardHeader>

                <ProgressText>
                  <span>Overall Progress</span>
                  <span>{child.progress}%</span>
                </ProgressText>
                <ProgressBar>
                  <ProgressFill progress={child.progress} />
                </ProgressBar>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Quizzes: {child.completedQuizzes}/{child.totalQuizzes}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Badges: {child.badges.length}
                  </div>
                </div>

                <BadgeContainer>
                  {child.badges.map((badge, badgeIndex) => (
                    <Badge key={badgeIndex} type={badge}>
                      {badge}
                    </Badge>
                  ))}
                </BadgeContainer>
              </Card>
            ))}
          </CardsGrid>
        </Section>

        <Section>
          <SectionTitle>
            <FaCalendarAlt />
            Upcoming Drills
          </SectionTitle>
          <CardsGrid>
            {upcomingDrills.map((drill, index) => (
              <Card
                key={drill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <CardHeader>
                  <div>
                    <CardTitle>{drill.title}</CardTitle>
                    <CardDescription>
                      {drill.type.charAt(0).toUpperCase() + drill.type.slice(1)} preparedness drill
                    </CardDescription>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    {formatDate(drill.date)}
                  </div>
                </CardHeader>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                  <FaClock />
                  {formatDate(drill.date)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  <FaGraduationCap />
                  {drill.location}
                </div>
              </Card>
            ))}
          </CardsGrid>
        </Section>
      </Container>
    </DashboardContainer>
  );
};

export default ParentDashboard;
