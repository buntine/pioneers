#! /usr/bin/env python

import subprocess
import csv

from models import *
from pony.orm import *

# Seeds the database from the CSV files in ./data/csv.
# WARNING: This import is destructive. All existing data will be purged!

print "Opened database."

with db_session:
    for n in range(1, 6):
        Impact(value = n)

    commit()
    print "Created Impacts."

with open("data/csv/people.csv", "rb") as csvfile:
    people = csv.DictReader(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL, skipinitialspace=True)

    with db_session:
        for row in people:
            Person(name = row["Name"], gender = row["Gender"], country = row["Country"], yob = row["Born"], yod = row["Died"] if len(row["Died"]) > 0 else 0,
                   biography = row["Biography"], picture = row["Picture"], source = row["Source"])

        commit()
        print "Created People."

with open("data/csv/achievements.csv", "rb") as csvfile:
    achievements = csv.DictReader(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL, skipinitialspace=True)

    with db_session:
        for row in achievements:
            person = Person.get(name = row["Name"])
            impact = Impact.get(value = int(row["Impact"]))

            if person and impact:
                tags = map(lambda t: t.strip(), row["Tags"].split(","))
                tags = map(lambda t: Tag.get(name = t) or Tag(name = t), tags)

                Achievement(person = person, impact = impact, year = row["Date"], description = row["Achievement"], source = row["Source"],
                            tags = tags)

                commit()

                print "Created Achievement for %s" % (row["Name"],)
            else:
                print "WARN: Unknown person or impact (%s, %s). Skipping..." % (row["Name"], row["Impact"])
                continue

        print "Created Achievements."
 
# TODO: Create awards here.
