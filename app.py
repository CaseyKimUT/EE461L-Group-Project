from getpass import getuser
from unittest import result
from flask import Flask, jsonify,request
from flask.helpers import send_from_directory
from pandas import array

import hardwareSet
import wfdb


from pymongo import MongoClient


#Client=MongoClient("mongodb+srv://Cosmic:0000@cluster0.2bflj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
Client = MongoClient("mongodb+srv://Cosmic:0000@ee461ldb.lqgx1.mongodb.net/EE461LDB?retryWrites=true&w=majority")


mongoHardwareDatabase = Client.hardwareSets
mongoProjectsDatabase = Client.projects



# comment out on deployment
from flask_cors import CORS

app = Flask(__name__, static_folder="./build", static_url_path="")

# comment out on deployment
CORS(app)


#hardware variables, default 0 before connecting to database
HwSet1=hardwareSet.HWSet(0,0)
HwSet2=hardwareSet.HWSet(0,0)

dbHardware = {0:HwSet1,
      1:HwSet2}

#TODO implement with mongoDB
projectDB = []

def updateLocalHardware():
   """Updates local hardware to match server's"""
   hardware = mongoHardwareDatabase.hardware.find()
   set1 = hardware.next()
   set2 = hardware.next()
   HwSet1.set_availability(set1.get("availability"))
   HwSet2.set_availability(set2.get("availability"))
   
   HwSet1.set_capacity(set1.get("capacity"))
   HwSet2.set_capacity(set2.get("capacity"))


def updateServerHardware():
   """Updates server baased on how much changed locally"""
   print(mongoHardwareDatabase.hardware.find()[0])
   hardware = mongoHardwareDatabase.hardware.find()
   set1 = hardware.next()
   set2 = hardware.next()
   result = mongoHardwareDatabase.hardware.update_one({"id":0},{"$set": {'availability':HwSet1.get_availability()}})
   print("set1 update result is ",result.modified_count)
   result = mongoHardwareDatabase.hardware.update_one({"id":1},{"$set": {'availability':HwSet2.get_availability()}})
   print("set2 update result is ",result.modified_count)
 

@app.route("/updateServerProject/<projectName>/<ownedSets>", methods=["GET"])
def updateServerProject(projectName:str,ownedSets:array):
    result = "Admin text, change to whatever"
    projects = mongoProjectsDatabase.userProjects.find()

    #convert to name that can send to mongodb
    convertedName = str(projectName)

    #convert ownedsets string to array
    firstVar = ownedSets.split(',', 1)[0] 
    secondVar = ownedSets.split(',',1)[1]
    print(firstVar)
    print(secondVar)

    for project in projects:
        print("Current project name is ",project.get("projectName"))
        if(projectName == project.get("projectName")):
            mongoProjectsDatabase.userProjects.update_one({"projectName":convertedName},{"$set": {"checkedOut":[5,4]}}) 
            break
        else:
            result = "Name not in Database!"


    return (jsonify(result))
    


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
    #print(hardwareTemplate)
    updateLocalHardware()
    hardwareTemplate = []
    #print("dbhardware size is",len(dbHardware))
    for x in range(len(dbHardware)):
        currentHardware = dbHardware[x]
        hardwareFormat = {
            "id":int(x),
            "name":"HardwareSet_"+str(x),
            "capacity":currentHardware.get_capacity(),
            "availability":currentHardware.get_availability()
        }
        hardwareTemplate.append(hardwareFormat)
        #print(hardwareTemplate[x])

    return jsonify(hardwareTemplate)

@app.route("/checkOut/<hardwareId>/<checkoutAmount>/<hardwareTemplate>", methods=["GET"])
def checkOut(hardwareId:int,checkoutAmount:int,hardwareTemplate):

    currentHardwareId = int(hardwareId)
    checkoutAmount = int(checkoutAmount)

    #TODO change to do something with this sent in var
    #use hardwareTemplate to get user maybe??
    print(hardwareTemplate)

    updateLocalHardware()

    currentHardware = dbHardware[currentHardwareId]
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

    updateServerHardware()
    #print(output)
    return jsonify(hardwareTemplate = output)

@app.route("/checkIn/<hardwareId>/<checkInAmount>/<hardwareTemplate>", methods=["GET"])
def checkIn(hardwareId:int,checkInAmount:int,hardwareTemplate):

    currentHardwareId = int(hardwareId)
    checkInAmount = int(checkInAmount)

    print(hardwareTemplate)

    currentHardware = dbHardware[currentHardwareId]

    currentHardware.check_in(checkInAmount)

    print(checkInAmount)
    
    output = {"id":int(hardwareId),
             "name":"HardwareSet_"+hardwareId,
             "capacity":currentHardware.get_capacity(),
             "availability":currentHardware.get_availability(),
             "checkedOutAmount":checkInAmount
             }

    updateServerHardware()

    return jsonify(hardwareTemplate = output)


@app.route("/getUserProjects/<userID>/<projectTemplate>", methods=["GET"])
def getUserProjects(userID:str,projectTemplate):
    """
    Method returns all projects associated with userID
    """
    # TODO get user id from database
    #print("user is " + userID)

    tempDB = []
    
    projects = mongoProjectsDatabase.userProjects.find()

    for project in projects:
        if(userID in project.get("users")):
            print(userID)
            newProject = {
               "projectName":project.get("projectName"),
               "checkedOut":project.get("checkedOut")
            }
            tempDB.append(newProject)
       
    projectDB = tempDB
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
    if username in database:
        if database[username] == password:
            output = "logged In to " + username
        else:
            output = "incorrect username / password"
    else:
        output = "Account doesn't exist"
    
    return jsonify(error = output)

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
