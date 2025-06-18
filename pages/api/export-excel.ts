export const dynamic = "force-dynamic";
import { getDb } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import * as XLSX from "xlsx";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDb();

  if (req.method === "GET") {
    try {
      const data = await db.collection("Samparka").find({}).toArray();
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      res.setHeader("Content-Disposition", "attachment; filename=export.xlsx");
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.status(200).send(buffer);
    } catch (err) {
      console.error("Export error:", err);
      res.status(500).json({ error: "Failed to export data" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
