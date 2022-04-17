import {React,useState,useEffect} from 'react';
import NavBar from './NavBar';
import {account_info} from './LoginPage'


let allProjectsArray = [
    {
     projectName:"",
     checkedOut:[-1,-1]
    }
  ]

function JoinProjects(){

    const [userID,setUserID] = useState("this will change when user logs in")

    
    const [joinProjectsArray,setJoinProjects] = useState([])
    const [rerender,setRerender] = useState(0)

    useEffect(() => {
        setUserID(userID => userID = account_info.username)
        //setUserID(userID => userID = "testUser3")
        initializeProjectsArray();
        console.log(account_info)
      },[]);

    function initializeProjectsArray(){
        fetch("/getNonJoinedProjects/" + userID)
        .then(response => 
          response.json()
        )
        .then(data => {
          allProjectsArray = data
          setJoinProjects(joinProjectsArray => joinProjectsArray = new Array(allProjectsArray.length).fill(0))
          console.log(joinProjectsArray)
          
          {/*forces rerender, probably better way to do this */}
          setRerender(render => render + 1)   
          setRerender(render => render - 1)                             
          console.log("project 1 is  " + allProjectsArray[0].projectName)
          
          {/*Catches error if user joined all projects  */}
        }).catch(error => {console.log(error)})       

    }



    function joinProjectButton(i){
        fetch("/getAllProjects/" + userID + "/" + allProjectsArray[i].projectName)
                .then(response => 
                  response.json()
                ) 
                .then(data => { 
                  initializeProjectsArray()
                  console.log("Success")
                }).catch(error => {
                  initializeProjectsArray()
                }
                )         
    }

    function displayProjects(){
        return(
            <div>
                {allProjectsArray.map((value,i) => (
                    <div key = {i}>
			            <h3>
                            Name: {value.projectName}                     
                            <button onClick = {() =>joinProjectButton(i)}>Join</button>  
                            </h3>
			        </div>
                ))}
            </div>
        );

    }

    return(
        <div>
            {/* <NavBar/> */}
            {displayProjects()}
        </div>

    );


}


export default JoinProjects; 