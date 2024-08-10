--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chat_membership; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.chat_membership (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    chat_id uuid NOT NULL,
    "timestamp" date DEFAULT now() NOT NULL
);


ALTER TABLE public.chat_membership OWNER TO jak;

--
-- Name: chats; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.chats (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title public.citext,
    "timestamp" date DEFAULT now() NOT NULL,
    expiration date
);


ALTER TABLE public.chats OWNER TO jak;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.comments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    text public.citext NOT NULL,
    parent_id uuid NOT NULL,
    author_id uuid NOT NULL,
    "timestamp" date DEFAULT now() NOT NULL
);


ALTER TABLE public.comments OWNER TO jak;

--
-- Name: connections; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.connections (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_a_id uuid NOT NULL,
    user_b_id uuid NOT NULL,
    a_following_b boolean DEFAULT false NOT NULL,
    b_following_a boolean DEFAULT false NOT NULL,
    "timestamp" date DEFAULT now() NOT NULL
);


ALTER TABLE public.connections OWNER TO jak;

--
-- Name: images; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.images (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    post_id uuid NOT NULL,
    bucket_key text NOT NULL
);


ALTER TABLE public.images OWNER TO jak;

--
-- Name: likeness; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.likeness (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    content_id uuid NOT NULL,
    like_content boolean NOT NULL,
    user_id uuid NOT NULL,
    "timestamp" date DEFAULT now() NOT NULL
);


ALTER TABLE public.likeness OWNER TO jak;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.messages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    text public.citext NOT NULL,
    author_id uuid NOT NULL,
    chat_id uuid NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.messages OWNER TO jak;

--
-- Name: notification_tokens; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.notification_tokens (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    value character varying NOT NULL,
    "timestamp" date DEFAULT now() NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.notification_tokens OWNER TO jak;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.posts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    text public.citext NOT NULL,
    author_id uuid NOT NULL,
    "timestamp" date DEFAULT now() NOT NULL
);


ALTER TABLE public.posts OWNER TO jak;

--
-- Name: users; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    first_name public.citext NOT NULL,
    last_name public.citext NOT NULL,
    email public.citext NOT NULL,
    password public.citext NOT NULL,
    dob date NOT NULL,
    email_verified boolean DEFAULT false NOT NULL,
    username public.citext NOT NULL,
    "timestamp" date DEFAULT CURRENT_DATE NOT NULL,
    description character varying(1000),
    profile_picture_bucket_key text
);


ALTER TABLE public.users OWNER TO jak;

--
-- Data for Name: chat_membership; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.chat_membership (id, user_id, chat_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.chats (id, title, "timestamp", expiration) FROM stdin;
a4c4cf77-07ee-4b93-81d3-9d8dcfedb720		2022-07-09	\N
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.comments (id, text, parent_id, author_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: connections; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.connections (id, user_a_id, user_b_id, a_following_b, b_following_a, "timestamp") FROM stdin;
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.images (id, post_id, bucket_key) FROM stdin;
\.


--
-- Data for Name: likeness; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.likeness (id, content_id, like_content, user_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.messages (id, text, author_id, chat_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: notification_tokens; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.notification_tokens (id, value, "timestamp", user_id) FROM stdin;
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.posts (id, text, author_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.users (id, first_name, last_name, email, password, dob, email_verified, username, "timestamp", description, profile_picture_bucket_key) FROM stdin;
\.


--
-- Name: chat_membership chat_membership_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.chat_membership
    ADD CONSTRAINT chat_membership_pkey PRIMARY KEY (id);


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: connections connections_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_pkey PRIMARY KEY (id);


--
-- Name: images image_id_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT image_id_pkey PRIMARY KEY (id);


--
-- Name: likeness likeness_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.likeness
    ADD CONSTRAINT likeness_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: notification_tokens notification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.notification_tokens
    ADD CONSTRAINT notification_tokens_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: images unique_bucket_key; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT unique_bucket_key UNIQUE (bucket_key);


--
-- Name: chats unique_chat_id; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT unique_chat_id UNIQUE (id);


--
-- Name: users unique_email; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- Name: users unique_id; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_id UNIQUE (id);


--
-- Name: users unique_username; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_username UNIQUE (username);


--
-- Name: notification_tokens unique_value; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.notification_tokens
    ADD CONSTRAINT unique_value UNIQUE (value);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: messages author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: chat_membership chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.chat_membership
    ADD CONSTRAINT chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id);


--
-- Name: messages chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id);


--
-- Name: comments comments_author_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_author_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: connections connections_user_a_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_user_a_id_fkey FOREIGN KEY (user_a_id) REFERENCES public.users(id);


--
-- Name: connections connections_user_b_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_user_b_id_fkey FOREIGN KEY (user_b_id) REFERENCES public.users(id);


--
-- Name: likeness likeness_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.likeness
    ADD CONSTRAINT likeness_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: chat_membership member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.chat_membership
    ADD CONSTRAINT member_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notification_tokens notification_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.notification_tokens
    ADD CONSTRAINT notification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: images post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- Name: posts posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chat_membership; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.chat_membership (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    chat_id uuid NOT NULL,
    "timestamp" date DEFAULT now() NOT NULL
);


ALTER TABLE public.chat_membership OWNER TO jak;

--
-- Name: chats; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.chats (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title public.citext,
    "timestamp" date DEFAULT now() NOT NULL,
    expiration date
);


ALTER TABLE public.chats OWNER TO jak;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.comments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    text public.citext NOT NULL,
    parent_id uuid NOT NULL,
    author_id uuid NOT NULL,
    "timestamp" date DEFAULT now() NOT NULL
);


ALTER TABLE public.comments OWNER TO jak;

--
-- Name: connections; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.connections (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_a_id uuid NOT NULL,
    user_b_id uuid NOT NULL,
    a_following_b boolean DEFAULT false NOT NULL,
    b_following_a boolean DEFAULT false NOT NULL,
    "timestamp" date DEFAULT now() NOT NULL
);


ALTER TABLE public.connections OWNER TO jak;

--
-- Name: images; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.images (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    post_id uuid NOT NULL,
    bucket_key text NOT NULL
);


ALTER TABLE public.images OWNER TO jak;

--
-- Name: likeness; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.likeness (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    content_id uuid NOT NULL,
    like_content boolean NOT NULL,
    user_id uuid NOT NULL,
    "timestamp" date DEFAULT now() NOT NULL
);


ALTER TABLE public.likeness OWNER TO jak;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.messages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    text public.citext NOT NULL,
    author_id uuid NOT NULL,
    chat_id uuid NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.messages OWNER TO jak;

--
-- Name: notification_tokens; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.notification_tokens (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    value character varying NOT NULL,
    "timestamp" date DEFAULT now() NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.notification_tokens OWNER TO jak;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.posts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    text public.citext NOT NULL,
    author_id uuid NOT NULL,
    "timestamp" date DEFAULT now() NOT NULL
);


ALTER TABLE public.posts OWNER TO jak;

--
-- Name: users; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    first_name public.citext NOT NULL,
    last_name public.citext NOT NULL,
    email public.citext NOT NULL,
    password public.citext NOT NULL,
    dob date NOT NULL,
    email_verified boolean DEFAULT false NOT NULL,
    username public.citext NOT NULL,
    "timestamp" date DEFAULT CURRENT_DATE NOT NULL,
    description character varying(1000),
    profile_picture_bucket_key text
);


ALTER TABLE public.users OWNER TO jak;

--
-- Data for Name: chat_membership; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.chat_membership (id, user_id, chat_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.chats (id, title, "timestamp", expiration) FROM stdin;
a4c4cf77-07ee-4b93-81d3-9d8dcfedb720		2022-07-09	\N
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.comments (id, text, parent_id, author_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: connections; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.connections (id, user_a_id, user_b_id, a_following_b, b_following_a, "timestamp") FROM stdin;
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.images (id, post_id, bucket_key) FROM stdin;
\.


--
-- Data for Name: likeness; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.likeness (id, content_id, like_content, user_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.messages (id, text, author_id, chat_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: notification_tokens; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.notification_tokens (id, value, "timestamp", user_id) FROM stdin;
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.posts (id, text, author_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.users (id, first_name, last_name, email, password, dob, email_verified, username, "timestamp", description, profile_picture_bucket_key) FROM stdin;
\.


--
-- Name: chat_membership chat_membership_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.chat_membership
    ADD CONSTRAINT chat_membership_pkey PRIMARY KEY (id);


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: connections connections_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_pkey PRIMARY KEY (id);


--
-- Name: images image_id_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT image_id_pkey PRIMARY KEY (id);


--
-- Name: likeness likeness_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.likeness
    ADD CONSTRAINT likeness_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: notification_tokens notification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.notification_tokens
    ADD CONSTRAINT notification_tokens_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: images unique_bucket_key; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT unique_bucket_key UNIQUE (bucket_key);


--
-- Name: chats unique_chat_id; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT unique_chat_id UNIQUE (id);


--
-- Name: users unique_email; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- Name: users unique_id; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_id UNIQUE (id);


--
-- Name: users unique_username; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_username UNIQUE (username);


--
-- Name: notification_tokens unique_value; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.notification_tokens
    ADD CONSTRAINT unique_value UNIQUE (value);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: messages author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: chat_membership chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.chat_membership
    ADD CONSTRAINT chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id);


--
-- Name: messages chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id);


--
-- Name: comments comments_author_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_author_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: connections connections_user_a_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_user_a_id_fkey FOREIGN KEY (user_a_id) REFERENCES public.users(id);


--
-- Name: connections connections_user_b_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_user_b_id_fkey FOREIGN KEY (user_b_id) REFERENCES public.users(id);


--
-- Name: likeness likeness_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.likeness
    ADD CONSTRAINT likeness_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: chat_membership member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.chat_membership
    ADD CONSTRAINT member_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notification_tokens notification_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.notification_tokens
    ADD CONSTRAINT notification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: images post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- Name: posts posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

