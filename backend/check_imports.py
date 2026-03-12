import sys
import os
import importlib

# Add backend to sys.path
sys.path.append(os.getcwd())

files_to_check = [
    "app/main.py",
    "app/config.py",
    "app/database.py",
    "app/agents/base_agent.py",
    "app/agents/resume_agent.py",
    "app/agents/career_agent.py",
    "app/agents/interview_agent.py",
    "app/agents/skill_gap_agent.py",
    "app/agents/orchestrator.py",
    "app/routers/auth.py",
    "app/routers/resume.py",
    "app/routers/career.py",
    "app/routers/interview.py",
    "app/utils/auth.py",
    "app/utils/file_parser.py",
    "app/models/user.py",
    "app/models/resume.py",
]

errors = []

for file_path in files_to_check:
    module_name = file_path.replace("/", ".").replace(".py", "")
    try:
        # Just try to import it
        importlib.import_module(module_name)
    except Exception as e:
        errors.append(f"{file_path}: {str(e)}")

if errors:
    print("\n".join(errors))
    sys.exit(1)
else:
    print("All imports successful!")
