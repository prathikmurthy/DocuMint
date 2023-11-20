import axios from "axios";
import { NextResponse } from "next/server"
import OpenAI from "openai";
type ResponseData = {
    message: string
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET(req: Request) {

    const tempOwner = '';
    const tempOwner_other = ''

    const tempRepoPublic = '';
    const tempRepoPrivate = '';
    const tempRepoPrivate_other = ''

    const tempFilePublic = 'one/hello.md';
    const tempFilePrivate = 'counter.js';

    const tempBranch = 'main';
    const tempBranch_other = 'number2';

    async function fetchGithubFileContent(owner: string, repo: string, branch: string, filePath: string, accessToken: string) {
        const headers = accessToken ? { 'Authorization': `token ${accessToken}` } : {};
        const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;

        try {
            const response = await axios.get(fileUrl, { headers });
            return Buffer.from(response.data.content, 'base64').toString('utf-8');
        } catch (error: any) {
            return `Error fetching file: ${error.message}`;
        }
    }
    console.log("STARTING")
    const data = await fetchGithubFileContent(tempOwner, tempRepoPrivate, 'main', tempFilePrivate, tempToken);
    console.log(data)
    const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You will be supplied with code, you should create a Markdown formatted README for documentation, and return that markdown code in raw text." },
            { role: "user", content: data }],
            model: "gpt-3.5-turbo",
    });
    console.log(completion)


    return NextResponse.json({"data": completion.choices[0].message.content})
}
