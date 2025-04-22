const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

require('./dbConnect')();
const USER = require('./userSchema');

app.use(cors());
app.use(express.json());

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer-Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user_profiles', // Cloudinary folder name
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

const upload = multer({ storage });

const SECRET_KEY = "yourSecrhqwghuqgwdyugqyugetKey";

app.get('/', (req, res) => {
    console.log("home page running")
    res.send("welcome to home page")
})

// Register route
app.post('/register', upload.single('profilepic'), async (req, res) => {
    try {
        const {
            name, email, contact, aadhar, gender,
            dob, address, city, bloodgroup, password
        } = req.body;

        const userExist = await USER.findOne({ email });
        if (userExist) return res.send({ message: "User already exists", codeStatus: 1 });

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new USER({
            name, email, contact, aadhar, gender,
            dob, address, city, bloodgroup,
            password: hashPassword,
            profilepic: req.file.path, // Cloudinary URL
            token: ''
        });

        await newUser.save();

        res.send({ message: "Register Successfully", codeStatus: 2, user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
});

// Login route (unchanged)
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await USER.findOne({ email });
        if (!userExist) {
            return res.status(404).send({ message: "User Not Found!" });
        }

        const isMatch = await bcrypt.compare(password, userExist.password);
        if (!isMatch) {
            return res.status(401).send({ message: "Password is not match" });
        }

        const token = jwt.sign({ id: userExist._id, email: userExist.email }, SECRET_KEY, { expiresIn: '1h' });

        res.send({
            message: "Login successful",
            token,
            user: { name: userExist.email }
        });

    } catch (error) {
        console.log("Login error", error);
        res.status(500).send({ message: "Server error" });
    }
});

app.listen(1300, () => {
    console.log("Server running on http://localhost:1300");
});





// // Configure storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // make sure this directory exists
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

// const upload = multer({ storage: storage });
