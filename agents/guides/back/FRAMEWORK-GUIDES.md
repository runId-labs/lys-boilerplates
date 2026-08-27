# Where the back framework guides live

The lys framework guides (architecture, apps/modules, entities, services,
nodes, webservices, permissions, fixtures, emails/events, tasks, signals,
AI, rules) ship INSIDE the lys package — they always match the installed
version.

Locate them:

```bash
# In the api container (all-Docker workflow)
ls /usr/local/lib/python3.13/site-packages/lys/agents/guides

# On a host environment
python -c "import lys, pathlib; print(pathlib.Path(lys.__file__).parent / 'agents' / 'guides')"
```

Requires `runid-lys` ≥ 0.42.0.

Only project-specific workflows stay here (`migrations.md`).
