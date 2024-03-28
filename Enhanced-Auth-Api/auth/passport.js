const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/User');

// Pre-existing LocalStrategy and GoogleStrategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username });
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    if (!(await user.comparePassword(password)))
      return done(null, false, { message: 'Incorrect password.' });
    return done(null, user);
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) return done(null, existingUser);
      const newUser = await new User({ googleId: profile.id }).save();
      done(null, newUser);
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ facebookId: profile.id });
      if (existingUser) return done(null, existingUser);
      const newUser = await new User({ facebookId: profile.id, email: profile.email }).save();
      done(null, newUser);
    }
  )
);

// Twitter Strategy
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: '/auth/twitter/callback',
      userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
    },
    async (token, tokenSecret, profile, done) => {
      const existingUser = await User.findOne({ twitterId: profile.id });
      if (existingUser) return done(null, existingUser);
      const newUser = await new User({ twitterId: profile.id, email: profile. emails[0].value }).save();
      done(null, newUser);
    }
  )
);

// Github Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ githubId: profile.id });
      if (existingUser) return done(null, existingUser);
      const newUser = await new User({ githubId: profile.id, email: profile.emails[0].value }).save();
      done(null, newUser);
    }
  )
);