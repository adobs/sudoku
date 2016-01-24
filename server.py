from flask import Flask, request, render_template, redirect, flash, session
from jinja2 import StrictUndefined
# from flask_debugtoolbar import DebugToolbarExtension
import os
import json

from board_helper_functions.generator import generate_board, solved_board

app = Flask(__name__)

# Required to use Flask sessions and the debug toolbar
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "ABCDEF")
# Normally, if you use an undefined variable in Jinja2, it fails silently.
# This is horrible. Fix this so that, instead, it raises an error.
app.jinja_env.undefined = StrictUndefined


@app.route("/")
def home():
    """Home page"""

    return render_template("index.html")


@app.route("/problem-generator.json")
def generator():
    """ Initializes board """

    print "server side"

    return json.dumps(generate_board())


@app.route("/solved-board.json")
def solved():
    """ Returns solved board """

    return json.dumps(solved_board())
if __name__ == "__main__":
    
    PORT = int(os.environ.get("PORT", 5000))
    DEBUG = "NO_DEBUG" not in os.environ

    app.run(debug=DEBUG, host="0.0.0.0", port=PORT)
