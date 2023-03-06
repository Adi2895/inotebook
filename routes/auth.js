const express = require('express');

// User is a collection in the database under schema in the user file
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
// bcrypt package to make the password more strong
const bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = 'Adityajangrais$a$good%$boy';


//   Route:1
// create a user using: POSTv"/api/auth/createuser". no login required
router.post("/createuser", [

    // these isemail , isLength comes under express package
    body('email', 'Enter a valid email').isEmail(),
    body('name', 'Enter a valid name').isLength({ min: 5 }),
    body('password', 'Password must be of minimum 8 characters').isLength({ min: 8 }),
], async (req, res) => {

    // if there are errors , return the bad request and the errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        // check whether the user email already exist or not 

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            // checking the user already exist or not 
            return res.status(400).json({ error: "sorry a user with the same email already exist" })
        }


        var salt = bcrypt.genSaltSync(10);
        secpass = await bcrypt.hashSync(req.body.password, salt);
        // adding salt to the password to make it more strong

        // creating a new user 
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secpass,
        })


        const data = {
            user: {
                // fetch the user id
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        // authtoken is provided to the user to authenticiate him/herself
        // done with the help of jsonwebtoken package


        res.json(authToken);
    } catch (error) {
        // if there is some error in the code above 500 status code will be showed
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})





// Route:2
// authenticate a user using: POSTv"/api/auth/login". no login required
router.post("/login", [

    // these isemail , isLength comes under express package
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),

], async (req, res) => {


    // if there are errors , return the bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {

        let user = await User.findOne({ email })
        // find the user with email provided by the user

        if (!user) {
            // user doesnot exixt with this email so send the status and msg
            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }

        const data = {
            user: {
                // fetch the user id
                id: user.id
            }
        }
        const authToken = await jwt.sign(data, JWT_SECRET);
        // authtoken is provided to the user to authenticiate him/herself
        // done with the help of jsonwebtoken package
        res.json({ authToken });

    } catch (error) {

        // if there is some error in the code above 500 status code will be showed
        console.error(error.message);
        res.status(500).send("Internal Server Error ");

    }


})


// Route :3 
// get logged in details user Details using : Post "api/auth/getuser" lgin required

router.post("/getuser",   async (req, res) => {

    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user);
    } catch (error) {


        // if there is some error in the code above 500 status code will be showed
        console.error(error.message);
        res.status(500).send("Internal Server Error ");

    }
})
module.exports = router