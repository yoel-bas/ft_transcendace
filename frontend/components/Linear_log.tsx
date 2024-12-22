'use client';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useTranslation } from "react-i18next";

const DonutChart = ({ wins, matches }) => {
  // State to store the donut data
  const [donutData, setDonutData] = useState([
    { name: 'Win', value: 0 },
    { name: 'Losses', value: 0 },
  ]);

  const [winPercentage, setWinPercentage] = useState(0);

  useEffect(() => {

    const updateDonutData = () => {
      if (matches === 0) {
        setDonutData([
          { name: 'Win', value: 0 },
          { name: 'Losses', value: 0 },
        ]);
        setWinPercentage(0);
      } else {
        const winPercent = (wins / matches) * 100;
        const lossPercent = 100 - winPercent;

        setDonutData([
          { name: 'Win', value: winPercent },
          { name: 'Losses', value: lossPercent },
        ]);
        setWinPercentage(winPercent);
      }
    };

    updateDonutData();
  }, [wins, matches]);

  const COLORS = ['#3b82f6', '#10b981'];
  const { t } = useTranslation();
  return (
    <div className="w-full lg:h-full mobile:h-[70%] md:h-[60%] chart flex justify-center items-center">
      <div className="flex flex-col lg:w-full lg:h-full text-white justify-center relative mobile:top-1">
        <div className="w-full h-full relative ">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="gradient1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#007BEC" />
                  <stop offset="100%" stopColor="#001F4F" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00B4A9" />
                  <stop offset="100%" stopColor="#000000" />
                </linearGradient>
              </defs>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                cornerRadius={6}
                startAngle={90}
                endAngle={-270}
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#gradient${index + 1})`} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={30}
                iconType="circle"
                formatter={(value, entry, index) => (
                  <span style={{ color: COLORS[index] }}>{t(value)}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 -top-3 flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {winPercentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeeklyStatsDashboard = ({ matches, wins }) => {
  return (
    <div className="w-full h-full">
      <DonutChart matches={matches} wins={wins} />
    </div>
  );
};

export default WeeklyStatsDashboard;
