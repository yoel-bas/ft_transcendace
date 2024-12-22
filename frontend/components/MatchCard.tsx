const Match = ({main_user_name, main_user_avatar,   opp, img , result,time}) => {
    const [score1, score2] = result.split(':')
    return(
        <>
        <h1 className="text-gray-500 lg:text-[12px]  md:text-[20px] mobile:text-[18px]">{time}</h1>
        <div className=" w-full h-full flex justify-between items-center border-b border-white/40">
                <div className="h-full flex flex-col justify-center items-center gap-1">
                    <img className="mobile:w-8 mobile:h-8 xl:w-12  xl:h-12 lg:w-8 lg:h-8 xs:w-12 xs:h-12 rounded-full border-2 border-[#00FFF0] md:w-16 md:h-16 " src={main_user_avatar} alt="" />
                    {main_user_name.length < 5 ?  <h3 title={main_user_name} className="relative  text-[14px] text-white font-light"> {main_user_name}</h3>
                    :<h3 title={main_user_name} className="relative  text-[14px] text-white font-light"> {main_user_name.slice(0, 4)}...</h3>}
                </div>
                <div className="relative flex flex-col justify-center items-center top-2 ">
                    {/* <h1></h1> */}
                        <h1 className="lg:text-[12px]  md:text-[20px] mobile:text-[18px] relative md:-top-7 mobile:-top-7 lg:-top-5 text-white/80"> Match Result</h1>
                        <div className="flex justify-center items-center gap-1  absolute  match_result_  lg:w-[90px] lg:h-[25px] xl:w-[120px] xl:h-[30px] md:w-[240px] md:h-[40px] xs:w-[150px] xs:h-[40px] mobile:w-[100px] mobile:h-[30px] ">
                                   <p className="share text-white lg:text-[18px] md:text-[24px] mobile:text-[18px]  font thin ">{score1}</p>                 
                                   <p className="share text-white lg:text-[18px] md:text-[24px] mobile:text-[18px] font thin"> : </p>
                                   <p className="share text-white lg:text-[18px] md:text-[24px] mobile:text-[18px] font thin"> {score2}</p>                 
                        </div>
                </div>
                <div className="h-full flex flex-col justify-center items-center gap-1">
                    <img className="mobile:w-8 mobile:h-8 xl:w-12  xl:h-12 lg:w-8 lg:h-8 md:w-16 md:h-16 xs:w-12 xs:h-12 rounded-full border-2 border-[#00FFF0]" src={img} alt="" />
                    {opp.length < 5 ? <h3 title={opp} className="relative  text-[14px] text-white font-light">{opp.slice(0, 4)}</h3>
                    :<h3 title={opp} className="relative  text-[14px] text-white font-light">{opp.slice(0, 4)}...</h3>}
                </div>
        </div>
        </>
    )
}
export default Match