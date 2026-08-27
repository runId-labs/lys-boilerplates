"""
Lys API CLI entry point.

This script provides a command-line interface for launching the API
with configurable options like host, port, workers, etc.

Usage:
    python main.py run --help
    python main.py run --host 0.0.0.0 --port 8000 --reload
"""

import typer
from pathlib import Path

from lys.core.clis import run_fast_app, export_graphql_schema, run_migrate, run_makemigrations, run_db_status, run_db_stamp

app = typer.Typer()

@app.command()
def run(
    host: str = typer.Option("0.0.0.0", "--host", "-h", help="Host to bind the server to"),
    port: int = typer.Option(8000, "--port", "-p", help="Port to bind the server to"),
    reload: bool = typer.Option(False, "--reload", help="Enable auto-reload on code changes"),
    workers: int = typer.Option(1, "--workers", "-w", help="Number of worker processes"),
    app_path: Path = typer.Option(Path("src/app.py"), "--app", help="Path to FastAPI app file"),
    ssl_certfile: str | None = typer.Option(None, "--ssl-certfile", help="Path to SSL certificate file"),
    ssl_keyfile: str | None = typer.Option(None, "--ssl-keyfile", help="Path to SSL key file"),
    timeout_graceful_shutdown: int = typer.Option(2, "--timeout-graceful-shutdown", help="Seconds to wait for SSE connections to close"),
):
    """Launch the API server."""
    try:
        run_fast_app(
            host=host,
            port=port,
            reload=reload,
            workers=workers,
            app_path=app_path,
            ssl_certfile=ssl_certfile,
            ssl_keyfile=ssl_keyfile,
            timeout_graceful_shutdown=timeout_graceful_shutdown,
        )
    except Exception as e:
        import traceback
        typer.echo(f"Error: {e}")
        typer.echo(f"Traceback:")
        traceback.print_exc()
        raise typer.Exit(code=1)

@app.command()
def ping():
    """Simple ping command to test CLI functionality."""
    typer.echo("pong")


@app.command()
def export_schema(
    output: Path = typer.Option(
        Path("schema/schema.graphql"),
        "--output",
        "-o",
        help="Output path for the GraphQL schema file"
    ),
    settings_module: str = typer.Option(
        "settings",
        "--settings",
        "-s",
        help="Settings module to import (default: settings)"
    )
):
    """
    Export the GraphQL schema to a file.

    This command initializes the app_manager with all necessary components
    and exports the GraphQL schema in SDL (Schema Definition Language) format.
    """
    try:
        export_graphql_schema(output_path=output, settings_module=settings_module)
    except Exception as e:
        import traceback
        typer.echo(f"Error exporting schema: {e}")
        typer.echo("Traceback:")
        traceback.print_exc()
        raise typer.Exit(code=1)


@app.command()
def migrate(
    revision: str = typer.Argument("head", help="Target revision (default: head)"),
):
    """Apply database migrations."""
    run_migrate(revision)


@app.command()
def makemigrations(
    message: str = typer.Option(..., "-m", "--message", help="Migration description"),
):
    """Auto-generate a new migration from model changes."""
    run_makemigrations(message)


@app.command()
def db_status():
    """Show the current migration revision."""
    run_db_status()


@app.command()
def db_stamp(
    revision: str = typer.Argument("head", help="Revision to stamp (default: head)"),
):
    """Stamp the database with a revision without running migrations."""
    run_db_stamp(revision)


if __name__ == "__main__":
    app()
