from flask import Flask, jsonify
from flask.helpers import send_from_directory

import hardwareSet


# comment out on deployment
from flask_cors import CORS



app = Flask(__name__, static_folder="/build", static_url_path="")

#change to get from database and use class
db = {1:{"name":"HardwareSet","capacity":300,"availability":300}}


#Create object hwSet1 of class hardwareSet with capacity of 250
hwSet1=hardwareSet.HWSet(250)

db = {1:hwSet1}

# comment out on deployment
CORS(app)



@app.route("/checkOut/<Index>/<Amount>", methods=["GET"])
def checkOut(index: str,amount: str):
    if index in db:
        output = db.get(index)
        output.check_out(amount)
    else:
        output = "Index out of Bounds" #probably won't happen
    return jsonify(db=output)

@app.route("/")
def index():
    return send_from_directory("frontend/build", "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0")