import BadgeTour from "./BadgeTour"
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function WinnerTour({winner, img}) {
    const { t } = useTranslation();
    const router = useRouter()
    return(
        <div className="w-full h-full flex-col">
        <div className="w-full h-full flex justify-center items-center">
                <div className="xl:w-[50%] lg:h-[50%] lg:w-[70%] xs:w-[90%] xs:h-[50%] x flex flex-col justify-center items-center bg-[url('/images/tour-2.png')] bg-cover bg-center border border-white/50 rounded-xl  trophy-card ">
                <div className=" relative  xs:w-[60%]   md:w-[90%] xs:h-full  lg:w-[40%] lg:h-[70%] xl:h-[90%] 2xl:w-[30%]  xs:flex xs:flex-col xs:justify-center xs:items-center    xs:gap-2">
                <img
        className="relative xs:w-full    top-2 md:w-[40%]  lg:w-[90%] lg:top-2 p-1 border-2 border-[#bff1fafb] rounded-full"
        src={img}
        alt=""
      />
                    </div>
                    <h1 className="  xl:text-[50px] xs:text-[1rem] md:text-[2rem] lg:text-[40px] relative -top-10 text-winner text-[#bff1fafb]  font-barcade">{winner} {t("Win")}</h1>
                </div>
        </div>
        <div className="w-full   h-[5%] flex  justify-center">
        <div className="relative mobile:w-[25%] lg:w-[10%] h-full  bg-gradient-to-b from-sky-900 to-sky-500 rounded-xl border-2 border-[#bff1fafb] flex justify-center items-center">
            <button className="font-barcade" onClick={() => {
                router.push('/')
            }}>{t("Home")}</button>
        </div>
        </div>
        </div>
    );
}