import {React,useState,useEffect} from 'react';
import LoginPage from './LoginPage';
import {account_info} from './LoginPage'

  
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


function HWSetPage(){

    const [userID,setUserID] = useState("this will change when user logs in")

    const [checkOut,setCheckout] = useState(new Array(HardwareArray.length).fill(0))
    const [checkIn,setCheckIn] = useState(new Array(HardwareArray.length).fill(0))

    const [ownedSets,setOwnedSets] = useState(new Array(HardwareArray.length).fill(0))
    const [projectName, setProjectName] = useState("")

    const [currentProjectName,setCurrentProjectName] = useState('')
    const [currentProjectIndex,setCurrentProjectIndex] = useState(0)

    const [rerender,setRerender] = useState(0)

    useEffect(() => {
      getProjects();      
      refreshHardwareArray();
      setUserID(userID => userID = account_info.username)
      console.log(account_info)
    },[]);


    function displayCreateProject(){
      return (
        <div>
          <label>New Project: 
            <input type="text" value ={projectName} onChange = {(e) => setProjectName(e.target.value)}></input>
          </label>
          
          <button        
            variant="outlined"   
            onClick={() =>
              fetch("/createProject/" + userID + "/" + projectName)
                .then(response => 
                  response.json()
                ) 
                .then(data => { 
                  getProjects()
                  console.log("Success")
                }).catch(error => {
                  getProjects()
                  console.log(currentProjectIndex)
                }
                )        
            }>       
          Create Project
          </button>
        </div>
      )   
    }


    function updateOwnedSetsServer(i){
      console.log(i)
      fetch("/updateServerProject/" + projectsArray[currentProjectIndex].projectName + "/" + ownedSets)
        .then(response => 
          response.json()
        )
        .then(data => {
          {/*forces rerender, probably better way to do this */}
          setRerender(render => render - 1)                             
          setRerender(render => render + 1)    
          console.log(data)
        }).catch(error => {console.log(error)})           
    }

    function displayProject(){
      return(
        <h3>   
          {"Current Project:" + currentProjectName}
          {/*"Current Project " + currentProjectIndex + ":" + projectsArray[currentProjectIndex].projectName*/}
            <button
              variant="outlined"
              onClick={() => {
                if(currentProjectIndex==projectsArray.length-1){
                  setCurrentProjectIndex(currentProjectIndex => currentProjectIndex = 0)
                } else{
                  setCurrentProjectIndex(currentProjectIndex => currentProjectIndex  + 1) 
                  console.log("Project index is " + currentProjectIndex)  
                  console.log("incremented currentProjectIndex")  
                }
                            
                setOwnedSets(ownedSets => projectsArray[currentProjectIndex].checkedOut)
                setCurrentProjectName(projectName => projectsArray[currentProjectIndex].projectName)
                                  
                console.log("Owned sets is " + ownedSets)
                console.log("Current Project name should be " + projectsArray[currentProjectIndex].projectName)
                console.log("Checked Out should be " + projectsArray[currentProjectIndex].checkedOut)
                console.log("Project index is " + currentProjectIndex)
              }
              }>       
            Change Project
          </button>    
        </h3>
      );

    }

    function getProjects(){
      let projectTemplate = {}
      fetch("/getUserProjects/" + userID + "/" + projectTemplate)
        .then(response => 
          response.json()
        )
        .then(data => {
          projectsArray = data  

          //testing this
          //setCurrentProjectIndex(currentProjectIndex => currentProjectIndex = 0)
          
          setCurrentProjectName(projectsArray[currentProjectIndex].projectName)
          setOwnedSets(ownedSets => ownedSets = projectsArray[currentProjectIndex].checkedOut)
          
          {/*forces rerender, probably better way to do this */}
          setRerender(render => render - 1)                             
          setRerender(render => render + 1)    
          console.log("projects is " + projectsArray)
          
          {/*Catches error if user has no projects  */}
        }).catch(error => {console.log(error)})           
    }

    //fetches from flask to update local array for all hardware
    function refreshHardwareArray(){
        let hardwareTemplate = {}              
        fetch("/initializeHardwarePage/" + hardwareTemplate)
          .then(response => 
            response.json()
          )
          .then(data => {
            HardwareArray = data
            {/*forces rerender, probably better way to do this */}
            setRerender(render => render - 1)                             
            setRerender(render => render + 1)        
          })
          .catch(error => {
            console.log(error)
          })                                                                 
    }

    //Functions for Check Out 
    function incrementCheckOutValue(i){
      let temp = checkOut
      temp[i]++
      setCheckout(checkOut => checkOut = temp)
      setRerender(rerender => rerender + 1)
      console.log("Hardware " + i + ' Checked Out is ' + checkOut)
    }
    
    function decrementCheckOutValue(i){
      if(checkOut[i] > 0){
        let temp = checkOut
        temp[i]--
        setCheckout(checkOut => checkOut = temp)       
        setRerender(rerender => rerender - 1)
      } 
      console.log("Hardware " + i + ' Checked Out is ' + checkOut)
    }
      
    function displayCheckOutButton(value,i){
        return(
        <button
            variant="outlined"
            onClick={() => {

              {/*Probably can send another variable with this*/}
              let hardwareTemplate = {}     
          
              fetch("/checkOut/" + value.id + "/" + checkOut[i] + "/" + hardwareTemplate)
                .then(response => 
                  response.json()
                )
                .then(data => {
                  {/*Data stored in hardwareTemplate from flask*/}
                    let updatedHardware = ({
                      id: data.hardwareTemplate.id,
                      name: data.hardwareTemplate.name,
                      capacity: data.hardwareTemplate.capacity,
                      availability: data.hardwareTemplate.availability,
                    });

                    HardwareArray[updatedHardware.id] = updatedHardware

                    //update locally
                    let temp = ownedSets
                    temp[i] = temp[i] + data.hardwareTemplate.checkedOutAmount
                    setOwnedSets(ownedSets => ownedSets = temp)

                    //update server
                    updateOwnedSetsServer(i)
          
                    console.log("checked out" + data.hardwareTemplate.checkedOutAmount)
                    {/*forces rerender, probably better way to do this */}
                    setRerender(render => render - 1)                             
                    setRerender(render => render + 1)        
                    console.log(data)
                  })
                  .catch(error => {
                    console.log(error)
                  })                        
                  console.log("Owned sets is " + ownedSets)

                  let temp = checkOut
                  temp[i] = 0
                  setCheckout(checkOut => checkOut = temp)                                               
                } 
              }>
        Checkout
      </button>
    );
  }

  //Functions for Check In 
  function incrementCheckInValue(i){
    //only goes up to how many sets you own
    if(checkIn[i] < ownedSets[i]){
      let temp = checkIn
      temp[i]++
      setCheckIn(checkIn => checkIn = temp)
      setRerender(rerender => rerender + 1)
      console.log("Hardware " + i + ' Checked In is ' + checkIn)
    }
  }

  function decrementCheckInValue(i){
    if(checkIn[i] > 0){
      let temp = checkIn
      temp[i]--
      setCheckIn(checkIn => checkIn = temp)       
      setRerender(rerender => rerender - 1)
    } 
    console.log("Hardware " + i + ' Checked In is ' + checkIn)
  }
  
  function displayCheckInButton(value,i){
    return(
    <button
        variant="outlined"
        onClick={() => {

          {/*Probably can send another variable with this*/}
          let hardwareTemplate = {}     
      
          fetch("/checkIn/" + value.id + "/" + checkIn[i] + "/" + hardwareTemplate)
            .then(response => 
              response.json()
            )
            .then(data => {
              {/*Data stored in hardwareTemplate from flask*/}
                let updatedHardware = ({
                  id: data.hardwareTemplate.id,
                  capacity: data.hardwareTemplate.capacity,
                  availability: data.hardwareTemplate.availability,
                });

                HardwareArray[updatedHardware.id] = updatedHardware

                //update locally
                let temp = ownedSets
                temp[i] = temp[i] - data.hardwareTemplate.checkedOutAmount
                setOwnedSets(ownedSets => ownedSets = temp)

                //update server
                updateOwnedSetsServer(i)
      
                console.log("checked out amount for set " + ownedSets[i] + " is " + data.hardwareTemplate.checkedOutAmount)
                
                {/*forces rerender, probably better way to do this */}
                setRerender(render => render - 1)                             
                setRerender(render => render + 1)        
                console.log(data)
              })

              .catch(error => {
                console.log(error)
              })                        
              console.log("Owned sets is " + ownedSets)

              let temp = checkIn
              temp[i] = 0
              setCheckIn(checkIn => checkIn = temp)                                               
            } 
          }>
        Check in
      </button>
    );
  }

  
  function displayHardware(){ 
    if(projectsArray.length > 0){
	    return (
        <div>
          {" "} 
          {" "} 
          {displayProject()}
          {" "} 
	        {HardwareArray.map((value,i) => (
            <div key = {i}>
					  <h3>id is: {value.id}                     </h3>
					  <h3>capacity is: {value.capacity}         </h3>
				    <h3>availability is: {value.availability} </h3>                
            <h3>There are currently {ownedSets[i]} sets checked out to you.</h3>
            <h3>                  
                Checkout, How many? 
                {" "} 
                <button onClick = {() =>decrementCheckOutValue(i)}>-</button>  
                {" "} 
                {checkOut[i]} 
                {" "} 
                <button onClick = {() =>incrementCheckOutValue(i)}>+</button>                
                {" "}            
                {displayCheckOutButton(value,i)}
            </h3> 
            <h3>
              Check In, How many? 
              {" "} 
              <button onClick = {() =>decrementCheckInValue(i)}>-</button>  
              {" "} 
              {checkIn[i]} 
              {" "} 
              <button onClick = {() =>incrementCheckInValue(i)}>+</button>                
              {" "}     
              {displayCheckInButton(value,i)}      
          </h3>       
			  </div>
       ))}
    </div>
   );
  } else {
    return(<div>
           <h3>You have no projects, please create one here or join an existing one!</h3>
          </div>
          );
    }
	}

	return(
			<div>
        Current user is {userID}
        {displayCreateProject()}
				{displayHardware()}
			</div>
		)

}

export default HWSetPage;