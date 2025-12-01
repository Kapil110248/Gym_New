import { registerUser, loginUser } from "./auth.service.js";

// export const register = async (req, res, next) => {
//   try {
//     const user = await registerUser(req.body);
//     res.json({ success: true, user });
//   } catch (err) {
//     next(err);
//   }
// };

export const register = async (req, res, next) => {
  try {
    // pass req.body directly to service
    const user = await registerUser(req.body);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// export const login = async (req, res, next) => {
//   try {
//     const data = await loginUser(req.body);
//     res.json({ success: true, ...data });
//   } catch (err) {
//     next(err);
//   }
// };

export const login = async (req, res, next) => {
  try {
    const data = await loginUser(req.body);
    res.json({
      success: true,
      token: data.token,
      user: {
        id: data.user.id,
        fullName: data.user.fullName,
        email: data.user.email,
        phone: data.user.phone,
        role: data.user.role.name || null,
        branchId: data.user.branchId,
        branchName: data.user.branch?.name || null,
      },
    });
  } catch (err) {
    next(err);
  }
};
