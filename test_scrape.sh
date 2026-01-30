#!/bin/bash
# test_scrape.sh

# Ensure .venv is activated or python is available
if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

echo "Sending test request to http://localhost:8000/scrape..."

curl -X POST "http://localhost:8000/scrape" \
     -H "Content-Type: application/json" \
     -d '{
           "url": "https://example.com",
           "instruction": "Summarize the intent of this page and list any tech stack mentioned."
         }' | jq .
