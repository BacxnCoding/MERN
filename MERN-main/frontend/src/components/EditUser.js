import React from 'react';

function EditUser({
  selectedUser,
  setSelectedUser,
  selectedNation,
  setSelectedNation,
  handleUpdateUser,
  customItemName,
  setCustomItemName,
  customItemQuantity,
  setCustomItemQuantity,
  nations,
  selectedRole,
  setSelectedRole,
  handleAssignNation,
  handleUnassignNation,
  handleAssignRole,
  handleRemoveRole,
  handleAddCustomItem,
}) {
  if (!selectedUser) return <div>Please select a user first.</div>;

  return (
    <div>
      <h3>Edit {selectedUser.username}</h3>

      <label>
        Strength:
        <input
          type="number"
          value={selectedUser.stats?.strength || 0}
          onChange={(e) =>
            setSelectedUser((prev) => ({
              ...prev,
              stats: {
                ...prev.stats,
                strength: parseInt(e.target.value, 10),
              },
            }))
          }
          onBlur={() =>
            handleUpdateUser(selectedUser._id, {
              stats: selectedUser.stats,
            })
          }
        />
      </label>
      <label>
        Agility:
        <input
          type="number"
          value={selectedUser.stats?.agility || 0}
          onChange={(e) =>
            setSelectedUser((prev) => ({
              ...prev,
              stats: {
                ...prev.stats,
                agility: parseInt(e.target.value, 10),
              },
            }))
          }
          onBlur={() =>
            handleUpdateUser(selectedUser._id, {
              stats: selectedUser.stats,
            })
          }
        />
      </label>
      <label>
        Intelligence:
        <input
          type="number"
          value={selectedUser.stats?.intelligence || 0}
          onChange={(e) =>
            setSelectedUser((prev) => ({
              ...prev,
              stats: {
                ...prev.stats,
                intelligence: parseInt(e.target.value, 10),
              },
            }))
          }
          onBlur={() =>
            handleUpdateUser(selectedUser._id, {
              stats: selectedUser.stats,
            })
          }
        />
      </label>
      <label>
        Bank Account:
        <input
          type="number"
          value={selectedUser.bankAccount || 0}
          onChange={(e) =>
            setSelectedUser((prev) => ({
              ...prev,
              bankAccount: parseInt(e.target.value, 10),
            }))
          }
          onBlur={() =>
            handleUpdateUser(selectedUser._id, {
              bankAccount: selectedUser.bankAccount,
            })
          }
        />
      </label>

      <h4>Assign Nation</h4>
      <select
  value={selectedNation?._id || ''}
  onChange={(e) => {
    const nation = nations.find(n => n._id === e.target.value);
    setSelectedNation(nation);  // Set the entire nation object, not just the ID
    console.log('Selected Nation:', nation);  // Debugging log to check the selected nation
  }}
>
  <option value="" disabled>
    Select a Nation
  </option>
  {nations.map((nation) => (
    <option key={nation._id} value={nation._id}>
      {nation.name}
    </option>
  ))}
</select>

      <button
        onClick={handleAssignNation}
        disabled={!selectedNation}
      >
        Assign Nation
      </button>
      <button onClick={handleUnassignNation}>Unassign Nation</button>

      <h4>Assign or Remove Role</h4>
      <select
  value={selectedRole || ''}
  onChange={(e) => {
    setSelectedRole(e.target.value);
    console.log('Selected Role:', e.target.value); // Debugging log to check the selected role
  }}
>
  <option value="" disabled>
    Select a Role
  </option>
  <option value="Finance">Finance</option>
  <option value="Military">Military</option>
  <option value="Social">Social</option>
</select>
<button
  onClick={() => handleAssignRole(selectedRole)}
  disabled={!selectedRole}
>
  Add Role
</button>
<button
  onClick={() => handleRemoveRole(selectedRole)}
  disabled={!selectedRole}
>
  Remove Role
</button>


      <h4>Inventory</h4>
      <ul>
        {selectedUser.items.map((item, index) => (
          <li key={index}>
            {item.itemName} (x{item.quantity})
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                setSelectedUser((prev) => {
                  const updatedItems = [...prev.items];
                  updatedItems[index].quantity = parseInt(e.target.value, 10);
                  return { ...prev, items: updatedItems };
                })
              }
              onBlur={() =>
                handleUpdateUser(selectedUser._id, {
                  items: selectedUser.items,
                })
              }
            />
          </li>
        ))}
      </ul>

      <h4>Add Custom Item</h4>
      <input
        type="text"
        placeholder="Item Name"
        value={customItemName}
        onChange={(e) => setCustomItemName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={customItemQuantity}
        onChange={(e) =>
          setCustomItemQuantity(parseInt(e.target.value, 10))
        }
      />
      <button
        onClick={() => {
          if (customItemName && customItemQuantity > 0) {
            handleUpdateUser(selectedUser._id, {
              items: [
                ...selectedUser.items,
                { itemName: customItemName, quantity: customItemQuantity },
              ],
            });
            setCustomItemName(''); // Clear fields after adding
            setCustomItemQuantity(1);
          } else {
            alert('Please enter valid item details.');
          }
        }}
      >
        Add Item
      </button>
    </div>
  );
}

export default EditUser;
