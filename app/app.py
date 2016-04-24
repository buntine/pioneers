from flask import Flask, request, render_template, jsonify
from models import *
from pony.orm import *

app = Flask(__name__)
app.config.from_envvar('SETTINGS', silent=True)

@app.route("/")
@db_session
def index():
    people = Person.select()
    return render_template("index.html", people=people)

@app.route("/people")
@db_session
def people():
    # Get tags
    # Get People and mix in achievements for tags
    # Markup results with "total" which is sum of "importance" of achievements
    # Example:
    tags = request.args.getlist("tag")
    people = left_join((p, a) for p in Person for a in p.achievements for t in a.tags if t.name in tags)

    return jsonify(people=people[:])

if __name__ == "__main__":
    app.run()
