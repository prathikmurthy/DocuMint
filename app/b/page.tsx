"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import bg from '@/public/bg6.png'
import { Dropzone, DropzoneProps, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Button, Group, Text, rem, rgba } from '@mantine/core';
import { IconUpload, IconPhoto, IconX, IconBrandGithub, IconArrowRight, IconSourceCode } from '@tabler/icons-react';
import { redirect } from 'next/navigation'
import Link from 'next/link';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useRouter } from 'next/navigation'

export default function B() {
    const [saved, setSaved] = useLocalStorage<string | ArrayBuffer | null>("saved", null);
    
    useEffect(() => {
        setSaved(null)
    }, [])

    return (
        <div>
            <Navbar />

            <div className='flex items-center justify-center h-screen w-screen bg-zinc-950'>
                <div className='w-4/5 backdrop-blur-2xl h-3/5 flex flex-row justify-evenly items-center '>
                    <div className='mr-4 bg-black w-[36rem] h-[30rem] hover:scale-110 transition-all'>
                        <GithubButton />
                    </div>
                    <div className='ml-4 bg-black w-[36rem] h-[30rem] hover:scale-110 transition-all'>
                        <FileUpload />
                    </div>
                </div>
            </div>
        </div>
    )
}

const GithubButton = () => {
    return (<div className='flex flex-col justify-evenly h-full m-2'>
        <div>
            <div className='flex flex-row justify-center'><IconBrandGithub className="mt-4 mr-4" style={{ width: rem(52), height: rem(52), color: 'white' }}
                stroke={1.5} /><h1 className="text-white text-4xl text-center font-bold pt-6 pb-4">GitHub</h1></div>
            <p className='text-slate-400 font-light italic text-2xl text-center pl-24 pr-24 mb-16'>Connect your GitHub account to generate documentation for a repository</p>
        </div>
        <div className='ml-24 mr-24 mb-28'>
            <Button fullWidth color='teal' size="xl" rightSection={<IconArrowRight size={24} /> }>Connect to GitHub</Button>
        </div>
        
    </div>)
}

const FileUpload = (props: Partial<DropzoneProps>) => {
    "use client"
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useLocalStorage<string | ArrayBuffer | null>("saved", null);

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setLoading(true)
        console.log(acceptedFiles)
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()
            
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const i = reader.result
                setSaved(i)
                router.push('/c')
            }
            reader.readAsText(file)
            // reader.readAsArrayBuffer(file)

        })



        setLoading(false)

    }, [])

    return ( <div className='flex flex-col justify-evenly h-full m-2'>
        <div>
            <div className='flex flex-row justify-center'><IconUpload className="mt-4 mr-4" style={{ width: rem(52), height: rem(52), color: 'white' }}
                stroke={1.5} /><h1 className="text-white text-4xl text-center font-bold pt-6 pb-4">File Upload</h1></div>
            <p className='text-slate-400 font-light italic text-2xl text-center'>Drag a file or files into the space below to generate documentation</p>
        </div>
        <Dropzone
            loading={loading}
            onDrop={(file) => onDrop(file)}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={3 * 1024 ** 2}
            maxFiles={1}
            styles={{ root: { backgroundColor: rgba("#FFFFFF", 0), color: rgba("#55B589", 1), borderColor: rgba("#55B589", 1) }}}
            // accept={IMAGE_MIME_TYPE}
            
            {...props}
        >
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                {/* <Dropzone.Accept>
                    <IconUpload
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Reject> */}
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
    </div> )
}