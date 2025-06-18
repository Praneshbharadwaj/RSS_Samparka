export const dynamic = "force-dynamic";
import { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const db = await getDb();
    const users = await db.collection("Samparka").find({}).toArray();

    const fieldsToExtract = [
      "Title",
      "Group",
      "Organisation 1",
      "Designation 1",
      "Organisation 2",
      "Designation 2",
      "Category",
      "Area",
      "Nagara",
      "St Coordinator",
      "Re-assigned (Patti Hanchike)",
    ];

    const valuesMap: Record<string, Set<string>> = {};
    for (const field of fieldsToExtract) valuesMap[field] = new Set();

    users.forEach((user) => {
      fieldsToExtract.forEach((field) => {
        const value = user[field];
        if (typeof value === "string" && value.trim()) {
          valuesMap[field].add(value.trim());
        }
      });
    });

    const autocompleteCol = db.collection("autocomplete_store");
    const bulkOps = [];

    for (const field of fieldsToExtract) {
      for (const val of valuesMap[field]) {
        console.log("Adding:", field, val); // 👈 Add this
        bulkOps.push({
          updateOne: {
            filter: { field, value: val },
            update: { $setOnInsert: { field, value: val } },
            upsert: true,
          },
        });
      }
    }

    if (bulkOps.length > 0) {
      await autocompleteCol.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Prefilled successfully!" });
  } catch (error) {
    console.error("Error pre-filling autocomplete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
