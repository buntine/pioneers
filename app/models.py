from pony.orm import *

db = Database()

sql_debug(True)

class Impact(db.Entity):
    value = Required(int)
    achievements = Set("Achievement")

class Person(db.Entity):
    achievements = Set("Achievement")
    wins = Set("Win")
    name = Required(str)
    country = Required(str)
    gender = Required(str)
    yob = Required(int)
    yod = Required(int)
    biography = Required(str)
    picture = Required(str)
    source = Required(str)

class Award(db.Entity):
    wins = Set("Win")
    name = Required(str)

class Win(db.Entity):
    person = Required(Person)
    award = Required(Award)
    year = Required(int)

class Tag(db.Entity):
    name = Required(str)
    style = Required(str)
    slug = Required(str)
    achievements = Set("Achievement")

class Achievement(db.Entity):
    tags = Set("Tag")
    person = Required(Person)
    impact = Required(Impact)
    year = Required(int)
    description = Required(str)
    source = Required(str)

db.bind("sqlite", "../db/pioneers.sqlite3", create_db=True)
db.generate_mapping(create_tables=True)
