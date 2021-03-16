
import { Logger } from "../../utils/logger";
const logger = Logger.createLogger(__filename);
import { ActivityModel } from "../../models/activity/activity.model";
class ActivitySave {
    async saveData(id: string, reporting_org_narrative: string,
        transaction_value_usd: number,
        transaction_value_date: Date, year: number): Promise<null> {
        await ActivityModel.create({ id, reporting_org_narrative, transaction_value_date, transaction_value_usd, year })
        return null
    }
}
export default ActivitySave;
