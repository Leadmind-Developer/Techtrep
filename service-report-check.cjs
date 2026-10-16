require("dotenv").config();
const { Client } = require("pg");
async function main() {
  const client = new Client({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
  try {
    await client.connect();
    const result = await client.query(`SELECT to_regclass('public.service_reports') AS service_reports_table, to_regtype('public."ServiceReportStatus"') IS NOT NULL AS service_report_status_enum`);
    console.log(JSON.stringify(result.rows, null, 2));
  } finally {
    await client.end();
  }
}
main().catch((error) => { console.error("Database check failed:", error.message); process.exitCode = 1; });
