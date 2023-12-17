const Promoter = require('../models/promoter.model');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');


//  - - - S I G N  U P - - - //
exports.signup = async (req, res) => {
    // destructure request
    const { email, name, surname, password, organization} = req.body;

    // Check if promoter already exists
    let promoter = await Promoter.findOne({email: email});
    
    if (promoter) {
        return res.status(400).json({
            "status": false,
            "data": {"msg": "Promoter already exists"}
        })
    }

    // Hash Password
    let salt = Number(process.env.SALT);
    let hashedPassword = await bcrypt.hash(password, salt)

    // Create new promoter
    let newPromoter = new Promoter({
        email,
        name,
        surname,
        password: hashedPassword,
        organization
    })

    // Save new promoter to database
    console.log('Attempting register of :', name);

    try {
        const result = await newPromoter.save();

        // Return result but not the password
        const {password, ...data} = result.toJSON();
        res.status(200).json({status: true, data: data});
    } catch (err) {
        res.status(400).json({status: false, data: err});
        console.log('Failed registering', name);
    }
}

//  - - - L O G  I N - - - //
exports.login = async (req, res) => {
    
    // Check Promoter's existance
    const promoter = await Promoter.findOne({email: req.body.email});
    if (!promoter) {
        return res.status(400).json({
            status: false, 
            data: {msg: 'Promoter not found'}
        })
    }

    // Check password 
    if (!await bcrypt.compare(req.body.password, promoter.password)) {
        return res.status(400).json({
            "status": false,
            "data": {"msg": "Invalid Credentials"}
        })
    }

    // Generate JWT
    const token = JWT.sign({_id: promoter._id}, process.env.JWT_SECRET);

    // Send Cookie
    res.cookie('jwt', token, {
        // Limit access to backend only
        httpOnly: true,
        // Allow cross-origin requests to include cookies.
        sameSite: 'None',
        // Ensure cookie is sent only over secure connections
        secure: true,
        // 1 day access
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        "status": true,
        "data": {"msg": "Login success"}
    })
}

// - - - A U T H - - - //
exports.auth = async (req, res) => {
    
    try {
        // Access cookie
        const cookie = req.cookies['jwt'];

        // Decode cookie
        const claims = JWT.verify(cookie, process.env.JWT_SECRET);
        if (!claims) {
            res.status(401).json({
                "status": false,
                "data": {"msg": "Unauthenticated"}
            })
        }

        // Access promoter
        const promoter = await Promoter.findOne({"_id": claims._id});
        
        // Exclude password
        const {password, ...data} = promoter.toJSON();

        res.status(200).json({
            "status": true,
            "data": data
        })

    } catch(err) {
        res.status(401).json({
            "status": false,
            "data": {"msg": "unauthenticated"}
        })
    }
}

// - -  - L O G  O U T - - - //
exports.logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 0, httpOnly: true, secure: true, sameSite: 'None'});
    res.status(200).json({
        "status": true,
        "data": {"msg": "Logout success"}
    })
}
