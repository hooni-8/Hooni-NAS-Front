/* 단일 파일 다운로드 Action */
import * as manager from "@provider/file/DownloadManager";

export const SingleDownloadFileAction = (file) => {

    try {
        
        // 추후에 다른 로직이 추가 될수도 있기에 Action 별도로 구현
        
        manager.download('/nas/api/v1/download/single', {fileId: file.itemId, folderId: file.parentId});
        
    } catch (e) {
        console.error(e);
    }
}