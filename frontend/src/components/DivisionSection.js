import React from "react";
import TeamCard from "./TeamCard";

const DivisionSection = ({ 
  title, 
  teams, 
  conference, 
  division, 
  titleColor = "text-cyan-300" 
}) => {
  const filteredTeams = teams.filter(
    (team) => team.conference === conference && team.division === division
  );

  return (
    <div className="mb-8">
      <h3 className={`text-lg font-mono font-semibold ${titleColor} mb-4 border-l-4 border-gray-600 pl-3`}>
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {filteredTeams.map((team) => (
          <TeamCard 
            key={team.id} 
            team={team}
          />
        ))}
      </div>
    </div>
  );
};

export default DivisionSection;
