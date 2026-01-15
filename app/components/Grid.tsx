"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from "next/navigation";

type ImageItem = {
    id: number;
    src: string;
    file: File;
};

const ImageGrid = () => {
    const [ idValue, setId ] = useState<number>(1111);
    const [ urls, setUrls ] = useState<string[]>([]);
    const [ images, setImages ] = useState<ImageItem[]>([]);
    const [ viewing, setViewing ] = useState<ImageItem | null>(null);
    const [ filesState, setFiles ] = useState<ImageItem[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean | null>(false);
    const [ supabase, setSupabase ] = useState<SupabaseClient | null>(null);
    const [ session, setSession ] = useState<Session | null>(null);
    const [ token, setToken ] = useState<string>("");
    const router = useRouter();
    async function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        
        const url = URL.createObjectURL(file)

        setFiles(prev => [...prev, {id: idValue, src: url, file: file}]);
        setId(idValue + 1);
    }

    async function removeFile(url: string) {
        const formData = new FormData();
        formData.append("path", "/api/delete");
        formData.append("url", url);
        const res = await fetch("/api/delete", { method: "POST", credentials: "include", body: formData });
        handleList();
    }

    async function handleList() {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("path", "/api/list");
        const response = await fetch("/api/router", { method: "POST", credentials: "include", body: formData });
        setIsLoading(false);
        if (response.status === 200) {
            const { data } = await response.json();
            setUrls(data);
        } else {
            router.push("/login");
        }
    }

    async function uploadPicture() {
        for (let i = 0; i < filesState.length; i++) {
            const formData = new FormData();
            formData.append("image" + filesState[i].id , filesState[i].file);
            if (filesState[i].file.name.toLowerCase().includes(".jpg") || filesState[i].file.name.toLowerCase().includes(".jpeg")) {
                formData.append("format", "jpeg");
            } else if (filesState[i].file.name.toLowerCase().includes(".png")) {
                formData.append("format", "png");
            } else if (filesState[i].file.name.toLowerCase().includes(".gif")) {
                formData.append("format", "gif");
            }
            const response = await fetch("/api/upload", { method: "POST", credentials: "include", body: formData });        
        }
        setFiles([]);
        handleList();
    }

    useEffect(()=>{
        handleList();
    }, []);

    return (
            <div style={{ padding: "80px" }}>
                <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
                <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                    <input
                    type="file"
                    accept=".jpg,.png,.gif"
                    onChange={handleChange}
                    className="hidden"
                    />
                    <span className="text-sm text-blue-600 hover:underline">
                    Choose image
                    </span>
                </label>

                <button
                    onClick={uploadPicture}
                    className="text-sm text-gray-700 hover:text-black disabled:opacity-50"
                >
                    Upload
                </button>
                </div>

                </div>

                <br/>
                <div
                    style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: "10px",
                    }}
                >
                    {filesState.map((file, index) => (
                    <div key={index} style={{ border: "1px solid #ccc", padding: "5px" }}>
                        <img
                        src={file.src}
                        alt={`img-${index}`}
                        style={{ width: "100%", height: "auto", display: "block" }}
                        />
                    </div>
                    ))}
                </div>
                <br/>
                <div
                    style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: "10px",
                    }}
                >
                    {urls.map((url, index) => (
                    <div key={index} style={{ border: "1px solid #ccc", padding: "5px" }}>
                        <img
                        src={url}
                        alt={`img-${index}`}
                        style={{ width: "100%", height: "auto", display: "block" }}
                        />
                        <div
                            key={index}
                            className="relative bg-gray-200 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                            <button
                                onClick={() => removeFile(url)}
                                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-400 hover:text-white transition-colors duration-200"
                            >
                                ×
                            </button>
                            </div>

                    </div>
                    ))}
                </div>
            </div>

    );
}

export default ImageGrid;
function streamToString(arg0: ReadableStream<Uint8Array<ArrayBuffer>>) {
    throw new Error("Function not implemented.");
}

