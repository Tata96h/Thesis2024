"""add filiere

Revision ID: 5aa5c756e3ea
Revises: bf9a7315417a
Create Date: 2024-07-18 11:41:53.971945

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5aa5c756e3ea'
down_revision = 'bf9a7315417a'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('planification',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('theme', sa.String(length=200), nullable=False),
    sa.Column('jury', sa.String(length=200), nullable=False),
    sa.Column('date', sa.String(length=200), nullable=False),
    sa.Column('heure', sa.String(length=200), nullable=False),
    sa.Column('salle', sa.String(length=200), nullable=False),
    sa.Column('annee_id', sa.Integer(), nullable=True),
    sa.Column('departement_id', sa.Integer(), nullable=True),
    sa.Column('filiere', sa.String(length=200), nullable=False),
    sa.Column('thesis_id', sa.Integer(), nullable=True),
    sa.Column('etudiant1', sa.String(length=200), nullable=True),
    sa.Column('etudiant2', sa.String(length=200), nullable=True),
    sa.ForeignKeyConstraint(['annee_id'], ['annee.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['departement_id'], ['departement.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['thesis_id'], ['soutenance.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('thesis_id')
    )
    op.drop_constraint('jury_president_id_fkey', 'jury', type_='foreignkey')
    op.drop_constraint('jury_rapporteur_id_fkey', 'jury', type_='foreignkey')
    op.drop_constraint('jury_examinateur_id_fkey', 'jury', type_='foreignkey')
    op.create_foreign_key(None, 'jury', 'enseignant', ['president_id'], ['id'], source_schema='public', ondelete='CASCADE')
    op.create_foreign_key(None, 'jury', 'enseignant', ['rapporteur_id'], ['id'], source_schema='public', ondelete='CASCADE')
    op.create_foreign_key(None, 'jury', 'enseignant', ['examinateur_id'], ['id'], source_schema='public', ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'jury', schema='public', type_='foreignkey')
    op.drop_constraint(None, 'jury', schema='public', type_='foreignkey')
    op.drop_constraint(None, 'jury', schema='public', type_='foreignkey')
    op.create_foreign_key('jury_examinateur_id_fkey', 'jury', 'enseignant', ['examinateur_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('jury_rapporteur_id_fkey', 'jury', 'enseignant', ['rapporteur_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('jury_president_id_fkey', 'jury', 'enseignant', ['president_id'], ['id'], ondelete='CASCADE')
    op.drop_table('planification')
    # ### end Alembic commands ###