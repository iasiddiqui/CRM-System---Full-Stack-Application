const prisma = require('../config/database');

// Public enquiry form (unauthenticated)
const createPublicEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        claimedBy: null // Start unclaimed
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        createdAt: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

// Get unclaimed enquiries (authenticated)
const getUnclaimedEnquiries = async (req, res, next) => {
  try {
    const enquiries = await prisma.enquiry.findMany({
      where: {
        claimedBy: null
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    next(error);
  }
};

// Claim an enquiry atomically (authenticated)
const claimEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employeeId = req.user.id;

    // Atomic claim operation using updateMany with claimedBy null check
    // This prevents race conditions where multiple employees try to claim the same enquiry
    const result = await prisma.$transaction(async (tx) => {
      // First, verify the enquiry exists and is unclaimed using SELECT FOR UPDATE equivalent
      // Prisma doesn't have direct SELECT FOR UPDATE, so we use updateMany which is atomic
      const updateResult = await tx.enquiry.updateMany({
        where: {
          id,
          claimedBy: null // Only update if unclaimed
        },
        data: {
          claimedBy: employeeId
        }
      });

      // If no rows were updated, enquiry is either claimed or doesn't exist
      if (updateResult.count === 0) {
        // Check if enquiry exists
        const enquiry = await tx.enquiry.findUnique({
          where: { id }
        });

        if (!enquiry) {
          throw new Error('NOT_FOUND');
        }

        if (enquiry.claimedBy) {
          throw new Error('ALREADY_CLAIMED');
        }
      }

      // Fetch the updated enquiry
      const claimedEnquiry = await tx.enquiry.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          message: true,
          claimedBy: true,
          createdAt: true,
          updatedAt: true,
          claimedByEmployee: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      return claimedEnquiry;
    });

    res.json({
      success: true,
      message: 'Enquiry claimed successfully',
      data: result
    });
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    if (error.message === 'ALREADY_CLAIMED') {
      return res.status(409).json({
        success: false,
        message: 'Enquiry has already been claimed by another employee'
      });
    }

    next(error);
  }
};

// Get enquiries claimed by the logged-in employee
const getMyEnquiries = async (req, res, next) => {
  try {
    const employeeId = req.user.id;

    const enquiries = await prisma.enquiry.findMany({
      where: {
        claimedBy: employeeId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        claimedBy: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPublicEnquiry,
  getUnclaimedEnquiries,
  claimEnquiry,
  getMyEnquiries
};

