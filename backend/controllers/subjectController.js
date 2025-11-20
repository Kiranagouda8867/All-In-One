import Subject from "../models/Subject.js";

// Add Subject
export const addSubject = async (req, res) => {
  try {
    const { name, category, rating, comment } = req.body;

    console.log('[subjects] addSubject request body=', req.body, 'user=', req.user && req.user._id);

    if (!req.user || !req.user._id) {
      console.error('[subjects] addSubject blocked: missing req.user');
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!name || !category) {
      console.error('[subjects] addSubject validation failed: missing name/category', { name, category });
      return res.status(400).json({ message: 'Missing required fields: name and category' });
    }

    // Ensure rating is a number in valid range; if absent, default to 3
    const parsedRating = typeof rating === 'number' ? rating : (parseInt(rating, 10) || 3);
    const safeRating = Math.min(5, Math.max(1, parsedRating));

    const subject = await Subject.create({
      userId: req.user._id,
      name,
      category,
      rating: safeRating,
      comment: comment || ''
    });

    console.log('[subjects] created:', subject && subject._id);

    res.json(subject);
  } catch (err) {
    console.error('[subjects] addSubject error:', err && err.stack || err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

// Get all subjects of logged user
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user._id });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit subject rating/comment
export const updateSubject = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;

    const updated = await Subject.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { rating, comment, updatedAt: Date.now() },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Subject
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    await Subject.findOneAndDelete({ _id: id, userId: req.user._id });

    res.json({ message: "Subject deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
