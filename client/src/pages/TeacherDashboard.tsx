import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaChalkboardTeacher, 
  FaUsers, 
  FaCalendarAlt, 
  FaChartLine,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt
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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AddButton = styled.button`
  background: ${props => props.theme.colors.gradient};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
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

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textMuted};
  font-size: 0.8rem;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  background: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.colors.primary;
      case 'danger': return props.theme.colors.error;
      default: return 'transparent';
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'primary': return 'white';
      case 'danger': return 'white';
      default: return props.theme.colors.text;
    }
  }};
  border: ${props => props.variant === 'secondary' ? `1px solid ${props.theme.colors.border}` : 'none'};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.8;
  }
`;

const StatusBadge = styled.div<{ status: string }>`
  background: ${props => {
    switch (props.status) {
      case 'scheduled': return props.theme.colors.info + '20';
      case 'completed': return props.theme.colors.success + '20';
      case 'cancelled': return props.theme.colors.error + '20';
      default: return props.theme.colors.textMuted + '20';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'scheduled': return props.theme.colors.info;
      case 'completed': return props.theme.colors.success;
      case 'cancelled': return props.theme.colors.error;
      default: return props.theme.colors.textMuted;
    }
  }};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    scheduledDrills: 0,
    completedDrills: 0,
    averageAttendance: 0,
  });

  // Mock data - in real app, this would come from API
  const [drills] = useState([
    {
      id: 1,
      title: 'Earthquake Drill - Building A',
      type: 'earthquake',
      scheduledDate: '2024-01-15T10:00:00Z',
      location: 'Building A - Ground Floor',
      status: 'scheduled',
      registeredStudents: 45,
      totalStudents: 50,
    },
    {
      id: 2,
      title: 'Fire Safety Drill - Building B',
      type: 'fire',
      scheduledDate: '2024-01-20T14:00:00Z',
      location: 'Building B - All Floors',
      status: 'scheduled',
      registeredStudents: 38,
      totalStudents: 42,
    },
    {
      id: 3,
      title: 'Flood Preparedness Drill',
      type: 'flood',
      scheduledDate: '2024-01-10T09:00:00Z',
      location: 'Main Campus',
      status: 'completed',
      registeredStudents: 52,
      totalStudents: 55,
    },
  ]);

  const [quizzes] = useState([
    {
      id: 1,
      title: 'Earthquake Safety Quiz',
      category: 'earthquake',
      difficulty: 'medium',
      totalAttempts: 45,
      averageScore: 78,
      createdDate: '2024-01-01',
    },
    {
      id: 2,
      title: 'Fire Prevention Basics',
      category: 'fire',
      difficulty: 'easy',
      totalAttempts: 38,
      averageScore: 85,
      createdDate: '2024-01-05',
    },
    {
      id: 3,
      title: 'Emergency Response Procedures',
      category: 'general',
      difficulty: 'hard',
      totalAttempts: 29,
      averageScore: 72,
      createdDate: '2024-01-08',
    },
  ]);

  useEffect(() => {
    // Mock stats calculation
    setStats({
      totalStudents: 150,
      scheduledDrills: drills.filter(d => d.status === 'scheduled').length,
      completedDrills: drills.filter(d => d.status === 'completed').length,
      averageAttendance: 85,
    });
  }, [drills]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardContainer>
      <Container>
        <Header>
          <WelcomeText>Teacher Dashboard</WelcomeText>
          <Subtitle>Manage drills, track student progress, and create learning content</Subtitle>
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
            <StatValue>{stats.totalStudents}</StatValue>
            <StatLabel>Total Students</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatIcon color="#0080ff">
              <FaCalendarAlt />
            </StatIcon>
            <StatValue>{stats.scheduledDrills}</StatValue>
            <StatLabel>Scheduled Drills</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatIcon color="#ff0080">
              <FaCheckCircle />
            </StatIcon>
            <StatValue>{stats.completedDrills}</StatValue>
            <StatLabel>Completed Drills</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatIcon color="#ffaa00">
              <FaChartLine />
            </StatIcon>
            <StatValue>{stats.averageAttendance}%</StatValue>
            <StatLabel>Avg Attendance</StatLabel>
          </StatCard>
        </StatsGrid>

        <Section>
          <SectionHeader>
            <SectionTitle>
              <FaCalendarAlt />
              Mock Drills
            </SectionTitle>
            <AddButton>
              <FaPlus />
              Schedule Drill
            </AddButton>
          </SectionHeader>
          <CardsGrid>
            {drills.map((drill, index) => (
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
                  <StatusBadge status={drill.status}>
                    {drill.status}
                  </StatusBadge>
                </CardHeader>

                <CardMeta>
                  <MetaItem>
                    <FaClock />
                    {formatDate(drill.scheduledDate)}
                  </MetaItem>
                  <MetaItem>
                    <FaMapMarkerAlt />
                    {drill.location}
                  </MetaItem>
                  <MetaItem>
                    <FaUsers />
                    {drill.registeredStudents}/{drill.totalStudents} students
                  </MetaItem>
                </CardMeta>

                <CardActions>
                  <ActionButton variant="primary">
                    <FaEye />
                    View Details
                  </ActionButton>
                  <ActionButton variant="secondary">
                    <FaEdit />
                    Edit
                  </ActionButton>
                  <ActionButton variant="danger">
                    <FaTrash />
                    Cancel
                  </ActionButton>
                </CardActions>
              </Card>
            ))}
          </CardsGrid>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>
              <FaChalkboardTeacher />
              Quiz Management
            </SectionTitle>
            <AddButton>
              <FaPlus />
              Create Quiz
            </AddButton>
          </SectionHeader>
          <CardsGrid>
            {quizzes.map((quiz, index) => (
              <Card
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <CardHeader>
                  <div>
                    <CardTitle>{quiz.title}</CardTitle>
                    <CardDescription>
                      {quiz.category.charAt(0).toUpperCase() + quiz.category.slice(1)} - {quiz.difficulty}
                    </CardDescription>
                  </div>
                  <StatusBadge status={quiz.difficulty}>
                    {quiz.difficulty}
                  </StatusBadge>
                </CardHeader>

                <CardMeta>
                  <MetaItem>
                    <FaUsers />
                    {quiz.totalAttempts} attempts
                  </MetaItem>
                  <MetaItem>
                    <FaChartLine />
                    {quiz.averageScore}% avg score
                  </MetaItem>
                  <MetaItem>
                    <FaClock />
                    {formatDate(quiz.createdDate)}
                  </MetaItem>
                </CardMeta>

                <CardActions>
                  <ActionButton variant="primary">
                    <FaEye />
                    View Results
                  </ActionButton>
                  <ActionButton variant="secondary">
                    <FaEdit />
                    Edit Quiz
                  </ActionButton>
                  <ActionButton variant="danger">
                    <FaTrash />
                    Delete
                  </ActionButton>
                </CardActions>
              </Card>
            ))}
          </CardsGrid>
        </Section>
      </Container>
    </DashboardContainer>
  );
};

export default TeacherDashboard;
