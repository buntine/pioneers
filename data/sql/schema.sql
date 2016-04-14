drop table if exists people;
create table people (
  id integer primary key autoincrement,
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
  id integer primary_key autoincrement,
  name varchar(255) not null,
  value smallint
);

drop table if exists achievements;
create table achievements (
  id integer primary key autoincrement,
  foreign_key(person_id) references people(id),
  foreign_key(impact_id) references impacts(id),
  year integer not null,
  description text not null,
  source varchar(255) not null
);
