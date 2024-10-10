import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminCreateNation = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: '',
    nationalBank: 0,
    peopleindex: 0,
    militaryindex: 0,
    economyindex: 0,
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

  // Toggle visibility for each section
  const [showSocial, setShowSocial] = useState(false);
  const [showMilitary, setShowMilitary] = useState(false);
  const [showEconomy, setShowEconomy] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;
    if (dataset.section && dataset.subsection) {
      setFormValues((prevState) => ({
        ...prevState,
        [dataset.section]: {
          ...prevState[dataset.section],
          [dataset.subsection]: {
            ...prevState[dataset.section][dataset.subsection],
            [name]: value,
          },
        },
      }));
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

  // Handle form submission to create a new nation
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/nations', formValues);
      alert('Nation created successfully!');
      navigate('/admin'); // Redirect back to admin dashboard after creation
    } catch (error) {
      console.error('Error creating nation:', error);
      alert('Failed to create nation');
    }
  };

  return (
    <div>
      <h2>Create New Nation</h2>
      <form onSubmit={handleFormSubmit}>
        {/* General Info */}
        <h3>Nation General Info</h3>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>National Bank:</label>
          <input
            type="number"
            name="nationalBank"
            value={formValues.nationalBank}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>People Index:</label>
          <input
            type="number"
            name="peopleindex"
            value={formValues.peopleindex}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Military Index:</label>
          <input
            type="number"
            name="militaryindex"
            value={formValues.militaryindex}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Economy Index:</label>
          <input
            type="number"
            name="economyindex"
            value={formValues.economyindex}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Toggle Social Section */}
        <h3 onClick={() => setShowSocial(!showSocial)} style={{ cursor: 'pointer' }}>
          Social Info {showSocial ? '▼' : '▶'}
        </h3>
        {showSocial && (
          <div>
            <div>
              <label>Total Budget:</label>
              <input
                type="number"
                name="TotalBudget"
                value={formValues.people.TotalBudget}
                onChange={handleInputChange}
                data-section="people"
              />
            </div>
            <div>
              <label>Health Procedures:</label>
              <input
                type="number"
                name="procedures"
                value={formValues.people.health.procedures}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="health"
              />
            </div>
            <div>
              <label>Vaccines:</label>
              <input
                type="number"
                name="vaccines"
                value={formValues.people.health.vaccines}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="health"
              />
            </div>
            <div>
              <label>Hospitals:</label>
              <input
                type="number"
                name="hospitals"
                value={formValues.people.health.hospitals}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="health"
              />
            </div>
            <h4>Satisfaction</h4>
            <div>
              <label>Education:</label>
              <input
                type="number"
                name="education"
                value={formValues.people.satisfaction.education}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="satisfaction"
              />
            </div>
            <div>
              <label>Freedom:</label>
              <input
                type="number"
                name="freedom"
                value={formValues.people.satisfaction.freedom}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="satisfaction"
              />
            </div>
            <div>
              <label>Infrastructure:</label>
              <input
                type="number"
                name="infrastructure"
                value={formValues.people.satisfaction.infrastructure}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="satisfaction"
              />
            </div>
            <div>
              <label>Political Stability:</label>
              <input
                type="number"
                name="politicalStability"
                value={formValues.people.satisfaction.politicalStability}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="satisfaction"
              />
            </div>
            <div>
              <label>Internal Safety:</label>
              <input
                type="number"
                name="internalSafety"
                value={formValues.people.satisfaction.internalSafety}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="satisfaction"
              />
            </div>
            <div>
              <label>Economy Satisfaction:</label>
              <input
                type="number"
                name="economy"
                value={formValues.people.satisfaction.economy}
                onChange={handleInputChange}
                data-section="people"
                data-subsection="satisfaction"
              />
            </div>
            <div>
              <label>Productivity:</label>
              <input
                type="number"
                name="productivity"
                value={formValues.people.productivity}
                onChange={handleInputChange}
                data-section="people"
              />
            </div>
          </div>
        )}

        {/* Toggle Military Section */}
        <h3 onClick={() => setShowMilitary(!showMilitary)} style={{ cursor: 'pointer' }}>
          Military Details {showMilitary ? '▼' : '▶'}
        </h3>
        {showMilitary && (
          <div>
            <div>
              <label>Total Budget:</label>
              <input
                type="number"
                name="TotalBudget"
                value={formValues.military.TotalBudget}
                onChange={handleInputChange}
                data-section="military"
              />
            </div>
            <div>
              <label>Personnel Training:</label>
              <input
                type="number"
                name="training"
                value={formValues.military.personnel.training}
                onChange={handleInputChange}
                data-section="military"
                data-subsection="personnel"
              />
            </div>
            <div>
              <label>Well-being:</label>
              <input
                type="number"
                name="wellBeing"
                value={formValues.military.personnel.wellBeing}
                onChange={handleInputChange}
                data-section="military"
                data-subsection="personnel"
              />
            </div>
            <h4>Equipment</h4>
            <div>
              <label>Bases:</label>
              <input
                type="number"
                name="bases"
                value={formValues.military.equipment.bases}
                onChange={handleInputChange}
                data-section="military"
                data-subsection="equipment"
              />
            </div>
            <div>
              <label>Ports:</label>
              <input
                type="number"
                name="ports"
                value={formValues.military.equipment.ports}
                onChange={handleInputChange}
                data-section="military"
                data-subsection="equipment"
              />
            </div>
            <div>
              <label>Communication:</label>
              <input
                type="number"
                name="communication"
                value={formValues.military.equipment.communication}
                onChange={handleInputChange}
                data-section="military"
                data-subsection="equipment"
              />
            </div>
            <div>
              <label>Equipment Quality:</label>
              <input
                type="number"
                name="equipmentQuality"
                value={formValues.military.equipment.equipmentQuality}
                onChange={handleInputChange}
                data-section="military"
                data-subsection="equipment"
              />
            </div>
            <div>
              <label>Performance:</label>
              <input
                type="number"
                name="performance"
                value={formValues.military.performance}
                onChange={handleInputChange}
                data-section="military"
              />
            </div>
          </div>
        )}

        {/* Toggle Economy Section */}
        <h3 onClick={() => setShowEconomy(!showEconomy)} style={{ cursor: 'pointer' }}>
          Finance Details {showEconomy ? '▼' : '▶'}
        </h3>
        {showEconomy && (
          <div>
            <h4>Income</h4>
            <div>
              <label>Tax Rate:</label>
              <input
                type="number"
                name="taxRate"
                value={formValues.economy.income.taxRate}
                onChange={handleInputChange}
                data-section="economy"
                data-subsection="income"
              />
            </div>
            <div>
              <label>Exports:</label>
              <input
                type="number"
                name="exports"
                value={formValues.economy.income.exports}
                onChange={handleInputChange}
                data-section="economy"
                data-subsection="income"
              />
            </div>
            <h4>Spending</h4>
            <div>
              <label>Debt:</label>
              <input
                type="number"
                name="debt"
                value={formValues.economy.spending.debt}
                onChange={handleInputChange}
                data-section="economy"
                data-subsection="spending"
              />
            </div>
            <div>
              <label>Imports:</label>
              <input
                type="number"
                name="imports"
                value={formValues.economy.spending.imports}
                onChange={handleInputChange}
                data-section="economy"
                data-subsection="spending"
              />
            </div>
            <div>
              <label>Inflation:</label>
              <input
                type="number"
                name="inflation"
                value={formValues.economy.inflation}
                onChange={handleInputChange}
                data-section="economy"
              />
            </div>
          </div>
        )}

        <button type="submit">Create Nation</button>
      </form>
    </div>
  );
};

export default AdminCreateNation;
