import { getDb } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDb();

  if (req.method === "GET") {
    const { field } = req.query;
    if (!field || typeof field !== "string")
      return res.status(400).json({ error: "Missing field" });

    const results = await db
      .collection("autocomplete_store")
      .find({ field })
      .toArray();

    const options = results.map((r) => r.value);
    return res.status(200).json({ options });
  }

  if (req.method === "POST") {
    const { field, value } = req.body;
    if (!field || !value)
      return res.status(400).json({ error: "Missing field or value" });

    const existing = await db
      .collection("autocomplete_store")
      .findOne({ field, value });
    if (!existing) {
      await db.collection("autocomplete_store").insertOne({ field, value });
    }

    return res.status(200).json({ success: true });
  }

  res.status(405).end(); // Method Not Allowed
}
