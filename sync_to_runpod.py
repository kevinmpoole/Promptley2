import subprocess
import os

# ==== CONFIGURATION ====
LOCAL_UNIVERSE_DIR = "/Users/kevinpoole/Documents/Python Scripts/Promptley2/universes"
REMOTE_USERNAME = "root"
REMOTE_IP = "YOUR_RUNPOD_IP"  # ← Replace this with your actual RunPod IP
REMOTE_PATH = "/storage/universes"  # ← Adjust if your universe path is different
# ========================

def sync_universes():
    if not os.path.isdir(LOCAL_UNIVERSE_DIR):
        print(f"❌ Local universe folder does not exist: {LOCAL_UNIVERSE_DIR}")
        return

    cmd = [
        "scp",
        "-r",
        LOCAL_UNIVERSE_DIR,
        f"{REMOTE_USERNAME}@{REMOTE_IP}:{REMOTE_PATH}"
    ]

    print(f"🚀 Syncing local → RunPod\nLocal: {LOCAL_UNIVERSE_DIR}\nRemote: {REMOTE_USERNAME}@{REMOTE_IP}:{REMOTE_PATH}")
    try:
        subprocess.run(cmd, check=True)
        print("✅ Sync complete.")
    except subprocess.CalledProcessError as e:
        print("❌ SCP failed:", e)

if __name__ == "__main__":
    sync_universes()
