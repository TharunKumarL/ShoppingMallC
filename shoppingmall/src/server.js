const express = require('express');
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
const bookingSchema = require("./models/bookingSchema.js");
const Manager=require("./models/manager.js")
const adminAuth = require('./middleware/adminAuth');
const verifyAdmin = require('./middleware/verifyAdmin.js');
const SportRoute = require('./Routes/SportRoute.js');
const SportRouteUser = require("./Routes/SportRouteUser.js");
const authenticateToken = require("../src/middleware/authenticationToken.js");


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


//Routes //Sport
app.use("/sport", SportRoute);
app.use("/sport", SportRouteUser);

`  `
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Database connected successfully'))
.catch((error) => console.error('Database connection error:', error));


app.post('/api/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

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
    console.log('User object:', newUser);  // Log user object

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error('Error during signup:', error);  // Log the complete error
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

app.post('/api/manager-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the manager exists in the database
    const manager = await Manager.findOne({ email });

    if (!manager) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the hashed password with the input password
    const isMatch = await bcrypt.compare(password, manager.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token with the manager's role and section information
    const payload = {
      id: manager._id,
      email: manager.email,
      role: 'manager',
      section: manager.section, // Store section (sports, restaurant, etc.)
    };

    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

    // Respond with the token
    res.status(200).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
let x=''
app.post('/api/shopowner-login', async (req, res) => {
  const { email, password } = req.body;
  x=email
  console.log(x)
  try {
    // Check if the shop owner exists in the database
    const shopOwner = await ShopOwner.findOne({ email });

    if (!shopOwner) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the hashed password with the input password
    const isMatch = await bcrypt.compare(password, shopOwner.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token with the shop owner's info
    const payload = {
      id: shopOwner._id,
      email: shopOwner.email,
      name: shopOwner.name,
      shop: shopOwner.shop, // Include shop information if needed
      contact: shopOwner.contact, // Include contact info if needed
      role: 'shopOwner', // Set the role as 'shopOwner' to differentiate
    };

    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

    // Respond with the token
    res.status(200).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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
app.post("/api/managers", async (req, res) => {
  try {
    const { name, email, section } = req.body;

    // Generate a random password
    const password = Math.random().toString(36).slice(-8);

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the manager
    const manager = new Manager({
      name,
      email,
      password: hashedPassword,
      section,
    });

    await manager.save();

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or another provider
      auth: {
        user: 'tharunkumarlagisetty@gmail.com', // Replace with your email
        pass: 'bjbt ovza dnuf ayyp',   // Replace with your email password or app password
      },
    });

    // Email content
    const mailOptions = {
      from: 'your-email@example.com',
      to: email,
      subject: 'Your Manager Account Credentials',
      text: `Dear ${name},\n\nYour manager account has been created successfully.\n\nHere are your credentials:\nEmail: ${email}\nPassword: ${password}\n\nPlease log in and change your password immediately.\n\nThank you!`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(201).send({ message: "Manager created successfully and email sent!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send({ message: error.message });
  }
});
app.get('/api/a/shops', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Pagination parameters
    const shops = await Shop.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ name: 1 }); // Sort by name alphabetically

    console.log('Fetched shops from DB:', shops); // Log fetched shops
    res.status(200).json(shops); // Explicitly send status 200
  } catch (error) {
    console.error('Error fetching shops:', error.message, error.stack); // Improved error logs
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
});
app.get('/api/a/shops/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const shop = await Shop.findById(id);

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found.' });
    }

    res.status(200).json(shop);
  } catch (error) {
    console.error('Error fetching shop details:', error.message);

    // Handle invalid ObjectId errors
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid shop ID.' });
    }

    res.status(500).json({ message: 'Server error. Could not fetch shop details.' });
  }
});

app.put('/api/a/shops/:id', async (req, res) => {
  const { id } = req.params;
  const { name, location, contact, workingHours, image } = req.body;

  try {
    // Fetch the existing shop details
    const existingShop = await Shop.findById(id);

    if (!existingShop) {
      return res.status(404).json({ message: 'Shop not found.' });
    }

    // Update only the provided fields
    const updatedData = {
      name: name || existingShop.name,
      location: location || existingShop.location,
      contact: contact || existingShop.contact,
      workingHours: workingHours || existingShop.workingHours,
      image: image || existingShop.image,
    };

    const updatedShop = await Shop.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update against the schema
    });

    res.status(200).json(updatedShop);
  } catch (error) {
    console.error('Error updating shop:', error.message);

    // Handle validation or server errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Server error. Could not update shop.' });
  }
});

// Add a new shop
app.post('/api/admin/shops', async (req, res) => {
  const { name, location, contact, image, workingHours, owner } = req.body;

  if (!name || !location || !contact || !owner || !owner.name || !owner.email || !owner.contact) {
    return res.status(400).json({ 
      error: 'Name, location, contact, and complete owner details are required' 
    });
  }

  // Ensure that workingHours are provided, if not default to closed for all days
  const defaultWorkingHours = {
    monday: 'Closed',
    tuesday: 'Closed',
    wednesday: 'Closed',
    thursday: 'Closed',
    friday: 'Closed',
    saturday: 'Closed',
    sunday: 'Closed',
  };

  const finalWorkingHours = { ...defaultWorkingHours, ...workingHours };

  try {
    const password = generatePassword();
    console.log(password)
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the ShopOwner if it doesn't already exist
    let shopOwner = await ShopOwner.findOne({ email: owner.email });

    // If owner doesn't exist, create a new ShopOwner
    if (!shopOwner) {
      shopOwner = new ShopOwner({
        name: owner.name,
        email: owner.email,
        contact: owner.contact,
        password: hashedPassword, // Make sure to hash the password before saving
        shop: name, // Store shop name in ShopOwner
      });
      await shopOwner.save();
    }
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
          to: owner.email,
          subject: 'Your Shop Owner Account Password',
          text: `Hello ${name},\n\nYour account has been created successfully. Here is your password: ${password}\nPlease log in and change your password immediately.\n\nBest regards,\nShopping Mall Admin`,
        };
    
        await transporter.sendMail(mailOptions);

    // Create the shop
    const newShop = new Shop({
      name,
      location,
      contact,
      image,
      workingHours: finalWorkingHours,
      owner
    });

    await newShop.save();

    // Update ShopOwner with the shop ID and name
    shopOwner.shopId = newShop.__id;
    shopOwner.shopName = newShop.name; // Add shop name to ShopOwner
    await shopOwner.save();

    // Respond with the created shop
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
      text: `Hello ${name},\n\nYour account has been created successfully. Here is your password: ${password}\nPlease log in \n\nBest regards,\nShopping Mall Admin`,
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
  x=email
  console.log(x)
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
app.get('/api/shopowner/profile', async (req, res) => {
  console.log(x)
  try {
    console.log( x);
    
    // Find the shop owner by email
    const shopOwner = await ShopOwner.findOne({ email: x }).select('-password'); // Exclude the password field
    
    if (!shopOwner) {
      return res.status(404).json({ message: 'Shop Owner not found' });
    }

    // Respond with the shop owner's profile
    res.json({
      name: shopOwner.name,
      email: shopOwner.email,
      contact: shopOwner.contact,
      shop: shopOwner.shop,
    });
  } catch (error) {
    console.error('Error fetching shop owner profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.put('/api/shopowner/profile', async (req, res) => {
  try {
    // Update the shop owner profile by email
    const shopOwner = await ShopOwner.findOneAndUpdate(
      { email: x }, // Query by email
      req.body, // Update with the request body
      { new: true } // Return the updated document
    );

    if (!shopOwner) {
      return res.status(404).json({ message: 'Shop Owner not found' });
    }

    res.json({
      message: 'Profile updated successfully!',
      shopOwner,
    });
  } catch (error) {
    console.error('Error updating shop owner profile:', error);
    res.status(500).json({ message: 'Server error' });
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




// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
