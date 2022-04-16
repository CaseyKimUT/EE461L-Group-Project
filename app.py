from flask import Flask, jsonify,request
from flask.helpers import send_from_directory

import hardwareSet
import wfdb

# comment out on deployment
from flask_cors import CORS



app = Flask(__name__, static_folder="./build", static_url_path="")

# comment out on deployment
CORS(app)

#Create object hwSet1 of class hardwareSet with capacity of 250
hwSet1=hardwareSet.HWSet(200)
hwSet2=hardwareSet.HWSet(150)

##TODO implement with mongoDB
db = {0:hwSet1,
      1:hwSet2}

#TODO implement with mongoDB
"""projectDB = [
    {
        "projectName":"StarterProject",
        "checkedOut":[0,0]
    }"""
    
projectDB = []

@app.route("/initializeHardwarePage/<hardwareTemplate>", methods=["GET"])
def initializeHardwarePage(hardwareTemplate):
    """initializes a document for all hardware sets in database
       format ex
       { 
          { 
            id:0,
            name:HardwareSet_0",
            capacity:300,
            availability:300
          },
          ...
        }
    """
    print(hardwareTemplate)

    hardwareTemplate = []

    for x in range(len(db)):
        currentHardware = db[x]
        hardwareFormat = {
            "id":int(x),
            "name":"HardwareSet_"+str(x),
            "capacity":currentHardware.get_capacity(),
            "availability":currentHardware.get_availability()
        }
        hardwareTemplate.append(hardwareFormat)
        print(hardwareTemplate[x])

    return jsonify(hardwareTemplate)

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


@app.route("/getUserProjects/<userID>/<projectTemplate>", methods=["GET"])
def getUserProjects(userID:str,projectTemplate):
    """
    Method returns all projects associated with userID
    """
    # TODO get user id from database
    print("user is " + userID)
    #TODO get from database
    print(projectDB)

    return jsonify(projectDB)

@app.route("/createProject/<userID>/<projectName>", methods=["GET"])
def createProject(userID:str,projectName:str):
    """
    Creates project to database
        - Check if empty string sent
        - Check if duplicate project name 
    """
    print("User is ",userID)
    print("New Project Name is: " ,projectName)

    newProject = {
            "projectName":projectName,
            "checkedOut":[0,0]
        }   
    
    #TODO add to mongoDB instead
    projectDB.append(newProject)
    print(projectDB)
    return("hello")

# Login and SignIn information
# TO BE DELETED LATER: Database

database = {"user1": "password1", "user2": "password2"}

 # Will update with actual database later. Hardcoded account for time being 
@app.route("/check_correct/<username>/<password>", methods = ["GET"])
def check_correct(username:str, password:str):
    output = {"correct":False, "message":""}

    if username in database:
        if database[username] == password:
            output["correct"] = True
            output["message"] = "Login Successful"
        else:
            output["message"] = "Incorrect username / password"
    else:
        output["message"] = "Account doesn't exist"

    return jsonify(output)

@app.route("/dataset/<datasetkey>", methods=["GET"])
def dataset(datasetkey:str):

    record_list = wfdb.get_record_list(datasetkey)
    return jsonify(recordNum=len(record_list))


@app.route("/")
def index():
    return send_from_directory("./build", "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0")

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')