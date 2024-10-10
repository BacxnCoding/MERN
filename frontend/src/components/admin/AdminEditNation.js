import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminEditNation = () => {
  const { id } = useParams();  // Extract nation ID from URL
  const navigate = useNavigate();  // To navigate after updates

  const [loading, setLoading] = useState(true);

  // Control visibility of sections
  const [showSocial, setShowSocial] = useState(false);
  const [showMilitary, setShowMilitary] = useState(false);
  const [showFinance, setShowFinance] = useState(false);
  const [showUsers, setShowUsers] = useState(false);  // Toggle visibility of users

  const [formValues, setFormValues] = useState({
    name: '',
    nationalBank: '',
    peopleindex: '',
    militaryindex: '',
    economyindex: '',
    people: {
      TotalBudget: 0,
      health: {
        procedures: 0,
        vaccines: 0,
        hospitals: 0,
      },
      satisfaction: {
        infrastructure: 0,
        politicalStability: 0,
        education: 0,
        internalSafety: 0,
        freedom: 0,
        economy: 0,
      },
      productivity: 0,
    },
    military: {
      TotalBudget: 0,
      personnel: {
        training: 0,
        wellBeing: 0,
      },
      equipment: {
        bases: 0,
        ports: 0,
        communication: 0,
        equipmentQuality: 0,
      },
      performance: 0,
    },
    economy: {
      income: {
        taxRate: 0,
        exports: 0,
      },
      spending: {
        debt: 0,
        imports: 0,
      },
      inflation: 0,
    },
  });

  const [users, setUsers] = useState([]);  // Store users belonging to this nation

  useEffect(() => {
    const fetchNationDetails = async () => {
      try {
        const nationResponse = await axios.get(`http://localhost:5000/api/nations/${id}`);
        setFormValues(nationResponse.data);

        // Fetch users that belong to this nation
        const usersResponse = await axios.get('http://localhost:5000/api/users');
        const usersInNation = usersResponse.data.filter(user => user.nation_id === id);
        setUsers(usersInNation);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching nation details:', error);
        setLoading(false);
      }
    };

    fetchNationDetails();
  }, [id]);

  // Helper function to update nested fields
  const updateNestedField = (section, subsection, name, value) => {
    setFormValues((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [subsection]: {
          ...prevState[section][subsection],
          [name]: value,
        },
      },
    }));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;
    if (dataset.section && dataset.subsection) {
      updateNestedField(dataset.section, dataset.subsection, name, value);
    } else if (dataset.section) {
      setFormValues((prevState) => ({
        ...prevState,
        [dataset.section]: {
          ...prevState[dataset.section],
          [name]: value,
        },
      }));
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  // Handle form submission (PATCH request to update nation)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(`http://localhost:5000/api/nations/${id}`, formValues);
      alert('Nation updated successfully!');
      navigate(`/admin/nation/${id}`);  // Redirect back to nation details
    } catch (error) {
      console.error('Error updating nation:', error);
      alert('Failed to update nation');
    }
  };

  // Toggle display of users associated with this nation
  const toggleShowUsers = () => {
    setShowUsers(!showUsers);
  };

  // Handle removing a user from the nation
const handleRemoveUser = async (userId) => {
  try {
    // Send a PATCH request to update only the nation_id field of the user
    await axios.patch(`http://localhost:5000/api/users/${userId}`, { nation_id: null });
    // Remove user from the list locally after successful update
    setUsers(users.filter(user => user._id !== userId));
    alert('User removed from the nation.');
  } catch (error) {
    console.error('Error removing user from nation:', error);
    alert('Failed to remove user');
  }
};


  if (loading) {
    return <p>Loading nation details...</p>;
  }

  return (
    <div>
      <h2>Edit Nation: {formValues.name}</h2>

      {/* General Info */}
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>National Bank</label>
          <input
            type="number"
            name="nationalBank"
            value={formValues.nationalBank}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>People Index</label>
          <input
            type="number"
            name="peopleindex"
            value={formValues.peopleindex}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Military Index</label>
          <input
            type="number"
            name="militaryindex"
            value={formValues.militaryindex}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Economy Index</label>
          <input
            type="number"
            name="economyindex"
            value={formValues.economyindex}
            onChange={handleInputChange}
          />
        </div>

        {/* Toggleable Sections for Social, Military, Finance */}
        <div>
          <button type="button" onClick={() => setShowSocial(!showSocial)}>
            {showSocial ? 'Hide Social' : 'Edit Social'}
          </button>
          {showSocial && (
            <div>
              <h3>Edit Social Info</h3>
              {/* Add input fields for social details here */}
            </div>
          )}
        </div>

        <div>
          <button type="button" onClick={() => setShowMilitary(!showMilitary)}>
            {showMilitary ? 'Hide Military' : 'Edit Military'}
          </button>
          {showMilitary && (
            <div>
              <h3>Edit Military Info</h3>
              {/* Add input fields for military details here */}
            </div>
          )}
        </div>

        <div>
          <button type="button" onClick={() => setShowFinance(!showFinance)}>
            {showFinance ? 'Hide Finance' : 'Edit Finance'}
          </button>
          {showFinance && (
            <div>
              <h3>Edit Finance Info</h3>
              {/* Add input fields for finance details here */}
            </div>
          )}
        </div>

        <button type="submit">Confirm</button>
      </form>

      {/* Toggle to Show/Hide Users */}
      <h3 onClick={toggleShowUsers} style={{ cursor: 'pointer', marginTop: '20px' }}>
        Users in this Nation {showUsers ? '▼' : '▶'}
      </h3>
      {showUsers && (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.username} - Roles: {user.roles.join(', ')}
              <button onClick={() => handleRemoveUser(user._id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminEditNation;
