#!/bin/sh
set -e

# Refuse to start without the bearer key rather than serving the model to the open internet.
if [ -z "${TWIN_MODEL_API_KEY}" ]; then
  echo "TWIN_MODEL_API_KEY is not set. Add it as a Space secret before starting." >&2
  exit 1
fi

if command -v llama-server >/dev/null 2>&1; then
  SERVER=llama-server
elif [ -x /app/llama-server ]; then
  SERVER=/app/llama-server
else
  echo "llama-server binary not found in this image." >&2
  exit 1
fi

exec "$SERVER" \
  -m /models/model.gguf \
  --host 0.0.0.0 \
  --port 7860 \
  -c 4096 \
  --threads 2 \
  --parallel 1 \
  --reasoning-budget 0 \
  --api-key "${TWIN_MODEL_API_KEY}"
