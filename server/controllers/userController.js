const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const dummyUsers = require('../data/dummyUsers');

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res, next) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalUsers = await User.countDocuments();

    // Fetch paginated users
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalUsers / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        limit,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    next(error);
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    // Create audit log entry
    await AuditLog.create({
      action: 'CREATE',
      entityType: 'USER',
      entityId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      details: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
      },
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create audit log entry
    await AuditLog.create({
      action: 'UPDATE',
      entityType: 'USER',
      entityId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      details: {
        updatedFields: req.body,
        currentData: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status,
        },
      },
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create audit log entry
    await AuditLog.create({
      action: 'DELETE',
      entityType: 'USER',
      entityId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      details: {
        deletedUser: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {},
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    next(error);
  }
};

// @desc    Search users by name
// @route   GET /api/users/search?name=
// @access  Public
const searchUsers = async (req, res, next) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name query parameter is required',
      });
    }

    // Search by first name or last name (case-insensitive)
    const users = await User.find({
      $or: [
        { firstName: { $regex: name, $options: 'i' } },
        { lastName: { $regex: name, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed database with dummy users
// @route   POST /api/users/seed
// @access  Public
const seedUsers = async (req, res, next) => {
  try {
    // Clear existing users
    await User.deleteMany();

    // Insert dummy users
    const users = await User.insertMany(dummyUsers);

    res.status(201).json({
      success: true,
      count: users.length,
      message: 'Database seeded successfully',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  seedUsers,
};
