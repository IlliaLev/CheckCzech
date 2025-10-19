"use client";

import {useState} from "react";

import Divider from "@/ui/divider";

type WordData = {
  word: string,
  declension: Record<string, {singular: string, plural: string,}>,
}

export default function Home() {
  const [word, setWord] = useState("");
  const [data, setData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(false);
  //const [error, setError] = useState<string | null>(null);

  async function fetchWord() {
    if(!word.trim()) return;

    
    setLoading(true);
    //setError(null);

    try {
      const res = await fetch(`/api/info?word=${word}`);
      const json = (await res.json()) as WordData & {error?: string,};

      if(!res.ok) throw new Error(json.error || "Unknown Error");
      setData(json);
    } catch(err) {
      //setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.log(err);
      setData(null);
    } finally {
      setLoading(false);
      setWord("");
    }
  }

  return (
    <main className={`
      flex flex-col gap-10 items-center
      w-[500px] h-[500px]
      min-w-[500px] min-h-[500px]
      bg-white/20
      sm:text-2xl
      sm:w-[600px] sm:h-[600px]
      sm:min-w-[600px] sm:min-h-[600px]
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
          mt-5 gap-3
          `}>
          <input type="text" value={word} onChange={(e) => setWord(e.target.value)} className={`
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
        <Divider mt="2" />
      </div>
      {data && (
        <div className={`
          flex flex-col items-center
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
