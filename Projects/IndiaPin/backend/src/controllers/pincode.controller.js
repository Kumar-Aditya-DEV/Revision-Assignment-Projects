const PincodeModel = require("../models/pincode.model");
const { Parser } = require("json2csv");

// 1. Get All States
exports.getStates = async (req, res) => {
    try {
        const states = await PincodeModel.distinct("stateName");
        res.json(states.filter(s => s).sort());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Get Districts by State
exports.getDistrictsByState = async (req, res) => {
    try {
        const districts = await PincodeModel.distinct("districtName", {
            stateName: { $regex: new RegExp(`^${req.params.state}$`, "i") },
        });
        res.json(districts.filter(d => d).sort());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Get Taluks by District
exports.getTaluksByDistrict = async (req, res) => {
    try {
        const taluks = await PincodeModel.distinct("taluk", {
            stateName: { $regex: new RegExp(`^${req.params.state}$`, "i") },
            districtName: { $regex: new RegExp(`^${req.params.district}$`, "i") },
        });
        res.json(taluks.filter(t => t).sort());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Get Filtered PIN Code Data (Pagination)
exports.getPincodes = async (req, res) => {
    try {
        const { state, district, taluk, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (state) filter.stateName = { $regex: new RegExp(`^${state}$`, "i") };
        if (district) filter.districtName = { $regex: new RegExp(`^${district}$`, "i") };
        if (taluk) filter.taluk = { $regex: new RegExp(`^${taluk}$`, "i") };

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const data = await PincodeModel.find(filter).skip(skip).limit(parseInt(limit));
        const total = await PincodeModel.countDocuments(filter);

        res.json({
            data,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. Search API
exports.searchPincodes = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);
        const results = await PincodeModel.find({
            $or: [
                { officeName: { $regex: q, $options: "i" } },
                { districtName: { $regex: q, $options: "i" } },
                ...(!isNaN(q) ? [{ pincode: parseInt(q) }] : [])
            ]
        }).limit(10);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 6. Get Details by PIN Code
exports.getPincodeDetails = async (req, res) => {
    try {
        const result = await PincodeModel.findOne({ pincode: parseInt(req.params.pincode) });
        if (!result) return res.status(404).json({ message: "Pincode not found" });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 7. Dashboard Stats API
exports.getStats = async (req, res) => {
    try {
        const totalPincodes = await PincodeModel.countDocuments();
        const totalStates = (await PincodeModel.distinct("stateName")).length;
        const deliveryOffices = await PincodeModel.countDocuments({ deliveryStatus: "Delivery" });
        const nonDeliveryOffices = await PincodeModel.countDocuments({ deliveryStatus: "Non-Delivery" });
        res.json({ totalPincodes, totalStates, deliveryOffices, nonDeliveryOffices });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 8. State-wise Distribution
exports.getStateDistribution = async (req, res) => {
    try {
        const distribution = await PincodeModel.aggregate([
            { $group: { _id: "$stateName", count: { $sum: 1 } } },
            { $limit: 10 },
            { $project: { _id: 0, state: "$_id", count: 1 } },
            { $sort: { count: -1 } }
        ]);
        res.json(distribution);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 9. Delivery Status Distribution
exports.getDeliveryDistribution = async (req, res) => {
    try {
        const delivery = await PincodeModel.countDocuments({ deliveryStatus: "Delivery" });
        const nonDelivery = await PincodeModel.countDocuments({ deliveryStatus: "Non-Delivery" });
        res.json({ delivery, nonDelivery });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 10. Export API (CSV)
exports.exportToCsv = async (req, res) => {
    try {
        const { state } = req.query;
        const filter = {};
        if (state) filter.stateName = { $regex: new RegExp(`^${state}$`, "i") };

        const data = await PincodeModel.find(filter).lean();
        if (!data.length) return res.status(404).send("No data to export");

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

        res.header("Content-Type", "text/csv");
        res.attachment(`${state || "All"}_Pincodes.csv`);
        res.send(csv);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
