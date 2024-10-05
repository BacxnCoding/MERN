import React from 'react';

const NationInfo = ({ nation, user }) => {
  return (
    <div>
      <h3>Your Nation's Stats</h3>
      <p><strong>Name:</strong> {nation?.name}</p>
      <p><strong>National Bank:</strong> {nation?.nationalBank}</p>
      <p><strong>People Index:</strong> {nation?.peopleindex}</p>
      <p><strong>Military Index:</strong> {nation?.militaryindex}</p>
      <p><strong>Economy Index:</strong> {nation?.economyindex}</p>

      {/* Add any other nation-specific information here */}
      <h3>Military Details</h3>
      <p><strong>Training:</strong> {nation?.military?.personnel?.training}</p>
      <p><strong>Well-being:</strong> {nation?.military?.personnel?.wellBeing}</p>
      <p><strong>Bases:</strong> {nation?.military?.equipment?.bases}</p>
      <p><strong>Ports:</strong> {nation?.military?.equipment?.ports}</p>
      <p><strong>Communication:</strong> {nation?.military?.equipment?.communication}</p>
      <p><strong>Equipment Quality:</strong> {nation?.military?.equipment?.equipmentQuality}</p>
      <p><strong>Performance:</strong> {nation?.military?.performance}</p>
    </div>
  );
};

export default NationInfo;
