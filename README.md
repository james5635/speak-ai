## Usage
```sh
git submodule init
git submodule update
uv venv
uv sync
cd VibeVoice
uv pip install -e .[streamingtts]

sudo apt-get install zstd
curl -fsSL https://ollama.com/install.sh | sh
ollama pull gemma3:270m

sudo apt update
sudo apt install -y ffmpeg

wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O cloudflared && chmod +x cloudflared

./cloudflared tunnel --url http://localhost:8000 --no-autoupdate
```

## Run
```sh
# frontend
cd frontend
npm run dev

# backend
uv run fastapi dev
```
