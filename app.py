from flask import Flask, jsonify,request
from flask.helpers import send_from_directory
from matplotlib.style import available

import hardwareSet


# comment out on deployment
from flask_cors import CORS



app = Flask(__name__, static_folder="/build", static_url_path="")


#Create object hwSet1 of class hardwareSet with capacity of 250
hwSet1=hardwareSet.HWSet(250)
hwSet2=hardwareSet.HWSet(250)

##TODO implement with mongoDB
db = {0:hwSet1,
      1:hwSet2}

# comment out on deployment
CORS(app)



@app.route("/checkOut/<hardwareId>/<checkoutAmount>/<hardwareTemplate>", methods=["GET"])
def checkOut(hardwareId:int,checkoutAmount:int,hardwareTemplate):

    currentHardwareId = int(hardwareId)
    checkoutAmount = int(checkoutAmount)

    #TODO change to do something with this sent in var
    #use hardwareTemplate to get user maybe??
    print(hardwareTemplate)

    currentHardware = db[currentHardwareId]
    currentHardware.check_out(checkoutAmount)
    
    output = {"id":int(hardwareId),
             "name":"HardwareSet",
             "capacity":currentHardware.get_capacity(),
             "availability":currentHardware.get_availability()
             }

    #print(output)
    return jsonify(hardwareTemplate = output)

@app.route("/")
def index():
    return send_from_directory("frontend/build", "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0")