-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler version: 0.9.4
-- PostgreSQL version: 13.0
-- Project Site: pgmodeler.io
-- Model Author: ---

-- Database creation must be performed outside a multi lined SQL file. 
-- These commands were put in this file only as a convenience.
-- 
-- object: new_database | type: DATABASE --
-- DROP DATABASE IF EXISTS new_database;
--CREATE DATABASE new_database;
-- ddl-end --

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- object: public.utilisateur | type: TABLE --
-- DROP TABLE IF EXISTS public.utilisateur CASCADE;
CREATE TABLE public.utilisateur (
	id varchar(12) NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
	username varchar(255) NOT NULL,
	email varchar(200) NOT NULL,
	password varchar(255) NOT NULL,
	role varchar(50) NOT NULL DEFAULT 'Etudiant',
	created_at timestamp NOT NULL DEFAULT now(),
	is_actif boolean NOT NULL DEFAULT true,
	CONSTRAINT user_pk PRIMARY KEY (id)
);
-- ddl-end --
COMMENT ON COLUMN public.utilisateur.role IS E'Administrateur, Etudiant, Enseignant';
-- ddl-end --
ALTER TABLE public.utilisateur OWNER TO postgres;
-- ddl-end --

-- object: public.etudiant | type: TABLE --
-- DROP TABLE IF EXISTS public.etudiant CASCADE;
CREATE TABLE public.etudiant (
	id varchar(12) NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
	matricule varchar(20) NOT NULL,
	id_utilisateur varchar(12),
	nom varchar(50) NOT NULL,
	prenoms varchar(150) NOT NULL,
	date_naissance date,
	genre varchar(20),
	peut_soutenir boolean NOT NULL DEFAULT true,
	id_departement_et_filiere varchar(12),
	id_memoire varchar(12),
	id_binome varchar(12),
	CONSTRAINT etudiant_pk PRIMARY KEY (id)
);
-- ddl-end --
COMMENT ON COLUMN public.etudiant.id_binome IS E'identifiant de l''étudiant binome de celui-ci';
-- ddl-end --
ALTER TABLE public.etudiant OWNER TO postgres;
-- ddl-end --

-- object: public.departement_et_filiere | type: TABLE --
-- DROP TABLE IF EXISTS public.departement_et_filiere CASCADE;
CREATE TABLE public.departement_et_filiere (
	id varchar(12) NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
	libelle varchar(255) NOT NULL,
	is_filiere boolean NOT NULL DEFAULT true,
	id_departement varchar(12),
	CONSTRAINT "filières_pk" PRIMARY KEY (id)
);
-- ddl-end --
COMMENT ON COLUMN public.departement_et_filiere.is_filiere IS E'filière ou departement';
-- ddl-end --
COMMENT ON COLUMN public.departement_et_filiere.id_departement IS E'Dans le cas ou c''est une filiere, id_departement indique son departement';
-- ddl-end --
ALTER TABLE public.departement_et_filiere OWNER TO postgres;
-- ddl-end --

-- object: public.enseignant | type: TABLE --
-- DROP TABLE IF EXISTS public.enseignant CASCADE;
CREATE TABLE public.enseignant (
	id varchar(12) NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
	grade varchar(255) NOT NULL,
	specialite varchar(255) NOT NULL,
	id_utilisateur varchar(12),
	nom varchar(50) NOT NULL,
	prenoms varchar(150) NOT NULL,
	CONSTRAINT enseignant_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.enseignant OWNER TO postgres;
-- ddl-end --

-- object: public.memoire | type: TABLE --
-- DROP TABLE IF EXISTS public.memoire CASCADE;
CREATE TABLE public.memoire (
	id varchar(12) NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
	theme varchar(255) NOT NULL,
	lieu_stage varchar(200),
	adresse_stage varchar(100),
	contact_stage varchar(100),
	is_theme_valide boolean NOT NULL DEFAULT true,
	is_pret_pour_soutenir boolean NOT NULL DEFAULT false,
	id_maitre_memoire varchar(12),
	id_soutenance varchar(12),
	CONSTRAINT memoire_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.memoire OWNER TO postgres;
-- ddl-end --

-- object: public.jury | type: TABLE --
-- DROP TABLE IF EXISTS public.jury CASCADE;
CREATE TABLE public.jury (
	id varchar(12) NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
	id_enseignant varchar(12),
	id_soutenance varchar(12),
	role varchar NOT NULL DEFAULT 'Président',
	CONSTRAINT jury_pk PRIMARY KEY (id)
);
-- ddl-end --
COMMENT ON COLUMN public.jury.role IS E'Président, Rapporteur, Examinateur';
-- ddl-end --
ALTER TABLE public.jury OWNER TO postgres;
-- ddl-end --

-- object: public.soutenance | type: TABLE --
-- DROP TABLE IF EXISTS public.soutenance CASCADE;
CREATE TABLE public.soutenance (
	id varchar(12) NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
	date date,
	heure time,
	id_salle varchar(12),
	decision_du_jury varchar,
	CONSTRAINT soutenance_pk PRIMARY KEY (id)
);
-- ddl-end --
COMMENT ON COLUMN public.soutenance.decision_du_jury IS E'Accepté, Refusé';
-- ddl-end --
ALTER TABLE public.soutenance OWNER TO postgres;
-- ddl-end --

-- object: public.salle | type: TABLE --
-- DROP TABLE IF EXISTS public.salle CASCADE;
CREATE TABLE public.salle (
	id varchar(12) NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
	intitule varchar(150) NOT NULL,
	CONSTRAINT salle_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.salle OWNER TO postgres;
-- ddl-end --

-- object: utilisateur_fk | type: CONSTRAINT --
-- ALTER TABLE public.etudiant DROP CONSTRAINT IF EXISTS utilisateur_fk CASCADE;
ALTER TABLE public.etudiant ADD CONSTRAINT utilisateur_fk FOREIGN KEY (id_utilisateur)
REFERENCES public.utilisateur (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: etudiant_uq | type: CONSTRAINT --
-- ALTER TABLE public.etudiant DROP CONSTRAINT IF EXISTS etudiant_uq CASCADE;
ALTER TABLE public.etudiant ADD CONSTRAINT etudiant_uq UNIQUE (id_utilisateur);
-- ddl-end --

-- object: utilisateur_fk | type: CONSTRAINT --
-- ALTER TABLE public.enseignant DROP CONSTRAINT IF EXISTS utilisateur_fk CASCADE;
ALTER TABLE public.enseignant ADD CONSTRAINT utilisateur_fk FOREIGN KEY (id_utilisateur)
REFERENCES public.utilisateur (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: enseignant_uq | type: CONSTRAINT --
-- ALTER TABLE public.enseignant DROP CONSTRAINT IF EXISTS enseignant_uq CASCADE;
ALTER TABLE public.enseignant ADD CONSTRAINT enseignant_uq UNIQUE (id_utilisateur);
-- ddl-end --

-- object: departement_et_filiere_fk | type: CONSTRAINT --
-- ALTER TABLE public.etudiant DROP CONSTRAINT IF EXISTS departement_et_filiere_fk CASCADE;
ALTER TABLE public.etudiant ADD CONSTRAINT departement_et_filiere_fk FOREIGN KEY (id_departement_et_filiere)
REFERENCES public.departement_et_filiere (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: public.enseignant_departement_filiere | type: TABLE --
-- DROP TABLE IF EXISTS public.enseignant_departement_filiere CASCADE;
CREATE TABLE public.enseignant_departement_filiere (
	id varchar(12) NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
	id_departement_et_filiere varchar(12),
	id_enseignant varchar(12),
	is_relation_avec_departement boolean NOT NULL DEFAULT false,
	is_chef_departement boolean NOT NULL DEFAULT false,
	matiere_enseignee varchar(200),
	CONSTRAINT edf_pk PRIMARY KEY (id)
);
-- ddl-end --
COMMENT ON COLUMN public.enseignant_departement_filiere.is_relation_avec_departement IS E'La relation entre la table enseignant et la table departement_filiere est celle entre l''enseignant et son département ou pas (filière)';
-- ddl-end --
COMMENT ON COLUMN public.enseignant_departement_filiere.matiere_enseignee IS E'Matiere enseignée par l''enseignant dans la filière';
-- ddl-end --
ALTER TABLE public.enseignant_departement_filiere OWNER TO postgres;
-- ddl-end --

-- object: departement_et_filiere_fk | type: CONSTRAINT --
-- ALTER TABLE public.enseignant_departement_filiere DROP CONSTRAINT IF EXISTS departement_et_filiere_fk CASCADE;
ALTER TABLE public.enseignant_departement_filiere ADD CONSTRAINT departement_et_filiere_fk FOREIGN KEY (id_departement_et_filiere)
REFERENCES public.departement_et_filiere (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: enseignant_fk | type: CONSTRAINT --
-- ALTER TABLE public.enseignant_departement_filiere DROP CONSTRAINT IF EXISTS enseignant_fk CASCADE;
ALTER TABLE public.enseignant_departement_filiere ADD CONSTRAINT enseignant_fk FOREIGN KEY (id_enseignant)
REFERENCES public.enseignant (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: memoire_fk | type: CONSTRAINT --
-- ALTER TABLE public.etudiant DROP CONSTRAINT IF EXISTS memoire_fk CASCADE;
ALTER TABLE public.etudiant ADD CONSTRAINT memoire_fk FOREIGN KEY (id_memoire)
REFERENCES public.memoire (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: salle_fk | type: CONSTRAINT --
-- ALTER TABLE public.soutenance DROP CONSTRAINT IF EXISTS salle_fk CASCADE;
ALTER TABLE public.soutenance ADD CONSTRAINT salle_fk FOREIGN KEY (id_salle)
REFERENCES public.salle (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: soutenance_fk | type: CONSTRAINT --
-- ALTER TABLE public.memoire DROP CONSTRAINT IF EXISTS soutenance_fk CASCADE;
ALTER TABLE public.memoire ADD CONSTRAINT soutenance_fk FOREIGN KEY (id_soutenance)
REFERENCES public.soutenance (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: memoire_uq | type: CONSTRAINT --
-- ALTER TABLE public.memoire DROP CONSTRAINT IF EXISTS memoire_uq CASCADE;
ALTER TABLE public.memoire ADD CONSTRAINT memoire_uq UNIQUE (id_soutenance);
-- ddl-end --

-- object: enseignant_fk | type: CONSTRAINT --
-- ALTER TABLE public.jury DROP CONSTRAINT IF EXISTS enseignant_fk CASCADE;
ALTER TABLE public.jury ADD CONSTRAINT enseignant_fk FOREIGN KEY (id_enseignant)
REFERENCES public.enseignant (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: soutenance_fk | type: CONSTRAINT --
-- ALTER TABLE public.jury DROP CONSTRAINT IF EXISTS soutenance_fk CASCADE;
ALTER TABLE public.jury ADD CONSTRAINT soutenance_fk FOREIGN KEY (id_soutenance)
REFERENCES public.soutenance (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: enseignant_fk | type: CONSTRAINT --
-- ALTER TABLE public.memoire DROP CONSTRAINT IF EXISTS enseignant_fk CASCADE;
ALTER TABLE public.memoire ADD CONSTRAINT enseignant_fk FOREIGN KEY (id_maitre_memoire)
REFERENCES public.enseignant (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --


