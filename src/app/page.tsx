"use client";

import {useState} from "react";

type WordData = {
  word: string,
  partOfSpeech: string[],
  declension: Record<string, {singular: string, plural: string,}>,
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
      const res = await fetch(`/api/info?word=${word}`);
      const json = (await res.json()) as WordData & {error?: string,};

      if(!res.ok) throw new Error(json.error || "Unknown Error");
      setData(json);
    } catch(err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={`
      flex flex-col
    `}>
      <div className={`
        flex flex-row
        `}>
        <input type="text" value={word} onChange={(e) => setWord(e.target.value)}/>
        <button onClick={fetchWord} disabled={loading}>    
          {loading ? "Nacitam" : "Hledat"}
        </button>
      </div>

      {data && (
        <div>
          <h2>{data.word}</h2>

          {data.partOfSpeech?.length > 0 && (
            <p>{data.partOfSpeech[0]}</p>
          )}

          {data.declension && Object.keys(data.declension).length > 0 && (
            <>
              <h3>Skloňování</h3>
              <table>
                <thead>
                  <tr>
                    <th>Pád</th>
                    <th>Jednotné číslo</th>
                    <th>Množne číslo</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.declension).map(([caseName, forms]) => (
                    <tr key={caseName}>
                      <td>{caseName}</td>
                      <td>{forms.singular}</td>
                      <td>{forms.plural}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </main>
  );
}
