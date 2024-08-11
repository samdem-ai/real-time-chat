import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
useEffect(()=>{
if (!userInfo.profileSetup){
  toast("Please setup your profile first to continue")
  navigate('/profile')
}

},[userInfo,navigate])

  return (
    <>
      <div>
        <ContactsContainer/>
        <EmptyChatContainer/>
        <ChatContainer/>
      </div>
    </>
  );
};

export default Chat;
