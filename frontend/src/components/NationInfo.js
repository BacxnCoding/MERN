import React from 'react';

const NationInfo = ({ nation, user }) => {
  const roles = user?.roles || [];
  const isAdmin = user?.isAdmin;  // Check if the user is an admin

  return (
    <div>
      <h3>Nation General Info</h3>
      <p><strong>Name:</strong> {nation?.name}</p>
      <p><strong>National Bank:</strong> ${nation?.nationalBank}</p>
      <p><strong>People Index:</strong> {nation?.peopleindex}</p>
      <p><strong>Military Index:</strong> {nation?.militaryindex}</p>
      <p><strong>Economy Index:</strong> {nation?.economyindex}</p>

      {/* Show all military details if the user is an admin, otherwise based on roles */}
      {(isAdmin || roles.includes('military')) && (
        <>
          <h3>Military Details</h3>
          <p><strong>Total Budget:</strong> {nation?.military?.TotalBudget}</p>
          <p><strong>Personnel Training:</strong> {nation?.military?.personnel?.training}</p>
          <p><strong>Well-being:</strong> {nation?.military?.personnel?.wellBeing}</p>
          <p><strong>Bases:</strong> {nation?.military?.equipment?.bases}</p>
          <p><strong>Ports:</strong> {nation?.military?.equipment?.ports}</p>
          <p><strong>Communication:</strong> {nation?.military?.equipment?.communication}</p>
          <p><strong>Equipment Quality:</strong> {nation?.military?.equipment?.equipmentQuality}</p>
        </>
      )}

      {/* Show all finance details if the user is an admin, otherwise based on roles */}
      {(isAdmin || roles.includes('finance')) && (
        <>
          <h3>Finance Details</h3>
          <h3>Income</h3>
          <p><strong>Tax Rate:</strong> {nation?.economy?.income?.taxRate}</p>
          <p><strong>Exports:</strong> {nation?.economy?.income?.exports}</p>
          <h3>Spending</h3>
          <p><strong>Debt:</strong> {nation?.economy?.spending?.debt}</p>
          <p><strong>Imports:</strong> {nation?.economy?.spending?.imports}</p>
        </>
      )}

      {/* Show all social details if the user is an admin, otherwise based on roles */}
      {(isAdmin || roles.includes('social')) && (
        <>
          <h3>Social Info</h3>
          <p><strong>Total Budget:</strong> {nation?.people?.TotalBudget}</p>
          <p><strong>Health Procedures:</strong> {nation?.people?.health?.procedures}</p>
          <p><strong>Vaccines:</strong> {nation?.people?.health?.vaccines}</p>
          <p><strong>Hospitals:</strong> {nation?.people?.health?.hospitals}</p>
          <h4>Satisfaction</h4>
          <p><strong>Education:</strong> {nation?.people?.satisfaction?.education}</p>
          <p><strong>Freedom:</strong> {nation?.people?.satisfaction?.freedom}</p>
          <p><strong>Infrastructure:</strong> {nation?.people?.satisfaction?.infrastructure}</p>
          <p><strong>Political Stability:</strong> {nation?.people?.satisfaction?.politicalStability}</p>
        </>
      )}
    </div>
  );
};

export default NationInfo;
