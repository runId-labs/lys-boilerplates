"""add ai_prompt_version and prompt_version_id on ai_message

Revision ID: 5874a0fb4f87
Revises: 1471464ecb04
Create Date: 2026-09-20 10:02:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5874a0fb4f87'
down_revision: Union[str, None] = '1471464ecb04'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Immutable, append-only registry of AI prompt versions: one row per distinct
    # content, per purpose. Filled by AIService at boot from the configured endpoints'
    # system prompts and the routes manifest; a real FK (not a soft one) so a version
    # row can never be deleted while turns still reference it, and ON DELETE SET NULL
    # is only a safety net - rows are never deleted by design.
    op.create_table('ai_prompt_version',
    sa.Column('purpose', sa.String(length=100), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('hash', sa.String(length=64), nullable=False),
    sa.Column('id', sa.Uuid(as_uuid=False), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('purpose', 'hash', name='uq_ai_prompt_version_purpose_hash')
    )
    op.create_index('ix_ai_prompt_version_purpose', 'ai_prompt_version', ['purpose'], unique=False)

    # Links each user turn to the prompt version in force when it was sent. Best-effort
    # at write time: a missing version never fails the turn.
    op.add_column('ai_message', sa.Column('prompt_version_id', sa.Uuid(as_uuid=False), nullable=True))
    op.create_index(op.f('ix_ai_message_prompt_version_id'), 'ai_message', ['prompt_version_id'], unique=False)
    op.create_foreign_key(
        "fk_ai_message_prompt_version_id", 'ai_message', 'ai_prompt_version',
        ['prompt_version_id'], ['id'], ondelete='SET NULL',
    )


def downgrade() -> None:
    op.drop_constraint("fk_ai_message_prompt_version_id", 'ai_message', type_='foreignkey')
    op.drop_index(op.f('ix_ai_message_prompt_version_id'), table_name='ai_message')
    op.drop_column('ai_message', 'prompt_version_id')
    op.drop_index('ix_ai_prompt_version_purpose', table_name='ai_prompt_version')
    op.drop_table('ai_prompt_version')
