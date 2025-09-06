const express = require('express');
const supabase = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(authenticateToken);
router.use(requireRole(['admin']));

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get user counts by role
    const { data: userStats, error: userError } = await supabase
      .from('users')
      .select('role')
      .then(data => {
        const stats = data.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});
        return { data: stats, error: null };
      });

    if (userError) throw userError;

    // Get quiz statistics
    const { data: quizStats, error: quizError } = await supabase
      .from('quiz_attempts')
      .select('score, percentage')
      .then(data => {
        const totalAttempts = data.length;
        const avgScore = data.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts;
        const avgPercentage = data.reduce((sum, attempt) => sum + attempt.percentage, 0) / totalAttempts;
        return { 
          data: { totalAttempts, avgScore, avgPercentage }, 
          error: null 
        };
      });

    if (quizError) throw quizError;

    // Get drill statistics
    const { data: drillStats, error: drillError } = await supabase
      .from('mock_drills')
      .select('id')
      .then(data => {
        return { data: { totalDrills: data.length }, error: null };
      });

    if (drillError) throw drillError;

    res.json({
      userStats,
      quizStats,
      drillStats
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// Upload learning content
router.post('/content/upload', async (req, res) => {
  try {
    const { title, description, type, url, category, duration } = req.body;

    const { data: content, error } = await supabase
      .from('learning_videos')
      .insert([{
        title,
        description,
        type,
        url,
        category,
        duration,
        uploaded_by: req.user.id,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Content uploaded successfully',
      content
    });
  } catch (error) {
    console.error('Upload content error:', error);
    res.status(500).json({ message: 'Failed to upload content' });
  }
});

// Send system-wide alert
router.post('/alert/send', async (req, res) => {
  try {
    const { message, type, target_roles } = req.body;

    const { data: alert, error } = await supabase
      .from('emergency_alerts')
      .insert([{
        message,
        type,
        target_roles: target_roles || ['student', 'teacher', 'parent'],
        sent_by: req.user.id,
        sent_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    // Here you would integrate with notification services
    console.log('System Alert:', {
      message,
      type,
      targetRoles: target_roles,
      sentBy: req.user.name
    });

    res.json({
      message: 'System alert sent successfully',
      alert
    });
  } catch (error) {
    console.error('Send system alert error:', error);
    res.status(500).json({ message: 'Failed to send system alert' });
  }
});

// Get all alerts
router.get('/alerts', async (req, res) => {
  try {
    const { data: alerts, error } = await supabase
      .from('emergency_alerts')
      .select(`
        *,
        users (
          name,
          role
        )
      `)
      .order('sent_at', { ascending: false });

    if (error) throw error;

    res.json({ alerts });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
});

module.exports = router;
