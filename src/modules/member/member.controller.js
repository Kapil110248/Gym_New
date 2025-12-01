import {
  createMemberService,
  listMembersService,
  memberDetailService,
} from "./member.service.js";

export const createMember = async (req, res, next) => {
  try {
    const m = await createMemberService(req.body);
    res.json({ success: true, member: m });
  } catch (err) {
    next(err);
  }
};

// export const listMembers = async (req, res, next) => {
//   try {
//     const branchId = parseInt(req.params.branchId);
//     const list = await listMembersService(branchId);
//     res.json({ success: true, members: list });
//   } catch (err) {
//     next(err);
//   }
// };


export const listMembers = async (req, res, next) => {
  try {
    const branchId = parseInt(req.params.branchId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const data = await listMembersService(branchId, page, limit);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

export const memberDetail = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const member = await memberDetailService(id);
    res.json({ success: true, member });
  } catch (err) {
    next(err);
  }
};
