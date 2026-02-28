import { Router } from "express";
import expenseTypeRoutes from "./expense-type.routes.js";
import incomeSourceRoutes from "./income-source.routes.js";
import expenseRoutes from "./expense.routes.js";
import incomeRoutes from "./income.routes.js";
import savingsRoutes from "./savings.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import accountRoutes from "./account.routes.js";

const router = Router();

router.use("/expense-types", expenseTypeRoutes);
router.use("/income-sources", incomeSourceRoutes);
router.use("/expenses", expenseRoutes);
router.use("/incomes", incomeRoutes);
router.use("/savings", savingsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/accounts", accountRoutes);

export default router;
