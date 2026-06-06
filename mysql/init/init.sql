-- Create read-only user for reporting service
CREATE USER IF NOT EXISTS 'relatorio_user'@'%' IDENTIFIED BY 'relatorio_pass';
GRANT SELECT ON ebookstore_db.* TO 'relatorio_user'@'%';
FLUSH PRIVILEGES;
