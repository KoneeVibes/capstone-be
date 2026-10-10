import express from "express";
import retrieveInvoice from "../controller/invoice/retrieveInvoice.ts";
import settleInvoice from "../controller/invoice/settleInvoice.ts";

const router = express.Router();

router.get("/:id", retrieveInvoice);
router.post("/settle/:invoiceId", settleInvoice);

export default router;
