---
title: Twin LLM
colorFrom: indigo
colorTo: purple
sdk: docker
app_port: 7860
license: apache-2.0
---

# Twin LLM

The always-awake fallback tier for the AI twin on [amritesh.net](https://amritesh.net). It
serves Qwen3-1.7B (GGUF q4_K_M) under `llama-server` on small CPU hardware, exposing an
OpenAI-compatible API. Answers are slower than a hosted API but never rate-limited, so the
twin can still reply when its Gemini free tier is spent for the day. The site's client is
host-agnostic: any OpenAI-compatible endpoint works, this container being the self-hosted
option.

## API

- `POST /v1/chat/completions`: OpenAI-compatible chat completions with streaming. Requires
  `Authorization: Bearer <key>`, where the key comes from the `TWIN_MODEL_API_KEY` Space
  secret. Thinking is disabled server-side; callers may also send
  `chat_template_kwargs: {"enable_thinking": false}`.
- `GET /health`: unauthenticated readiness probe, used to wake the Space before a visitor
  sends their first message.

## Fine-tuning

The served model can be tuned on a curated voice dataset without touching this Space's code;
the swap is a filename change in the Dockerfile. `finetune.ipynb` runs the QLoRA fine-tune on
a free Colab GPU and exports a drop-in GGUF.
