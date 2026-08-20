import express from "express";
import retrieveAllLocation from "../controller/misc/retrieveAllLocation.ts";

const router = express.Router();

router.get("/location", retrieveAllLocation);

export default router;
