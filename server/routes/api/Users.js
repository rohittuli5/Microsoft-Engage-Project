const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validation

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model

const User = require("../../models/Users");


/**
 * This api is used to register new users.
 * If form data is invalid or email already exists in database it returns an error
 * else it creates the account
 */
router.post("/register", (req, res) => {
    // validate registration data for errors
    const {errors, isValid} = validateRegisterInput(req.body);

    // if there is some error return error code 400 with error description
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({email : req.body.email}).then(user=>{
        // if user is already in database return error
        // else if he is a new user create an account
        if(user){
            return res.status(400).json({email: "Email already exists in database"});
        }
        else{
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                userType: req.body.userType,
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser.save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
              });
              return res.status(200).json({email:newUser.email, name:newUser.name, userType:newUser.userType})

        }

    });

});


// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
    User.findOne({ email }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }
  // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            name: user.name,
            userType:user.userType,
            email:user.email,
          };
        // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });
  // export the router
  module.exports = router;