import axios from "axios";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server"
import OpenAI from "openai";
type ResponseData = {
    message: string
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });



export async function POST(req: Request) {

    console.log("STARTING")
    // const data = await fetchGithubFileContent(tempOwner, tempRepoPrivate, 'main', tempFilePrivate, tempToken);
    const data = await req.text();    
    console.log(data)

    if (data.length == 0) {
        return NextResponse.json({ "data": "No generation found yet..." })
    }

    // console.log(req.body)

    // return NextResponse.json({"data": "hello"})

    console.log("STARTING OPENAI CALL")
    
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You will be supplied with code, you should create a Markdown formatted README for documentation, and return that markdown code in raw text." },
        { role: "user", content: data.toString() }],
        model: "gpt-4-1106-preview",
    });
    console.log(completion)


    return NextResponse.json({ "data": completion.choices[0].message.content })

}
