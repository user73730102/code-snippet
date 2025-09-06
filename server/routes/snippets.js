const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // We will create this next
const Snippet = require('../models/Snippet');
const User = require('../models/User');

// @route   POST /api/snippets
// @desc    Create a new code snippet
// @access  Private
// ... (keep the existing POST and GET routes)

// @route   DELETE /api/snippets/:id
// @desc    Delete a snippet by its ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        // Find the snippet by its ID
        let snippe = await Snippet.findById(req.params.id);

        if (!snippet) {
            return res.status(404).json({ msg: 'Snippet not found' });
        }

        // IMPORTANT: Make sure the user owns the snippet
        // We convert the user ObjectId to a string for comparison
        if (snippet.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorize' });
        }

        await Snippet.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Snippet removed successfully' });

    } catch (err) {
        console.error(err.message);
        // If the ID is not a valid ObjectId, it will throw an error
        if (err.kind === 'ObjectId') {
             return res.status(404).json({ msg: 'Snippet not found' });
        }
        res.status(500).send('Server Error');
    }
});


// @route   PATCH /api/snippets/:id
// @desc    Update a snippet
// @access  Private
router.patch('/:id', auth, async (req, res) => {
    const { title, language, code } = req.body;

    // Build snippet object based on the fields that were submitted
    const snippetFields = {};
    if (title) snippetFields.title = title;
    if (language) snippetFields.language = language;
    if (code) snippetFields.code = code;
    
    try {
        let snippet = await Snippet.findById(req.params.id);

        if (!snippet) {
            return res.status(404).json({ msg: 'Snippet not found' });
        }

        // IMPORTANT: Make sure the user owns the snippet
        if (snippet.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        snippet = await Snippet.findByIdAndUpdate(
            req.params.id,
            { $set: snippetFields }, // Use $set to update only the fields provided
            { new: true } // This option returns the document after it has been updated
        );

        res.json(snippet);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', auth, async (req, res) => {
    const { title, language, code } = req.body;

    if (!code) {
        return res.status(400).json({ msg: 'Code snippet cannot be empty.' });
    }

    try {
        const newSnippet = new Snippet({
            user: req.user.id, // Get user id from auth middleware
            title,
            language,
            code
        });

        const snippet = await newSnippet.save();
        res.json(snippet);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/snippets
// @desc    Get all snippets for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Find snippets and sort by most recent
        const snippets = await Snippet.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(snippets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;