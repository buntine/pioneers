from flask import Flask, request, render_template, jsonify
from models import *
from pony.orm import *
from collections import defaultdict

app = Flask(__name__)
app.config.from_envvar("SETTINGS", silent=True)

def expand_achievements(achievements):
    return map(lambda a: {"description": a.description,
                          "year": a.year,
                          "impact": a.impact.value,
                          "source": a.source}, achievements)

def expand_wins(wins):
    return map(lambda w: {"name": w.award.name, "year": w.year}, wins)

def expand_person(person, achievements):
    p = person.to_dict(only=["name", "country", "gender", "yob", "yod", "biography", "picture", "source"])
    p["achievements"] = expand_achievements(achievements)
    p["wins"] = expand_wins(person.wins)
    p["impact"] = reduce(lambda t, a: t + a["impact"], p["achievements"], 0)

    return p

def to_list(people):
    "Translates a dict of people->achievements into a list of people."
    return [expand_person(p, a) for p, a in people.iteritems()]

def has_all_tags(achievement, tags):
    names = [t.name for t in achievement.tags]
    return all([t in names for t in tags])

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
                            for t in a.tags if t.name in tags)
 
def all_achievements():
    return left_join((p, a) for p in Person
                            for a in p.achievements)
 
@app.route("/")
@db_session
def index():
    return render_template("index.html", tags=select(t.name for t in Tag).order_by(1)[:])

@app.route("/people")
@db_session
def people():
    tags = request.args.getlist("tags[]")
    operation = request.args.get("op", "OR")
    people = translate(
               all_achievements_for_tags(tags) if len(tags) > 0 else all_achievements(),
               tags if operation == "AND" else [])

    return jsonify(people=people)

if __name__ == "__main__":
    app.run(debug=True)
