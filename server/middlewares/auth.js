import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth(); // Clerk SDK
    const hasPremiumPlan = await has({ plan: 'premium' });
    const user = await clerkClient.users.getUser(userId);

    const currentFreeUsage = user.privateMetadata?.free_usage;

    let freeUsage = 0;
    if (typeof currentFreeUsage === 'number') {
      freeUsage = currentFreeUsage;
    } else {
      // Initialize if missing or corrupted
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: 0 },
      });
    }

    req.free_usage = freeUsage;
    req.plan = hasPremiumPlan ? 'premium' : 'free';
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};
