import {React,useState} from 'react';
import { Link } from 'react-router-dom';

{/*TODO Change*/}
let HardwareArray = [
  {id: 1,     name: "HardwareSet" ,capacity:300, availability:300},
  ]

function HWSetPage(){


    const [database,setDatabase] = useState(HardwareArray)
    const [checkOut,setCheckout] = useState(0)
      
    {/*TODO CHANGE IMPLEMENTATION NEED ANOTHER BUTTON TO ACTUALLY PROCCESS CHECKOUT*/ }
      function incrementValue(i){
        setCheckout(previousValue => previousValue + 1)
        console.log("Hardware " + i + ' Checked Out is ' + checkOut)
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
                <h3>Checkout, How many??: {checkOut}</h3>
                <button
                variant="outlined"
                onClick={() => {
                    
                    fetch("http://127.0.0.1:5000/checkOut/" + i + '/' + checkOut)
                        .then(response => 
                            response.json()
                        )
                        .then(data => {
      
                            console.log(data)
                            setDatabase(data)
                            
                        })
                        .catch(error => {
                            console.log(error)
                        })

                        setCheckout(0)
                      
                    } 
                  }
                    
            >
                        Submit
                    </button>
                  ))
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