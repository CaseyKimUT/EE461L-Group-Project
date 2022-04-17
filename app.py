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
from flask_cors import CORS

database = client["accounts"]

app = Flask(__name__, static_folder="./build", static_url_path="")

# comment out on deployment
CORS(app)


#Hardware/Project Variables
HwSet1=hardwareSet.HWSet(0,0)
HwSet2=hardwareSet.HWSet(0,0)

dbHardware = {0:HwSet1,
      1:HwSet2}

mongoHardwareDatabase = client.hardwareSets
mongoProjectsDatabase = client.projects
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
def updateServerProject(projectName:str,ownedSets:str):
    result = "Admin text, change to whatever"
    projects = mongoProjectsDatabase.userProjects.find()
    
    #projectName format already fine

    #convert ownedSet to Int Array
    newArray = ownedSets.split(',')
    newArray = [int(i) for i in newArray]
    print(newArray)


    for project in projects:
        print("Current project name is ",project.get("projectName"))
        if(projectName == project.get("projectName")):
            mongoProjectsDatabase.userProjects.update_one({"projectName":projectName},{"$set": {"checkedOut":newArray}}) 
            break
        else:
            result = "Name not in Database!"


    return (jsonify(result))
    


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
    """
    print("User is",userID)
    print("New Project Name is:" ,projectName)

    createdProject = {
            "projectName":projectName,
            "checkedOut":[0,0]
        }   
    
    #add locally
    projectDB.append(createdProject)
    #add to server and add user to it
    createdProject["users"] =[userID]
    print("added",createdProject)
    project = mongoProjectsDatabase.userProjects
    project.insert_one(createdProject)

    #print(projectDB)
    return(jsonify("hello"))

@app.route("/getNonJoinedProjects/<userID>", methods=["GET"])
def getNonJoinedProjects(userID:str):
    """
    Method returns all projects that user is not a part of
    """
    #print("user is " + userID)

    tempDB = []
    
    projects = mongoProjectsDatabase.userProjects.find()

    for project in projects:
        if(userID not in project.get("users")):
            newProject = {
                "projectName":project.get("projectName"),
                "checkedOut":project.get("checkedOut")
            }
            tempDB.append(newProject)

    
    print(tempDB)

    return jsonify(tempDB)

@app.route("/getAllProjects/<userID>/<projectName>", methods=["GET"])
def joinProject(userID:str,projectName:str):
    """
    Join project from database using userID and projectName
    """
    print("user is ",userID)
    print("projectName is",projectName)

    getArray = mongoProjectsDatabase.userProjects.find({"projectName":projectName})
    getArray = getArray.next()
    getArray.get("users").append(userID)

    newArray = getArray.get("users")

    print("getArray is ",getArray)
    print("array by itself is ",newArray)

    result = mongoProjectsDatabase.userProjects.update_one({"projectName":projectName},{"$set": {"users":newArray}})

    return jsonify(result)

# Login and SignIn information
# TO BE DELETED LATER: Database

# database = {"user1": "password1", "user2": "password2"}


 # Checks to see if an inputed username and password are in the database to log in 
@app.route("/check_correct/<username>/<password>", methods = ["GET"])
def check_correct(username:str, password:str):
    output = {"correct":False, "message":""}
    
    collections = database.list_collection_names()

    if username in collections:
        password = encrypt.encrypt(password)
        account_info = database[username].find_one()
        if account_info["password"] == password:
            output["correct"] = True
            output["message"] = account_info["projects"]
            
        else:
            output["message"] = "Incorrect username / password"
    else:
        output["message"] = "Account doesn't exist"
    print(output)
    return jsonify(output)

# Creates a new account with the given username and password
@app.route("/create_account/<username>/<password>", methods = ["GET"])
def create_account(username: str, password: str):
    output = {"correct":False, "message":""}
    collections = database.list_collection_names()
    if username in collections:
        output['message'] = "An account with this username already exists"
        output['correct'] = False
    else:
        user = database[username]
        password = encrypt.encrypt(password)
        account_info = {
            "password": password,
            "projects": []
        }
        user.insert_one(account_info)
        output['message'] = "Created account!"
        output['correct'] = True
    print(output)
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