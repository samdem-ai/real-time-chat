import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import animationData from "@/assets/lottie-json.json";
import Lottie from "lottie-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { GET_ALL_CONTACTS, HOST } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contact } from "@/utils/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import {useAppStore} from "@/store"

const NewDm = () => {
  const {setSelectedChatType,setSelectedChatData} = useAppStore()
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (searchTerm: string) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          GET_ALL_CONTACTS,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
          console.log(searchedContacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (e) {
      toast.error("something went wrong?");
      console.log(e);
    }
  };

  const selectNewContact = (contact: Contact) => {
    setOpenNewContactModal(false);
    setSearchedContacts([]);
    setSelectedChatType("contact");
    setSelectedChatData(contact)
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={() => setOpenNewContactModal(true)}>
            <FiPlus className="text-neutral-500 text-start text-2xl font-bold text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300" />
          </TooltipTrigger>
          <TooltipContent
            className={"bg-[#1c1b1e] text-white border-none mb-2 p-3"}
          >
            <p>Select New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact: Contact) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center cursor-pointer hover:bg-neutral-500 rounded-lg p-2 -mb-3 transition-all duration-300"
                    onClick={()=>selectNewContact(contact)}
                  >
                     {/* TODO make this into a component to reuse it instead of copying it */}
                    <div className="w-12 h-12 relative ">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {contact.image ? (
                          <AvatarImage
                            src={`${HOST}/${contact.image}`}
                            alt="profile"
                            className="object-cover w-full h-full bg-black"
                          />
                        ) : (
                          <AvatarFallback
                            className={`h-12 w-12 text-lg items-center justify-center rounded-full ${getColor(
                              contact.color
                            )}`}
                          >
                            {contact.firstName
                              ? contact.firstName
                                  .split("")
                                  .shift()
                                  ?.toUpperCase()
                              : contact.email.split("").shift().toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : `${contact.email}`}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {contact.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {searchedContacts.length <= 0 && (
            <div className=" flex-1 flex flex-col justify-center items-center transition-all duration-1000">
              <Lottie
                animationData={animationData}
                className="w-[100px]"
                autoPlay={true}
                loop={true}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5  lg:text-xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium whitespace-nowrap">
                  Hi<span className="text-purple-500">! </span>
                  Search for a new{" "}
                  <span className="text-purple-500">Contact .</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
