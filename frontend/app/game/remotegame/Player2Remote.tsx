
interface PlayerProps{
    image: string;
    name: string;

}

export default function Player({image, name}: PlayerProps)
{
    return (
        <div className="lm:flex lm:flex-col lm:items-center lm:justify-start lm:w-[210px] ">
            <div className="bg-cover bg-center cover rounded-full
                            border-2 border-yellow-300
                            sm:w-[50px] sm:h-[50px] 
                            lm:w-[70px] lm:h-[70px]
                            lg:w-[100px] lg:h-[100px]
                            xl:w-[100px] xl:h-[100px]
                            2xl:w-[150px] 2xl:h-[150px]
                            3xl:w-[200px] 3xl:h-[200px]
                            animate-slide-in-left 
                        "
                    style={{ backgroundImage: `url(${image})` }}></div>
            <div className="text-white animate-slide-in-left ">{name}</div>
        </div>
    );
}

