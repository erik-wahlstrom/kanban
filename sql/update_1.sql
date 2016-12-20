SET search_path=public;

ALTER TABLE person ADD COLUMN fb_id varchar(30);



ALTER TABLE person ADD CONSTRAINT unique_fb_id UNIQUE (fb_id);


CREATE TABLE note (
    id SERIAL PRIMARY KEY,
    work_item_id integer REFERENCES work_item(id),
    value text, 
    created_date date
);


