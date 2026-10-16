SELECT
  to_regclass('public.service_reports') AS service_reports_table,
  EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'ServiceReportStatus'
  ) AS service_report_status_enum;
