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

  useEffect(() => {
    const fetchNationDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/nations/${id}`);
        setFormValues(response.data);
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
          {/* Social Section */}
          <button type="button" onClick={() => setShowSocial(!showSocial)}>
            {showSocial ? 'Hide Social' : 'Edit Social'}
          </button>
          {showSocial && (
            <div>
              <h3>Edit Social Info</h3>
              <label>Total Budget</label>
              <input
                type="number"
                name="TotalBudget"
                value={formValues.people.TotalBudget}
                onChange={handleInputChange}
                data-section="people"
              />
              <label>Health Procedures</label>
              <input
                type="number"
                name="procedures"
                value={formValues.people.health.procedures}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="health"
              />
              <label>Vaccines</label>
              <input
                type="number"
                name="vaccines"
                value={formValues.people.health.vaccines}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="health"
              />
              <label>Hospitals</label>
              <input
                type="number"
                name="hospitals"
                value={formValues.people.health.hospitals}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="health"
              />
              <h3>Satisfaction</h3>
              <label>Infrastructure</label>
              <input
                type="number"
                name="infrastructure"
                value={formValues.people.satisfaction.infrastructure}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="satisfaction"
              />
              <label>Political Stability</label>
              <input
                type="number"
                name="politicalStability"
                value={formValues.people.satisfaction.politicalStability}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="satisfaction"
              />
              <label>Education</label>
              <input
                type="number"
                name="education"
                value={formValues.people.satisfaction.education}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="satisfaction"
              />
              <label>Internal Safety</label>
              <input
                type="number"
                name="internalSafety"
                value={formValues.people.satisfaction.internalSafety}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="satisfaction"
              />
              <label>Freedom</label>
              <input
                type="number"
                name="freedom"
                value={formValues.people.satisfaction.freedom}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="satisfaction"
              />
              <label>Economy Satisfaction</label>
              <input
                type="number"
                name="economy"
                value={formValues.people.satisfaction.economy}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="satisfaction"
              />
              <label>Productivity</label>
              <input
                type="number"
                name="productivity"
                value={formValues.people.productivity}
                onChange={handleInputChange}
                data-section="people"
              />
            </div>
          )}
        </div>

        <div>
          {/* Military Section */}
          <button type="button" onClick={() => setShowMilitary(!showMilitary)}>
            {showMilitary ? 'Hide Military' : 'Edit Military'}
          </button>
          {showMilitary && (
            <div>
              <h3>Edit Military Info</h3>
              <label>Total Budget</label>
              <input
                type="number"
                name="TotalBudget"
                value={formValues.military.TotalBudget}
                onChange={handleInputChange}
                data-section="military"
              />
              <label>Personnel Training</label>
              <input
                type="number"
                name="training"
                value={formValues.military.personnel.training}
                onChange={handleInputChange}
                data-section="military"
                data-subsection="personnel"
              />
              <label>Well-being</label>
              <input
                type="number"
                name="wellBeing"
                value={formValues.military.personnel.wellBeing}
                onChange={handleInputChange}
                data-section="military"
                data-subsection="personnel"
              />
              <h3>Equipment</h3>
              <label>Bases</label>
              <input
                type="number"
                name="bases"
                value={formValues.military.equipment.bases}
                onChange={handleInputChange}
                data-section="military"
                data-subsection="equipment"
              />
              <label>Ports</label>
              <input
                type="number"
                name="ports"
                value={formValues.military.equipment.ports}
                onChange={handleInputChange}
                data-section="military"
                data-subsection="equipment"
              />
              <label>Communication</label>
              <input
                type="number"
                name="communication"
                value={formValues.military.equipment.communication}
                onChange={handleInputChange}
                data-section="military"
                data-subsection="equipment"
              />
              <label>Equipment Quality</label>
              <input
                type="number"
                name="equipmentQuality"
                value={formValues.military.equipment.equipmentQuality}
                onChange={handleInputChange}
                data-section="military"
                data-subsection="equipment"
              />
              <label>Performance</label>
              <input
                type="number"
                name="performance"
                value={formValues.military.performance}
                onChange={handleInputChange}
                data-section="military"
              />
            </div>
          )}
        </div>

        <div>
          {/* Finance Section */}
          <button type="button" onClick={() => setShowFinance(!showFinance)}>
            {showFinance ? 'Hide Finance' : 'Edit Finance'}
          </button>
          {showFinance && (
            <div>
              <h3>Edit Finance Info</h3>
              <label>Tax Rate</label>
              <input
                type="number"
                name="taxRate"
                value={formValues.economy.income.taxRate}
                onChange={handleInputChange}
                data-section="economy"
                data-subsection="income"
              />
              <label>Exports</label>
              <input
                type="number"
                name="exports"
                value={formValues.economy.income.exports}
                onChange={handleInputChange}
                data-section="economy"
                data-subsection="income"
              />
              <label>Imports</label>
              <input
                type="number"
                name="imports"
                value={formValues.economy.spending.imports}
                onChange={handleInputChange}
                data-section="economy"
                data-subsection="spending"
              />
              <label>Debt</label>
              <input
                type="number"
                name="debt"
                value={formValues.economy.spending.debt}
                onChange={handleInputChange}
                data-section="economy"
                data-subsection="spending"
              />
              <label>Inflation</label>
              <input
                type="number"
                name="inflation"
                value={formValues.economy.inflation}
                onChange={handleInputChange}
                data-section="economy"
              />
            </div>
          )}
        </div>

        <button type="submit">Confirm</button>
      </form>
    </div>
  );
};

export default AdminEditNation;
