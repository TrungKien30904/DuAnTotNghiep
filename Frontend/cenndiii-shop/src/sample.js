import React, { useState } from 'react';

function AddressForm() {
  // State to store the list of addresses
  const [addresses, setAddresses] = useState([
    { id: 1, street: '', city: '', zip: '', isVisible: true }
  ]);

  // Function to handle adding a new address form
  const addAddressForm = () => {
    setAddresses([
      ...addresses,
      { id: addresses.length + 1, street: '', city: '', zip: '', isVisible: true }
    ]);
  };

  // Function to handle form field changes
  const handleFieldChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...addresses];
    updatedAddresses[index][name] = value;
    setAddresses(updatedAddresses);
  };

  // Function to toggle the visibility of a specific address form
  const toggleVisibility = (index) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index].isVisible = !updatedAddresses[index].isVisible;
    setAddresses(updatedAddresses);
  };

  return (
    <div>
      <h2>Enter Address</h2>
      
      {addresses.map((address, index) => (
        <div key={address.id} className="address-container">
          {/* Toggle icon based on visibility */}
          <button type="button" onClick={() => toggleVisibility(index)} className="toggle-btn">
            {address.isVisible ? '↑' : '↓'}
          </button>

          {/* Render the form fields only if the address is visible */}
          {address.isVisible && (
            <div className="address-form">
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={(e) => handleFieldChange(index, e)}
                placeholder="Street"
              />
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={(e) => handleFieldChange(index, e)}
                placeholder="City"
              />
              <input
                type="text"
                name="zip"
                value={address.zip}
                onChange={(e) => handleFieldChange(index, e)}
                placeholder="Zip Code"
              />
            </div>
          )}
        </div>
      ))}

      {/* Button to add another address form */}
      <button type="button" onClick={addAddressForm}>
        + Add Another Address
      </button>
    </div>
  );
}

export default AddressForm;
