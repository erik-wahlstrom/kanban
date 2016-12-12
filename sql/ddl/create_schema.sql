SET search_path=public;

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

insert into work_item_group (description, created_date, last_update) values ('Default', now(), now());
insert into work_item_group (description, created_date, last_update) values ('Home', now(), now());
insert into work_item_group (description, created_date, last_update) values ('Work', now(), now());

CREATE TABLE IF NOT EXISTS person (
    id SERIAL PRIMARY KEY,
    name text NOT NULL
);

insert into person (name) values ('Erik');
insert into person (name) values ('Colleen');



CREATE TABLE IF NOT EXISTS work_item (
	id SERIAL PRIMARY KEY,
    state_id integer REFERENCES state(id),
    work_item_group_id integer REFERENCES work_item_group(id),
    person_id integer REFERENCES users(id),
    description text,
    created_date date,
    due_date date, 
    last_update date
);



insert into work_item (state_id, work_item_group_id, person_id, description, created_date, last_update) values (1, 1, 1, 'Dummy item', now(), now());
	
select wi.id, 
	   s.name, 
       wi.description, 
       wi.created_date, 
       wi.last_update
 from  work_item wi
 inner join state s on s.id = wi.state_id
