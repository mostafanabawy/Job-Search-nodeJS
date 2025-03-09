import cron from "node-cron";
import { userModel } from "../../DB/models/user.model.js";

// Run this job every day at midnight
cron.schedule("0 */6 * * *", async () => {
    console.log("Running scheduled job: Deleting expired OTPs");

    try {
        const result = await userModel.updateMany(
            { "OTP.expiresIn": { $lt: new Date() } },
            { $pull: { OTP: { expiresIn: { $lt: new Date() } } } }
        )

        console.log(`Deleted ${result.deletedCount} expired job(s).`);
    } catch (error) {
        console.error("Error running cron job:", error);
    }
}, {
    scheduled: true,
    timezone: "UTC"
});
