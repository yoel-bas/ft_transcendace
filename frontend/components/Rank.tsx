

import React from "react";
import Gold from "./Gold"
import Bronze from "./Bronze"
import Silver from "./Silver"
import Basic from "./Basic"

// pages/api/get_first.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const get_first = async () => {

    let team
    let sortedTeams;
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'rank.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);

        const teams = data.teams;
        const sortByPoints = (arr) => {
            return arr.sort((a, b) => b.points - a.points);
        };
        sortedTeams = sortByPoints(teams);
    } catch (error) {
        console.error('There was a problem with reading the file:', error);
    }
    return sortedTeams
};


async function Rank(info, player: number) {
    const table = await get_first();
    return (
        <div
            className=" w-full xs:h-[89%] lg:h-full overflow-auto border_cus rounded-xl bg-gradient-to-b from-[rgba(26,31,38,0.7)] to-[rgba(0,0,0,0.5)] flex flex-col justify-start gap-[15px] items-center hide-scrollbar"
        >
            <h1 className="text-[rgb(113,113,113)] relative text-start  w-full left-7 top-2 text-[15px]">Top players</h1>
            <Gold name={table[0].teamName} lvl={table[0].points} minipic="/images/minipic.jpeg" />
            <Silver name={table[2].teamName} lvl={table[1].points} minipic="/images/minipic.jpeg" />
            <Bronze name={table[1].teamName}  lvl={table[2].points} minipic="/images/minipic.jpeg" />
            <h3 className="text-[rgb(113,113,113)] w-full text-start relative left-7 top-2 text-[15px]">Others</h3>
            {table.slice(3).map((team, index) => (
                <Basic key={index + 3} name={team.teamName} lvl={team.points} minipic="/images/minipic.jpeg" />
            ))}
        </div>
    );
}

export default Rank;


