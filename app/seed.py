#! /usr/bin/env python

import subprocess
import sqlite3
import csv
import models

# Seeds the database from the CSV files in ./data/csv.

conn = sqlite3.connect("db/pioneers.sqlite3")
conn.text_factory = sqlite3.Binary
db = conn.cursor()
print "Opened database."

for n in range(1, 6):
    db.execute("INSERT INTO impact (value) VALUES (?)", (n,))

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

            conn.commit()
            print "Created Achievement for %s" % (row["Name"],)

            tags = map(lambda t: t.strip(), row["Tags"].split(","))

            for t in tags:
                db.execute("SELECT id FROM tags WHERE name = ?", (t,))
                tag = db.fetchone()

                if tag:
                    db.execute

        else:
            print "WARN: Unknown person or impact (%s, %s). Skipping..." % (row["Name"], row["Impact"])
            continue

    print "Created Achievements."
 
# TODO: Create awards here.
