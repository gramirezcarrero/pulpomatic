db.getCollection('activities').aggregate([

    {
        "$match": {
            "transaction_value_date": {
                "$lte": new Date("2013-01-01"),
                "$gte": new Date("2011-01-01")
            }
        }
    },


    {
        "$group":
        {
            "_id": {
                "reporting_org_narrative": "$reporting_org_narrative",
                year: { $year: "$transaction_value_date" }

            },
            transaction_value_usd: { $sum: "$transaction_value_usd" },
        }
    },
    {
        "$sort": { transaction_value_usd: - 1 }
    }
])