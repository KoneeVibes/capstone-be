import type { Request, Response } from "express";
import LOCATION_RATES from "../../config/location.ts";

const retrieveAllLocation = async (req: Request, res: Response) => {
	res.status(200).json({
		status: "success",
		data: LOCATION_RATES,
	});
};

export default retrieveAllLocation;
