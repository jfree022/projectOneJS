//start using invoice for the page
const invoices =[]; //hold all of our invoices, the index will be the invoice number
invoices[0] = new Invoice(); //generate first default invoice
invoices[0].invoiceNumber = 0;
let currentInvoice = 0; //our current invoice number


//js for page interactions
$(function(){

    //create a console log for "Add Item" button
    $('.submitItem').on('submit', function(event) { 
        event.preventDefault();
        console.log("ADD ITEM");

        invoices[currentInvoice].addItem($("#item").val(), parseFloat($("#price").val()), parseFloat($("#count").val()));
        console.log(invoices[currentInvoice]);

        //clear fields out
        $("#item").val("");
        $("#price").val("");
        $("#count").val("");

        //render what they entered
        $('ul').empty();
        invoices[currentInvoice].items.forEach((product) => {
            const todo = `
            <li id=${product.itemKey}>
                <span class=""></span>${product.item} $${product.price} count: ${product.count}
                <span class="fas fa-plus-square"></span>
                <span class="fas fa-minus-square"></span>
                <span class="fas fa-trash"></span>
            </li>`;
            $('ul').append(todo);
        });

        //refresh the estimates
        $(".displayEstimate").empty();
        $(".displayEstimate").append(`
            <p>Estimate: ${invoices[currentInvoice].estimate}</p>
            <p>Estimate with Tax: ${invoices[currentInvoice].estimateWithTax}</p>`
        );
    });
    
    //Updates customer information
    $('.submitCustomerInfo').on('submit', function(event){
        event.preventDefault();
        console.log("UPDATE");

        //collect customer information and update invoice
        invoices[currentInvoice].updateCustomerInfo($("#name").val(), $("#address").val(), $("#city").val(), $("#province").val());
        console.log(invoices[currentInvoice])

        //clear out fields
        $("#name").val("");
        $("#address").val("");
        $("#city").val("");
        $("#province").val("");

        //render the customer information
        $(".displayCustomerInfo").empty();
        const customerDisplayInfo = `
        <p> Customer Information: </p>
        <p>NAME: ${invoices[currentInvoice].customerInfo.name}</p>
        <p>CITY: ${invoices[currentInvoice].customerInfo.city}</p>
        <p>ADDRESS: ${invoices[currentInvoice].customerInfo.address}</p>
        <p>PROVINCE: ${invoices[currentInvoice].customerInfo.province}</p>`;

        $(".displayCustomerInfo").append(customerDisplayInfo);
    });

    //Loads previously saved invoices
    $('.submitInvoice').on('submit',function(event){
        event.preventDefault();
        console.log("LOAD");

        //search for the invoice number
        if (($("#load").val() < invoices.length) && ($("#load").val().length != 0)){ //make sure not submitting nothing
            currentInvoice = $("#load").val();
            console.log(currentInvoice);

            //render customer information
            $(".displayCustomerInfo").empty();
            const customerDisplayInfo = `
            <p> Customer Information: </p>
            <p>NAME: ${invoices[currentInvoice].customerInfo.name}</p>
            <p>CITY: ${invoices[currentInvoice].customerInfo.city}</p>
            <p>ADDRESS: ${invoices[currentInvoice].customerInfo.address}</p>
            <p>PROVINCE: ${invoices[currentInvoice].customerInfo.province}</p>`;

            $(".displayCustomerInfo").append(customerDisplayInfo);
            
            //render list
            $('ul').empty();
            invoices[currentInvoice].items.forEach((product) => {
                const todo = `
                <li id=${product.itemKey}>
                    <span class=""></span>${product.item} $${product.price} count: ${product.count}
                    <span class="fas fa-plus-square"></span>
                    <span class="fas fa-minus-square"></span>
                    <span class="fas fa-trash"></span>
                </li>`;
                $('ul').append(todo);
            });

            //render estimate
            $(".displayEstimate").empty();
            $(".displayEstimate").append(`
                <p>Estimate: ${invoices[currentInvoice].estimate}</p>
                <p>Estimate with Tax: ${invoices[currentInvoice].estimateWithTax}</p>`
            );

            //render invoice number
            $(".displayInvoice").empty();
            $(".displayInvoice").append(
                `<p>Invoice Number: ${invoices[currentInvoice].invoiceNumber}</p>`
            );
            
            //clear load field
            $("#load").val("");

            } else {
                console.log("Nothing loaded")
            }
    });

    //creates new invoice, will do nothing if no information was saved
    $('#newInvoice').on('click',function(event) {
        console.log("NEW");

        if (!invoices[currentInvoice].isEmpty()) {//if the current invoice is not empty, proceed to add a new invoice
            invoices.push(new Invoice());
            currentInvoice = invoices.length - 1;
            invoices[currentInvoice].invoiceNumber = currentInvoice;
            console.log("NEW INVOICE GENERATED");


            //render everything as blank
            $(".displayCustomerInfo").empty();

            const customerDisplayInfo = `
            <p> Customer Information: </p>
            <p>NAME: </p>
            <p>CITY: </p>
            <p>ADDRESS: </p>
            <p>PROVINCE: </p>`;

            $(".displayCustomerInfo").append(customerDisplayInfo);

            $(".displayEstimate").empty();
            $(".displayEstimate").append(`<p>Estimate: 0</p>`);

            $('ul').empty();

            $("#load").val("");

            $(".displayInvoice").empty();
            $(".displayInvoice").append(
                `<p>Invoice Number: ${invoices[currentInvoice].invoiceNumber}</p>`
            );
        } else {
            console.log("CURRENT INVOICE IS EMPTY");
        }
    })  
    
    //create something that removes the item competely
    $('ul').on('click','.fa-trash', function(event){
        event.stopPropagation();//this stops the event from propagating to the top, which is ul. Needed this to avoid adding the completed or triggering the toggle
        // console.log($(this).parent('li')); //this will return the first li while bubbling up. the first parent li
        invoices[currentInvoice].removeItem($(this).parent('li')[0].id) //returns the id which is also the itemKey
        $(this).parent('li').remove(); // Remove li element

        $(".displayEstimate").empty();
        $(".displayEstimate").append(`<p>Estimate: ${invoices[currentInvoice].estimate}</p>`);
    });

    //increment the count by one
    $('ul').on('click','.fa-plus-square', function(event){
        event.stopPropagation();//this stops the event from propagating to the top, which is ul. Needed this to avoid adding the completed or triggering the toggle
        // console.log($(this).parent('li')); //this will return the first li while bubbling up. the first parent li
        invoices[currentInvoice].incrementItem($(this).parent('li')[0].id)//increment by itemKey
        const itemIndex = invoices[currentInvoice].findItem($(this).parent('li')[0].id);
        const itemID= $(this).parent('li')[0].id
        console.log($(this).parent('li'));
        $(this).parent('li').empty();
        const updatedItem =
            `<span class=""></span>${invoices[currentInvoice].items[itemIndex].item} $${invoices[currentInvoice].items[itemIndex].price} count: ${invoices[currentInvoice].items[itemIndex].count}
            <span class="fas fa-plus-square"></span>
            <span class="fas fa-minus-square"></span>
            <span class="fas fa-trash"></span>`;
        $(`#${itemID}`).append(updatedItem);

        $(".displayEstimate").empty();
        $(".displayEstimate").append(`
            <p>Estimate: ${invoices[currentInvoice].estimate}</p>
            <p>Estimate with Tax: ${invoices[currentInvoice].estimateWithTax}</p>`
        );
    });

    //decrement the count by one
    $('ul').on('click','.fa-minus-square', function(event){
        event.stopPropagation();//this stops the event from propagating to the top, which is ul. Needed this to avoid adding the completed or triggering the toggle
        // console.log($(this).parent('li')); //this will return the first li while bubbling up. the first parent li
        invoices[currentInvoice].decrementItem($(this).parent('li')[0].id)//increment by itemKey
        const itemIndex = invoices[currentInvoice].findItem($(this).parent('li')[0].id);
        const itemID= $(this).parent('li')[0].id
        console.log($(this).parent('li'));
        $(this).parent('li').empty();
        const updatedItem =
            `<span class=""></span>${invoices[currentInvoice].items[itemIndex].item} $${invoices[currentInvoice].items[itemIndex].price} count: ${invoices[currentInvoice].items[itemIndex].count}
            <span class="fas fa-plus-square"></span>
            <span class="fas fa-minus-square"></span>
            <span class="fas fa-trash"></span>`;
        $(`#${itemID}`).append(updatedItem);
        $(".displayEstimate").empty();
        $(".displayEstimate").append(`
            <p>Estimate: ${invoices[currentInvoice].estimate}</p>
            <p>Estimate with Tax: ${invoices[currentInvoice].estimateWithTax}</p>`
        );
    });
});