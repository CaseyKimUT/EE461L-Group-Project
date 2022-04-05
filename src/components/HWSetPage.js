import { render } from '@testing-library/react';
import {React,useState,useEffect} from 'react';


{/*TODO Change*/}
let HardwareArray = [
  {id: 0,name:"HardwareSet_0",capacity:300,availability:300},
  {id: 1,name:"HardwareSet_1",capacity:300,availability:300}
  ]

function HWSetPage(){

    const [checkOut,setCheckout] = useState([0,0])
    const [rerender,setRerender] = useState(0)
    
    function incrementValue(i){
      let temp = checkOut
      temp[i]++
      setCheckout(checkOut => checkOut = temp)
      setRerender(rerender => rerender + 1)
      console.log("Hardware " + i + ' Checked Out is ' + checkOut)
    }

    function decrementValue(i){
      

      if(checkOut[i] > 0){
        let temp = checkOut
        temp[i]--
        setCheckout(checkOut => checkOut = temp)       
        setRerender(rerender => rerender - 1)
      } 
      console.log("Hardware " + i + ' Checked Out is ' + checkOut)
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

                <h3>
                  Checkout, How many? 
                  {" "} 
                  <button onClick = {() =>decrementValue(i)}>-</button>  
                  {" "} 
                  {checkOut[i]} 
                  {" "} 
                  <button onClick = {() =>incrementValue(i)}>+</button>                
                  {" "}
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
                            
                              {/*forces rerender, probably better way to do this */}
                              
                              setRerender(render => render - 1)                             
                              setRerender(render => render + 1)
                            
                              console.log(data)
                          })
                          .catch(error => {
                              console.log(error)
                          })
                          let temp = checkOut
                          temp[i] = 0
                          setCheckout(checkOut => checkOut = temp)

                          
                      
                       } 
                    }
                  
            >
                        Submit
                    </button>
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