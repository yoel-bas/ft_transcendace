const FriendCard = ({Name, Username, online}) => {
    return(
        <div className="w-[90%] h-full flex justify-between lg:gap-2 xl:gap-0 items-start border-b border-t rounded-3xl border-gray-500/40 p-2 ">
            <div className="flex items-center gap-2 relative w-full  5xl:-top-1   ">
                <div className="h-full border border-[#00FFF0]  bg-gray-500/40 rounded-full flex items-center justify-center">
                    <img src="images/minipic.jpeg" className="w-10 h-10 rounded-full " alt="avatar" />
                </div>
                <div className="flex flex-col justify-center ">
                    <h1  className="text-white font-semibold  mobile:text-[4vw] ls:text-[3vw] md:text-[2vw] lg:text-[1.4vw] xl:text-[1.2vw] 2xl:text-[0.8vw]  w-full">{Name}</h1>
                    <h3 className="text-white/80 mobile:text-[2vw] ls:text-[2vw] dm:text-[1.5vw] lg:text-[1vw] xl:text-[0.9vw] 2xl:text-[0.7vw]">@{Username}</h3>
                </div>
            </div>
        </div>
    )
}
export default FriendCard