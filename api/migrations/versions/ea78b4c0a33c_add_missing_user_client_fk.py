"""add missing user_client FK

Revision ID: ea78b4c0a33c
Revises: 5874a0fb4f87
Create Date: 2026-09-20 13:15:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'ea78b4c0a33c'
down_revision: Union[str, None] = '5874a0fb4f87'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # The user entity declares a real FK user.client_id -> client.id (ON DELETE SET
    # NULL). The initial migration carried it inline in create_table with
    # use_alter=True, and Alembic never emits a use_alter FK from create_table - it
    # must be added separately like this. Every database initialized from the chain
    # (fresh installs included) is missing the constraint; this restores it.
    op.create_foreign_key(
        "fk_user_client_id_client", 'user', 'client',
        ['client_id'], ['id'], ondelete='SET NULL',
    )


def downgrade() -> None:
    op.drop_constraint("fk_user_client_id_client", 'user', type_='foreignkey')
