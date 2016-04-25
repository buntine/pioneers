from flask import Flask, request, render_template, jsonify
from models import *
from pony.orm import *

app = Flask(__name__)
app.config.from_envvar('SETTINGS', silent=True)

def dictify(people):
    "Collects a list of (person, achievement) into a dict of people->achievements.
     Also decorates dict with sum of importance of achievements."
    people

def all_achievements(people):
    "Adds remaining achievements for each person."
    people

@app.route("/")
@db_session
def index():
    people = Person.select()
    return render_template("index.html", people=people)

@app.route("/people")
@db_session
def people():
    tags = request.args.getlist("tag")
    results = left_join((p, a) for p in Person
                               for a in p.achievements
                               for t in a.tags if t.name in tags)

    people = all_achievements(
               to_dict(people[:]))

    return jsonify(people=people)

if __name__ == "__main__":
    app.run()
