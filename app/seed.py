#! /usr/bin/env python

import subprocess
import csv
import re
import time

from models import *
from pony.orm import *
from geopy.geocoders import Nominatim

# Seeds the database from the CSV files in ./data/csv.
# WARNING: This import is destructive. All existing data will be purged!

# sql_debug(True)

print "Opened database."

geolocator = Nominatim()

@db_session
def with_csv(path, f):
    with open(path, "rb") as csvfile:
        rows = csv.DictReader(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL, skipinitialspace=True)
        f(rows)   
        commit()

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
        if row["Latitude"] == "" or row["Longitude"] == "":
            geocoded = geolocator.geocode("%s, %s" % (row["Birthplace"], row["Country"]), timeout=12)

            if geocoded:
                location = (geocoded.latitude, geocoded.longitude)
                time.sleep(1.2);
            else:
                raise RuntimeError("Cannot geolocate: %s" % row["Name"])
        else:
            location = (row["Latitude"], row["Longitude"])

        Person(name = unicode(row["Name"], 'utf-8'), gender = row["Gender"], country = row["Country"], birthplace = row["Birthplace"],
               lat = location[0], lng = location[1], yob = row["Born"], source = row["Source"],
               yod = row["Died"] if len(row["Died"]) > 0 else 0, biography = row["Biography"],
               picture = row["Picture"])

        print "Created Person: %s" % row["Name"]

def achievements(rows):
    for row in rows:
        person = Person.get(name = unicode(row["Name"], 'utf-8'))
        impact = Impact.get(value = int(row["Impact"]))

        if person and impact:
            tags = map(lambda t: fetch_tag(t, "Tag"), row["Tags"].split(","))
            topics = map(lambda t: fetch_tag(t, "Topic"), row["Topics"].split(","))

            Achievement(person = person, impact = impact, year = row["Date"], description = unicode(row["Achievement"], 'utf-8'),
                        source = row["Source"], tags = (topics + tags))

            print "Created Achievement for %s" % person.name
        else:
            print "WARN: Unknown person or impact (%s, %s). Skipping..." % (row["Name"], row["Impact"])
            continue

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

def fetch_tag(t, style):
    s = slug(t)

    return Tag.get(slug = s, style = style) or Tag(name = t, slug = s, style = style)

def slug(s):
    pattern = re.compile("[^\w\-\+\@\#\$]+")

    return pattern.sub("-", s.strip().lower())

impacts()
with_csv("data/csv/people.csv", people)
with_csv("data/csv/achievements.csv", achievements)
with_csv("data/csv/awards.csv", awards)
