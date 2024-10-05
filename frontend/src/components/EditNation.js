import React from 'react';

function EditNation({ selectedNation, setSelectedNation, handleUpdateNation }) {
  return (
    <div>
      <h3>Edit Nation: {selectedNation.name}</h3>
      <label>
        National Bank:
        <input
          type="number"
          value={selectedNation.nationalBank || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              nationalBank: parseInt(e.target.value, 10),
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              nationalBank: selectedNation.nationalBank,
            })
          }
        />
      </label>

      <label>
        Soldiers:
        <input
          type="number"
          value={selectedNation.soldiersAmount || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              soldiersAmount: parseInt(e.target.value, 10),
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              soldiersAmount: selectedNation.soldiersAmount,
            })
          }
        />
      </label>

      <h4>Economy</h4>
      <label>
        Inflation:
        <input
          type="number"
          value={selectedNation.economy?.inflation || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              economy: {
                ...prev.economy,
                inflation: parseFloat(e.target.value),
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              economy: selectedNation.economy,
            })
          }
        />
      </label>

      <label>
        Tax Rate:
        <input
          type="number"
          value={selectedNation.economy?.income?.taxRate || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              economy: {
                ...prev.economy,
                income: {
                  ...prev.economy.income,
                  taxRate: parseFloat(e.target.value),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              economy: selectedNation.economy,
            })
          }
        />
      </label>

      <label>
        Exports:
        <input
          type="number"
          value={selectedNation.economy?.income?.exports || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              economy: {
                ...prev.economy,
                income: {
                  ...prev.economy.income,
                  exports: parseFloat(e.target.value),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              economy: selectedNation.economy,
            })
          }
        />
      </label>

      <label>
        Debt:
        <input
          type="number"
          value={selectedNation.economy?.spending?.debt || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              economy: {
                ...prev.economy,
                spending: {
                  ...prev.economy.spending,
                  debt: parseFloat(e.target.value),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              economy: selectedNation.economy,
            })
          }
        />
      </label>

      <label>
        Imports:
        <input
          type="number"
          value={selectedNation.economy?.spending?.imports || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              economy: {
                ...prev.economy,
                spending: {
                  ...prev.economy.spending,
                  imports: parseFloat(e.target.value),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              economy: selectedNation.economy,
            })
          }
        />
      </label>

      <h4>Military</h4>
      <label>
        Bases:
        <input
          type="number"
          value={selectedNation.military?.equipment?.bases || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              military: {
                ...prev.military,
                equipment: {
                  ...prev.military.equipment,
                  bases: parseInt(e.target.value, 10),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              military: selectedNation.military,
            })
          }
        />
      </label>

      <label>
        Ports:
        <input
          type="number"
          value={selectedNation.military?.equipment?.ports || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              military: {
                ...prev.military,
                equipment: {
                  ...prev.military.equipment,
                  ports: parseInt(e.target.value, 10),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              military: selectedNation.military,
            })
          }
        />
      </label>

      <label>
        Communication:
        <input
          type="number"
          value={selectedNation.military?.equipment?.communication || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              military: {
                ...prev.military,
                equipment: {
                  ...prev.military.equipment,
                  communication: parseInt(e.target.value, 10),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              military: selectedNation.military,
            })
          }
        />
      </label>

      <label>
        Equipment Quality:
        <input
          type="number"
          value={selectedNation.military?.equipment?.equipmentQuality || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              military: {
                ...prev.military,
                equipment: {
                  ...prev.military.equipment,
                  equipmentQuality: parseInt(e.target.value, 10),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              military: selectedNation.military,
            })
          }
        />
      </label>

      <h4>Personnel</h4>
      <label>
        Training:
        <input
          type="number"
          value={selectedNation.military?.personnel?.training || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              military: {
                ...prev.military,
                personnel: {
                  ...prev.military.personnel,
                  training: parseInt(e.target.value, 10),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              military: selectedNation.military,
            })
          }
        />
      </label>

      <label>
        Well-Being:
        <input
          type="number"
          value={selectedNation.military?.personnel?.wellBeing || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              military: {
                ...prev.military,
                personnel: {
                  ...prev.military.personnel,
                  wellBeing: parseInt(e.target.value, 10),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              military: selectedNation.military,
            })
          }
        />
      </label>

      <h4>People</h4>
      <label>
        Vaccines:
        <input
          type="number"
          value={selectedNation.people?.health?.vaccines || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              people: {
                ...prev.people,
                health: {
                  ...prev.people.health,
                  vaccines: parseInt(e.target.value, 10),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              people: selectedNation.people,
            })
          }
        />
      </label>

      <label>
        Hospitals:
        <input
          type="number"
          value={selectedNation.people?.health?.hospitals || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              people: {
                ...prev.people,
                health: {
                  ...prev.people.health,
                  hospitals: parseInt(e.target.value, 10),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              people: selectedNation.people,
            })
          }
        />
      </label>

      <h4>Satisfaction</h4>
      <label>
        Infrastructure:
        <input
          type="number"
          value={selectedNation.people?.satisfaction?.infrastructure || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              people: {
                ...prev.people,
                satisfaction: {
                  ...prev.people.satisfaction,
                  infrastructure: parseInt(e.target.value, 10),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              people: selectedNation.people,
            })
          }
        />
      </label>

      <label>
        Political Stability:
        <input
          type="number"
          value={
            selectedNation.people?.satisfaction?.politicalStability || 0
          }
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              people: {
                ...prev.people,
                satisfaction: {
                  ...prev.people.satisfaction,
                  politicalStability: parseInt(e.target.value, 10),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              people: selectedNation.people,
            })
          }
        />
      </label>

      <label>
        Education:
        <input
          type="number"
          value={selectedNation.people?.satisfaction?.education || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              people: {
                ...prev.people,
                satisfaction: {
                  ...prev.people.satisfaction,
                  education: parseInt(e.target.value, 10),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              people: selectedNation.people,
            })
          }
        />
      </label>

      <label>
        Internal Safety:
        <input
          type="number"
          value={selectedNation.people?.satisfaction?.internalSafety || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              people: {
                ...prev.people,
                satisfaction: {
                  ...prev.people.satisfaction,
                  internalSafety: parseInt(e.target.value, 10),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              people: selectedNation.people,
            })
          }
        />
      </label>

      <label>
        Freedom:
        <input
          type="number"
          value={selectedNation.people?.satisfaction?.freedom || 0}
          onChange={(e) =>
            setSelectedNation((prev) => ({
              ...prev,
              people: {
                ...prev.people,
                satisfaction: {
                  ...prev.people.satisfaction,
                  freedom: parseInt(e.target.value, 10),
                },
              },
            }))
          }
          onBlur={() =>
            handleUpdateNation(selectedNation._id, {
              people: selectedNation.people,
            })
          }
        />
      </label>
    </div>
  );
}

export default EditNation;
