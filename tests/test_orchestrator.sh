#!/bin/bash

# Create a JSON payload
cat <<EOF > payload.json
{
  "urls": [
    "https://example.com"
  ]
}
EOF

echo "Sending orchestration request for example.com..."
curl -X POST http://localhost:8000/orchestrator/run \
     -H "Content-Type: application/json" \
     -d @payload.json | jq .

rm payload.json
