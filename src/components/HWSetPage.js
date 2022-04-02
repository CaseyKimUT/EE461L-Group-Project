import {React,useState,useEffect} from 'react';


{/*TODO Change*/}
let HardwareArray = [
  {id: 0,name:"HardwareSet",capacity:300,availability:300},
  {id: 1,name:"HardwareSet",capacity:300,availability:300}
  ]

function HWSetPage(){

    {/*TODO have different checkout for every id*/}
    const [checkOut,setCheckout] = useState(0)
  
      function displayHardware(){
           {/*TODO have different increment for every id*/}
          function incrementValue(i){
              setCheckout(previousValue => previousValue + 1)
              console.log("Hardware " + i + ' Checked Out is ' + checkOut)
          }

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

                    {/*Probably can send another variable with this*/}
                    let hardwareTemplate = {}     
                  
                    fetch("http://127.0.0.1:5000/checkOut/" + value.id + "/" + checkOut + "/" + hardwareTemplate)
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
                            setCheckout(previousValue => previousValue - 1)
                            setCheckout(previousValue => previousValue + 1)
                            
                            console.log(updatedHardware)
                            console.log(data)
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