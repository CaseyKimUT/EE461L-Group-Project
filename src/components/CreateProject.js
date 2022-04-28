import * as React from "react";


let userID = localStorage.getItem('userID')

let HardwareArray = [
    {id: 0,capacity:"",availability:""},
    {id: 1,capacity:"",availability:""}
    ]
    
  let projectsArray = [
    {
     projectName:"",
     checkedOut:[-1,-1]
    }
  ]

function getProjects(){
    let projectTemplate = {}
    fetch("http://127.0.0.1:5000/getUserProjects/" + userID + "/" + projectTemplate)
      .then(response => 
        response.json()
      )
      .then(data => {
        projectsArray = data  

        
        localStorage.setItem('currentProject', )
        localStorage.setItem('owned sets', )
            
        console.log("projects is " + projectsArray)
        
        {/*Catches error if user has no projects  */}
      }).catch(error => {console.log(error)})           
  }