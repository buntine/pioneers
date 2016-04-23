from flask import Flask
from models import *
from pony.orm import *

DEBUG = True

app = Flask(__name__)

@app.route("/")
@db_session
def index():
    people = Person.select()
    return str(len(people))

@app.route("/people")
@db_session
def people():
    # Get tags
    # Get People and mix in achievements for tags
    # Markup results with "total" which is sum of "importance" of achievements
    # Example:
    people = [{"name": "Andrew", "achievements": [{"description": "Invented everything", "year": 1945}], "total": 12}]
    return people

if __name__ == "__main__":
    app.run(debug=DEBUG)
