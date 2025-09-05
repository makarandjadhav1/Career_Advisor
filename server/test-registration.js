// Simple test script to test registration without MongoDB
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// In-memory storage for testing
const users = [];

// Simple registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender, location, education } = req.body;

    // Basic validation
    if (!name || !email || !password || !dateOfBirth || !gender || !location?.state || !location?.city || !education?.currentLevel) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['name', 'email', 'password', 'dateOfBirth', 'gender', 'location.state', 'location.city', 'education.currentLevel']
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object
    const user = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      dateOfBirth,
      gender,
      location,
      education,
      createdAt: new Date().toISOString()
    };

    // Store user
    users.push(user);

    // Generate token
    const token = jwt.sign({ id: user.id }, 'test-secret-key', { expiresIn: '7d' });

    // Return success (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, 'test-secret-key', { expiresIn: '7d' });

    // Return success (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: 'test',
    usersCount: users.length
  });
});

// Get all users (for testing)
app.get('/api/users', (req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  res.json({ users: usersWithoutPasswords });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Registration: POST http://localhost:${PORT}/api/auth/register`);
  console.log(`Login: POST http://localhost:${PORT}/api/auth/login`);
});
