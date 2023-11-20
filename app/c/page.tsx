"use client"

import React, { useEffect, useState } from "react"
import styles from "./page.module.css"
import { useLocalStorage } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import Markdown from "react-markdown";

const renderSingleFile = (file: File) => {

    const [saved, setSaved] = useLocalStorage<string | undefined>("saved", undefined);

    const [input, setInput] = useState<string | undefined>(undefined);

    const [output, setOutput] = useState<string | undefined>(undefined)

    const [loading, setLoading] = useState<boolean>(true)

    const router = useRouter();
    
    useEffect(() => {
        if (saved) {
            setInput(saved)
        } else {
            router.push("/b")
        }
    })

    useEffect(() => {
        fetch("/api/generator/GenerateFromFile", {"method": "POST", "body": "hello"}).then((res) => res.json()).then((data) => {
            console.log(data)
            setOutput(data.data)
            setLoading(false)
        })
    }, [input])

    if (loading) return <div>Loading...</div>

    return (
        <div className={styles.markdown}><Markdown>{output}</Markdown></div> 
    )
}

export default renderSingleFile