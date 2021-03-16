import { ActivityModel } from "../../models/activity/activity.model";
class ActivitySave {
    async saveData(
        id: string,
        reporting_org_narrative: string,
        transaction_value_usd: number,
        transaction_value_date: string,
        year: number
    ): Promise<null> {
        const date = new Date(`${transaction_value_date}`)
        await ActivityModel.updateOne(
            { id },
            { id, reporting_org_narrative, transaction_value_usd, date, year },
            { upsert: true })
        return null
    }
}
export default ActivitySave;
