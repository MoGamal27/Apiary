import { deleteApiary, getApiaries, getApiaryById, updateApiary, createApiary } from "../Controller/apiaryController";
import { createApiaryValidator, updateApiaryValidator, apiaryIdValidator } from "../utils/validator/apiaryValidator";

import express from "express";
const router = express.Router();


router.route("/")
    .post( createApiaryValidator, createApiary)
    .get( getApiaries);


router.route("/:id")
    .get( apiaryIdValidator, getApiaryById)
    .put( updateApiaryValidator, updateApiary)
    .delete( deleteApiary);
    
export default router;    