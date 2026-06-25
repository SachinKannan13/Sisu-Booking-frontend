import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X } from 'lucide-react';
import { uploadBook } from '../../lib/api.js';
import Button from '../ui/Button.jsx';
import toast from 'react-hot-toast';

export default function BookUpload({ onUploaded, onClose }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const ACCEPTED = ['application/pdf', 'application/epub+zip',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  const handleFile = (f) => {
    if (!ACCEPTED.includes(f.type)) {
      toast.error('Please upload a PDF, EPUB, or DOCX file');
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      toast.error('File must be under 50MB');
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('book', file);

    try {
      setUploading(true);
      const { data } = await uploadBook(formData);
      toast.success('Book uploaded! Analysis starting...');
      onUploaded?.(data.bookId);
      onClose?.();
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <motion.div
        animate={{ borderColor: dragging ? '#f5a623' : '#d6d2c7' }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
          dragging ? 'bg-[#f5a623]/5' : 'hover:bg-[#f3efe4]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.epub,.docx"
          className="hidden"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        />

        {file ? (
          <>
            <div className="w-12 h-12 bg-[#f5a623]/10 rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-[#f5a623]" />
            </div>
            <div className="text-center">
              <p className="text-[#1c1c1c] font-medium text-sm">{file.name}</p>
              <p className="text-[#5f5f5d] text-xs mt-1">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="absolute top-3 right-3 text-[#5f5f5d] hover:text-[#c85250]"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-[#f0ece1] rounded-xl flex items-center justify-center">
              <Upload size={24} className="text-[#5f5f5d]" />
            </div>
            <div className="text-center">
              <p className="text-[#1c1c1c] text-sm font-medium">Drop your book here</p>
              <p className="text-[#5f5f5d] text-xs mt-1">PDF, EPUB, or DOCX · Max 50MB</p>
            </div>
            <p className="text-[#8f8a80] text-xs">or click to browse</p>
          </>
        )}
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!file}
          loading={uploading}
        >
          Upload & Analyse
        </Button>
      </div>
    </div>
  );
}
