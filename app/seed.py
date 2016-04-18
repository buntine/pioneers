#! /usr/bin/env python

import subprocess
import csv

from models import *
from pony.orm import *

# Seeds the database from the CSV files in ./data/csv.
# WARNING: This import is destructive. All existing data will be purged!

# sql_debug(True)

print "Opened database."

def with_csv(path, f):
    with open(path, "rb") as csvfile:
        rows = csv.DictReader(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL, skipinitialspace=True)
        f(rows)   

@db_session
def impacts():
    print "Removed: %d Impacts." % Impact.select().delete()

    for n in range(1, 6):
        Impact(value = n)

    commit()
    print "Created Impacts."
 
@db_session
def people(rows):
    print "Removed: %d People." % Person.select().delete()

    for row in rows:
        Person(name = row["Name"], gender = row["Gender"], country = row["Country"], yob = row["Born"], yod = row["Died"] if len(row["Died"]) > 0 else 0,
               biography = row["Biography"], picture = row["Picture"], source = row["Source"])
        print "Created Person: %s" % row["Name"]

    commit()

@db_session
def achievements(rows):
    for row in rows:
        person = Person.get(name = row["Name"])
        impact = Impact.get(value = int(row["Impact"]))

        if person and impact:
            tags = map(lambda t: Tag.get(name = t) or Tag(name = t),
                       map(lambda t: t.strip(), row["Tags"].split(",")))

            Achievement(person = person, impact = impact, year = row["Date"], description = row["Achievement"], source = row["Source"],
                        tags = tags)

            print "Created Achievement for %s" % person.name
        else:
            print "WARN: Unknown person or impact (%s, %s). Skipping..." % (row["Name"], row["Impact"])
            continue

    commit()

@db_session
def awards(rows):
    print "Removed: %d Awards." % Award.select().delete()

    for row in rows:
        award = Award.get(name = row["Award"]) or Award(name = row["Award"])
        person = Person.get(name = row["Name"])

        if person:
            Win(award = award, person = person, year = row["Year"])

            print "Created Award for %s, %s, %s" % (award.name, person.name, row["Year"])
        else:
            print "WARN: Unknown person (%s). Skipping..." % row["Name"]
            continue

    commit()

impacts()
with_csv("data/csv/people.csv", people)
with_csv("data/csv/achievements.csv", achievements)
with_csv("data/csv/awards.csv", awards)
