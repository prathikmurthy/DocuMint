"use client"

// Check if you're logged in

import axios, { AxiosError } from "axios";
// import OpenAI from "openai";
import { useEffect, useState} from "react";

import { useEditor, EditorContent } from '@tiptap/react'

import styles from './page.module.css'
import { Editor } from "@tiptap/core";
import StarterKit from '@tiptap/starter-kit'
import Markdown from 'react-markdown'
import { Button } from "@mantine/core";
//@ts-ignore
// import { Markdown } from 'tiptap-markdown'

// Fetch all repositories owned by your account

// Displa

async function getData() {
    const res = await fetch("https://meowfacts.herokuapp.com/")

    if (!res.ok) {
        throw new Error("Failed to fetch")
    }

    return res.json()
}

const page = () => {
    // const data = await getData()
    const [data, setData] = useState("null")
    const [loading, setLoading] = useState(true)


    return (
        <div className={styles.markdown}><Markdown>{data}</Markdown></div> 
    )
}
const DownloadButton = ({ textOutput }: { textOutput: string }) => {
    const file = new Blob([textOutput], { type: 'text/plain' });

    return (
        <Button variant="outlined">
            <a download="sample.txt" target="_blank" rel="noreferrer" href={URL.createObjectURL(file)} style={{
                textDecoration: "inherit",
                color: "inherit",
            }}>Download</a>
        </Button>
    )
}


export default page;