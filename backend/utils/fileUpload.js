import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const uploadDirs = {
  products: path.join(__dirname, '..', 'uploads', 'products'),
  waste: path.join(__dirname, '..', 'uploads', 'waste'),
  users: path.join(__dirname, '..', 'uploads', 'users')
};

Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadType = req.body.uploadType || 'products';
    const uploadDir = uploadDirs[uploadType] || uploadDirs.products;
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Helper function to get file URL
export const getFileUrl = (filename, uploadType = 'products') => {
  if (!filename) return '';
  // If it's already a full URL, return as is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  // If it's a relative path starting with /, return as is (for existing photos)
  if (filename.startsWith('/')) {
    return filename;
  }
  // Otherwise, construct the path
  return `/uploads/${uploadType}/${filename}`;
};

// Helper function to delete file
export const deleteFile = (filePath) => {
  try {
    if (!filePath) return false;
    
    // Don't delete files from /photos (public folder) or external URLs
    if (filePath.startsWith('http://') || filePath.startsWith('https://') || filePath.startsWith('/photos/')) {
      return false;
    }
    
    // Handle paths like /uploads/products/filename.jpg
    let fullPath;
    if (filePath.startsWith('/uploads/')) {
      // Remove leading /uploads/ and construct full path
      const relativePath = filePath.replace('/uploads/', '');
      fullPath = path.join(__dirname, '..', 'uploads', relativePath);
    } else {
      // Assume it's already a relative path from uploads
      fullPath = path.join(__dirname, '..', 'uploads', filePath);
    }
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

export default upload;
