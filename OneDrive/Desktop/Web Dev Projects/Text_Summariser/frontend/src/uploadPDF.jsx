
///NOT USED IN THE PROJECT YET


import axios from "axios";
import { useState } from "react";

export function PDFUpload({setSummary, length, setLoading, token,loading}){
    const [file,setFile] = useState(null);
    async function HandlePDFUpload(file){
       
        const formData = new FormData();
        formData.append("file",file);
        formData.append("length",length);
        try{
            setLoading(true);
        const res = await axios.post("http://localhost:5000/summarise",
            formData,
           { headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }})
        setSummary(res.data.summary);
         alert("File successfully uploaded and summarised down (down of the page).");
    } catch (err) {
      console.log(err);
      alert("Problem in uploading the PDF");
    } finally {
      setLoading(false);
    }
  }

    return (
    <div className="flex flex-col items-center gap-3 p-4 bg-[#fffaf0] rounded-2xl border border-amber-300 shadow-md">
      <h3 className="text-lg font-semibold text-amber-800">Upload a PDF to Summarise</h3>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full text-sm text-amber-800 border border-yellow-600 rounded-lg cursor-pointer bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <button
        onClick={ () => HandlePDFUpload(file)}
        disabled={loading}
        className={`mt-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition-transform duration-300 ${
          loading ? "opacity-60 cursor-not-allowed" : "hover:scale-105"
        }`}
      >
        {loading ? "Uploading..." : "Upload & Summarise"}
      </button>
    </div>
  );
}
    
