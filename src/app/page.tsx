"use client";

import {useState} from "react";

import Divider from "@/ui/divider";

type WordData = {
  word: string,
  declension: Record<string, {singular: string, plural: string,}>,
  error?: string,
}

export default function Home() {
  const [word, setWord] = useState("");
  const [data, setData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchWord() {
    if(!word.trim()) return;

    
    setLoading(true);
    setError(null);

    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      const res = await fetch(`${baseURL}/api/info?word=${encodeURIComponent(word)}`);
      const json = (await res.json()) as WordData;

      setData(json);
      if(json.error === "No html") throw new Error("Zadejte podstatné jméno");
      else if(json.error === "Not a noun") throw new Error("Zadejte podstatné jméno.");
    } catch(err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      setData(null);
    } finally {
      setLoading(false);
      setWord("");
    }
  }

  return (
    <main className={`
      flex flex-col gap-10 items-center
      w-[80%] h-[80%]
      mt-3 mb-3
      bg-white/20
      sm:text-2xl
      md:w-[600px] md:h-[600px]
      md:min-w-[600px] md:min-h-[600px]
      rounded-3xl
    
      shadow-2xl shadow-white/40
    `}>
      <div className={`
        w-full
        flex flex-col items-center
        `}>
        <h1 className={`
          font-bold text-3xl
          mt-7
          `}>CheckCzech</h1>
        <div className={`
          flex flex-row
          mt-5 gap-3 mb-2
          `}>
          <input type="text" value={word} onChange={(e) => setWord(e.target.value)} placeholder="Zadejte podstatné jméno" className={`
              outline-none
              bg-white/40
              px-3 py-1
              rounded-2xl
            `}/>
          <button onClick={fetchWord} disabled={loading} className={`
              bg-white/40
              min-w-[120px]
              rounded-2xl
              
            `}>    
            {loading ? "Načítám" : "Hledat"}
          </button>
        </div>
        <Divider/>
      </div>
      {error && (
        <div>
          <h2 className={`
            font-semibold text-[#320E3B]
            drop-shadow-sm drop-shadow-[#FF0035]
            `}>{error}</h2>
        </div>
      )}
      {data && (
        <div className={`
          flex flex-col items-center
          ml-2 mb-4 mr-2
        `}>

          {data.declension && Object.keys(data.declension).length > 0 && (
            <>
              <h3 className={`
                font-bold mb-5
                `}>Skloňování slova {data.word}</h3>
              <div className={`
                rounded-lg border-2
                p-2
                `}>
              <table className={`
                
                `}>
                <thead>
                  <tr>
                    <th className="px-3 py-1 font-semibold">Pád</th>
                    <th className="px-3 py-1 font-semibold">Jednotné číslo</th>
                    <th className="px-3 py-1 font-semibold">Množne číslo</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.declension).map(([caseName, forms]) => (
                    <tr key={caseName} className={`

                    `}>
                      <td className="px-3 py-1">{caseName}</td>
                      <td className="px-3 py-1">{forms.singular}</td>
                      <td className="px-3 py-1">{forms.plural}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}
