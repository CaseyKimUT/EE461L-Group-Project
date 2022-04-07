from genericpath import getsize
from flask import Flask, jsonify,request
from flask.helpers import send_from_directory
from matplotlib.style import available
from numpy import size

import hardwareSet


# comment out on deployment
#from flask_cors import CORS



app = Flask(__name__, static_folder="./build", static_url_path="")

# comment out on deployment
#CORS(app)

#Create object hwSet1 of class hardwareSet with capacity of 250
hwSet1=hardwareSet.HWSet(250)
hwSet2=hardwareSet.HWSet(250)

##TODO implement with mongoDB
db = {0:hwSet1,
      1:hwSet2}

#TODO implement on frontend, maybe not needed idk
def initializeHardwarePage(hardwareTemplate):
    """initializes a document for all hardware sets in database
       format ex
       { 
          0:{ 
            id:0,
            name:HardwareSet_0",
            capacity:300,
            availability:300
          },
          ...
        }
    """
    print(hardwareTemplate)

    output = {}

    for x in range(len(db)):
        
        currentHardware = db[x]
    
        hardwareFormat = {
            "id":int(x),
            "name":"HardwareSet_"+str(x),
            "capacity":currentHardware.get_capacity(),
            "availability":currentHardware.get_availability()
        }
        output[x] = hardwareFormat
        print(output)

    return jsonify(output)

@app.route("/checkOut/<hardwareId>/<checkoutAmount>/<hardwareTemplate>", methods=["GET"])
def checkOut(hardwareId:int,checkoutAmount:int,hardwareTemplate):

    currentHardwareId = int(hardwareId)
    checkoutAmount = int(checkoutAmount)

    #TODO change to do something with this sent in var
    #use hardwareTemplate to get user maybe??
    print(hardwareTemplate)

    currentHardware = db[currentHardwareId]
    userCheckedOut = currentHardware.get_availability()
    currentHardware.check_out(checkoutAmount)
    userCheckedOut = userCheckedOut - currentHardware.get_availability() 
    print(checkoutAmount)
    
    output = {"id":int(hardwareId),
             "name":"HardwareSet_"+hardwareId,
             "capacity":currentHardware.get_capacity(),
             "availability":currentHardware.get_availability(),
             "checkedOutAmount":userCheckedOut
             }

    #print(output)
    return jsonify(hardwareTemplate = output)

@app.route("/checkIn/<hardwareId>/<checkInAmount>/<hardwareTemplate>", methods=["GET"])
def checkIn(hardwareId:int,checkInAmount:int,hardwareTemplate):

    currentHardwareId = int(hardwareId)
    checkInAmount = int(checkInAmount)

    print(hardwareTemplate)

    currentHardware = db[currentHardwareId]

    currentHardware.check_in(checkInAmount)

    print(checkInAmount)
    
    #TODO CHANGE IMPLEMENTATION FOR CHECKED OUT AMOUNT TO GET FROM SERVER
    output = {"id":int(hardwareId),
             "name":"HardwareSet_"+hardwareId,
             "capacity":currentHardware.get_capacity(),
             "availability":currentHardware.get_availability(),
             "checkedOutAmount":checkInAmount
             }

    return jsonify(hardwareTemplate = output)

@app.route("/")
def index():
    return send_from_directory("./build", "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0")

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')
