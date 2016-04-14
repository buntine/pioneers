drop table if exists people;
create table people (
  id integer primary key,
  name varchar(255) not null,
  gender tinyint not null,
  country varchar(255) not null,
  yob integer not null,
  yod integer not null,
  biography text not null,
  picture varchar(255) not null,
  source varchar(255) not null
);

drop table if exists impacts;
create table impacts (
  id integer primary key,
  value smallint unique
);

drop table if exists achievements;
create table achievements (
  id integer primary key,
  person_id integer references people(id),
  impact_id integer references impacts(id),
  year integer not null,
  description text not null,
  source varchar(255) not null
);

drop table if exists awards;
create table awards (
  id integer primary key,
  name varchar(255) not null
);

drop table if exists awardees;
create table awardees (
  award_id integer references awards(id),
  person_id integer references people(id),
  year integer not null
);
 
drop table if exists tags;
create table tags (
  id integer primary key,
  name varchar(255) unique not null
);

drop table if exists achievement_tags;
create table achievement_tags (
  achievement_id integer references achievements(id),
  tag_id integer references tags(id)
);
