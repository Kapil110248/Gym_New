import { prisma } from "../../config/db.js";

// Create new product
export const createProductService = async (data) => {
  const { name, sku, category, sellingPrice, costPrice, openingStock, branchId } =
    data;

  // check SKU unique (if given)
  if (sku) {
    const exist = await prisma.product.findUnique({ where: { sku } });
    if (exist) throw { status: 400, message: "SKU already exists" };
  }

  const product = await prisma.product.create({
    data: {
      name,
      sku,
      category,
      sellingPrice,
      costPrice,
      currentStock: openingStock || 0,
      branchId,
      movements: openingStock
        ? {
            create: {
              type: "OPENING",
              quantity: openingStock,
              note: "Opening stock",
            },
          }
        : undefined,
    },
  });

  return product;
};

// List products for branch with optional search
export const listProductsService = async (branchId, search) => {
  return prisma.product.findMany({
    where: {
      branchId,
      isActive: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { id: "desc" },
  });
};

// Update basic product info
export const updateProductService = async (id, data) => {
  const { name, sku, category, sellingPrice, costPrice, isActive } = data;

  // Optional SKU uniqueness check
  if (sku) {
    const exist = await prisma.product.findFirst({
      where: { sku, NOT: { id } },
    });
    if (exist) throw { status: 400, message: "SKU already in use" };
  }

  return prisma.product.update({
    where: { id },
    data: {
      name,
      sku,
      category,
      sellingPrice,
      costPrice,
      isActive,
    },
  });
};

// Stock adjustment (purchase, sale, etc.)
export const adjustStockService = async ({ productId, type, quantity, note }) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw { status: 404, message: "Product not found" };

  // Purchase / IN  → positive
  // Sale / OUT     → negative
  let delta = quantity;

  if (type === "SALE" || type === "OUT") {
    delta = -Math.abs(quantity);
  } else if (type === "PURCHASE" || type === "IN") {
    delta = Math.abs(quantity);
  } else if (type === "ADJUSTMENT") {
    // can be + or - as sent by user
    delta = quantity;
  }

  const newStock = product.currentStock + delta;
  if (newStock < 0) throw { status: 400, message: "Insufficient stock" };

  const movement = await prisma.$transaction(async (tx) => {
    const m = await tx.stockMovement.create({
      data: {
        productId,
        type,
        quantity: delta,
        note,
      },
    });

    await tx.product.update({
      where: { id: productId },
      data: { currentStock: newStock },
    });

    return m;
  });

  return movement;
};

// Product stock history
export const productHistoryService = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      movements: {
        orderBy: { id: "desc" },
      },
    },
  });

  if (!product) throw { status: 404, message: "Product not found" };

  return product;
};
