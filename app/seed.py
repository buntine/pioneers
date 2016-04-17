#! /usr/bin/env python

import subprocess
import csv

from models import *
from pony.orm import *

# Seeds the database from the CSV files in ./data/csv.
# WARNING: This import is destructive. All existing data will be purged!

# sql_debug(True)

print "Opened database."

with db_session:
    print "Removed: %d Impacts." % Impact.select().delete()

    for n in range(1, 6):
        Impact(value = n)

    commit()
    print "Created Impacts."

with open("data/csv/people.csv", "rb") as csvfile:
    people = csv.DictReader(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL, skipinitialspace=True)

    with db_session:
        print "Removed: %d People." % Person.select().delete()

        for row in people:
            Person(name = row["Name"], gender = row["Gender"], country = row["Country"], yob = row["Born"], yod = row["Died"] if len(row["Died"]) > 0 else 0,
                   biography = row["Biography"], picture = row["Picture"], source = row["Source"])
            print "Created Person: %s" % row["Name"]

        commit()

with open("data/csv/achievements.csv", "rb") as csvfile:
    achievements = csv.DictReader(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL, skipinitialspace=True)

    with db_session:
        for row in achievements:
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

with open("data/csv/awards.csv", "rb") as csvfile:
    wins = csv.DictReader(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL, skipinitialspace=True)

    with db_session:
        print "Removed: %d Awards." % Award.select().delete()

        for row in wins:
            award = Award.get(name = row["Award"]) or Award(name = row["Award"])
            person = Person.get(name = row["Name"])

            if person:
                Win(award = award, person = person, year = row["Year"])

                print "Created Award for %s, %s, %s" % (award.name, person.name, row["Year"])
            else:
                print "WARN: Unknown person (%s). Skipping..." % row["Name"]
                continue

        commit()
