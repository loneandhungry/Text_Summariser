import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import './index.css';

export function Upload({ setSummary }) {
  const [data, setData] = useState(null);

  async function handleUpload() {
    const formData = new FormData();
    const token = localStorage.getItem("token");
    if (data) {
      formData.append('file', data);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/summarise",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSummary(res.data.summary);
      alert("File uploaded successfully!");
    } catch (err) {
      alert("Problem sending file to backend");
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <label className="text-amber-800 font-medium">Upload PDF:</label>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setData(e.target.files[0])}
        className="text-sm text-amber-900 border border-amber-400 rounded-md px-3 py-1 
                   bg-yellow-50 hover:bg-yellow-100 transition-all duration-300 cursor-pointer"
      />
      <button
        onClick={handleUpload}
        className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-5 py-2 
                   rounded-full shadow-md transition-transform duration-300 hover:scale-105 self-center"
      >
        Upload
      </button>
    </div>
  );
}

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
            alert("Logged in! Token saved.");
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
  const [length, setLength] = useState("m");
  const [loading, setLoading] = useState(false);

  async function handleSummariser() {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      alert("Please login first");
      return;
    }

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
      alert("Error generating summary.");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-row justify-between items-center min-h-screen bg-[#fff8dc] px-16 overflow-hidden">
      {/* Left side - message */}
      <div className="w-1/2 flex flex-col justify-center items-start space-y-8 animate-[floatIn_2s_ease-in-out]">
        <h1 className="text-8xl font-extrabold text-amber-900 leading-tight tracking-tight animate-[bounceIn_2.5s_ease-in-out]">
          Read Less.<br />
          <span className="text-yellow-600">Learn More.</span>
        </h1>
        <p className="text-2xl text-amber-700 font-light tracking-wide">
          Let your words turn into clarity — right here.
        </p>
      </div>

      {/* Right side - single summariser card */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-[#fffdf5] p-10 rounded-3xl border border-amber-300 shadow-lg hover:shadow-2xl transition-all duration-500">
        <h1 className="text-4xl font-extrabold text-yellow-700 mb-6">Text Summariser</h1>

        {token ? (
          <>
            {/* Upload + Logout */}
            <div className="flex items-center justify-between w-full max-w-2xl mb-6">
              <Upload setSummary={setSummary} />
              <LogOut setToken={setToken} />
            </div>

            {/* Unified summariser section */}
            <div className="bg-[#fffaf0] shadow-xl p-6 rounded-3xl border border-amber-300 w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-center mb-4 text-amber-800">
                Generate a Summary (Text or PDF)
              </h2>

              <textarea
                rows="12"
                placeholder="Enter your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="bg-[#fff8e1] border-2 border-amber-400 focus:border-yellow-600 focus:ring-2 
                           focus:ring-amber-300 outline-none rounded-xl w-full p-3 resize-none transition-all duration-300"
              />

              <div className="flex justify-center items-center gap-5 mt-4">
                <select
                  onChange={(e) => setLength(e.target.value)}
                  className="bg-yellow-100 text-amber-900 font-medium px-5 py-2 border-2 border-yellow-600 
                             rounded-full shadow-sm hover:bg-yellow-200 focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
                >
                  <option value="m">Medium</option>
                  <option value="s">Small</option>
                  <option value="l">Large</option>
                </select>

                <button
                  onClick={handleSummariser}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-2 
                             rounded-full shadow-md transition-transform duration-300 hover:scale-105"
                >
                  {loading ? "Generating..." : "Generate Summary"}
                </button>
              </div>

              <textarea
                rows="6"
                readOnly
                value={loading ? "Loading summary..." : summary}
                className="bg-[#fffde7] text-gray-800 border-2 border-amber-400 rounded-xl 
                           w-full p-3 mt-6 resize-none focus:outline-none"
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
