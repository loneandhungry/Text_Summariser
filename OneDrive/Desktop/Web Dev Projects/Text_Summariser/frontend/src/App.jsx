import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import './index.css';
import { PDFUpload } from './uploadPDF';

export function Login({ setToken }) {
  return (
    <div className="my-4 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-3 text-amber-800">Login with Google</h2>
      <div className="shadow-md hover:shadow-xl transition-all duration-300 rounded-xl p-4 bg-white border border-amber-300">
        <GoogleLogin
          onSuccess={async (response) => {
            const token = response.credential;
            const res = await axios.post('http://localhost:5000/auth', { token });
            localStorage.setItem("token", res.data.token);
            setToken(res.data.token);
            alert("Please upload a PDF File, or put in a text. And select the size of summary you want.")
          }}
          onError={() => console.log("Login Failed.")}
        />
      </div>
    </div>
  );
}

export function LogOut({ setToken }) {
  function handleLogOut() {
    localStorage.removeItem("token");
    setToken(null);
    alert("You have logged out.");
  }

  return (
    <button
      onClick={handleLogOut}
      className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 
                 hover:from-red-600 hover:via-red-700 hover:to-red-800
                 text-white font-semibold px-10 py-3 rounded-full shadow-xl 
                 transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-red-300"
    >
      Log Out
    </button>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [summary, setSummary] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [length, setLength] = useState("m");

  async function handleSummariser() {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      alert("Please login first");
      return;
    }
    setText("");
    setLoading(true);
    setSummary("");
    try {
      const response = await axios.post(
        "http://localhost:5000/summarise",
        { text, length },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setSummary(response.data.summary);
    } catch (err) {
      if(err.response){
        if(err.response.status === 429){
          alert("Can make only 5 requests in 20 mins. Please try again later.");
        }
         if(err.response.status === 400){
          alert("Cannot send an empty body.")
        }
        if(err.response.status === 401){
          alert("Please login first.")
        }
        if(err.response.status === 403){
          alert("Inavlid token. Please login again.")
        }
        if(err.response.status === 500){
          alert("Cannot send an empty body.")
        }
        else{
        alert(`${err.response.data}`);
        }
      }
      else{
      alert(`${err}`); }
    }
    setLoading(false);
  }

return (
  <div className="relative flex flex-col lg:flex-row justify-start lg:justify-between items-start min-h-screen bg-[#f5ebd6] px-6 lg:px-16 py-6 overflow-hidden font-body">
    

<div className="absolute top-6 left-6">
  <LogOut setToken={setToken} />
</div>


<div className="w-1/2 flex flex-col justify-start items-start space-y-4 mt-16 animate-[floatIn_2s_ease-in-out]">
  <h1 className="text-8xl font-extrabold text-[#78350f] leading-tight tracking-tight animate-[bounceIn_2.5s_ease-in-out] font-heading">
    Read Less.<br />
    <span className="text-[#b45309]">Learn More.</span>
  </h1>

  <p className="text-3xl text-[#92400e] font-medium tracking-wide mt-3">
    Transform words into clarity and knowledge, effortlessly.
  </p>

  <p className="text-xl text-[#4b2e14] font-light">
    <span className="font-semibold">Tejaswani, K24</span> <br />
    BIT MESRA
  </p>

  <p className="text-lg text-[#78350f] font-medium mt-1">
    Dive into smarter reading, faster comprehension, and concise summaries at your fingertips.
  </p>

  <p className="text-lg text-[#78350f] font-medium italic mt-1">
    Seamlessly turn text into knowledge, one summary at a time.
  </p>

  <p className="text-lg text-[#78350f] font-semibold italic mt-1">
    Your AI-powered text companion.
  </p>

   <p className="text-lg text-[#78350f] font-semibold italic mt-1">
    Github - https://github.com/loneandhungry/Text_Summariser
  </p>
</div>


    
    <div className="w-full lg:w-1/2 flex flex-col justify-start items-center bg-[#fdf5eb] p-6 sm:p-8 lg:p-10 rounded-3xl border border-[#92400e] shadow-lg hover:shadow-2xl transition-all duration-500 mt-8 lg:mt-0">
      <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold text-[#78350f] mb-6 lg:mb-10 text-center font-heading">
        Text Summariser
      </h1>

      {token ? (
        <>
    
          <div className="w-full max-w-2xl mb-6 lg:mb-10">
            <div className="bg-[#fef3e7] border-2 border-[#92400e] rounded-2xl shadow-md hover:shadow-xl 
                            transition-all duration-300 p-4 sm:p-6 flex flex-col items-center justify-center w-full">
              <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#78350f] mb-2 sm:mb-3 flex items-center gap-2 font-heading">
                  Upload PDF
                </h4>
              <PDFUpload
                setSummary={setSummary}
                length={length}
                loading={loading}
                setLoading={setLoading}
                token={token}
              />
              <p className="text-xs sm:text-sm text-[#4b2e14] mt-1 sm:mt-2">
                Supported format: <span className="font-medium text-[#b45309]">.pdf</span>
              </p>
            </div>
          </div>

        
          <div className="bg-[#fdf5ec] shadow-xl p-4 sm:p-6 lg:p-6 rounded-3xl border border-[#92400e] w-full max-w-2xl">
            <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 text-[#78350f] font-heading">
              Text Box
            </h2>

            <textarea
              rows="10"
              placeholder="Enter your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="bg-[#fef7e7] border-2 border-[#b45309] focus:border-[#92400e] focus:ring-2 
                         focus:ring-[#b45309] outline-none rounded-xl w-full p-3 sm:p-4 resize-none transition-all duration-300 text-[#4b2e14] font-body"
            />

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5 mt-3 sm:mt-4">
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="bg-[#fcd34d] text-[#78350f] font-medium px-4 sm:px-5 py-2 border-2 border-[#b45309] 
                           rounded-full shadow-sm hover:bg-[#fbbf24] focus:ring-2 focus:ring-[#92400e] transition-all duration-300 font-body"
              >
                <option value="m">Medium</option>
                <option value="s">Small</option>
                <option value="l">Large</option>
              </select>

              <button
                onClick={handleSummariser}
                className="bg-[#b45309] hover:bg-[#78350f] text-white font-semibold px-8 sm:px-10 py-2 sm:py-3 
                           rounded-lg shadow-md transition-transform duration-300 hover:scale-105 font-body w-full sm:w-auto"
              >
                {loading ? "Generating..." : "Generate Summary"}
              </button>
            </div>

            <textarea
              rows="5"
              readOnly
              value={loading ? "Loading summary..." : summary}
              className="bg-[#fef7e7] text-[#4b2e14] border-2 border-[#b45309] rounded-xl 
                         w-full p-3 sm:p-4 mt-4 sm:mt-6 resize-none focus:outline-none font-body"
            />
          </div>
        </>
      ) : (
        <Login setToken={setToken} />
      )}
    </div>
  </div>
);


}