--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2026-02-09 09:22:34

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'ISO_8859_5';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16885)
-- Name: Reserva; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Reserva" (
    id integer NOT NULL,
    "usuarioId" integer NOT NULL,
    "veiculoId" integer NOT NULL,
    "dataRetirada" timestamp(3) without time zone NOT NULL,
    "horaRetirada" text NOT NULL,
    observacoes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dataDevolucao" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "valorTotal" double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public."Reserva" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16884)
-- Name: Reserva_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Reserva_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Reserva_id_seq" OWNER TO postgres;

--
-- TOC entry 4925 (class 0 OID 0)
-- Dependencies: 222
-- Name: Reserva_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Reserva_id_seq" OWNED BY public."Reserva".id;


--
-- TOC entry 219 (class 1259 OID 16574)
-- Name: Usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Usuario" (
    id integer NOT NULL,
    nome text NOT NULL,
    cpf text NOT NULL,
    email text NOT NULL,
    senha text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Usuario" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16573)
-- Name: Usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Usuario_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Usuario_id_seq" OWNER TO postgres;

--
-- TOC entry 4926 (class 0 OID 0)
-- Dependencies: 218
-- Name: Usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Usuario_id_seq" OWNED BY public."Usuario".id;


--
-- TOC entry 221 (class 1259 OID 16690)
-- Name: Veiculo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Veiculo" (
    id integer NOT NULL,
    nome text NOT NULL,
    cadeiras integer NOT NULL,
    acessorios text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    foto text,
    reservado boolean DEFAULT false NOT NULL,
    "precoDiaria" double precision NOT NULL
);


ALTER TABLE public."Veiculo" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16689)
-- Name: Veiculo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Veiculo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Veiculo_id_seq" OWNER TO postgres;

--
-- TOC entry 4927 (class 0 OID 0)
-- Dependencies: 220
-- Name: Veiculo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Veiculo_id_seq" OWNED BY public."Veiculo".id;


--
-- TOC entry 217 (class 1259 OID 16562)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 4759 (class 2604 OID 16888)
-- Name: Reserva id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reserva" ALTER COLUMN id SET DEFAULT nextval('public."Reserva_id_seq"'::regclass);


--
-- TOC entry 4754 (class 2604 OID 16577)
-- Name: Usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario" ALTER COLUMN id SET DEFAULT nextval('public."Usuario_id_seq"'::regclass);


--
-- TOC entry 4756 (class 2604 OID 16693)
-- Name: Veiculo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Veiculo" ALTER COLUMN id SET DEFAULT nextval('public."Veiculo_id_seq"'::regclass);


--
-- TOC entry 4772 (class 2606 OID 16893)
-- Name: Reserva Reserva_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reserva"
    ADD CONSTRAINT "Reserva_pkey" PRIMARY KEY (id);


--
-- TOC entry 4768 (class 2606 OID 16582)
-- Name: Usuario Usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY (id);


--
-- TOC entry 4770 (class 2606 OID 16698)
-- Name: Veiculo Veiculo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Veiculo"
    ADD CONSTRAINT "Veiculo_pkey" PRIMARY KEY (id);


--
-- TOC entry 4764 (class 2606 OID 16570)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4765 (class 1259 OID 16583)
-- Name: Usuario_cpf_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Usuario_cpf_key" ON public."Usuario" USING btree (cpf);


--
-- TOC entry 4766 (class 1259 OID 16584)
-- Name: Usuario_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Usuario_email_key" ON public."Usuario" USING btree (email);


--
-- TOC entry 4773 (class 2606 OID 16894)
-- Name: Reserva Reserva_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reserva"
    ADD CONSTRAINT "Reserva_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4774 (class 2606 OID 16899)
-- Name: Reserva Reserva_veiculoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reserva"
    ADD CONSTRAINT "Reserva_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES public."Veiculo"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2026-02-09 09:22:34

--
-- PostgreSQL database dump complete
--

