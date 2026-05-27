import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sparkles, User } from "lucide-react";

declare global {
  interface Window {
    handleCredentialResponse: any;
  }
}

const Login = () => {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // ================= GOOGLE LOGIN =================

  const handleCredentialResponse = async (response: any) => {
    try {
      const res = await fetch(
        "http://localhost/leavecraft/backend/google-login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: response.credential,
          }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        const payload = JSON.parse(atob(response.credential.split(".")[1]));

        localStorage.setItem("user", payload.email);

        localStorage.setItem("user_email", payload.email);

        localStorage.setItem("user_name", payload.name);

        localStorage.setItem("user_picture", payload.picture);

        navigate("/");
      } else {
        alert("Google Login Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Google Login Error");
    }
  };

  // ================= GOOGLE SCRIPT =================

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";

    script.async = true;

    script.defer = true;

    script.onload = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      // @ts-ignore
      google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
        }
      );
    };

    document.body.appendChild(script);
  }, []);

  // ================= LOGIN =================
  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost/leavecraft/backend/login.php", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      console.log(data);

      if (data.status === "success") {
        localStorage.setItem("user", data.email);

        localStorage.setItem("user_email", data.email);

        localStorage.setItem(
          "user_name",
          data.name || data.email.split("@")[0]
        );

        navigate("/");
      } else {
        alert(data.message || "Login Failed");
      }
    } catch (error) {
      console.error(error);

      alert("Server Error");
    }
  };

  // ================= SIGNUP =================

  const handleSignup = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost/leavecraft/backend/signup.php",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fullName: name,
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      console.log(data);

      if (data.status === "success") {
        alert("Account Created Successfully");

        localStorage.setItem("user", email);

        localStorage.setItem("user_email", email);

        localStorage.setItem("user_name", name || email.split("@")[0]);

        navigate("/");

        setIsSignup(false);

        setName("");
        setEmail("");
        setPassword("");
      } else {
        alert(data.message || "Signup Failed");
      }
    } catch (error) {
      console.error(error);

      alert("Server Error");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 px-4">
      {/* CARD */}

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        {/* TOP */}

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white mt-4">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>

          <p className="text-slate-400 text-sm mt-2">
            {isSignup ? "Signup to continue" : "Login to your account"}
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={isSignup ? handleSignup : handleLogin}
          className="space-y-4"
        >
          {/* NAME */}

          {isSignup && (
            <div className="relative">
              <User className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 pl-12 pr-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {/* EMAIL */}

          <div className="relative">
            <Mail className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 rounded-xl bg-white/5 border border-white/10 pl-12 pr-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* PASSWORD */}

          <div className="relative">
            <Lock className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 rounded-xl bg-white/5 border border-white/10 pl-12 pr-12 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-slate-400"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 text-white font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30 active:scale-95"
          >
            {isSignup ? "Create Account" : "Login"}
          </button>
        </form>

        {/* DIVIDER */}

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10" />

          <span className="text-slate-400 text-sm">OR</span>

          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* GOOGLE */}

        <div id="googleSignInDiv" className="flex justify-center" />

        {/* TOGGLE */}

        <p className="text-center text-sm text-slate-400 mt-6">
          {isSignup ? "Already have an account?" : "Don't have an account?"}

          <button
            onClick={() => setIsSignup(!isSignup)}
            className="ml-2 text-purple-400 hover:text-purple-300 font-semibold"
          >
            {isSignup ? "Login" : "Signup"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
