from flask import Flask, jsonify
from flask.helpers import send_from_directory

import hardwareSet


# comment out on deployment
from flask_cors import CORS



app = Flask(__name__, static_folder="/build", static_url_path="")


#Create object hwSet1 of class hardwareSet with capacity of 250
hwSet1=hardwareSet.HWSet(250)

##TODO implement with mongoDB
db = {1:hwSet1}

# comment out on deployment
CORS(app)



@app.route("/checkOut/<hwSetIndex>/", methods=["GET"])
def checkOut(hwSetIndex: str):

    if hwSetIndex in db:
        output = db.get(hwSetIndex)
    else:
        output = 0


    return jsonify(hwSetIndex = output)

@app.route("/")
def index():
    return send_from_directory("frontend/build", "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0")