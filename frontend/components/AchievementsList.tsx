import React from 'react';
import Achievement from './Achievement'; // Assuming Achievement is a separate component

const AchievementsList = ({ achievements , wins}) => {

  return (
    <div className="relative top-3 w-full h-[90%] flex flex-col justify-start items-center gap-2 overflow-auto hide-scrollbar">
      {achievements.map((achievement, index) => (
        <div
          key={index}
          className={`relative top-4 w-[90%] h-[25%] flex justify-center items-center border rounded-[25px] ach ${
            wins >= achievement.targetWins  ? 'opacity-95' : 'opacity-35'
          }`}
        >
          <Achievement
            title={achievement.name }
            des={achievement.reward}
            img={achievement.images}
            status={wins >= achievement.targetWins ? true: false}
          />
        </div>
      ))}
    </div>
  );
};

export default AchievementsList;
