const express = require("express");
const router = express.Router();
const pincodeController = require("../controllers/pincode.controller");

router.get("/states", pincodeController.getStates);
router.get("/states/:state/districts", pincodeController.getDistrictsByState);
router.get("/states/:state/districts/:district/taluks", pincodeController.getTaluksByDistrict);
router.get("/pincodes", pincodeController.getPincodes);
router.get("/search", pincodeController.searchPincodes);
router.get("/pincode/:pincode", pincodeController.getPincodeDetails);
router.get("/stats", pincodeController.getStats);
router.get("/stats/state-distribution", pincodeController.getStateDistribution);
router.get("/stats/delivery-distribution", pincodeController.getDeliveryDistribution);
router.get("/export", pincodeController.exportToCsv);

module.exports = router;
