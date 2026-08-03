const Book = require('../models/Book');

// @desc    Get all books for logged in user (with filtering, sorting, pagination)
// @route   GET /api/v1/books
// @access  Private
const getBooks = async (req, res, next) => {
  try {
    const { status, genre, search, isFavorite, sort, limit = 50, page = 1 } = req.query;
    
    // Build query
    const query = { user: req.user.id };
    
    // Match filtering
    if (status) query.status = status;
    if (genre) query.genre = genre;
    if (isFavorite) query.isFavorite = isFavorite === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    let mongooseQuery = Book.find(query);

    // Sorting
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      mongooseQuery = mongooseQuery.sort(sortBy);
    } else {
      mongooseQuery = mongooseQuery.sort('-createdAt');
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    
    mongooseQuery = mongooseQuery.skip(skip).limit(limitNum);

    const books = await mongooseQuery;
    const total = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      },
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book
// @route   GET /api/v1/books/:id
// @access  Private
const getBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user.id });

    if (!book) {
      res.status(404);
      return next(new Error('Book not found'));
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new book
// @route   POST /api/v1/books
// @access  Private
const createBook = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update book
// @route   PUT /api/v1/books/:id
// @access  Private
const updateBook = async (req, res, next) => {
  try {
    let book = await Book.findOne({ _id: req.params.id, user: req.user.id });

    if (!book) {
      res.status(404);
      return next(new Error('Book not found'));
    }
    
    // Update lastReadDate if status changed to Reading or Completed
    if (req.body.status && req.body.status !== book.status && (req.body.status === 'Reading' || req.body.status === 'Completed')) {
      req.body.lastReadDate = Date.now();
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete book
// @route   DELETE /api/v1/books/:id
// @access  Private
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!book) {
      res.status(404);
      return next(new Error('Book not found'));
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Book deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/v1/books/stats/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Run aggregations in parallel
    const [statusStats, genreStats, totalBooks, thisMonthCount] = await Promise.all([
      Book.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Book.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: '$genre', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      Book.countDocuments({ user: userId }),
      Book.countDocuments({ 
        user: userId, 
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } 
      })
    ]);

    // Format stats for frontend
    const formattedStatus = {
      'Want to Read': 0,
      'Reading': 0,
      'Completed': 0
    };
    
    statusStats.forEach(stat => {
      formattedStatus[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        statusCounts: formattedStatus,
        topGenres: genreStats,
        booksAddedThisMonth: thisMonthCount,
        readingGoal: req.user.readingGoal
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getDashboardStats
};
