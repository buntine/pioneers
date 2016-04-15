from pony.orm import *
import os

db = Database()

class Tag(db.Entity):
    name = Required(str)

db.bind("sqlite", "../db/pioneers.sqlite3", create_db=True)
db.generate_mapping(create_tables=True)
