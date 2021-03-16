
import { Logger } from "../../utils/logger";
import axios from "axios";

import Activity from "../activity/activity.service";
const logger = Logger.createLogger(__filename);

class IatiPaginatedByYear {
    async populateDatabase(year: number): Promise<any> {

        let url = `https://iatidatastore.iatistandard.org/api/transactions/?transaction_date_year=${year}&format=json&page=1&page_size=20&recipient_country=SD&fields=all`
        const iatiGet = await axios.get(String(url))
        const ActivitySave = new Activity();
        const docs = iatiGet.data.results || []
        if (docs.length) {
            for (const dataActivity of docs) {
                const id = String(parseInt(dataActivity.url.split(/transactions\//gi)[1]));
                const text = dataActivity?.provider_organisation?.narrative[0]?.text ?? ""
                const dateObject = new Date(dataActivity.transaction_date)
                const year = dateObject.getFullYear();
                const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
                const day = dateObject.getDate().toString().padStart(2, "0");
                try {
                    await ActivitySave.saveData(
                        id,
                        text,
                        dataActivity.value,
                        `${year}-${month}-${day}`,
                        year
                    )
                } catch (err) {
                    logger.warn(err)
                }
            }
        }
        return docs;
    }
}
export default IatiPaginatedByYear;