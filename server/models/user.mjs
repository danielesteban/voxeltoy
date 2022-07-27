import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const sessionSecret = process.env.SESSION_SECRET || 'superunsecuresecret';
if (
  sessionSecret === 'superunsecuresecret'
  && process.env.NODE_ENV === 'production'
) {
  console.warn('\nSecurity warning:\nYou must provide a random SESSION_SECRET.\n');
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: true,
    index: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

UserSchema.index({ name: 1 }, { name: 'name_2', collation: { locale: 'en', strength: 2 }, unique: true });

UserSchema.pre('save', function onSave(next) {
  const user = this;
  if (user.isModified('password')) {
    return bcrypt.genSalt(5, (err, salt) => {
      if (err) {
        return next(err);
      }
      return bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        user.password = hash;
        return next();
      });
    });
  }
  return next();
});

UserSchema.methods = {
  comparePassword(candidatePassword) {
    const user = this;
    return new Promise((resolve, reject) => (
      bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(isMatch);
      })
    ));
  },
  getSession() {
    return {
      name: this.name,
      session: jwt.sign(
        { id: this.id },
        sessionSecret,
        { expiresIn: '24h' }
      ),
    };
  },
};

UserSchema.statics = {
  fromToken(token) {
    const User = this;
    return new Promise((resolve, reject) => (
      jwt.verify(token, sessionSecret, (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(
          User
            .findById(decoded.id)
            .select('-password')
        );
      })
    ));
  },
};

export default mongoose.model('User', UserSchema);
