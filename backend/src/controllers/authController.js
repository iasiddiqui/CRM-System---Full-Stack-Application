const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { generateToken } = require('../utils/jwt');

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee
   const employee = await prisma.Employee.create({
  data: {
    email,
    password: hashedPassword,
    name
  },
  select: {
    id: true,
    email: true,
    name: true,
    createdAt: true
  }
    });

    // Generate token
    const token = generateToken(employee);

    res.status(201).json({
      success: true,
      message: 'Employee registered successfully',
      data: {
        employee,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find employee
    const employee = await prisma.employee.findUnique({
      where: { email }
    });

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, employee.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(employee);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        employee: {
          id: employee.id,
          email: employee.email,
          name: employee.name
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };

