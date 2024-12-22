import FriendCard from './FriendCard'
const FriendsList = ({ friends }) => {

    return (
        <>
        <div className='relative top-6  lg:h-[90%] xs:h-[90%]  w-full overflow-auto hide-scrollbar  scale-105'>
        <div className=' w-full h-auto   flex flex-col items-center gap-5 '>
            {friends && friends.map((friend, index) => (
                <div key={index} className='relative w-[100%] h-[3.5rem]  flex flex-col justify-center items-center'>
                    <FriendCard Name={friend.full_name} Username={friend.username} online={friend.online} />
                </div>
            ))}
        </div>
        </div>
        </>
    );
};
export default FriendsList