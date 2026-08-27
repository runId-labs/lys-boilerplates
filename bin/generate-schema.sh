#!/bin/bash
#
# Generate front/schema.graphql from the API (lys apps only) and recompile
# the Relay types.
#
# Usage:
#   ./bin/generate-schema.sh
#
# Runs inside the running api container (all-Docker workflow): the export
# builds the schema in-process from the registered lys apps (entities,
# services, nodes, webservices) — no running GraphQL endpoint needed.
# front/schema.graphql is bind-mounted into the container, so the output
# lands directly in the repository; the front container picks it up for the
# Relay compilation.
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Exporting GraphQL schema from the api container...${NC}"

cd "${ROOT_DIR}"

if ! docker compose ps --status running api | grep -q api; then
    echo -e "${RED}Error: api container not running. Start the stack first: docker compose up -d${NC}"
    exit 1
fi

docker compose exec api python main.py export-schema -o /app/schema.graphql

echo -e "${GREEN}Schema generated: front/schema.graphql${NC}"
echo -e "${BLUE}Compiling Relay types in the front container...${NC}"
docker compose exec front npm run relay

echo -e "${GREEN}Done${NC}"
