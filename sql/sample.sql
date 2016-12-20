

insert into work_item_group (description, created_date, last_update) values ('Default', now(), now());
insert into work_item_group (description, created_date, last_update) values ('Home', now(), now());
insert into work_item_group (description, created_date, last_update) values ('Work', now(), now());

insert into person (name, fb_id, admin) values ('Erik Wahlstrom', '10209783371732544', true );
insert into person (name, fb_id, admin) values ('Colleen Wahlstrom', 'UNKOWN', false );

insert into work_item (state_id, work_item_group_id, person_id, description, created_date, last_update) values (1, 1, 1, 'Dummy item', now(), now());

INSERT INTO note (work_item_id, value, created_date) VALUES (1, 2, 'This is a note.', now());

