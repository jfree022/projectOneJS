//Sorry for the lack of styling, input checks and legibility.......

class Invoice { //invoice object, need to put into separate file later
    constructor () {
        this.items = [];
        this.estimate = 0;
        this.estimateWithTax = 0;
        this.invoiceNumber = -1;
        this.customerInfo = {
            name: "",
            address: "",
            city: "",
            province: ""
        }
    }
    
    update() { //helper function to update estimates, usually run after adding or removing items
        let newEstimate = 0;
        this.items.forEach((items) =>{
        newEstimate = newEstimate + items.price*items.count; 
        });
        this.estimate = newEstimate;
        this.estimateWithTax = Math.round(newEstimate*1.13*100)/100;
    }

    updateCustomerInfo(name,address,city,province) {
        this.customerInfo.name = name.trim();
        this.customerInfo.address = address.trim();
        this.customerInfo.city = city.trim();
        this.customerInfo.province = province.trim();
    }

    findItem(itemName) { //iterates through array and returns matching item name index
        const searchItem = itemName.toLowerCase().replace(/ /g,''); //convert itemName into key format for searching
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].itemKey == searchItem) {
                return i;
            }
        }
        return -1;
    }

    isEmpty() { //returns true if there are no items and customer information is empty.
        let numContent = 0;
        for (let info in this.customerInfo) {
            numContent = numContent + this.customerInfo[info].length;
        }
        if ((numContent + this.items.length) != 0) {
            return false;
        } else {
            return true;
        }

    }

    addItem(userItem,userPrice,userCount) { //adds items to the invoice, including the name, price and desired count
        // should remember to put a bunch of checks here
        let userItemKey = userItem.toLowerCase().replace(/ /g,''); //remove all whitespace and letter case
        userItem = userItem.trim(); //remove surrounding whitespace
        const item = {
            item: userItem,
            itemKey: userItemKey,
            price: userPrice,
            count: userCount
        }
        this.items.push(item);
        this.update();
    }

    removeItem(itemName) { //if item is found, then remove item and return true, else returns false
        const index = this.findItem(itemName);
        console.log(index);
        if (index > -1) {
            this.items.splice(index,1);
            this.update();
            return true;
        } else {
            return false;
        }
    }

    incrementItem(itemName){ //increment item count by 1
        const index = this.findItem(itemName);
        if (index > -1) {
            this.items[index].count++;
            this.update();
            return true;
        } else {
            return false;
        }
    }

    decrementItem(itemName){ //decrement item count by 1
        const index = this.findItem(itemName);
        if (index > -1) {
            if (this.items[index].count >0){
                this.items[index].count--;
                this.update();
            }
            return true;
        } else {
            return false;
        }
    }
}
