const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('./models/UserSchema.js');
const Shop = require('./models/Shop');
const Deal = require('./models/deal');
const Event = require('./models/Event');
const ShopOwner = require('./models/ShopOwner')
const Reservation = require('./models/reservation.js')
const bookingSchema = require("./models/bookingSchema.js");
const adminAuth = require('./middleware/adminAuth');
const verifyAdmin = require('./middleware/verifyAdmin.js');
const SportRoute = require('./Routes/SportRoute.js');
const SportRouteUser = require("./Routes/SportRouteUser.js");
const authenticateToken = require("../src/middleware/authenticationToken.js");
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);


require('dotenv').config();

const app = express();

const port = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(bodyParser.json());
// Admin routes
app.use('/api/admin', adminAuth, verifyAdmin);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));


//Routes //Sport
app.use("/sport", SportRoute);
app.use("/sport", SportRouteUser);

// Feedback form 
passport.use(new GoogleStrategy({
  clientID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }
    
    // If the user does not exist, create a new one
    const newUser = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id
    });
    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    return done(error, false);
  }
}
));

// Routes
app.get('/auth/google',
passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
passport.authenticate('google', { failureRedirect: '/login' }),
(req, res) => {
  const token = jwt.sign({ userId: req.user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.redirect(`http://localhost:3000?token=${token}`); // Redirect to frontend with token
}
);

// Login endpoint for regular login
app.post('/api/login', async (req, res) => {
const { email, password } = req.body;
if (!email || !password) {
  return res.status(400).json({ error: 'Email and password are required' });
}

try {
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Implement your password comparison logic here for non-Google users (e.g., bcrypt)
  
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
} catch (error) {
  res.status(500).json({ error: 'Internal Server Error' });
}
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { name, email, password, role } = req.body; // Include role in signup if needed

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/api/google-signup', async (req, res) => {
  const { token } = req.body; // This is the Google token received on the frontend

  try {
    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Replace with your Google Client ID
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      // User already exists, send a token
      const authToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ token: authToken });
    }

    // If user doesn't exist, create a new user
    const newUser = new User({
      name: payload.name,
      email: email,
      googleId: payload.sub,
      role: 'user', // Assign default role (can be customized)
    });

    await newUser.save();

    // Generate a token for the new user
    const authToken = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ token: authToken });
  } catch (error) {
    console.error('Error during Google signup:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Login endpoint
app.post('/api/login',  async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check for admin credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      console.log("Admin Login successfully")
      const token = jwt.sign(
        { userId: 'admin', role: 'admin' }, // Use a special identifier for admin
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return res.status(200).json({ token });
    }
    if (email === 'sportssection@gmail.com' && password === '1') {
      console.log("Sports Section Login successfully")
      const token = jwt.sign(
        { userId: 'sportsmanager', role: 'sportsmanager' }, // Use a special identifier for admin
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return res.status(200).json({ token });
    }

    // Check for regular user credentials
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`Token details: ${token}`);

    res.status(200).json({ token });

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// For getting user-details
// Rout




// Utility function to generate a random password
const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Public routes
app.get('/api/shops', async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (error) {
    console.error('Error fetching shops:', error);
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
});
app.get('/api/shopowners', async (req, res) => {
  try {
    const shopowners = await ShopOwner.find();
    res.json(shopowners);
  } catch (error) {
    console.error('Error fetching shops:', error);
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
});
app.get('/api/deals', async (req, res) => {
  try {
    const deals = await Deal.find();
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});
// Server-side code
app.put('/api/shops/:id', async (req, res) => {
  const { id } = req.params;
  const { location, contact } = req.body;

  try {
    const updatedShop = await Shop.findByIdAndUpdate(id, { location, contact }, { new: true });
    if (!updatedShop) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    res.json(updatedShop);
  } catch (error) {
    console.error('Error updating shop:', error);
    res.status(500).json({ error: 'Failed to update shop' });
  }
});
//admin routes
app.get('/api/admin/dashboard', (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard' });
});
app.get('/api/admin/shops', async (req, res) => {
  try {
    const shops = await Shop.find();
    console.log('Fetched shops from DB:', shops); // Log fetched shops
    res.json(shops);
  } catch (error) {
    console.error('Error fetching shops:', error);
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
});
// Add a new shop
// Add a new shop
app.post('/api/admin/shops', async (req, res) => {
  const { name, location, contact, image } = req.body;

  if (!name || !location || !contact) {
    return res.status(400).json({ error: 'Name, location, and contact are required' });
  }

  try {
    const newShop = new Shop({ name, location, contact, image });
    await newShop.save();
    res.status(201).json(newShop);
  } catch (error) {
    console.error('Error adding shop:', error);
    res.status(500).json({ error: 'Failed to add shop: ' + error.message });
  }
});
app.get('/stats', async (req, res) => {
  try {
    // Get the count of users, shop owners, and shops
    const usersCount = await User.countDocuments({});
    const shopOwnersCount = await ShopOwner.countDocuments({});
    const shopsCount = await Shop.countDocuments({});
    const SportbookingTrue = await bookingSchema.countDocuments({ is_booked: true });
    const SportbookingFalse = await bookingSchema.countDocuments({ is_booked: false });


    // Return the counts as JSON
    res.json({
      usersCount,
      shopOwnersCount,
      shopsCount,
      SportbookingTrue,
      SportbookingFalse
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to add a shop owner
app.post('/add-shopowners/:shopId', async (req, res) => {
  const { name, email, contact } = req.body;
  const { shopId } = req.params;

  try {
    // Generate a random password for the shop owner
    const password = generatePassword();
    console.log(password)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new shop owner
    const newShopOwner = new ShopOwner({
      name,
      email,
      contact,
      shop: shopId,
      password: hashedPassword, // Store hashed password
    });

    await newShopOwner.save();

    // Send the password to the shop owner's email
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // You can use any email service like Gmail, Outlook, etc.
      auth: {
        user: 'tharunkumarlagisetty@gmail.com', // Your email
        pass: 'bjbt ovza dnuf ayyp',  // Your email password
      },
    });

    const mailOptions = {
      from: 'tharunkumarlagisetty22@gmail.com',
      to: email,
      subject: 'Your Shop Owner Account Password',
      text: `Hello ${name},\n\nYour account has been created successfully. Here is your password: ${password}\nPlease log in and change your password immediately.\n\nBest regards,\nShopping Mall Admin`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Shop owner added successfully' });

  } catch (error) {
    console.error('Error adding shop owner:', error);
    res.status(500).json({ error: 'Failed to add shop owner' });
  }
});
// PUT route to update shop owner details
app.put('/api/shopowners/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  // Validate input
  // if (!name || !email) {
  //   return res.status(400).json({ message: 'Name and email are required.' });
  // }

  try {
    // Find shop owner by ID and update details
    const updatedOwner = await ShopOwner.findByIdAndUpdate(
      id,
      { name, email },
      { new: true } // Return the updated document and validate changes
    );

    if (!updatedOwner) {
      return res.status(404).json({ message: 'Shop owner not found.' });
    }

    res.status(200).json(updatedOwner);
  } catch (error) {
    console.error('Error updating shop owner:', error);
    res.status(500).json({ message: 'Server error. Could not update shop owner.' });
  }
});

// DELETE route to delete a shop owner by ID
app.delete('/api/shopowners/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOwner = await ShopOwner.findByIdAndDelete(id);

    if (!deletedOwner) {
      return res.status(404).json({ message: 'Shop owner not found.' });
    }

    res.status(200).json({ message: 'Shop owner deleted successfully.' });
  } catch (error) {
    console.error('Error deleting shop owner:', error);
    res.status(500).json({ message: 'Server error. Could not delete shop owner.' });
  }
});
//shopOwner
app.post('/shopownerlogin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the shop owner by email
    const shopOwner = await ShopOwner.findOne({ email });

    if (!shopOwner) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, shopOwner.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate a token or return a success message
    // Option 1: Use JWT for token-based authentication
    const token = jwt.sign({ id: shopOwner._id, role: 'shopowner' }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    // Option 2: Return success message (if you are not using JWT)
    res.json({
      message: 'Login successful',
      token: token, // Send token if you are using it
      shopOwner: { id: shopOwner._id, email: shopOwner.email }, // Or other required details
    });
    // sessionStorage.setItem('shopOwnerId', shopOwner._id);
  } catch (error) {
    console.error('Error during shop owner login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//deals
app.put('/api/deals/:id', async (req, res) => {
  try {
    const { store, description, expiration, image } = req.body;
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { store, description, expiration, image },
      { new: true }  // Return the updated deal
    );

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//adddeals
app.post('/api/add-deal', async (req, res) => {
  const { store, description, expiration, image } = req.body;

  try {
    const newDeal = new Deal({
      store,
      description,
      expiration,
      image,
    });

    const savedDeal = await newDeal.save();
    res.status(201).json(savedDeal);
  } catch (error) {
    console.error('Error adding deal:', error);
    res.status(500).json({ message: 'Failed to add deal' });
  }
});
//stats
app.get('api/deals-expiration-stats', async (req, res) => {
  try {
    const deals = await Deal.find({}); // Fetch all deals

    const expirationStats = deals.reduce((acc, deal) => {
      const expirationDate = deal.expiration.toISOString().split('T')[0]; // Format date
      if (!acc[expirationDate]) {
        acc[expirationDate] = 0;
      }
      acc[expirationDate]++;
      return acc;
    }, {});

    res.status(200).json(expirationStats);
  } catch (error) {
    console.error('Error fetching deal stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.use("/sport", SportRoute);


const availableTables = [
  { _id: 1, name: "Table 1", capacity: 4, location: "Patio", isAvailable: true },
  { _id: 2, name: "Table 2", capacity: 2, location: "Inside", isAvailable: false },
  { _id: 3, name: "Table 3", capacity: 6, location: "Bar", isAvailable: true },
  { _id: 4, name: "Table 4", capacity: 8, location: "Patio", isAvailable: true },
  { _id: 5, name: "Table 5", capacity: 4, location: "Inside", isAvailable: false },
  { _id: 6, name: "Table 6", capacity: 2, location: "Bar", isAvailable: true },
  { _id: 7, name: "Table 7", capacity: 10, location: "Patio", isAvailable: true },
  { _id: 8, name: "Table 8", capacity: 6, location: "Inside", isAvailable: false },
  { _id: 9, name: "Table 9", capacity: 4, location: "Bar", isAvailable: true },
  { _id: 10, name: "Table 10", capacity: 8, location: "Patio", isAvailable: true },
  { _id: 11, name: "Table 11", capacity: 2, location: "Inside", isAvailable: true },
  { _id: 12, name: "Table 12", capacity: 6, location: "Bar", isAvailable: false }
];



app.post('/availability', (req, res) => {
  const { date } = req.body;
  // Fetch the available tables based on the date from MongoDB or other database

  res.json({ tables: availableTables });
});
app.post("/reservation", function (req, res, next) {
  const currentDate = new Date().toISOString().split('T')[0];

  // Ensure required fields are provided
  const { date, table, name, phone, email } = req.body;
  if (!date || !table || !name || !phone || !email) {
    return res.status(400).send("All fields are required.");
  }

  console.log("Processing reservation...");

  const selectedTable = availableTables.find(t => t._id == table);
  if (!selectedTable) {
    return res.status(404).send("Table not found.");
  }

  // Check if the table is available
  if (!selectedTable.isAvailable) {
    return res.status(400).send("Table is already reserved.");
  }

  // Mark the table as unavailable
  selectedTable.isAvailable = false;
  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'tharunkumarlagisetty@gmail.com', // Your email
      pass: 'bjbt ovza dnuf ayyp', // Your email password
    },
  });

  // Email options
  const mailOptions = {
    from: 'tharunkumarlagisetty22@gmail.com',
    to: email,
    subject: 'Reservation Confirmation',
    text: `Hello ${name},\n\nYou have successfully booked table ${table} for today, ${currentDate}. Thank you for choosing our restaurant!`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
      return res.status(500).send("Failed to send confirmation email");
    } else {
      console.log("Email sent:", info.response);
      return res.status(200).send("Reservation confirmed and email sent");
    }
  });
});



// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
