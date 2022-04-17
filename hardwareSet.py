class HWSet:

   ##Capacity --> total number of units. Initial value=qty
   ##Availability --> number of units available to check out. Initial value=Capacity
    
    def __init__(self,quantity,availability):
        self.capacity = quantity
        self.availability = availability

    def set_availability(self,availability):
        self.availability = availability

    def set_capacity(self,capacity):
        self.capacity = capacity

        
    def get_availability(self):
        """accessor function to return the number of unused units"""
        return self.availability 
    
    def get_capacity(self):
        """accessor function to return the total capacity of units"""
        return self.capacity

    def get_checkedout_qty(self):
        """accessor function to return the total number of checkout quantities"""
        return int(self.capacity) - int(self.availability) 
    
    def check_out(self,quantity):
        """Method that checks out number of units specified by qty.
           Updates the number of units available after check_out. 
           If the quantity requested is greater than the current availability 
              User checks out the number of units that are available and then returns -1"""
        for availability in range(quantity):
           self.availability = self.availability - 1
           if(self.availability == 0):      
               return -1
         
    def check_in(self,quantity):
        self.availability =  self.availability + quantity