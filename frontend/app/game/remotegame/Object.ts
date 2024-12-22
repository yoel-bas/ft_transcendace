

export interface player {
    player_id: string;
    name: string;
    player_number: string;
}

export interface walls {
    wallsWidth: number;
    wallsHeight: number;
}

export interface ball {
    x: number;
    y: number;
    radius: number;
    color: string;
    directionX: number;
    directionY: number;
    speed: number;
}
