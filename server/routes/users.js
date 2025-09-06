const express = require('express');
const supabase = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, student_id, parent_of, created_at')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;

    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, student_id, parent_of } = req.body;
    const updates = { updated_at: new Date().toISOString() };

    if (name) updates.name = name;
    if (student_id) updates.student_id = student_id;
    if (parent_of) updates.parent_of = parent_of;

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select('id, email, name, role, student_id, parent_of, updated_at')
      .single();

    if (error) throw error;

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Get all users (Admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, role, student_id, parent_of, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get students for parent
router.get('/students', authenticateToken, async (req, res) => {
  try {
    if (req.user.role === 'parent') {
      const { data: students, error } = await supabase
        .from('users')
        .select('id, name, student_id, email')
        .eq('parent_of', req.user.id)
        .order('name');

      if (error) throw error;

      res.json({ students });
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});

module.exports = router;
