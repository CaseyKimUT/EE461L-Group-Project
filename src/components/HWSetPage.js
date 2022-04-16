import {React,useState,useEffect} from 'react';
  

let HardwareArray = [
  {id: 0,capacity:300,availability:300},
  {id: 1,capacity:300,availability:300}
  ]
  
let projectsArray = [
  {
   projectName:"dummy",
   checkedOut:[-1,-1]
  }
]

//TODO Change to server
let userID = "test"

function HWSetPage(){

    const [checkOut,setCheckout] = useState(new Array(HardwareArray.length).fill(0))
    const [checkIn,setCheckIn] = useState(new Array(HardwareArray.length).fill(0))

    const [ownedSets,setOwnedSets] = useState(new Array(HardwareArray.length).fill(0))

    const [projectName, setProjectName] = useState("")

    const [currentProjectIndex,setCurrentProjectIndex] = useState(0)
    const [rerender,setRerender] = useState(0)

    useEffect(() => {
      getProjects();      
      refreshHardwareArray();
    },[]);

    function displayProject(){
      return(
        "Current Project: " + projectsArray[currentProjectIndex].projectName
      );
    }

    function displayCreateProject(){
      return (
        <div>
          <label>New Project: 
            <input type="text" value ={projectName} onChange = {(e) => setProjectName(e.target.value)}></input>
          </label>
          
          <button        
            variant="outlined"   
            onClick={() =>
              fetch("http://127.0.0.1:5000/createProject/" + userID + "/" + projectName)
                .then(response => 
                  response.json()
                ) 
                .then(data => { 
                  getProjects()
                  console.log(data)
                {/* for some reason this causes error when clicking */}
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

    //gets checkedOut num from flask
    function updateOwnedSets(){
      //getProjects() //TODO uncomment when database implemented
      setOwnedSets(ownedSets => ownedSets = projectsArray[currentProjectIndex].checkedOut)
    }

    function changeProjectButton(){
      return(
        <button
          variant="outlined"
          onClick={() => {
            setCurrentProjectIndex(currentProjectIndex => currentProjectIndex + 1)
            if(currentProjectIndex==projectsArray.length-1){
              setCurrentProjectIndex(currentProjectIndex => currentProjectIndex = 0)
            }
            updateOwnedSets()
            console.log("Projects length is " + (projectsArray.length - 1))
            console.log("Project index is " + currentProjectIndex)
          }
          }>       
        Change Project
        </button>
      );

    }

    function getProjects(){
      let projectTemplate = {}
      fetch("http://127.0.0.1:5000/getUserProjects/" + userID + "/" + projectTemplate)
        .then(response => 
          response.json()
        )
        .then(data => {
          projectsArray = data          
          {/*forces rerender, probably better way to do this */}
          setRerender(render => render - 1)                             
          setRerender(render => render + 1)    
          console.log("projects is " + projectsArray)
        }).catch(error => {console.log(error)})           
    }

    //fetches from flask to update local array for all hardware
    function refreshHardwareArray(){
        let hardwareTemplate = {}              
        fetch("http://127.0.0.1:5000/initializeHardwarePage/" + hardwareTemplate)
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
          
              fetch("http://127.0.0.1:5000/checkOut/" + value.id + "/" + checkOut[i] + "/" + hardwareTemplate)
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

                    {/*Current implementation adds to local owned sets                   
                      TODO change so updates with server sets instead
                    */}
                    let temp = ownedSets
                    temp[i] = temp[i] + data.hardwareTemplate.checkedOutAmount
                    setOwnedSets(ownedSets => ownedSets = temp)
          
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
      
          fetch("http://127.0.0.1:5000/checkIn/" + value.id + "/" + checkIn[i] + "/" + hardwareTemplate)
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

                {/*Current implementation adds to local owned sets                   
                  TODO change so updates with server sets instead
                */}
                let temp = ownedSets
                temp[i] = temp[i] - data.hardwareTemplate.checkedOutAmount
                setOwnedSets(ownedSets => ownedSets = temp)
      
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
          {displayProject()}
          {" "} 
          {changeProjectButton()}
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
        {displayCreateProject()}
				{displayHardware()}
			</div>
		)

}

export default HWSetPage;