import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Background from "/assets/login2.png";
import Victory from "/assets/victory.svg";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
    }
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be the same");
    }

    return true;
  };
  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
    }

    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.data.user.id) {
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
      } catch (e) {
        console.log(`error : ${e.message}`);
        toast.error("Incorrect username or password");
      }
    }
  };
  const handleSignup = async () => {
    try {
      if (validateSignup()) {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }
        console.log(response);
      }
    } catch (e) {
      toast.error(e.response.data);
      console.log(e.response);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="p-4 md:p-0 md:h-[80vh] bg-white border-2 border-white text-opacity-90 md:shadow-2xl w-[100vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="victory emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 bottom-2 rounded-none w-full data-[state=active]:text-black  data-[state=active]:font-semibold  data-[state=active]:border-b-purple-500 transition-all duration-300 p-3"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 bottom-2 rounded-none w-full data-[state=active]:text-black  data-[state=active]:font-semibold  data-[state=active]:border-b-purple-500 transition-all duration-300 p-3"
                  value="sign-up"
                >
                  Sign-up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                  className="flex flex-col gap-5 mt-10 transition-all duration-300"
                >
                  <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-full p-6"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    className="rounded-full p-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button className="rounded-full p-6" onClick={handleLogin}>
                    Login
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="sign-up">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSignup();
                  }}
                  className="flex flex-col gap-5 transition-all duration-300"
                >
                  <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-full p-6"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    className="rounded-full p-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    className="rounded-full p-6"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button className="rounded-full p-6" onClick={handleSignup}>
                    Sign up
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="background image" className="h-[400px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
