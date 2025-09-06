import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useVideo } from '../contexts/VideoContext';
import { 
  FaPlay, 
  FaPause, 
  FaVolumeUp, 
  FaVolumeMute,
  FaCheck,
  FaClock,
  FaFilter,
  FaSearch
} from 'react-icons/fa';

const VideoContainer = styled.div`
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
  margin-bottom: 2rem;
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

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const VideoCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
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

const VideoThumbnail = styled.div<{ thumbnail?: string }>`
  width: 100%;
  height: 200px;
  background: ${props => props.thumbnail ? `url(${props.thumbnail})` : props.theme.colors.surfaceLight};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(0, 255, 136, 0.1), rgba(0, 128, 255, 0.1));
  }
`;

const PlayButton = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(0, 255, 136, 0.9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background: rgba(0, 255, 136, 1);
  }
`;

const VideoInfo = styled.div`
  padding: 1.5rem;
`;

const VideoTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const VideoDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const VideoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textMuted};
  font-size: 0.8rem;
`;

const CategoryBadge = styled.div<{ category: string }>`
  background: ${props => {
    const colors = {
      'earthquake': '#ff6b6b',
      'flood': '#4ecdc4',
      'fire': '#ffa726',
      'general': '#9c27b0',
      'emergency': '#f44336',
    };
    return colors[props.category as keyof typeof colors] || '#666';
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 1rem;
  display: inline-block;
`;

const ProgressBar = styled.div`
  background: ${props => props.theme.colors.surfaceLight};
  border-radius: ${props => props.theme.borderRadius.full};
  height: 4px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  background: ${props => props.theme.colors.primary};
  height: 100%;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const CompletedBadge = styled.div`
  background: ${props => props.theme.colors.success}20;
  color: ${props => props.theme.colors.success};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

const VideoPlayer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const PlayerContent = styled.div`
  width: 100%;
  max-width: 1000px;
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  position: relative;
`;

const VideoFrame = styled.iframe`
  width: 100%;
  height: 500px;
  border: none;
`;

const PlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const PlayerTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textMuted};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.md};

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.surfaceLight};
  }
`;

const VideoLearning: React.FC = () => {
  const { videos, progress, loading, fetchVideos, updateProgress } = useVideo();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || video.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getVideoProgress = (videoId: string) => {
    const videoProgress = progress.find(p => p.video_id === videoId);
    return videoProgress ? videoProgress.progress : 0;
  };

  const isVideoCompleted = (videoId: string) => {
    const videoProgress = progress.find(p => p.video_id === videoId);
    return videoProgress ? videoProgress.completed : false;
  };

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const handleVideoComplete = async (videoId: string) => {
    try {
      await updateProgress(videoId, 100, true);
    } catch (error) {
      console.error('Failed to mark video as complete:', error);
    }
  };

  const categories = ['all', ...Array.from(new Set(videos.map(v => v.category)))];

  return (
    <VideoContainer>
      <Container>
        <Header>
          <Title>Learning Videos</Title>
          <Subtitle>Master disaster preparedness through interactive video content</Subtitle>
        </Header>

        <Controls>
          <SearchInput
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterSelect
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </FilterSelect>
        </Controls>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎥</div>
            <h2>Loading Videos...</h2>
          </div>
        ) : (
          <VideoGrid>
            {filteredVideos.map((video, index) => {
              const videoProgress = getVideoProgress(video.id);
              const isCompleted = isVideoCompleted(video.id);
              
              return (
                <VideoCard
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleVideoClick(video)}
                >
                  <VideoThumbnail thumbnail={video.thumbnail}>
                    <PlayButton>
                      <FaPlay />
                    </PlayButton>
                  </VideoThumbnail>
                  
                  <VideoInfo>
                    <CategoryBadge category={video.category}>
                      {video.category}
                    </CategoryBadge>
                    
                    {isCompleted && (
                      <CompletedBadge>
                        <FaCheck />
                        Completed
                      </CompletedBadge>
                    )}
                    
                    <VideoTitle>{video.title}</VideoTitle>
                    <VideoDescription>{video.description}</VideoDescription>
                    
                    <VideoMeta>
                      <MetaItem>
                        <FaClock />
                        {Math.round(video.duration / 60)} min
                      </MetaItem>
                      <MetaItem>
                        {video.type === 'youtube' ? 'YouTube' : 'Uploaded'}
                      </MetaItem>
                    </VideoMeta>
                    
                    {videoProgress > 0 && (
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                          Progress: {Math.round(videoProgress)}%
                        </div>
                        <ProgressBar>
                          <ProgressFill progress={videoProgress} />
                        </ProgressBar>
                      </div>
                    )}
                  </VideoInfo>
                </VideoCard>
              );
            })}
          </VideoGrid>
        )}

        <VideoPlayer isOpen={isPlayerOpen}>
          {selectedVideo && (
            <PlayerContent>
              <PlayerHeader>
                <PlayerTitle>{selectedVideo.title}</PlayerTitle>
                <CloseButton onClick={() => setIsPlayerOpen(false)}>
                  ×
                </CloseButton>
              </PlayerHeader>
              <VideoFrame
                src={selectedVideo.type === 'youtube' 
                  ? `https://www.youtube.com/embed/${selectedVideo.url}?autoplay=1`
                  : selectedVideo.url
                }
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </PlayerContent>
          )}
        </VideoPlayer>
      </Container>
    </VideoContainer>
  );
};

export default VideoLearning;
