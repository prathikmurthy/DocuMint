"use client";
import {signIn} from "next-auth/react";
import { IconArrowRight, IconBrandGithub, IconLeaf, IconSourceCode } from '@tabler/icons-react';
import { Button, Group, Text, rem, rgba } from '@mantine/core';
import { Dropzone, DropzoneProps, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useCallback, useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import styles from './page.module.css'

export default function Home(props: Partial<DropzoneProps>) {
    const [saved, setSaved] = useState(null);
    const[loading, setLoading] = useState(false)
    const [data, setData] = useState("")
    const [output, setOutput] = useState(null)
    const mainref = useRef(null)

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setLoading(true)
        console.log(acceptedFiles)
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()
            reader.readAsText(file, "UTF-8")
            reader.onload = (e) => {
                // console.log(e.target?.result)
                //@ts-ignore
                setData(e.target?.result)
            }
        })
    }, [])

    useEffect(() => {
        fetch("/api/generator/GenerateFromFile", {
            method: "POST",
            body: data
        }).then((res) => res.json()).then((out) => {
            console.log(out.data)
            console.log(JSON.stringify(out.data).replaceAll('"', ''));
            console.log(encodeURI(out.data));
            setOutput(out.data)
            setLoading(false)
        })
    }, [data])

    return (
        <div>

            <div ref={mainref} className='bg-gray-950 h-screen w-screen text-green-50 min-w-full' id="main">
                <div className='flex flex-row justify-between h-screen'>
                    <div className='mt-16 ml-32 mr-32'>
                        <div className='flex flex-row'>
                            <h1 className='font-bold text-8xl'>docu<span className='text-emerald-500'>Mint</span></h1>
                            <IconLeaf size={"8rem"} className='text-emerald-500 pb-8'/>
                        </div>
                        <div className='max-w-3xl pt-8 flex flex-col gap-12'>
                            <p className='text-4xl text-gray-400 font-light pl-2'>The <span className='text-emerald-500 font-bold'>fresh</span> way to document your code, powered by <span className='text-emerald-500'>AI</span>.</p>
                            <p className='text-2xl text-gray-400 font-light pl-2'>docu<span className='text-emerald-500'>Mint</span> makes it easy to generate custom documentation for your codebase. All built with the power of AI, helping you work faster and cutting down on code duplication and errors.</p>

                            <ul className='list-disc text-gray-400 text-2xl pl-8 flex flex-col gap-[2rem]'>
                                <li>Upload a file to the space on the right, and watch docu<span className="text-emerald-500">Mint</span> create the perfect documentation for you.</li>
                                <p className='font-bold text-center text-2xl mr-24 '>or</p>
                                <li>Connect with your GitHub account, and let docu<span className="text-emerald-500">Mint</span> help you create folder-level documentation. We'll even push it to your repo when we're done.</li>

                            </ul>
                        </div>
                    </div>
                    <div className='mr-32 mt-48 w-2/5 pb-24 gap-16 flex flex-col justify-evenly '>
                        <Dropzone
                            loading={loading}
                            onDrop={(file) => onDrop(file)}
                            onReject={(files) => console.log('rejected files', files)}
                            maxSize={3 * 1024 ** 2}
                            maxFiles={1}
                            styles={{ root: { backgroundColor: rgba("#FFFFFF", 0), color: rgba("#55B589", 1), borderColor: rgba("#55B589", 1), borderWidth: "4px" } }}
                            className='h-full'
                            // accept={IMAGE_MIME_TYPE}

                            {...props}
                        >
                            <Group justify="center" gap="xl" mih={300} style={{ pointerEvents: 'none' }}>
                                <Dropzone.Idle>
                                    <IconSourceCode
                                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                                        stroke={1.5}
                                    />
                                </Dropzone.Idle>

                                <div>
                                    <Text size="xl" inline>
                                        Drag files here or click to select
                                    </Text>
                                    <Text size="sm" c="dimmed" inline mt={7}>
                                        Attach as many files as you like, each file should not exceed 5mb
                                    </Text>
                                </div>
                            </Group>
                        </Dropzone>
                        <p className='font-bold text-center text-2xl'>or</p>
                        <div className='flex flex-col justify-evenly h-full m-2'>
                            {/* <div>
                                <div className='flex flex-row justify-center'><IconBrandGithub className="mt-4 mr-4" style={{ width: rem(52), height: rem(52), color: 'white' }}
                                    stroke={1.5} /><h1 className="text-white text-4xl text-center font-bold pt-6 pb-4">GitHub</h1></div>
                                <p className='text-slate-400 font-light italic text-2xl text-center pl-24 pr-24 mb-16'>Connect your GitHub account to generate documentation for a repository</p>
                            </div> */}
                            <div className='ml-24 mr-24 mb-28'>
                                <Button fullWidth color='teal' size="xl" rightSection={<IconArrowRight size={24} />} onClick={() => signIn()}>Connect to GitHub</Button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <h1 className='font-bold text-8xl text-center bg-gray-950 text-white'>Generated <span className='text-emerald-500'>Markdown</span></h1>
            <div className="h-screen w-screen bg-gray-950 flex flex-col justify-center items-center" id="renderer">
                <div className="bg-gray-800 w-3/5 h-4/5 overflow-scroll"><div className={styles.markdown}><Markdown>{output ? output : "No generation found yet..."}</Markdown></div></div>
            </div>
        </div>
    )
}
