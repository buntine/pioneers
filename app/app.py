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

if __name__ == "__main__":
    app.run(debug=DEBUG)
