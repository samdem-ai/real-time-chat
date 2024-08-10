import {useAppStore} from "@/store"

const Profile = () => {

  const {userInfo} = useAppStore()


  return (

    <>
      <div>PROFILE</div>
      <p>{userInfo.email}</p>
    </>
  );
};

export default Profile;
