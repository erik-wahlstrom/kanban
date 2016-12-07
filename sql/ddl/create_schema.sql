SET search_path=public;

DROP TABLE IF EXISTS work_item;
DROP TABLE IF EXISTS state;

CREATE TABLE IF NOT EXISTS state (
	id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL UNIQUE
);

insert into state (name) values ('Not Started');
insert into state (name) values ('In Progress');
insert into state (name) values ('Done');
insert into state (name) values ('Deleted');

CREATE TABLE IF NOT EXISTS work_item (
	id SERIAL PRIMARY KEY,
    state_id integer REFERENCES state(id),
    description text,
    created_date date, 
    last_update date
);

insert into work_item (state_id, description, created_date, last_update) values
	(1, 'Dummy item', now(), now());
	
select wi.id, 
	   s.name, 
       wi.description, 
       wi.created_date, 
       wi.last_update
 from  work_item wi
 inner join state s on s.id = wi.state_id
