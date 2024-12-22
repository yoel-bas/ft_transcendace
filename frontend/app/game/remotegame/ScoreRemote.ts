import React, { useRef, useEffect } from 'react';
import { walls } from './Object';
import p5 from 'p5';

export function countdown(sketch: p5, Walls : walls, count: number):void {
    sketch.fill(200, 20);
    sketch.stroke(0, 36);
    sketch.textSize(300);
    sketch.textAlign(sketch.CENTER, sketch.CENTER);
    sketch.text(count > 0 ? count : 'GO!', sketch.width / 2, sketch.height / 2);
}