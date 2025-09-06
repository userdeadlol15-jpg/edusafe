import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaCog, 
  FaUsers, 
  FaChartLine, 
  FaUpload,
  FaBell,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaTrophy,
  FaPlay
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

const StatusBadge = styled.div<{ status: string }>`
  background: ${props => {
    switch (props.status) {
      case 'active': return props.theme.colors.success + '20';
      case 'pending': return props.theme.colors.warning + '20';
      case 'completed': return props.theme.colors.info + '20';
      default: return props.theme.colors.textMuted + '20';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return props.theme.colors.success;
      case 'pending': return props.theme.colors.warning;
      case 'completed': return props.theme.colors.info;
      default: return props.theme.colors.textMuted;
    }
  }};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const AlertCard = styled.div<{ type: 'info' | 'warning' | 'success' | 'error' }>`
  background: ${props => {
    switch (props.type) {
      case 'warning': return props.theme.colors.warning + '20';
      case 'success': return props.theme.colors.success + '20';
      case 'error': return props.theme.colors.error + '20';
      default: return props.theme.colors.info + '20';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'warning': return props.theme.colors.warning + '40';
      case 'success': return props.theme.colors.success + '40';
      case 'error': return props.theme.colors.error + '40';
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

const AlertIcon = styled.div<{ type: 'info' | 'warning' | 'success' | 'error' }>`
  color: ${props => {
    switch (props.type) {
      case 'warning': return props.theme.colors.warning;
      case 'success': return props.theme.colors.success;
      case 'error': return props.theme.colors.error;
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

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    totalVideos: 0,
    totalDrills: 0,
    averageQuizScore: 0,
    systemHealth: 'Good',
  });

  const [recentAlerts] = useState([
    {
      id: 1,
      type: 'success' as const,
      title: 'System Update',
      message: 'Database backup completed successfully',
      timestamp: '2024-01-13T08:00:00Z',
    },
    {
      id: 2,
      type: 'warning' as const,
      title: 'High Traffic',
      message: 'Unusual spike in quiz attempts detected',
      timestamp: '2024-01-13T07:30:00Z',
    },
    {
      id: 3,
      type: 'info' as const,
      title: 'New Content',
      message: '5 new learning videos uploaded',
      timestamp: '2024-01-12T16:45:00Z',
    },
  ]);

  const [recentContent] = useState([
    {
      id: 1,
      title: 'Earthquake Safety Protocol',
      type: 'video',
      category: 'earthquake',
      uploadDate: '2024-01-12T10:00:00Z',
      views: 245,
      status: 'active',
    },
    {
      id: 2,
      title: 'Fire Prevention Quiz',
      type: 'quiz',
      category: 'fire',
      uploadDate: '2024-01-11T14:30:00Z',
      views: 189,
      status: 'active',
    },
    {
      id: 3,
      title: 'Flood Preparedness Guide',
      type: 'video',
      category: 'flood',
      uploadDate: '2024-01-10T09:15:00Z',
      views: 156,
      status: 'pending',
    },
  ]);

  const [systemStats] = useState([
    {
      label: 'Server Uptime',
      value: '99.9%',
      color: '#00ff88',
    },
    {
      label: 'Database Performance',
      value: 'Excellent',
      color: '#0080ff',
    },
    {
      label: 'API Response Time',
      value: '120ms',
      color: '#ffaa00',
    },
    {
      label: 'Storage Usage',
      value: '68%',
      color: '#ff0080',
    },
  ]);

  useEffect(() => {
    // Mock stats - in real app, this would come from API
    setStats({
      totalUsers: 1250,
      totalQuizzes: 45,
      totalVideos: 78,
      totalDrills: 23,
      averageQuizScore: 82,
      systemHealth: 'Good',
    });
  }, []);

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
          <WelcomeText>Admin Dashboard</WelcomeText>
          <Subtitle>System overview and content management</Subtitle>
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
            <StatValue>{stats.totalUsers.toLocaleString()}</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatIcon color="#0080ff">
              <FaTrophy />
            </StatIcon>
            <StatValue>{stats.totalQuizzes}</StatValue>
            <StatLabel>Total Quizzes</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatIcon color="#ff0080">
              <FaPlay />
            </StatIcon>
            <StatValue>{stats.totalVideos}</StatValue>
            <StatLabel>Learning Videos</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatIcon color="#ffaa00">
              <FaChartLine />
            </StatIcon>
            <StatValue>{stats.averageQuizScore}%</StatValue>
            <StatLabel>Avg Quiz Score</StatLabel>
          </StatCard>
        </StatsGrid>

        <Section>
          <SectionTitle>
            <FaBell />
            System Alerts
          </SectionTitle>
          {recentAlerts.map((alert, index) => (
            <AlertCard
              key={alert.id}
              type={alert.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <AlertIcon type={alert.type}>
                {alert.type === 'warning' ? <FaExclamationTriangle /> :
                 alert.type === 'success' ? <FaCheckCircle /> : 
                 alert.type === 'error' ? <FaExclamationTriangle /> : <FaBell />}
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
          <SectionHeader>
            <SectionTitle>
              <FaUpload />
              Recent Content
            </SectionTitle>
            <ActionButton variant="primary">
              <FaPlus />
              Upload Content
            </ActionButton>
          </SectionHeader>
          <CardsGrid>
            {recentContent.map((content, index) => (
              <Card
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <CardHeader>
                  <div>
                    <CardTitle>{content.title}</CardTitle>
                    <CardDescription>
                      {content.type.charAt(0).toUpperCase() + content.type.slice(1)} • {content.category}
                    </CardDescription>
                  </div>
                  <StatusBadge status={content.status}>
                    {content.status}
                  </StatusBadge>
                </CardHeader>

                <CardMeta>
                  <MetaItem>
                    <FaClock />
                    {formatDate(content.uploadDate)}
                  </MetaItem>
                  <MetaItem>
                    <FaEye />
                    {content.views} views
                  </MetaItem>
                </CardMeta>

                <CardActions>
                  <ActionButton variant="secondary">
                    <FaEye />
                    View
                  </ActionButton>
                  <ActionButton variant="secondary">
                    <FaEdit />
                    Edit
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

        <Section>
          <SectionTitle>
            <FaCog />
            System Health
          </SectionTitle>
          <CardsGrid>
            {systemStats.map((stat, index) => (
              <Card
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <CardHeader>
                  <div>
                    <CardTitle>{stat.label}</CardTitle>
                    <CardDescription>Current system status</CardDescription>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </CardsGrid>
        </Section>
      </Container>
    </DashboardContainer>
  );
};

export default AdminDashboard;
