import { NextResponse } from "next/server";
import {JSDOM} from "jsdom";
import iconv from "iconv-lite";

export const runtime = "nodejs";

export async function GET(req: Request) {
    try {
        const {searchParams} = new URL(req.url);
        const word = searchParams.get("word");

        if(!word) {
            return NextResponse.json({error: "Missing 'word' query parameter"}, {status: 400});
        }

        const res = await fetch(`https://cs.wiktionary.org/w/api.php?action=parse&format=json&page=${word}&origin=*`);

        if(!res.ok) {
            throw new Error(`Wiktionary request failed with status ${res.status}`);
        }
//        const buffer = await res.arrayBuffer();
  //      const text = iconv.decode(Buffer.from(buffer), "utf-8");
        //const data = JSON.parse(text);
        const data = await res.json();

        const html = data?.parse?.text?.["*"];
        if(!html) {
            return NextResponse.json({error: "No html"});
        }

        const dom = new JSDOM(html);
        const doc = dom.window.document;

        const partOfSpeech = Array.from(doc.querySelectorAll("h3, h4"))
            .map(el => el.textContent?.trim())
            .filter(t => /(podstatné jméno|sloveso|přídavné jméno|příslovce|zájmeno|číslovka)/i.test(t ?? ""));

        if(partOfSpeech[0] !== "podstatné jméno") {
            return NextResponse.json({
                word: word,
                error: "Not a noun",
            });
        }

        /*const headings = Array.from(doc.querySelectorAll("h3, h4"));

        const partOfSpeech: string[] = [];
        const gender: string[] = [];

        headings.forEach((el) => {
            const text = el.textContent?.trim().toLowerCase() ?? "";

            if(/(podstatné jméno|sloveso|přídavné jméno|příslovce|zájmeno|číslovka)/i.test(text)){
                partOfSpeech.push(text);

                let next = el.nextElementSibling;
                for(let i = 0; i < 3 && next; i++){
                    const content = next.textContent?.trim().toLowerCase() ?? "";

                    if(/rod\s+(mužský|ženský|střední)/i.test(content)) {
                        gender.push(content.match(/rod\s+(mužský|ženský|střední)/i)?.[1] ?? "");
                        break;
                    }
                    next = next.nextElementSibling;
                }
                
            }
        })*/
        
        const declension: Record<string, {singular: string, plural: string,}> = {};
        const declTable = doc.querySelectorAll("table.deklinace");
        if(declTable) {
            const rows = declTable[0].querySelectorAll("tr");
            rows.forEach(row => {
                const th = row.querySelector("th");
                const tds = row.querySelectorAll("td");
                if(th && tds.length === 2) {
                    const caseName = th.textContent?.trim() ?? "";
                    const singular = tds[0].textContent?.trim() ?? "";
                    const plural = tds[1].textContent?.trim() ?? "";

                    declension[caseName] = {singular, plural};
                }
            })
        }

        return NextResponse.json({
            word, 
            partOfSpeech,
            //gender,
            declension,
        });
    } catch(err: unknown) {
        console.log("Api error: ", err);
        const message = err instanceof Error ? err.message : "Unknown Error";
        return NextResponse.json({error: message}, {status: 500});
    }
}