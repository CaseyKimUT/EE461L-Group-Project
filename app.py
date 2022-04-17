from email import message
from urllib import response
from flask import Flask, jsonify,request
from flask.helpers import send_from_directory
from pymongo import MongoClient

import hardwareSet
import wfdb
import encrypt

client = MongoClient("mongodb+srv://stephanieA:jzI0dQyVTBviEzgF@ee461ldb.lqgx1.mongodb.net/accounts?retryWrites=true&w=majority")

# comment out on deployment
#from flask_cors import CORS

database = client["accounts"]

app = Flask(__name__, static_folder="./build", static_url_path="")

# comment out on deployment
#CORS(app)

#Create object hwSet1 of class hardwareSet with capacity of 250
hwSet1=hardwareSet.HWSet(200)
hwSet2=hardwareSet.HWSet(150)

##TODO implement with mongoDB
db = {0:hwSet1,
      1:hwSet2}

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

    projectTemplate = []

    #TODO get from database
    for x in range(2):
        template = {
            "projectName":"hello" + str(x),
            "checkedOut":[20,20]
        }
        projectTemplate.append(template)

    print(projectTemplate)

    return jsonify(projectTemplate)

# Login and SignIn information
# TO BE DELETED LATER: Database

# database = {"user1": "password1", "user2": "password2"}


 # Checks to see if an inputed username and password are in the database to log in 
@app.route("/check_correct/<username>/<password>", methods = ["GET"])
def check_correct(username:str, password:str):
    collections = database.list_collection_names()
    if username in collections:
        password = encrypt.encrypt(password)
        account_info = database[username].find_one()
        if account_info["password"] == password:
            output = account_info["projects"]
        else:
            output = "Incorrect username or password"
    else:
        output = "Incorrect username or password"
    print(output)
    return jsonify(message = output)

# Creates a new account with the given username and password
@app.route("/create_account/<username>/<password>", methods = ["GET"])
def create_account(username: str, password: str):
    collections = database.list_collection_names()
    if username in collections:
        output = "An account with this username already exists"
    else:
        user = database[username]
        password = encrypt.encrypt(password)
        account_info = {
            "password": password,
            "projects": []
        }
        user.insert_one(account_info)
        output = "Created account!"
    print(output)
    return jsonify(message = output)



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
