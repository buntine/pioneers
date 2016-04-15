#! /usr/bin/env python

import subprocess
import sqlite3
import csv

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

for n in range(1, 6):
    db.execute("INSERT INTO impacts (value) VALUES (?)", (n,))

conn.commit()
print "Created Impacts."

with open("data/csv/people.csv", "rb") as csvfile:
    people = csv.reader(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL, skipinitialspace=True)
    next(people, None) # Skip headers.

    for row in people:
        db.execute("INSERT INTO people (name, gender, country, yob, yod, biography, picture, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", row)

    conn.commit()
    print "Created People."

with open("data/csv/achievements.csv", "rb") as csvfile:
    achievements = csv.DictReader(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL, skipinitialspace=True)

    for row in achievements:
        db.execute("SELECT id FROM people WHERE name = ?", (row["Name"],))
        person = db.fetchone()

        db.execute("SELECT id FROM impacts WHERE value = ?", (int(row["Impact"]),))
        impact = db.fetchone()

        if person and impact:
            db.execute("INSERT INTO achievements (person_id, impact_id, year, description, source) VALUES (?, ?, ?, ?, ?)",
                       (person[0], impact[0], row["Date"], row["Achievement"], row["Source"]))

            print "Created Achievement for %s" % (row["Name"],)
        else:
            print "WARN: Unknown person or impact (%s, %s). Skipping..." % (row["Name"], row["Impact"])
            continue

    conn.commit()
    print "Created Achievements."
 
