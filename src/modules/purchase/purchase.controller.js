import { createPurchaseService, getAllPurchasesService } from "./purchase.service.js";

export const createPurchase = async (req, res) => {
  try {
    const data = req.body;   // selectedPlan, companyName, email, billingDuration, startDate
    const purchase = await createPurchaseService(data);
    return res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      data: purchase
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPurchases = async (req, res) => {
  try {
    const list = await getAllPurchasesService();
    return res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
