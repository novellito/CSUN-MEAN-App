const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config/database');
const User = require('../models/user');
const Schedule = require('../models/schedule');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({name: req.body.name, email: req.body.email, username: req.body.username, password: req.body.password, sched: []});

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({success: false, msg: 'failed to register'});
    } else {
      res.json({success: true, msg: 'user registered'});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) 
      throw err;
    if (!user) {
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) 
        throw err;
      if (isMatch) {
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});
router.post('/profUp', passport.authenticate('jwt', {session: false}), (req, res, next) => {

  let currUser = User.findById(req.user._id, (err, user) => {

    if (err) {
      res.json({success: false, msg: 'failed to add schedule'});
    } else {
      res.json({success: true, msg: 'Schedule Added!'});
      user
        .sched
        .push(req.body);
      user.save();
      console.log('User Schedule saved!');
    }

  });

});

router.post('/delSched', passport.authenticate('jwt', {session: false}), (req, res, next) => {

  let currUser = User.findById(req.user._id, (err, user) => {
    user
      .sched
      .splice(req.body.val, 1);
    user.save();
    console.log(`User schedule at index ${req.body.val} has been deleted`);

  });
});

router.post('/upSched', passport.authenticate('jwt', {session: false}), (req, res, next) => {

  let currUser = User.findById(req.user._id, (err, user) => {
    console.log(user.sched[req.body.index]);   
    console.log(user.sched); 
    if (err) {
      res.json({success: false, msg: 'failed to add schedule'});
    } else {
      res.json({success: true, msg: 'Schedule Added!'});
      user.sched[req.body.index].title = req.body.title;
      user.sched.splice(req.body.index, 1, {title:user.sched[req.body.index].title ,schedule:req.body.content});
      user.save();
    }
  });
});


// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: req.user});
});

module.exports = router;
