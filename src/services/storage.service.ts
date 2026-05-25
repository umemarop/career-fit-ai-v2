import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

type StoredFile = {
  url: string;
  key: string;
};

const UPLOADS_DIR = "uploads";
const AVATARS_DIR = "avatars";
const RESUMES_DIR = "resumes";

const AVATAR_SIZE = 500;
const AVATAR_QUALITY = 80;

const ensureDir = async (dirPath: string) => {
  await fs.mkdir(dirPath, { recursive: true });
};

const buildLocalFileUrl = (key: string) => {
  return `/${UPLOADS_DIR}/${key}`;
};

const buildLocalFilePath = (key: string) => {
  return path.join(process.cwd(), UPLOADS_DIR, key);
};

export const saveAvatar = async (
  userId: string,
  file: Express.Multer.File,
): Promise<StoredFile> => {
  const filename = `avatar-${userId}-${Date.now()}.webp`;
  const key = path.posix.join(AVATARS_DIR, filename);

  const filePath = buildLocalFilePath(key);
  const dirPath = path.dirname(filePath);

  await ensureDir(dirPath);

  await sharp(file.buffer)
    .resize(AVATAR_SIZE, AVATAR_SIZE, {
      fit: "cover",
      position: "center",
    })
    .webp({ quality: AVATAR_QUALITY })
    .toFile(filePath);

  return {
    url: buildLocalFileUrl(key),
    key,
  };
};

export const saveResume = async (
  userId: string,
  file: Express.Multer.File,
): Promise<StoredFile> => {
  const filename = `resume-${userId}-${Date.now()}.pdf`;
  const key = path.posix.join(RESUMES_DIR, filename);

  const filePath = buildLocalFilePath(key);
  const dirPath = path.dirname(filePath);

  await ensureDir(dirPath);

  await fs.writeFile(filePath, file.buffer);

  return {
    url: buildLocalFileUrl(key),
    key,
  };
};

export const deleteLocalFileByUrl = async (
  fileUrl: string | null | undefined,
): Promise<void> => {
  if (!fileUrl) return;

  const prefix = `/${UPLOADS_DIR}/`;

  if (!fileUrl.startsWith(prefix)) {
    return;
  }

  const key = fileUrl.slice(prefix.length);
  const filePath = buildLocalFilePath(key);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete local file: ${filePath}`, error);
  }
};
