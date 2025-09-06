const express = require('express');
const supabase = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all quizzes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ quizzes });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
});

// Get quiz by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json({ quiz });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Failed to fetch quiz' });
  }
});

// Submit quiz answer
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;
    const quizId = req.params.id;
    const userId = req.user.id;

    // Get quiz questions
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('questions')
      .eq('id', quizId)
      .single();

    if (quizError) throw quizError;

    // Calculate score
    let score = 0;
    const questions = quiz.questions;
    
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        score++;
      }
    });

    const percentage = Math.round((score / questions.length) * 100);

    // Save quiz attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('quiz_attempts')
      .insert([{
        user_id: userId,
        quiz_id: quizId,
        answers: answers,
        score: score,
        percentage: percentage,
        completed_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (attemptError) throw attemptError;

    // Check for badges
    const badges = [];
    if (percentage >= 90) {
      badges.push('expert');
    } else if (percentage >= 70) {
      badges.push('advanced');
    } else if (percentage >= 50) {
      badges.push('intermediate');
    }

    // Award badges
    for (const badge of badges) {
      await supabase
        .from('user_badges')
        .insert([{
          user_id: userId,
          badge_type: badge,
          quiz_id: quizId,
          earned_at: new Date().toISOString()
        }]);
    }

    res.json({
      message: 'Quiz submitted successfully',
      score,
      percentage,
      badges,
      attempt
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
});

// Get user's quiz attempts
router.get('/user/attempts', authenticateToken, async (req, res) => {
  try {
    const { data: attempts, error } = await supabase
      .from('quiz_attempts')
      .select(`
        *,
        quizzes (
          title,
          category
        )
      `)
      .eq('user_id', req.user.id)
      .order('completed_at', { ascending: false });

    if (error) throw error;

    res.json({ attempts });
  } catch (error) {
    console.error('Get user attempts error:', error);
    res.status(500).json({ message: 'Failed to fetch attempts' });
  }
});

// Get user badges
router.get('/user/badges', authenticateToken, async (req, res) => {
  try {
    const { data: badges, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        quizzes (
          title,
          category
        )
      `)
      .eq('user_id', req.user.id)
      .order('earned_at', { ascending: false });

    if (error) throw error;

    res.json({ badges });
  } catch (error) {
    console.error('Get user badges error:', error);
    res.status(500).json({ message: 'Failed to fetch badges' });
  }
});

// Create quiz (Admin/Teacher only)
router.post('/', authenticateToken, requireRole(['admin', 'teacher']), async (req, res) => {
  try {
    const { title, description, category, questions, difficulty } = req.body;

    const { data: quiz, error } = await supabase
      .from('quizzes')
      .insert([{
        title,
        description,
        category,
        questions,
        difficulty,
        created_by: req.user.id,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Failed to create quiz' });
  }
});

module.exports = router;
