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
                time.sleep(0.5);
            else:
                raise RuntimeError("Cannot geolocate: %s" % row["Name"])
        else:
            location = (row["Latitude"], row["Longitude"])

        Person(name = unicode(row["Name"], "utf-8"), gender = row["Gender"], country = row["Country"], birthplace = unicode(row["Birthplace"], "utf-8"),
               lat = location[0], lng = location[1], yob = row["Born"], source = row["Source"],
               yod = row["Died"] if len(row["Died"]) > 0 else 0, biography = row["Biography"],
               picture = row["Picture"])

        print "Created Person: %s" % row["Name"]

def achievements(rows):
    for row in rows:
        person = Person.get(name = unicode(row["Name"], "utf-8"))
        impact = Impact.get(value = int(row["Impact"]))

        if person and impact:
            tags = filter(None, map(lambda t: fetch_tag(t, "Tag"), row["Tags"].split(",")))
            topics = map(lambda t: fetch_tag(t, "Topic"), ["All"] + row["Topics"].split(","))

            # Add appropriate slugged tag into all tag-linking syntax in description field.
            desc = unicode(row["Achievement"], "utf-8")
            desc = re.sub("\#\{(.+?)\|(.+?)\}", lambda m: "#{%s|%s}" % (m.groups()[0], slug(m.groups()[1])), desc)
            desc = re.sub("\#\{([^|]+?)\}", lambda m: "#{%s|%s}" % (m.groups()[0], slug(m.groups()[0])), desc)

            Achievement(person = person, impact = impact, year = row["Date"], description = desc,
                        source = row["Source"], tags = (topics + tags))

            print "Created Achievement for %s" % person.name
        else:
            print "WARN: Unknown person or impact (%s, %s). Skipping..." % (row["Name"], row["Impact"])
            continue

def awards(rows):
    print "Removed: %d Awards." % Award.select().delete()

    # Just hard-code tags and impact for now (in future some awards may be worth others).
    impact = Impact.get(value = 1)

    for row in rows:
        award = Award.get(name = row["Award"]) or Award(name = row["Award"])
        person = Person.get(name = row["Name"])
        tags = filter(None, map(lambda t: fetch_tag(t, "Tag"), row["Tags"].split(",")))

        if person:
            Achievement(award = award, person = person, impact = impact, year = row["Date"], description = row["Description"],
                        source = row["Source"], tags = tags)

            print "Created Award for %s, %s, %s" % (award.name, person.name, row["Date"])
        else:
            print "WARN: Unknown person (%s). Skipping..." % row["Name"]
            continue

def fetch_tag(t, style):
    if len(t) > 0:
        s = slug(t)

        return Tag.get(slug = s, style = style) or Tag(name = unicode(t, "utf-8"), slug = s, style = style)

def slug(s):
    pattern = re.compile("[^\w\-\+\@\#\$]+")

    return pattern.sub("-", s.strip().lower())

impacts()
with_csv("data/csv/people.csv", people)
with_csv("data/csv/achievements.csv", achievements)
with_csv("data/csv/awards.csv", awards)
