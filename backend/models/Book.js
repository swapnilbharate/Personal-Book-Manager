const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Please add an author'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    genre: {
      type: String,
      default: 'Uncategorized',
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Want to Read', 'Reading', 'Completed'],
      default: 'Want to Read',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    lastReadDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate book titles for the same user (optional but good practice)
bookSchema.index({ user: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('Book', bookSchema);
