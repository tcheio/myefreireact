import React, { createContext, useState } from 'react';
import planningsData from '../Données/Planning';

export const PlanningContext = createContext();

export const PlanningProvider = ({ children }) => {
  const [plannings, setPlannings] = useState(planningsData);

  const updatePlanning = (classeId, newCourse) => {
    setPlannings(prevPlannings =>
      prevPlannings.map(planning => {
        if (planning.classeId === classeId) {
          return {
            ...planning,
            planning: [...planning.planning, newCourse],
          };
        }
        return planning;
      })
    );
  };

  return (
    <PlanningContext.Provider value={{ plannings, updatePlanning }}>
      {children}
    </PlanningContext.Provider>
  );
};
