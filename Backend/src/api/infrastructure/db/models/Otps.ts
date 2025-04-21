import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: 60 } } // 1 minute
});

const Otps = mongoose.model("Otp", otpSchema);
export default Otps;