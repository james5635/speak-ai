## Usage
```sh
git submodule init
git submodule update
uv venv
uv sync
cd VibeVoice
uv pip install -e .[streamingtts]

curl -fsSL https://ollama.com/install.sh | sh
ollama pull gemma3:270m

sudo apt update
sudo apt install -y ffmpeg
```