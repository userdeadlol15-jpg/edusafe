const express = require('express');
const supabase = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all drills
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: drills, error } = await supabase
      .from('mock_drills')
      .select('*')
      .order('scheduled_date', { ascending: true });

    if (error) throw error;

    res.json({ drills });
  } catch (error) {
    console.error('Get drills error:', error);
    res.status(500).json({ message: 'Failed to fetch drills' });
  }
});

// Get drill by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { data: drill, error } = await supabase
      .from('mock_drills')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json({ drill });
  } catch (error) {
    console.error('Get drill error:', error);
    res.status(500).json({ message: 'Failed to fetch drill' });
  }
});

// Create drill (Teacher/Admin only)
router.post('/', authenticateToken, requireRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { title, description, type, scheduled_date, location, instructions } = req.body;

    const { data: drill, error } = await supabase
      .from('mock_drills')
      .insert([{
        title,
        description,
        type,
        scheduled_date,
        location,
        instructions,
        created_by: req.user.id,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Drill created successfully',
      drill
    });
  } catch (error) {
    console.error('Create drill error:', error);
    res.status(500).json({ message: 'Failed to create drill' });
  }
});

// Register for drill
router.post('/:id/register', authenticateToken, async (req, res) => {
  try {
    const drillId = req.params.id;
    const userId = req.user.id;

    const { data: registration, error } = await supabase
      .from('drill_registrations')
      .insert([{
        user_id: userId,
        drill_id: drillId,
        registered_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Registered for drill successfully',
      registration
    });
  } catch (error) {
    console.error('Register for drill error:', error);
    res.status(500).json({ message: 'Failed to register for drill' });
  }
});

// Mark attendance (Teacher/Admin only)
router.post('/:id/attendance', authenticateToken, requireRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { user_id, attended } = req.body;
    const drillId = req.params.id;

    const { data: attendance, error } = await supabase
      .from('drill_attendance')
      .upsert([{
        user_id,
        drill_id: drillId,
        attended,
        marked_by: req.user.id,
        marked_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ message: 'Failed to mark attendance' });
  }
});

// Get user's drill registrations
router.get('/user/registrations', authenticateToken, async (req, res) => {
  try {
    const { data: registrations, error } = await supabase
      .from('drill_registrations')
      .select(`
        *,
        mock_drills (
          title,
          type,
          scheduled_date,
          location
        )
      `)
      .eq('user_id', req.user.id)
      .order('registered_at', { ascending: false });

    if (error) throw error;

    res.json({ registrations });
  } catch (error) {
    console.error('Get user registrations error:', error);
    res.status(500).json({ message: 'Failed to fetch registrations' });
  }
});

module.exports = router;
