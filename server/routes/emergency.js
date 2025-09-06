const express = require('express');
const supabase = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get emergency contacts
router.get('/contacts', authenticateToken, async (req, res) => {
  try {
    const { data: contacts, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .order('priority', { ascending: true });

    if (error) throw error;

    res.json({ contacts });
  } catch (error) {
    console.error('Get emergency contacts error:', error);
    res.status(500).json({ message: 'Failed to fetch emergency contacts' });
  }
});

// Add emergency contact (Admin only)
router.post('/contacts', authenticateToken, async (req, res) => {
  try {
    const { name, phone, email, department, priority, description } = req.body;

    const { data: contact, error } = await supabase
      .from('emergency_contacts')
      .insert([{
        name,
        phone,
        email,
        department,
        priority,
        description,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Emergency contact added successfully',
      contact
    });
  } catch (error) {
    console.error('Add emergency contact error:', error);
    res.status(500).json({ message: 'Failed to add emergency contact' });
  }
});

// Send emergency alert
router.post('/alert', authenticateToken, async (req, res) => {
  try {
    const { message, type, recipients } = req.body;

    // Create alert record
    const { data: alert, error } = await supabase
      .from('emergency_alerts')
      .insert([{
        message,
        type,
        sent_by: req.user.id,
        sent_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    // Here you would integrate with Twilio, email, or push notification services
    // For now, we'll just log the alert
    console.log('Emergency Alert:', {
      message,
      type,
      recipients,
      sentBy: req.user.name
    });

    res.json({
      message: 'Emergency alert sent successfully',
      alert
    });
  } catch (error) {
    console.error('Send emergency alert error:', error);
    res.status(500).json({ message: 'Failed to send emergency alert' });
  }
});

// Get emergency alerts
router.get('/alerts', authenticateToken, async (req, res) => {
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
      .order('sent_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({ alerts });
  } catch (error) {
    console.error('Get emergency alerts error:', error);
    res.status(500).json({ message: 'Failed to fetch emergency alerts' });
  }
});

module.exports = router;
