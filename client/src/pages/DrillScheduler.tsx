import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaClock,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFire,
  FaShieldAlt,
  FaWater
} from 'react-icons/fa';

const DrillContainer = styled.div`
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

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterTab = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.surfaceLight};
  }
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

const DrillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const DrillCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const DrillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const DrillTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const DrillType = styled.div<{ type: string }>`
  background: ${props => {
    switch (props.type) {
      case 'earthquake': return '#ff6b6b';
      case 'fire': return '#ffa726';
      case 'flood': return '#4ecdc4';
      default: return '#9c27b0';
    }
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const DrillDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const DrillMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${props => props.theme.colors.textMuted};
  font-size: 0.9rem;
`;

const MetaIcon = styled.div<{ color: string }>`
  color: ${props => props.color};
  font-size: 1rem;
  width: 20px;
  text-align: center;
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
  display: inline-block;
`;

const DrillActions = styled.div`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const DrillScheduler: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [drills, setDrills] = useState([
    {
      id: 1,
      title: 'Earthquake Drill - Building A',
      type: 'earthquake',
      description: 'Comprehensive earthquake preparedness drill covering evacuation procedures and safety protocols.',
      scheduledDate: '2024-01-15T10:00:00Z',
      location: 'Building A - Ground Floor',
      status: 'scheduled',
      registeredStudents: 45,
      totalCapacity: 50,
      duration: 30,
      instructor: 'Dr. Sarah Johnson',
    },
    {
      id: 2,
      title: 'Fire Safety Drill - Building B',
      type: 'fire',
      description: 'Fire safety drill including evacuation routes, fire extinguisher training, and emergency procedures.',
      scheduledDate: '2024-01-20T14:00:00Z',
      location: 'Building B - All Floors',
      status: 'scheduled',
      registeredStudents: 38,
      totalCapacity: 45,
      duration: 45,
      instructor: 'Mr. Michael Chen',
    },
    {
      id: 3,
      title: 'Flood Preparedness Drill',
      type: 'flood',
      description: 'Flood preparedness training covering early warning systems and evacuation procedures.',
      scheduledDate: '2024-01-10T09:00:00Z',
      location: 'Main Campus - Outdoor Area',
      status: 'completed',
      registeredStudents: 52,
      totalCapacity: 60,
      duration: 60,
      instructor: 'Prof. Emily Rodriguez',
    },
    {
      id: 4,
      title: 'Emergency Response Training',
      type: 'general',
      description: 'General emergency response training covering multiple disaster scenarios.',
      scheduledDate: '2024-01-25T11:00:00Z',
      location: 'Emergency Training Center',
      status: 'scheduled',
      registeredStudents: 28,
      totalCapacity: 40,
      duration: 90,
      instructor: 'Capt. David Wilson',
    },
  ]);

  const filteredDrills = drills.filter(drill => {
    if (activeFilter === 'all') return true;
    return drill.status === activeFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'earthquake': return <FaShieldAlt />;
      case 'fire': return <FaFire />;
      case 'flood': return <FaWater />;
      default: return <FaExclamationTriangle />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'earthquake': return '#ff6b6b';
      case 'fire': return '#ffa726';
      case 'flood': return '#4ecdc4';
      default: return '#9c27b0';
    }
  };

  return (
    <DrillContainer>
      <Container>
        <Header>
          <Title>Mock Drill Scheduler</Title>
          <Subtitle>Schedule and manage disaster preparedness drills</Subtitle>
        </Header>

        <Controls>
          <FilterTabs>
            <FilterTab
              active={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
            >
              All Drills
            </FilterTab>
            <FilterTab
              active={activeFilter === 'scheduled'}
              onClick={() => setActiveFilter('scheduled')}
            >
              Scheduled
            </FilterTab>
            <FilterTab
              active={activeFilter === 'completed'}
              onClick={() => setActiveFilter('completed')}
            >
              Completed
            </FilterTab>
            <FilterTab
              active={activeFilter === 'cancelled'}
              onClick={() => setActiveFilter('cancelled')}
            >
              Cancelled
            </FilterTab>
          </FilterTabs>

          <AddButton>
            <FaPlus />
            Schedule New Drill
          </AddButton>
        </Controls>

        {filteredDrills.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📅</EmptyIcon>
            <h3>No drills found</h3>
            <p>No drills match the current filter criteria.</p>
          </EmptyState>
        ) : (
          <DrillsGrid>
            {filteredDrills.map((drill, index) => (
              <DrillCard
                key={drill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DrillHeader>
                  <div>
                    <DrillTitle>{drill.title}</DrillTitle>
                    <DrillType type={drill.type}>
                      {getTypeIcon(drill.type)}
                      {drill.type}
                    </DrillType>
                  </div>
                  <StatusBadge status={drill.status}>
                    {drill.status}
                  </StatusBadge>
                </DrillHeader>

                <DrillDescription>{drill.description}</DrillDescription>

                <DrillMeta>
                  <MetaItem>
                    <MetaIcon color="#0080ff">
                      <FaCalendarAlt />
                    </MetaIcon>
                    {formatDate(drill.scheduledDate)}
                  </MetaItem>
                  <MetaItem>
                    <MetaIcon color="#ffaa00">
                      <FaMapMarkerAlt />
                    </MetaIcon>
                    {drill.location}
                  </MetaItem>
                  <MetaItem>
                    <MetaIcon color="#00ff88">
                      <FaUsers />
                    </MetaIcon>
                    {drill.registeredStudents}/{drill.totalCapacity} students
                  </MetaItem>
                  <MetaItem>
                    <MetaIcon color="#ff0080">
                      <FaClock />
                    </MetaIcon>
                    {drill.duration} minutes
                  </MetaItem>
                  <MetaItem>
                    <MetaIcon color="#9c27b0">
                      <FaCheckCircle />
                    </MetaIcon>
                    Instructor: {drill.instructor}
                  </MetaItem>
                </DrillMeta>

                <DrillActions>
                  <ActionButton variant="primary">
                    <FaCalendarAlt />
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
                </DrillActions>
              </DrillCard>
            ))}
          </DrillsGrid>
        )}
      </Container>
    </DrillContainer>
  );
};

export default DrillScheduler;
