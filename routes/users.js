const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')


const User = require('../views/models/users')


//login page
router.get('/login', (req, res) => {
   res.render('login')
})


// Register Page
router.get('/register', (req, res) => {
   res.render('register')
})


//handling the register data we gety from the form

router.post('/register', (req, res) => {

   const { name, email, password, password2 } = req.body;
   //console.log(req.body)

   let errors = []

   //checking the required fields in my form
   if (!name || !email || !password || !password2) {
      errors.push({
         message: 'please fill in all the fields'
      })
   }

   //check if the passwords match

   if (password != password2) {
      errors.push({
         message: 'make sure that the passwords match'
      })
   }


   //check if the password are at least 6characters long

   if (password.length < 6) {
      errors.push({
         message: 'The password should be of at least 6 characters'
      })
   }

   console.log(errors)

   if (errors.length > 0) {
      res.render('register', { errors })
   } else {

      User.findOne({ email: email }).then(
         user => {
            if (user) {
               errors.push({ message: 'This user email already exist' })
               res.render('register', { errors, name, email, password, password2 })
            }
            else {
               const newUser = new User({
                  name: name,
                  email: email,
                  password: password,
               })
               //console.log(newUser)

               //hashing the password
               bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;


                  //set my passeqword to the hashed one
                  newUser.password = hash

                  //saving the user inside my database

                  newUser.save()
                     .then(user => {
                        res.redirect('./login')
                     })
                     .catch(err => console.log(err))
               }))

            }
         }
      )

   }
})


module.exports = router;