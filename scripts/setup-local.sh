#!/bin/bash
# Simple setup script for local development.
# Creates the MySQL database and imports the schema.
# Usage: DB_USER=root DB_PASS=secret DB_HOST=localhost ./scripts/setup-local.sh
set -e
DB_HOST="${DB_HOST:-localhost}"
DB_NAME="${DB_NAME:-diako_db}"
DB_USER="${DB_USER:-root}"
DB_PASS="${DB_PASS:-}"

echo "Creating database '$DB_NAME'..."
mysql -h "$DB_HOST" -u "$DB_USER" ${DB_PASS:+-p$DB_PASS} -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo "Importing schema..."
mysql -h "$DB_HOST" -u "$DB_USER" ${DB_PASS:+-p$DB_PASS} "$DB_NAME" < sql/schema.sql

echo "Database ready."
