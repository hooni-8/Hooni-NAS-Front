import { createContext, useContext, useState } from "react";

import * as gateway from "@components/common/Gateway";

const UploadContext = createContext(null);

let RUNNING_COUNT = 0;
const MAX_CONCURRENCY = 3;

export const UploadProvider = ({ children }) => {
    const [files, setFiles] = useState([]);
    const [queue, setQueue] = useState([]);

    // 파일 등록
    const addFiles = (files) => {
        setFiles(prev => [...prev, ...files]);
    }

    // 파일 상태 업데이트
    const updateFile = (id, updates) => {
        setFiles(prev =>
            prev.map(f => (f.id === id ? { ...f, ...updates } : f))
        );
    };

    // 파일 상태 업데이트
    const pendingToReadyUpdateFile = () => {
        setFiles(prev =>
            prev.map(f => f.status === "PENDING" ?  ({ ...f, status: "READY"}) : f))
    };

    const pendingFiles = files.filter(f => f.status === "PENDING");
    const readyFiles = files.filter(f => f.status === "READY");
    const uploadingFiles = files.filter(f => f.status === "LOADING");
    const successFiles = files.filter(f => f.status === "SUCCESS");
    const errorFiles = files.filter(f => f.status === "ERROR");

    const uploadSingleFile = async (fileItem) => {

        // 업로드 시작 상태 업데이트
        updateFile(fileItem.id, { status: "LOADING", progress: 0 });

        const payload = { folderId: "860ce165-cddc-0d62-406b-023d02dbd04c" };
        const formData = new FormData();
        formData.append("files", fileItem.file);
        formData.append("fileRequest", new Blob([JSON.stringify(payload)], { type: "application/json" }));

        try {
            await gateway.post("/nas/api/v1/file/upload", formData, {
                onUploadProgress: (e) => {
                    const percent = e.total ? Math.round((e.loaded * 100) / e.total) : 0;

                    // 파일별 퍼센트 업데이트
                    updateFile(fileItem.id, { progress: percent });
                }
            });

            // 완료 처리
            updateFile(fileItem.id, { status: "SUCCESS", progress: 100 });

        } catch (e) {
            console.error(e);
            updateFile(fileItem.id, { status: "ERROR" });
        }
    };

    const processQueue = () => {
        // 이미 3개가 돌고 있으면 더 시작하지 않음
        if (RUNNING_COUNT >= MAX_CONCURRENCY) return;

        setQueue(prevQueue => {
            // 더 꺼낼 게 없으면 그대로 반환
            if (prevQueue.length === 0) return prevQueue;

            // 아직 슬롯이 남아 있을 때만 꺼냄
            const availableSlots = MAX_CONCURRENCY - RUNNING_COUNT;
            const toStart = prevQueue.slice(0, availableSlots);
            const rest    = prevQueue.slice(availableSlots);

            // 실제로 시작할 개수만큼 runningCount 증가
            RUNNING_COUNT += toStart.length;

            // 뽑힌 아이템들 업로드 시작
            toStart.forEach(fileItem => {
                uploadSingleFile(fileItem).finally(() => {
                    // 한 개 끝나면 runningCount 줄이고, 다시 큐 확인
                    RUNNING_COUNT = Math.max(RUNNING_COUNT - 1, 0);
                    processQueue(); // 빈 슬롯이 생겼으니 다시 채우기
                });
            });

            // 아직 안 꺼낸 나머지 큐 유지
            return rest;
        });
    };

    return (
        <UploadContext.Provider value={{
            files
            , setQueue
            , pendingFiles
            , readyFiles
            , uploadingFiles
            , successFiles
            , errorFiles
            , addFiles
            , pendingToReadyUpdateFile
            , processQueue
        }}>
            {children}
        </UploadContext.Provider>
    );
}

export const useUpload = () => useContext(UploadContext);