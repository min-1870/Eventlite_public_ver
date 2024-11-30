// Importing functions/libraries
const express = require('express');
const cors = require('cors')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routers
const authRouter = require('./routes/auth');
const eventRouter = require('./routes/event');
const recommendationsRouter = require('./routes/recommendations');
const searchRouter = require('./routes/search_filter');
const reviewRouter = require('./routes/star_rating_review_system');
const tagRouter = require('./routes/tags');
const adminRouter = require('./routes/admin');

// Test route
app.get('/api', (req, res) => {
    res.json({ "users": ["user1", "user2", "user3"] })
});

// Router to auth.js
app.use("/auth", authRouter);

// Router to event.js
app.use('/main_page', eventRouter);

// Router to event.js
app.use('/main_page', recommendationsRouter);

// Router to search_filter.js
app.use('/search', searchRouter);

// Router to search_filter.js
app.use('/review', reviewRouter);

// Router to tags.js
app.use('/tags', tagRouter);

// Router to admin.js
app.use('/admin', adminRouter);

module.exports = app;
