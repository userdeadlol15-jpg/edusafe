import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface LearningVideo {
  id: string;
  title: string;
  description: string;
  type: 'youtube' | 'uploaded';
  url: string;
  category: string;
  duration: number;
  thumbnail?: string;
  created_at: string;
}

interface VideoProgress {
  id: string;
  user_id: string;
  video_id: string;
  progress: number;
  completed: boolean;
  updated_at: string;
  learning_videos: LearningVideo;
}

interface VideoContextType {
  videos: LearningVideo[];
  currentVideo: LearningVideo | null;
  progress: VideoProgress[];
  loading: boolean;
  fetchVideos: () => Promise<void>;
  fetchVideo: (id: string) => Promise<void>;
  updateProgress: (videoId: string, progress: number, completed: boolean) => Promise<void>;
  fetchProgress: () => Promise<void>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<LearningVideo[]>([]);
  const [currentVideo, setCurrentVideo] = useState<LearningVideo | null>(null);
  const [progress, setProgress] = useState<VideoProgress[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/videos');
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideo = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/videos/${id}`);
      setCurrentVideo(response.data.video);
    } catch (error) {
      console.error('Failed to fetch video:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (videoId: string, progressValue: number, completed: boolean) => {
    try {
      await axios.post(`/videos/${videoId}/progress`, {
        progress: progressValue,
        completed
      });
      
      // Refresh progress
      await fetchProgress();
    } catch (error) {
      console.error('Failed to update progress:', error);
      throw error;
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await axios.get('/videos/user/progress');
      setProgress(response.data.progress);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchVideos();
    fetchProgress();
  }, []);

  const value: VideoContextType = {
    videos,
    currentVideo,
    progress,
    loading,
    fetchVideos,
    fetchVideo,
    updateProgress,
    fetchProgress,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = (): VideoContextType => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};
