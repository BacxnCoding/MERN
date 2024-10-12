import React from 'react';

function Nations({ nations, setSelectedNation }) {
  return (
    <div>
      <h3>Nations</h3>
      <ul>
        {nations.map((nation) => (
          <li
            key={nation._id}
            onClick={() => setSelectedNation(nation)}
          >
            <p>{nation.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Nations;
