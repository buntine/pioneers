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
    people = [{"name": "Andrew", "achievements": [{"description": "Invented everything", "year": 1945}], "total": 12}]
    return jsonify(people=people)

if __name__ == "__main__":
    app.run()
