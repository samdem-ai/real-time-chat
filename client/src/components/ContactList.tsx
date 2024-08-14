import { useAppStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    setSelectChatMessages,
  } = useAppStore();
  const handleClick = (contact) => {
    if (isChannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("contact");
    }
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectChatMessages([]);
    }
  };
  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#6013b7] hover:bg-[#571f97]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => {
            handleClick(contact);
          }}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300 ">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <AvatarFallback
                    className={`h-10 w-10 text-lg items-center justify-center rounded-full
                        ${
                          selectedChatData &&
                          selectedChatData._id === contact._id
                            ? "bg-[#ffffff22] border-white/70 border"
                            : getColor(contact.color)
                        }`}
                  >
                    {contact.firstName
                      ? contact.firstName.split("").shift()?.toUpperCase()
                      : contact.email.split("").shift()?.toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="flex bg-[#ffffff22] font-semibold text-lg border border-white/50 h-10 w-10 justify-center items-center rounded-full">
                <p>{contact.name.split("")[0].toUpperCase()}</p>
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>
                {" "}
                {contact.firstName && contact.lastName
                  ? `${contact.firstName} ${contact.lastName}`
                  : `${contact.email}`}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
