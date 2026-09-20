"""add request_context to ai_message

Revision ID: 1471464ecb04
Revises: 6953151bd8f7
Create Date: 2026-09-20 09:55:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1471464ecb04'
down_revision: Union[str, None] = '6953151bd8f7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Options, tools, page context and volatile context used for one turn, stored on
    # the message row that started it: a conversation can later be replayed or
    # evaluated against what the model actually received, not what the code says now.
    op.add_column('ai_message', sa.Column('request_context', sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column('ai_message', 'request_context')
