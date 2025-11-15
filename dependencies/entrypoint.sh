#!/usr/bin/env bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$SCRIPT_DIR"

echo "Waiting for Postgres to be ready..."

until pg_isready -h "${POSTGRES_HOST}" -p "${POSTGRES_PORT}" -U "${POSTGRES_USER}"; do
  sleep 1
done

echo "Postgres is ready."

echo "Preparing media and static directories..."
mkdir -p "${PROJECT_ROOT}/frontend/media" "${PROJECT_ROOT}/frontend/staticfiles"

echo "Applying Django migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Django development server..."
exec python manage.py runserver 0.0.0.0:8000

