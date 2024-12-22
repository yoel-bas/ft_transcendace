function Stats(stats)
{
    return(
        <div className="border xl:w-[80%] xl:h-[40%]  xs:w-[80%] xs:h-[60%]  lg:w-[80%] lg:h-[40%] flex flex-col justify-center items-center stats_styles ">
            <h2 className="text-white 2xl:text-[20px] xl:text-[15px] lg:text-[14px] xs:text-[20px] sm:text-[20px] text-center  ">{stats.type}</h2>
            <p className="text-white">{stats.number}</p>
        </div>
    );
}
export default Stats