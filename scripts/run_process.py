"""Runner that spawns process_images.py and writes progress to a status file."""
import subprocess
import sys
import os

os.chdir(r"C:\Workspace\Personal_Projects\Site")

log_path = r"C:\Workspace\Personal_Projects\Site\scripts\process_log2.txt"
err_path = r"C:\Workspace\Personal_Projects\Site\scripts\process_err.txt"

with open(log_path, "w", encoding="utf-8") as log, \
     open(err_path, "w", encoding="utf-8") as err:
    log.write("Starting...\n")
    log.flush()
    result = subprocess.run(
        [sys.executable, "-u", "scripts/process_images.py", "--force"],
        stdout=log,
        stderr=err,
        cwd=r"C:\Workspace\Personal_Projects\Site"
    )
    log.write(f"\nExit code: {result.returncode}\n")

print(f"Done. Exit: {result.returncode}")
