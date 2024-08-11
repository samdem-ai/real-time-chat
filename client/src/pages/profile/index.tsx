import { useAppStore } from "@/store";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor, colors } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState(userInfo.firstName || "");
  const [lastName, setLastName] = useState(userInfo.lastName || "");
  const [image, setImage] = useState("");
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(userInfo.color || 0);
  const fileInputRef = useRef(null);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required.");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully.");
          navigate("/chat");
        } else {
          toast.error("Something went wrong.");
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup your profile first.");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e:any) => {
    const file = e.target.files[0];
    if (file){
      const formData = new FormData();
      formData.append("profile-image",file)
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{withCredentials:true})
      if (response.status === 200){
        setUserInfo({...userInfo,image:response.data.image});
        toast.success("Image updated successfully")
      }
    }

  };

  const handleDeleteImage = async () => {};

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max ">
        <IoArrowBack
          onClick={handleNavigate}
          className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
        />
      </div>
      <div className="grid grid-cols-2 ">
        <div
          className="h-full w-32 md:w-48 md:h-48 flex items-center justify-center relative"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
            {image ? (
              <AvatarImage
                src={image}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <AvatarFallback
                className={`h-32 w-32 md:w-48 md:h-48 text-5xl items-center justify-center rounded-full ${getColor(
                  selectedColor
                )}`}
              >
                {firstName
                  ? firstName.split("").shift()?.toUpperCase()
                  : userInfo.email.split("").shift().toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          {hovered && (
            <div className="absolute inset-0 flex items-center bg-black/50 justify-center ring-fuchsia-50 w-32 h-32 rounded-full md:w-48 md:h-48 top-14 md:top-0" onClick={image? handleDeleteImage : handleFileInputClick}>
              {image ? (
                <FaTrash className="text-white text-3xl cursor-pointer" />
              ) : (
                <FaPlus className="text-white text-3xl cursor-pointer" />
              )}
            </div>
          )}
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} name="profile-image" accept=".png, .jpg, .jpeg, .webp"/>
        </div>
        <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
          <div className="w-full">
            <Input
              placeholder="Email"
              type="email"
              disabled
              value={userInfo.email}
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
            />
          </div>
          <div className="w-full">
            <Input
              placeholder="First Name"
              type="text"
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              value={firstName}
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
            />
          </div>
          <div className="w-full">
            <Input
              placeholder="Last Name"
              type="text"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              value={lastName}
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
            />
          </div>
          <div className="w-full flex gap-5">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300  ${
                  selectedColor === index
                    ? "outline outline-white/50 outline-2"
                    : ""
                }`}
                onClick={() => setSelectedColor(index)}
              ></div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-[70%]">
        <Button
          onClick={saveChanges}
          className=" h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;
