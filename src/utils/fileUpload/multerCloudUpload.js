import multer, { diskStorage } from "multer";
import path from "path";
import mime from "mime-types"
import { fileTypeFromBuffer } from "file-type";
import fs from "fs";

export const fileTypes = {
    images: ["image/jpeg", "image/png", "image/jpg"],
    videos: ["video/mp4", "video/quicktime"],
    documents: ["application/pdf", "application/msword"]
}
const allowedExtensions = ["jpeg", "png", "jpg"]
const fileSizeLimits = {
    images: 2 * 1024 * 1024,      // 2MB for images
    videos: 10 * 1024 * 1024,     // 10MB for videos
    documents: 5 * 1024 * 1024    // 5MB for documents
};
export function uploadCloud(fileType) {
    const storage = diskStorage({}); 
    const fileFilter = (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
        const mimeType = mime.lookup(file.originalname);
        if (!allowedExtensions.includes(ext) || !fileType.includes(mimeType)) {
            return cb(new Error(`only files of types ${allowedExtensions} are allowed`), false);
        }
        cb(null, true);
    }
    let maxFileSize = fileSizeLimits.images; 
    if (fileType === fileTypes.videos) maxFileSize = fileSizeLimits.videos;
    else if (fileType === fileTypes.documents) maxFileSize = fileSizeLimits.documents;
    const multerUpload = multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxFileSize
        }
    });
    return multerUpload;
}

export const validateFileSignature = async (filePath, fileTypes) => {
    const buffer = fs.readFileSync(filePath);
    const fileType = await fileTypeFromBuffer(buffer);

    if (!fileType || !fileTypes.includes(fileType.mime)) {
        throw new Error("Invalid file signature");
    }
};


