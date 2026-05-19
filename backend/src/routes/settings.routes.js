import { Router } from "express";
import { getSettings, updateSettings, addLocation, removeLocation, getQueries, createQuery, resolveQuery } from "../controllers/settings.controller.js";

const router = Router();

router.get("/", getSettings);
router.post("/update", updateSettings);
router.post("/location/add", addLocation);
router.post("/location/remove", removeLocation);
router.get("/queries", getQueries);
router.post("/queries/create", createQuery);
router.post("/queries/resolve/:id", resolveQuery);

export default router;
