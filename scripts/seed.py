#! /usr/bin/env python

import subprocess
import sqlite3

# Seeds the database from the CSV files in ./data/csv.

# - Remove database
# - Create database from schema

# - Create 1..5 for impacts
# - Import all from people.csv

# - For each achievement
#   - Assign person
#   - Assign impact
#   - For each tag:
#     - Create and assign
#   - Save

# - For each award
#   - Create and assign

def run(cmd, success, fail, die_on_fail=True):
    out = subprocess.call("cat data/sql/schema.sql | sqlite3 db/pioneers.sqlite3", shell=True, stderr=subprocess.PIPE)

    if out > 0:
        print fail
        if die_on_fail:
            exit(1)
    else:
        print success

run("rm db/pioneers.sqlite3",
    "Removed database",
    "No database. Continuing...", die_on_fail=False)

run("cat data/sql/schema.sql | sqlite3 db/pioneers.sqlite3",
    "Created database from schema.",
    "Could not create database. Dying...")

conn = sqlite3.connect("db/pioneers.sqlite3")
db = conn.cursor()
print "Opened database."

for n in range(1, 5):
    db.execute("INSERT INTO impacts VALUES ('%d', %d)" % (n, n))

db.commit()
print "Created Impacts."
