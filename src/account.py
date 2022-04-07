from crypt import methods
from flask import Flask, jsonify,request
from flask.helpers import send_from_directory

# comment out on deployment
from flask_cors import CORS

# TO BE DELETED LATER: Database
database = {"user1": "password1", "user2": "password2"}


app = Flask(__name__, static_folder="/build", static_url_path="")

# comment out on deployment
CORS(app)

# Will update with actual database later. Hardcoded account for time being 
@app.route("/check_correct/<username>/<password>", methods = ["GET"])
def check_correct(username:str, password:str):
    if username in database:
        if database[username] == password:
            output = "logged In to " + username
        else:
            output = "incorrect username / password"
    else:
        output = "Account doesn't exist"
    
    return jsonify(error = output)


@app.route("/")
def index():
    return send_from_directory("/build", "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0")
