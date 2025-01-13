
function addContactNumber() {
    var input = document.createElement('input');
    input.type = 'text';
    input.name = 'contact[]';
    input.placeholder = 'Enter contact number';
    input.className = 'form-control m-b-10';
    document.getElementById('contactNumbers').appendChild(input);
}

document.getElementById('saveSupplier').addEventListener('submit', function (event) {
    event.preventDefault();

    const supplierId = document.getElementById('supplierId').value;
    const supplierName = document.getElementById('supplierName').value;
    const contactNumbers = Array.from(document.querySelectorAll('input[name="contact[]"]')).map(input => input.value);

    const supplierData = {
        id: supplierId,
        name: supplierName,
        contacts: contactNumbers
    };

    fetch('/api/suppliers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(supplierData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        $('#newSupplier').modal('hide');
        document.getElementById('saveSupplier').reset();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
