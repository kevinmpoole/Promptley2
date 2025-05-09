import React from "react";

export const CardGridWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      {children}
    </div>
  );
};
