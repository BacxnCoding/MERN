// NationInfo.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NationInfo = ({ user }) => {
  const [nation, setNation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.nation_id) {
      const fetchNationDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/nations/${user.nation_id}`);
          setNation(response.data);
        } catch (error) {
          console.error('Failed to fetch nation details:', error);
          setError('Failed to fetch nation details.');
        }
      };

      fetchNationDetails();
    }
  }, [user]);

  if (!user || !user.nation_id) {
    return <p style={{ color: 'red' }}>Nation data not available for this user.</p>;
  }

  return (
    <div>
      <h3>Your Nation's Stats</h3>
      {nation ? (
        <div>
          <p><strong>Name:</strong> {nation.name}</p>
          <p><strong>National Bank:</strong> {nation.nationalBank}</p>
          <p><strong>People Index:</strong> {nation.peopleindex}</p>
          <p><strong>Military Index:</strong> {nation.militaryindex}</p>
          <p><strong>Economy Index:</strong> {nation.economyindex}</p>
          
          {/* Add role-specific details */}
          {user.roles.includes('finance') && (
            <div>
              <h4>Economy Details</h4>
              <p><strong>Inflation:</strong> {nation.economy.inflation}</p>
              <p><strong>Tax Rate:</strong> {nation.economy.income.taxRate}</p>
              <p><strong>Exports:</strong> {nation.economy.income.exports}</p>
              <p><strong>Debt:</strong> {nation.economy.spending.debt}</p>
              <p><strong>Imports:</strong> {nation.economy.spending.imports}</p>
            </div>
          )}

          {user.roles.includes('military') && (
            <div>
              <h4>Military Details</h4>
              <p><strong>Training:</strong> {nation.military.personnel.training}</p>
              <p><strong>Well-being:</strong> {nation.military.personnel.wellBeing}</p>
              <p><strong>Bases:</strong> {nation.military.equipment.bases}</p>
              <p><strong>Ports:</strong> {nation.military.equipment.ports}</p>
              <p><strong>Communication:</strong> {nation.military.equipment.communication}</p>
              <p><strong>Equipment Quality:</strong> {nation.military.equipment.equipmentQuality}</p>
              <p><strong>Performance:</strong> {nation.military.performance}</p>
            </div>
          )}

          {user.roles.includes('social') && (
            <div>
              <h4>Social Details</h4>
              <p><strong>Infrastructure:</strong> {nation.people.satisfaction.infrastructure}</p>
              <p><strong>Political Stability:</strong> {nation.people.satisfaction.politicalStability}</p>
              <p><strong>Education:</strong> {nation.people.satisfaction.education}</p>
              <p><strong>Internal Safety:</strong> {nation.people.satisfaction.internalSafety}</p>
              <p><strong>Freedom:</strong> {nation.people.satisfaction.freedom}</p>
              <p><strong>Economy Satisfaction:</strong> {nation.people.satisfaction.economy}</p>
            </div>
          )}
        </div>
      ) : (
        <p style={{ color: 'red' }}>{error || 'Nation data not available.'}</p>
      )}
    </div>
  );
};

export default NationInfo;
