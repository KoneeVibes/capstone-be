import express from "express";
import isAuthorized from "../middleware/authorization.ts";
import handleSearch from "../controller/search/handleSearch.ts";
import retrieveSearchHistory from "../controller/search/retrieveSearchHistory.ts";
import deleteSearchRecord from "../controller/search/deleteSearchRecord.ts";

const router = express.Router();

// routes open to only authenticated user types
router.get("/", isAuthorized, handleSearch);
router.get("/history", isAuthorized, retrieveSearchHistory);
router.delete("/history/:searchId", isAuthorized, deleteSearchRecord);

export default router;
