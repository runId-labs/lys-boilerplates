"""add ai conversation search and titling

Revision ID: 6953151bd8f7
Revises: 2146a537269c
Create Date: 2026-09-03 10:12:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import pgvector.sqlalchemy
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '6953151bd8f7'
down_revision: Union[str, None] = '2146a537269c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Fuzzy matching over message content, complementing full-text search: a stemmed
    # index only matches whole words, so a word typed without its accent, or a name
    # misspelled, finds nothing. Trigrams do.
    #
    # Both extensions are trusted, so the application user - which owns this database
    # but may not be superuser - may create them.
    op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")
    op.execute("CREATE EXTENSION IF NOT EXISTS unaccent")

    # `vector` is NOT a trusted extension: only a superuser may create it. Locally the
    # container's postgres user is one, so this statement succeeds; on a deployed
    # cluster where the application user is not, install the extension first (as
    # superuser) and this becomes a no-op NOTICE. Letting the statement fail rather
    # than skipping the column keeps an unconfigured environment loud instead of
    # silently losing semantic search.
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # Timezone-aware like every other timestamp in the framework: the column records an
    # instant, and a naive one cannot be compared across the deployments that read it.
    op.alter_column('ai_conversation', 'archived_at',
               existing_type=postgresql.TIMESTAMP(),
               type_=sa.DateTime(timezone=True),
               existing_nullable=True)

    # Full-text search: the tsvector is filled by the index_pending_messages worker
    # task, the configuration is stored beside it because vectors from different
    # stemming configurations are not comparable.
    op.add_column('ai_message', sa.Column('text_search_vector', postgresql.TSVECTOR(), nullable=True))
    op.add_column('ai_message', sa.Column('text_search_config', sa.String(length=32), nullable=True))

    # Semantic search: 1024 dimensions is the embedding model's output size
    # (lys EMBEDDING_DIMENSIONS, mistral-embed). The model is stored beside the vector
    # for the same reason as the search configuration: vectors from two models live in
    # unrelated spaces, and comparing across them returns confident nonsense rather
    # than an error.
    op.add_column('ai_message', sa.Column('embedding', pgvector.sqlalchemy.vector.VECTOR(dim=1024), nullable=True))
    op.add_column('ai_message', sa.Column('embedding_model', sa.String(length=64), nullable=True))


def downgrade() -> None:
    op.drop_column('ai_message', 'embedding_model')
    op.drop_column('ai_message', 'embedding')
    op.drop_column('ai_message', 'text_search_config')
    op.drop_column('ai_message', 'text_search_vector')
    op.alter_column('ai_conversation', 'archived_at',
               existing_type=sa.DateTime(timezone=True),
               type_=postgresql.TIMESTAMP(),
               existing_nullable=True)
    # The extensions are left in place on purpose. Dropping an extension takes down
    # every object depending on it, and any of them may have been enabled for something
    # else in this database.
