import React from 'react';
import { Link } from 'react-router-dom';

{/*TODO Change*/}
let HardwareArray = [
  {id: 1,     name: "HardwareSet" ,capacity:300, availability:300,checkedOut:0},
  {id: 2,     name: "HardwareSet2",capacity:300, availability:300,checkedOut:0}
  ]

function HWSetPage(){
      
    {/*TODO CHANGE IMPLEMENTATION NEED ANOTHER BUTTON TO ACTUALLY PROCCESS CHECKOUT*/ }
      function incrementValue(i){
        HardwareArray[i].availability = HardwareArray[i].availability - 1
        HardwareArray[i].checkedOut = HardwareArray[i].checkedOut + 1
        console.log("Hardware " + i + ' Checked Out is ' + HardwareArray[i].checkedOut)
        console.log("Hardware " + i + ' Availability is ' + HardwareArray[i].availability)
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
                <button onClick = {() =>incrementValue(i)}>+</button>
                <h3>Checkout, How many??: {value.checkedOut}</h3>
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