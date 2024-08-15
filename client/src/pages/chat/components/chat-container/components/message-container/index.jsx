import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { apiClient } from "@/lib/api-client";
import {
  GET_ALL_CHANNEL_MESSAGES,
  GET_ALL_MESSAGES,
  HOST,
} from "@/utils/constants";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

const MessageContainer = () => {
  const imageRef = useRef();
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
    userInfo,
  } = useAppStore();
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiClient.get(GET_ALL_MESSAGES, {
          withCredentials: true,
          params: {
            id: selectedChatData._id,
          },
        });
        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getChannelMessages = async () => {
      try {
        const response = await apiClient(GET_ALL_CHANNEL_MESSAGES, {
          withCredentials: true,
          params: {
            channelId: selectedChatData._id,
          },
        });
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      } else if (selectedChatType === "channel") {
        getChannelMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        imageRef.current &&
        !/(button|path|svg)/i.test(e.target.tagName.toLowerCase()) &&
        !imageRef.current.contains(e.target)
      ) {
        setShowImage(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [imageRef]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  document.onkeydown = function (e) {
    const isEscape = e.key === "Escape" || e.key === "Esc";
    if (isEscape) {
      setShowImage(false);
    }
  };

  const downloadFile = async (fileUrl) => {
    try {
      setIsDownloading(true);
      setFileDownloadProgress(0);
      const response = await apiClient.get(`${HOST}/${fileUrl}`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const downloadProgressPercentage = Math.round((100 * loaded) / total);
          setFileDownloadProgress(downloadProgressPercentage);
        },
      });
      if (response.data) {
        const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = urlBlob;
        link.setAttribute("download", fileUrl.split("/").pop());
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(urlBlob);
        setIsDownloading(false);
        setFileDownloadProgress(0);
      }
    } catch (e) {
      setIsDownloading(false);
      setFileDownloadProgress(0);
      console.log(e);
    }
  };

  const renderMessages = () => {
    let lastDate = "";
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY_MM_DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDmMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const renderDmMessages = (message) => {
    return (
      <div
        className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"
          }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-white border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-white/20"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${message.sender._id !== userInfo._id
              ? "bg-[#8417ff]/5 text-white border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-white/20"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer "
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3 ">
                  <MdFolderZip />
                </span>
                <span className="">{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => {
                    downloadFile(message.fileUrl);
                  }}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    console.log(userInfo);
    console.log(message);
    return (
      <div
        className={`${message.sender._id === userInfo.id ? "text-right" : "text-left mt-3"
          }`}
      >
        <div className="">
          {message.sender._id !== userInfo.id && (
            <span
              className={`text-xs text-gray-500 block ${message.messageType === "text" && "ms-9"
                }`}
            >{`${message.sender.firstName} ${message.sender.lastName}`}</span>
          )}
          <div
            className={`${message.sender._id !== userInfo.id &&
              "flex justify-start items-end gap-2"
              }`}
          >
            {message.sender._id !== userInfo.id &&
              message.messageType === "text" && (
                <Avatar className="h-6 w-6 mb-2 rounded-full overflow-hidden inline-block">
                  {message.sender.image ? (
                    <AvatarImage
                      src={`${HOST}/${message.sender.image}`}
                      alt="profile"
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <AvatarFallback
                      className={`h-6 w-6 text-lg items-center justify-center rounded-full text-xs ${getColor(
                        message.sender.color
                      )}`}
                    >
                      {message.sender.firstName.split("")[0].toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
            {message.messageType === "text" && (
              <div
                className={`${message.sender._id === userInfo.id
                  ? "bg-[#8417ff]/5 text-white border-[#8417ff]/50"
                  : "bg-[#2a2b33]/5 text-white/80 border-white/20"
                  } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
              >
                <p>{message.content}</p>
              </div>
            )}
          </div>
        </div>
        {message.messageType === "file" && (
          <div
            className={`${message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-white border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-white/20"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer "
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 w-fit">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3 ">
                  <MdFolderZip />
                </span>
                <span className="line-clamp-2 text-s text-start">
                  {message.fileUrl.split("/").pop()}
                </span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => {
                    downloadFile(message.fileUrl);
                  }}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}

        <div
          className={`text-xs text-gray-600 ${message.messageType === "text" ? "ms-9" : ""
            }`}
        >
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 w-full overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw]">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageUrl}`}
              alt="image"
              className="w-full"
              ref={imageRef}
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageUrl)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageUrl("");
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
