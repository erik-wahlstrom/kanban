SET search_path=public;

DROP TABLE IF EXISTS note;
DROP TABLE IF EXISTS work_item;
DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS work_item_group;
DROP TABLE IF EXISTS state;

CREATE TABLE IF NOT EXISTS state (
	id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL UNIQUE
);

insert into state (name) values ('Not Started');
insert into state (name) values ('Active');
insert into state (name) values ('Complete');
insert into state (name) values ('Deleted');

CREATE TABLE IF NOT EXISTS work_item_group (
	id SERIAL PRIMARY KEY,
    description text,
    created_date date, 
    due_date date, 
    last_update date
);



CREATE TABLE IF NOT EXISTS person (
    id SERIAL PRIMARY KEY,
    fb_id varchar(30),
    name text NOT NULL,
    admin bool DEFAULT false
    
);
ALTER TABLE person ADD CONSTRAINT unique_fb_id UNIQUE (fb_id);



CREATE TABLE IF NOT EXISTS work_item (
	id SERIAL PRIMARY KEY,
    state_id integer REFERENCES state(id),
    work_item_group_id integer REFERENCES work_item_group(id),
    person_id integer REFERENCES person(id),
    description text,
    created_date date,
    due_date date, 
    last_update date
);


CREATE TABLE IF NOT EXISTS note (
    id SERIAL PRIMARY KEY,
    work_item_id integer REFERENCES work_item(id),
    person_id integer REFERENCES person(id),
    value text, 
    created_date date
);


