const express = require('express');
const router = express.Router();
const mongoose  = require('mongoose');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

// Load Model
const Story = mongoose.model('stories');
const User = mongoose.model('users');

router.get('/', (req, res) => {
    Story.find({status: 'public'})
        .populate('user')
        .sort({date: 'desc'})
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });    
        });
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

router.post('/', ensureAuthenticated, (req, res) => {      
    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: req.body.allowComments ? true : false,
        user: req.user.id
    };
    
    // Create Story
    new Story(newStory)
        .save()
        .then((story) => {            
            res.redirect(`/stories/show/${story.id}`);
        });
});

// Show Single Story
router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .populate('user')
    .populate('comments.commentUser')
    .then((story) => {
        if (
            (
                story.status === 'private'
                ||
                story.status === 'unpublished'
            )
            && 
            !(req.user && (req.user.id === story.user.id))
        ) {
            res.redirect('/stories');
        } else {
            res.render('stories/show', {
                story: story
            });            
        }
    });
});

// List Stories From a User
router.get('/user/:user_id', (req, res) => {    
    Story.find({user: req.params.user_id, status: 'public'})
        .populate('user')
        .sort({date: 'desc'})
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });    
        });    
});

// Logged us user stories
router.get('/my', ensureAuthenticated, (req, res) => {    
    Story.find({user: req.user.id})
        .populate('user')
        .sort({date: 'desc'})
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });    
        });    
});

// Edit Story form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then((story) => {
        if (String(story.user) !== String(req.user.id)) {
            res.redirect('/stories');
        } else {
            res.render('stories/edit', {
                story: story
            });            
        }
    });
});

// Edit Form Process
router.put('/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then((story) => {        
        story.set({
            title: req.body.title,
            body: req.body.body,
            status: req.body.status,
            allowComments: req.body.allowComments ? true : false
        })
        .save()
        .then(() => {       
            res.redirect('/dashboard'); 
        });
    });
});

// Delete Story
router.delete('/:id', (req, res) => {    
    Story.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/dashboard');
        });
});

// Add Comment
router.post('/comment/:id', (req, res) => {    
    Story.findOne({
        _id: req.params.id
    })
    .then((story) => {  
        // Add to comment array
        story.comments.unshift({
            commentBody: req.body.commentBody,
            commentUser: req.user._id
        });
        
        story
            .save()
            .then((story) => {
                res.redirect(`/stories/show/${story._id}`); 
            });
    });
});

module.exports = router;