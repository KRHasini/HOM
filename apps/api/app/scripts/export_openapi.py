"""Write the OpenAPI schema to disk without starting a server.

Usage: ``python -m app.scripts.export_openapi [output.json]``
(``pnpm gen:api`` runs this, then generates the TypeScript client from it.)
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from app.core.config import Settings
from app.main import create_app


def main() -> None:
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("openapi.json")
    app = create_app(Settings(environment="development", log_json=False))
    out.write_text(json.dumps(app.openapi(), indent=2) + "\n", encoding="utf-8")
    print(f"OpenAPI schema written to {out}")


if __name__ == "__main__":
    main()
