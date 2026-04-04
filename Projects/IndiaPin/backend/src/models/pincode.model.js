const mongoose = require("mongoose");

const pinSchema = new mongoose.Schema(
    {
        officeName: String,
        pincode: Number,
        officeType: String,
        deliveryStatus: String,
        divisionName: String,
        regionName: String,
        circleName: String,
        taluk: String,
        districtName: String,
        stateName: String,
    },
    { collection: "All_India_Pin" }
);

const PincodeModel = mongoose.model("All_India_Pin", pinSchema);

module.exports = PincodeModel;
