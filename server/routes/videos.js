const express = require('express');
const supabase = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all learning videos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: videos, error } = await supabase
      .from('learning_videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ videos });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
});

// Get video by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { data: video, error } = await supabase
      .from('learning_videos')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json({ video });
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ message: 'Failed to fetch video' });
  }
});

// Track video progress
router.post('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { progress, completed } = req.body;
    const videoId = req.params.id;
    const userId = req.user.id;

    const { data: videoProgress, error } = await supabase
      .from('video_progress')
      .upsert([{
        user_id: userId,
        video_id: videoId,
        progress: progress,
        completed: completed,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Progress updated successfully',
      videoProgress
    });
  } catch (error) {
    console.error('Update video progress error:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
});

// Get user's video progress
router.get('/user/progress', authenticateToken, async (req, res) => {
  try {
    const { data: progress, error } = await supabase
      .from('video_progress')
      .select(`
        *,
        learning_videos (
          title,
          category,
          duration
        )
      `)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ progress });
  } catch (error) {
    console.error('Get video progress error:', error);
    res.status(500).json({ message: 'Failed to fetch progress' });
  }
});

module.exports = router;
