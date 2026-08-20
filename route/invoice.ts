import express from "express";
import retrieveInvoice from "../controller/invoice/retrieveInvoice.ts";

const router = express.Router();

router.get("/:invoiceId", retrieveInvoice);

export default router;
