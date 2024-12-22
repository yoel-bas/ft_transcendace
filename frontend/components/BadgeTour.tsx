'use client'
import React, { useState, useEffect } from 'react';

export default function BadgeTour( {img}: any) {


  return (
    <div className="bg-[url('/images/ultimate_badge.png')] bg-cover bg-center 2xl:w-[79%]  xs:w-[90%] xs:h-[70%]  lg:h-[60%] flex justify-center items-center scale-down ">
     <img
        className="relative xs:w-[35%]    top-2 md:w-[39%]  lg:w-[45%] xl:w-[50%] 3xl:w-[40%] xl:top-3  3xl:top-3  lg:top-2 rounded-full"
        src={img}
        alt=""
      />
    </div>
  );
}
