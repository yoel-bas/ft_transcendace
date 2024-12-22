import { ImPrevious } from 'react-icons/im';
import NavLink from './NavLink';
import { useRouter } from 'next/navigation';
function Option({ img, title, des , url}) {
  const router = useRouter();
  return (
    <button className="relative mobile:w-[90%] lg:w-[40%] lg:h-[80%] mobile:h-[45%] ls:h-[55%] bg-transparent/45 rounded-2xl border-2 border-gray-600 p-5 flex flex-col justify-around items-center  hover:border-[#00FFF0] md:hover:scale-105 lg:hover:scale-110 duration-1000 cursor-pointer" onClick={()=>{
      router.push(url)
    }}>
        <img className="mobile:w-52 mobile:h-52 tablet:w-64 tablet:h-64 rounded-xl" src={img} alt="" />
        <h1 className="mobile:text-[30px] lg:text-[1.5vw] font-NK57" >{title}</h1>
        <p className="mobile:text-[15px] text-center lg:text-[0.8vw] font-Red">{des}</p>
    </button>
  );
}
export default Option;