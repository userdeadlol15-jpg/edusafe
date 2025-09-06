import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaSearch,
  FaFilter,
  FaExclamationTriangle,
  FaShieldAlt,
  FaAmbulance,
  FaFire,
  FaUserMd,
  FaBuilding,
  FaClock
} from 'react-icons/fa';

const EmergencyContainer = styled.div`
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

const EmergencyAlert = styled.div`
  background: ${props => props.theme.colors.error}20;
  border: 1px solid ${props => props.theme.colors.error}40;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: ${props => props.theme.animations.pulse};
`;

const AlertIcon = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 2rem;
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertTitle = styled.h3`
  color: ${props => props.theme.colors.error};
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const AlertText = styled.p`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const EmergencyButton = styled.button`
  background: ${props => props.theme.colors.error};
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
    background: ${props => props.theme.colors.error}dd;
    transform: translateY(-2px);
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 0.75rem 1rem;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  flex: 1;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.shadow};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
`;

const FilterSelect = styled.select`
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 0.75rem 1rem;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  option {
    background: ${props => props.theme.colors.surfaceLight};
    color: ${props => props.theme.colors.text};
  }
`;

const ContactsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const ContactCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ContactHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ContactName = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const ContactDepartment = styled.div<{ priority: number }>`
  background: ${props => {
    switch (props.priority) {
      case 1: return props.theme.colors.error + '20';
      case 2: return props.theme.colors.warning + '20';
      case 3: return props.theme.colors.info + '20';
      default: return props.theme.colors.textMuted + '20';
    }
  }};
  color: ${props => {
    switch (props.priority) {
      case 1: return props.theme.colors.error;
      case 2: return props.theme.colors.warning;
      case 3: return props.theme.colors.info;
      default: return props.theme.colors.textMuted;
    }
  }};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const ContactDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${props => props.theme.colors.textMuted};
  font-size: 0.9rem;
`;

const ContactIcon = styled.div<{ color: string }>`
  color: ${props => props.color};
  font-size: 1rem;
  width: 20px;
  text-align: center;
`;

const ContactActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ContactButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.colors.primary;
      default: return 'transparent';
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'primary': return 'white';
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
  flex: 1;
  justify-content: center;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.8;
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const QuickActionCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const QuickActionIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.color}20;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
`;

const QuickActionTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const QuickActionDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.8rem;
`;

const EmergencyDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [contacts] = useState([
    {
      id: 1,
      name: 'Emergency Services',
      department: 'Emergency Response',
      phone: '+1-911',
      email: 'emergency@school.edu',
      priority: 1,
      description: '24/7 emergency response team for immediate assistance during disasters.',
      location: 'Emergency Command Center',
      availability: '24/7',
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      department: 'Medical Services',
      phone: '+1-555-0101',
      email: 'sarah.johnson@school.edu',
      priority: 1,
      description: 'Chief Medical Officer and emergency medical coordinator.',
      location: 'Medical Center - Room 101',
      availability: 'Mon-Fri 8AM-6PM',
    },
    {
      id: 3,
      name: 'Fire Safety Department',
      department: 'Fire Safety',
      phone: '+1-555-0102',
      email: 'firesafety@school.edu',
      priority: 2,
      description: 'Fire prevention, safety inspections, and emergency fire response.',
      location: 'Fire Station - Building C',
      availability: '24/7',
    },
    {
      id: 4,
      name: 'Security Office',
      department: 'Security',
      phone: '+1-555-0103',
      email: 'security@school.edu',
      priority: 2,
      description: 'Campus security and emergency coordination services.',
      location: 'Security Office - Main Gate',
      availability: '24/7',
    },
    {
      id: 5,
      name: 'Administration Office',
      department: 'Administration',
      phone: '+1-555-0104',
      email: 'admin@school.edu',
      priority: 3,
      description: 'General administration and non-emergency inquiries.',
      location: 'Administration Building - Room 201',
      availability: 'Mon-Fri 9AM-5PM',
    },
    {
      id: 6,
      name: 'IT Support',
      department: 'Information Technology',
      phone: '+1-555-0105',
      email: 'itsupport@school.edu',
      priority: 3,
      description: 'Technical support and communication system maintenance.',
      location: 'IT Center - Building D',
      availability: 'Mon-Fri 8AM-8PM',
    },
  ]);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || contact.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const departments = ['all', ...Array.from(new Set(contacts.map(c => c.department)))];

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'Emergency Response': return <FaExclamationTriangle />;
      case 'Medical Services': return <FaUserMd />;
      case 'Fire Safety': return <FaFire />;
      case 'Security': return <FaShieldAlt />;
      case 'Administration': return <FaBuilding />;
      case 'Information Technology': return <FaPhone />;
      default: return <FaPhone />;
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Emergency Response': return '#ff4444';
      case 'Medical Services': return '#00ff88';
      case 'Fire Safety': return '#ff6b6b';
      case 'Security': return '#0080ff';
      case 'Administration': return '#9c27b0';
      case 'Information Technology': return '#ffaa00';
      default: return '#666';
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  return (
    <EmergencyContainer>
      <Container>
        <Header>
          <Title>Emergency Directory</Title>
          <Subtitle>Quick access to emergency contacts and services</Subtitle>
        </Header>

        <EmergencyAlert>
          <AlertIcon>
            <FaExclamationTriangle />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Emergency Alert</AlertTitle>
            <AlertText>
              In case of emergency, call 911 immediately. Use this directory for non-emergency contacts and support services.
            </AlertText>
          </AlertContent>
          <EmergencyButton onClick={() => handleCall('911')}>
            <FaPhone />
            Call 911
          </EmergencyButton>
        </EmergencyAlert>

        <QuickActions>
          <QuickActionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => handleCall('911')}
          >
            <QuickActionIcon color="#ff4444">
              <FaAmbulance />
            </QuickActionIcon>
            <QuickActionTitle>Emergency Services</QuickActionTitle>
            <QuickActionDescription>Call 911 for immediate emergency assistance</QuickActionDescription>
          </QuickActionCard>

          <QuickActionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => handleCall('+1-555-0101')}
          >
            <QuickActionIcon color="#00ff88">
              <FaUserMd />
            </QuickActionIcon>
            <QuickActionTitle>Medical Services</QuickActionTitle>
            <QuickActionDescription>Contact medical team for health emergencies</QuickActionDescription>
          </QuickActionCard>

          <QuickActionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => handleCall('+1-555-0102')}
          >
            <QuickActionIcon color="#ff6b6b">
              <FaFire />
            </QuickActionIcon>
            <QuickActionTitle>Fire Safety</QuickActionTitle>
            <QuickActionDescription>Report fire incidents and safety concerns</QuickActionDescription>
          </QuickActionCard>

          <QuickActionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => handleCall('+1-555-0103')}
          >
            <QuickActionIcon color="#0080ff">
              <FaShieldAlt />
            </QuickActionIcon>
            <QuickActionTitle>Security</QuickActionTitle>
            <QuickActionDescription>Contact security for safety and security issues</QuickActionDescription>
          </QuickActionCard>
        </QuickActions>

        <Controls>
          <SearchInput
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterSelect
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            {departments.map(department => (
              <option key={department} value={department}>
                {department === 'all' ? 'All Departments' : department}
              </option>
            ))}
          </FilterSelect>
        </Controls>

        <ContactsGrid>
          {filteredContacts.map((contact, index) => (
            <ContactCard
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ContactHeader>
                <div>
                  <ContactName>{contact.name}</ContactName>
                  <ContactDepartment priority={contact.priority}>
                    {contact.department}
                  </ContactDepartment>
                </div>
              </ContactHeader>

              <ContactDescription>{contact.description}</ContactDescription>

              <ContactInfo>
                <ContactItem>
                  <ContactIcon color="#0080ff">
                    <FaPhone />
                  </ContactIcon>
                  {contact.phone}
                </ContactItem>
                <ContactItem>
                  <ContactIcon color="#00ff88">
                    <FaEnvelope />
                  </ContactIcon>
                  {contact.email}
                </ContactItem>
                <ContactItem>
                  <ContactIcon color="#ffaa00">
                    <FaMapMarkerAlt />
                  </ContactIcon>
                  {contact.location}
                </ContactItem>
                <ContactItem>
                  <ContactIcon color="#9c27b0">
                    <FaClock />
                  </ContactIcon>
                  {contact.availability}
                </ContactItem>
              </ContactInfo>

              <ContactActions>
                <ContactButton
                  variant="primary"
                  onClick={() => handleCall(contact.phone)}
                >
                  <FaPhone />
                  Call
                </ContactButton>
                <ContactButton
                  variant="secondary"
                  onClick={() => handleEmail(contact.email)}
                >
                  <FaEnvelope />
                  Email
                </ContactButton>
              </ContactActions>
            </ContactCard>
          ))}
        </ContactsGrid>
      </Container>
    </EmergencyContainer>
  );
};

export default EmergencyDirectory;
