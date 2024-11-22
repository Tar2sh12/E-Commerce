import { scheduleJob } from "node-schedule";
import { DateTime } from "luxon";
import { Coupon } from "../../DB/models/index.js";
export const cronJobForDisablingCoupons = () => {
    const job = scheduleJob('*/5 * * * * *',async ()=>{
        const now = DateTime.now();
        const enabledCoupons = await Coupon.find({isEnable:true})
        if(enabledCoupons.length === 0) return
        for (const coupon of enabledCoupons) {
            if(now > coupon.till){
                coupon.isEnable = false;
                await coupon.save();
            }
        }
    })    
}