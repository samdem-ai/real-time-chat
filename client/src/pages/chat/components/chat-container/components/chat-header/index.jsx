import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  // TODO temporary solution until refactoring for types
  const currentChatData = selectedChatData;
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between">
      <div className="flex gap-5 items-center justify-between w-full px-10">
        <div className="flex gap-3 items-center justify-center">
          {/* TODO make this into a component to reuse it instead of copying it */}
          <div className="w-12 h-12 relative ">
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {selectedChatType === "contact" && currentChatData.image ? (
                <AvatarImage
                  src={`${HOST}/${currentChatData.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <AvatarFallback
                  className={`h-12 w-12 text-lg items-center justify-center rounded-full ${selectedChatType === "contact"
                    ? getColor(currentChatData.color)
                    : "bg-[#ffffff22] font-semibold border border-white/50"
                    }`}
                >
                  {selectedChatType === "contact"
                    ? currentChatData.firstName
                      ? currentChatData.firstName
                        .split("")
                        .shift()
                        ?.toUpperCase()
                      : currentChatData.email.split("").shift()?.toUpperCase()
                    : selectedChatData.name.split("")[0].toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <div className="font-semibold">
            {selectedChatType === "contact" &&
              (currentChatData.firstName
                ? `${currentChatData.firstName} ${currentChatData.lastName}`
                : currentChatData.email)}
            {selectedChatType === "channel" && selectedChatData.name}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
