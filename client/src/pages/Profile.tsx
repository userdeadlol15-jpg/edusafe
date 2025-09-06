import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaGraduationCap, 
  FaChalkboardTeacher,
  FaUsers,
  FaCog,
  FaEdit,
  FaSave,
  FaTimes,
  FaTrophy,
  FaChartLine,
  FaCalendarAlt,
  FaShieldAlt
} from 'react-icons/fa';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 2rem;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  background: ${props => props.theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.2rem;
`;

const ProfileCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.lg};
  margin-bottom: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Avatar = styled.div<{ role: string }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => {
    switch (props.role) {
      case 'student': return props.theme.colors.primary + '20';
      case 'teacher': return props.theme.colors.info + '20';
      case 'parent': return props.theme.colors.warning + '20';
      case 'admin': return props.theme.colors.error + '20';
      default: return props.theme.colors.textMuted + '20';
    }
  }};
  color: ${props => {
    switch (props.role) {
      case 'student': return props.theme.colors.primary;
      case 'teacher': return props.theme.colors.info;
      case 'parent': return props.theme.colors.warning;
      case 'admin': return props.theme.colors.error;
      default: return props.theme.colors.textMuted;
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  border: 3px solid ${props => {
    switch (props.role) {
      case 'student': return props.theme.colors.primary;
      case 'teacher': return props.theme.colors.info;
      case 'parent': return props.theme.colors.warning;
      case 'admin': return props.theme.colors.error;
      default: return props.theme.colors.textMuted;
    }
  }};
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const ProfileRole = styled.div<{ role: string }>`
  background: ${props => {
    switch (props.role) {
      case 'student': return props.theme.colors.primary + '20';
      case 'teacher': return props.theme.colors.info + '20';
      case 'parent': return props.theme.colors.warning + '20';
      case 'admin': return props.theme.colors.error + '20';
      default: return props.theme.colors.textMuted + '20';
    }
  }};
  color: ${props => {
    switch (props.role) {
      case 'student': return props.theme.colors.primary;
      case 'teacher': return props.theme.colors.info;
      case 'parent': return props.theme.colors.warning;
      case 'admin': return props.theme.colors.error;
      default: return props.theme.colors.textMuted;
    }
  }};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ProfileEmail = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EditButton = styled.button`
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 0.75rem 1rem;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.shadow};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const SaveButton = styled.button`
  background: ${props => props.theme.colors.success};
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
    background: ${props => props.theme.colors.success}dd;
    transform: translateY(-2px);
  }
`;

const CancelButton = styled.button`
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.theme.colors.surfaceLight};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.md};
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const StatIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.color}20;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin: 0 auto 1rem;
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    student_id: user?.student_id || '',
    parent_of: user?.parent_of || '',
  });

  const [stats] = useState({
    quizzesCompleted: 12,
    averageScore: 85,
    badgesEarned: 8,
    videosWatched: 15,
    drillsAttended: 5,
    lastActivity: '2024-01-13T14:30:00Z',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        student_id: user.student_id || '',
        parent_of: user.parent_of || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call an API to update the user profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      student_id: user?.student_id || '',
      parent_of: user?.parent_of || '',
    });
    setIsEditing(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <FaGraduationCap />;
      case 'teacher': return <FaChalkboardTeacher />;
      case 'parent': return <FaUsers />;
      case 'admin': return <FaCog />;
      default: return <FaUser />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <ProfileContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
            <h2>Loading Profile...</h2>
          </div>
        </Container>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <Container>
        <Header>
          <Title>Profile Settings</Title>
          <Subtitle>Manage your account information and preferences</Subtitle>
        </Header>

        <ProfileCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProfileHeader>
            <Avatar role={user.role}>
              {getRoleIcon(user.role)}
            </Avatar>
            <ProfileInfo>
              <ProfileName>{user.name}</ProfileName>
              <ProfileRole role={user.role}>
                {getRoleIcon(user.role)}
                {user.role}
              </ProfileRole>
              <ProfileEmail>
                <FaEnvelope />
                {user.email}
              </ProfileEmail>
            </ProfileInfo>
            {!isEditing && (
              <EditButton onClick={() => setIsEditing(true)}>
                <FaEdit />
                Edit Profile
              </EditButton>
            )}
          </ProfileHeader>

          {isEditing ? (
            <Form onSubmit={handleSave}>
              <FormRow>
                <InputGroup>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </InputGroup>
              </FormRow>

              {user.role === 'student' && (
                <InputGroup>
                  <Label htmlFor="student_id">Student ID</Label>
                  <Input
                    type="text"
                    id="student_id"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    placeholder="Enter your student ID"
                  />
                </InputGroup>
              )}

              {user.role === 'parent' && (
                <InputGroup>
                  <Label htmlFor="parent_of">Child's Student ID</Label>
                  <Input
                    type="text"
                    id="parent_of"
                    name="parent_of"
                    value={formData.parent_of}
                    onChange={handleChange}
                    placeholder="Enter your child's student ID"
                  />
                </InputGroup>
              )}

              <FormActions>
                <CancelButton type="button" onClick={handleCancel}>
                  <FaTimes />
                  Cancel
                </CancelButton>
                <SaveButton type="submit">
                  <FaSave />
                  Save Changes
                </SaveButton>
              </FormActions>
            </Form>
          ) : (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Account Information</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #333' }}>
                    <span style={{ color: '#666' }}>Full Name:</span>
                    <span style={{ color: '#fff' }}>{user.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #333' }}>
                    <span style={{ color: '#666' }}>Email:</span>
                    <span style={{ color: '#fff' }}>{user.email}</span>
                  </div>
                  {user.student_id && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #333' }}>
                      <span style={{ color: '#666' }}>Student ID:</span>
                      <span style={{ color: '#fff' }}>{user.student_id}</span>
                    </div>
                  )}
                  {user.parent_of && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #333' }}>
                      <span style={{ color: '#666' }}>Child's Student ID:</span>
                      <span style={{ color: '#fff' }}>{user.parent_of}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                    <span style={{ color: '#666' }}>Last Activity:</span>
                    <span style={{ color: '#fff' }}>{formatDate(stats.lastActivity)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ProfileCard>

        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatIcon color="#00ff88">
              <FaTrophy />
            </StatIcon>
            <StatValue>{stats.quizzesCompleted}</StatValue>
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
              <FaShieldAlt />
            </StatIcon>
            <StatValue>{stats.badgesEarned}</StatValue>
            <StatLabel>Badges Earned</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatIcon color="#ffaa00">
              <FaCalendarAlt />
            </StatIcon>
            <StatValue>{stats.drillsAttended}</StatValue>
            <StatLabel>Drills Attended</StatLabel>
          </StatCard>
        </StatsGrid>
      </Container>
    </ProfileContainer>
  );
};

export default Profile;
