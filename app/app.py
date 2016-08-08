import random
from flask import Flask, request, render_template, jsonify
from models import *
from pony.orm import *
from collections import defaultdict

app = Flask(__name__)
app.config.from_envvar("SETTINGS", silent=True)

def expand_achievements(achievements):
    return map(lambda a: {"description": a.description,
                          "year": a.year,
                          "award": a.award.name if a.award else None,
                          "impact": a.impact.value,
                          "source": a.source}, achievements)

def expand_person(person, achievements):
    p = person.to_dict(only=["id", "name", "country", "gender", "yob", "yod", "biography", "birthplace", "picture", "source"])
    p["total_achievements"] = select(a for a in Achievement if a.person == person).count()
    p["achievements"] = expand_achievements(achievements)
    p["impact"] = reduce(lambda t, a: t + a["impact"], p["achievements"], 0)

    return p

def to_list(people):
    "Translates a dict of people->achievements into a list of people."
    return [expand_person(p, a) for p, a in people.iteritems()]

def has_all_tags(achievement, tags):
    slugs = [t.slug for t in achievement.tags]
    return all([t in slugs for t in tags])

def to_dict(people, tags=[]):
    "Collects a list of (person, achievement) into a dict of people->achievements."
    p = defaultdict(list)

    for k, v in people:
        if len(tags) == 0 or has_all_tags(v, tags):
            p[k].append(v)

    return p

def translate(results, tags=[]):
    return to_list(
             to_dict(results[:], tags))

def all_achievements_for_tags(tags):
    return left_join((p, a) for p in Person
                            for a in p.achievements
                            for t in a.tags if t.slug in tags)
 
def all_achievements():
    return left_join((p, a) for p in Person
                            for a in p.achievements)

def move_to_front(names, arr):
    lst = arr

    for n in reversed(names):
        i = next(i for i, x in enumerate(lst) if x[0] == n)
        lst = [lst.pop(i)] + lst

    return lst
 
@app.route("/")
@app.route("/impact/<op>/<tags>")
@app.route("/timeline/<op>/<tags>")
@app.route("/geography/<op>/<tags>")
@db_session
def index(op="OR", tags=[]):
    get_tags = lambda s: select((t.name, t.slug) for t in Tag if t.style == s).order_by(1)[:]
    topics = get_tags("Topic")

    return render_template("index.html",
            suggested_tag = random.choice(topics),
            topics = move_to_front(["All", "Major milestones"], topics),
            tags = get_tags("Tag"))

@app.route("/people")
@db_session
def people():
    tags = request.args.getlist("tags[]")
    operation = request.args.get("op", "OR")
    people = translate(
               all_achievements_for_tags(tags) if len(tags) > 0 else all_achievements(),
               tags if operation == "AND" else [])

    return jsonify(people=people)

@app.route("/people/<person_id>/achievements")
@db_session
def achievements(person_id):
    achievements = select(a for a in Achievement if a.person.id == person_id).order_by(Achievement.year)

    return jsonify(achievements=expand_achievements(achievements))

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True) # Add argument debug=True if you want to test during development.
