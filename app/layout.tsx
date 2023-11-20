import './globals.css'
import {Inter} from 'next/font/google'
import {getServerSession} from "next-auth";
import ContextProvider from "@/app/components/ContextProvider";
import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/dropzone/styles.css';


const theme = createTheme({
    /** Put your mantine theme override here */
});
const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default async function RootLayout({children}: {children: any}) {
    const session = await getServerSession();

    return (
        <html lang="en">
        <body className={inter.className}>
            <MantineProvider theme={theme}>
                <ContextProvider session={session}>
                    {children}
                </ContextProvider>
            </MantineProvider>
        </body>
        </html>
    )
}
