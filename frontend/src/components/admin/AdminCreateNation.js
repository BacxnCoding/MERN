import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminCreateNation = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    nationalBank: 0,
    peopleindex: 0,
    militaryindex: 0,
    economyindex: 0,
    people: {
      TotalBudget: 0,
      health: { procedures: 0, vaccines: 0, hospitals: 0 },
      satisfaction: { infrastructure: 0, politicalStability: 0, education: 0, internalSafety: 0, freedom: 0, economy: 0 },
      productivity: 0,
    },
    military: {
      TotalBudget: 0,
      personnel: { training: 0, wellBeing: 0 },
      equipment: { bases: 0, ports: 0, communication: 0, equipmentQuality: 0 },
      performance: 0,
    },
    economy: {
      income: { taxRate: 0, exports: 0 },
      spending: { debt: 0, imports: 0 },
      inflation: 0,
    },
  });
  const [error, setError] = useState(null); // State to handle errors
  const [success, setSuccess] = useState(false); // State to handle success
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      // Send POST request to create a new nation
      const response = await axios.post('http://localhost:5000/api/nations', formValues);
      console.log('Nation created:', response.data);
      setSuccess(true); // Show success message
      setError(null); // Clear any previous errors

      // Show alert and redirect after nation is created
      alert('Nation created successfully!');
      navigate('/admin');  // Redirect to admin dashboard
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Nation name already in use.'); // Show error if nation exists
      } else {
        console.error('Error creating nation:', err);
        setError('Failed to create nation.'); // Show other errors
      }
    }
  };

  return (
    <div>
      <h2>Create New Nation</h2>
      {success && <p>Nation created successfully!</p>} {/* Success message */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Error message */}
      <form>
        {/* Nation Name Input */}
        <div>
          <label>Name</label>
          <input
            type="text"
            value={formValues.name}
            onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
          />
        </div>

        {/* National Bank Input */}
        <div>
          <label>National Bank</label>
          <input
            type="number"
            value={formValues.nationalBank}
            onChange={(e) => setFormValues({ ...formValues, nationalBank: e.target.value })}
          />
        </div>

        {/* People Index */}
        <div>
          <label>People Index</label>
          <input
            type="number"
            value={formValues.peopleindex}
            onChange={(e) => setFormValues({ ...formValues, peopleindex: e.target.value })}
          />
        </div>

        {/* Military Index */}
        <div>
          <label>Military Index</label>
          <input
            type="number"
            value={formValues.militaryindex}
            onChange={(e) => setFormValues({ ...formValues, militaryindex: e.target.value })}
          />
        </div>

        {/* Economy Index */}
        <div>
          <label>Economy Index</label>
          <input
            type="number"
            value={formValues.economyindex}
            onChange={(e) => setFormValues({ ...formValues, economyindex: e.target.value })}
          />
        </div>

        {/* Submit Button */}
        <button type="button" onClick={handleSubmit}>
          Create Nation
        </button>
      </form>
    </div>
  );
};

export default AdminCreateNation;
