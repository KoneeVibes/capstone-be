import express from "express";
import paystack from "../webhook/provider/paystack.ts";

const router = express.Router();

router.post("/paystack", paystack);

export default router;
