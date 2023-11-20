import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {ReactNode} from "react";

export enum EntryType {
    Repository = "Please select a repository: ",
    File = "Select a File to Generate Documentation For"
}

type Props = {
    type: EntryType;
    children: ReactNode;
}

export default async ({type, children}: Props) => {
    const session = await getServerSession(authOptions);
    const firstName = session?.user?.name?.split(" ")[0] ?? "User";

    return (
        <div className='flex align-items-center text-white h-screen w-screen bg-zinc-950'>
            <div className='w-screen backdrop-blur-2xl justify-evenly items-center mx-64 mt-48'>
                <h1 className={"text-5xl"}>Welcome, <span style={{color: "#298F64"}}>{firstName}</span></h1>
                <h2 className={"text-2xl mb-2 py-6 font-light"} style={{color: "#9A9A9A", fontStyle: "italic"}}>{type}</h2>
                <div className={"bg-[#181818] min-h-screen rounded-2xl shadow-2xl shadow-[#298F64] drop-shadow-md"}>
                    {children}
                </div>
            </div>
        </div>
    )
};