import { areArraysEqual } from '@mui/base';
import { render } from '@testing-library/react';
import {React,useState,useEffect} from 'react';


{/*TODO Change*/}
let HardwareArray = [
  {id: 0,name:"HardwareSet_0",capacity:300,availability:300},
  {id: 1,name:"HardwareSet_1",capacity:300,availability:300}
  ]

function HWSetPage(){

    const [checkOut,setCheckout] = useState(new Array(HardwareArray.length).fill(0))
    const [checkIn,setCheckIn] = useState(new Array(HardwareArray.length).fill(0))
    const [ownedSets,setOwnedSets] = useState(new Array(HardwareArray.length).fill(0))
    const [rerender,setRerender] = useState(0)

    useEffect(() => {
      for(let i = 0;i<HardwareArray.length;i++){
        let hardwareTemplate = {}              
        fetch("http://127.0.0.1:5000/checkOut/" + i + "/" + checkOut[i] + "/" + hardwareTemplate)
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
    },[]);

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
                  name: data.hardwareTemplate.name,
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
	  return (
      <div>
	      {HardwareArray.map((value,i) => (
          <div key = {i}>
					<h3>id is: {value.id}                     </h3>
					<h3>name is: {value.name}                 </h3>
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
   )
	}

	return(
			<div>
				{displayHardware()}
			</div>
		)

}

export default HWSetPage;