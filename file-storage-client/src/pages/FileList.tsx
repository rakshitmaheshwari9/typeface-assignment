import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
  Button,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  CloudUpload as CloudUploadIcon,
  FolderOff as FolderOffIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { fileAPI } from '../services/api';
import { fileMaxSize } from '../utils/constants';

interface File {
  id: string;
  createdDate: string;
  updatedDate: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  key: string;
  bucket: string;
  userId: string;
}

interface FileListResponse {
  files: File[];
  meta: {
    total: number;
    page: string;
    limit: string;
    totalPages: number;
  };
}

const FileList: React.FC = () => {
  const { logout } = useAuth();
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: FileListResponse= await fileAPI.getFiles(page, itemsPerPage);
      setFiles(response.files);
      setTotalFiles(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, file: File) => {
    setAnchorEl(event.currentTarget);
    setSelectedFile(file);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if(file?.size > fileMaxSize) {
        setError('File limit:- 10 MB');
        return;
    }
    setLoading(true);
    setError(null);
    try {
      await fileAPI.uploadFile(file);
      fetchFiles();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    try {
      const fileUrl = await fileAPI.previewFile(selectedFile.id);
      window.open(fileUrl, '_blank');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download file');
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const handleDownload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    try {
      const fileUrl = await fileAPI.previewFile(selectedFile.id);
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedFile.originalname;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download file');
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const handleDelete = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    try {
      await fileAPI.deleteFile(selectedFile.id);
      fetchFiles();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete file');
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const EmptyState = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center',
      }}
    >
      <FolderOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No Files Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Upload your first file to get started
      </Typography>
      <input
        type="file"
        id="file-upload-empty"
        style={{ display: 'none' }}
        onChange={handleUpload}
        disabled={loading}
      />
      <label htmlFor="file-upload-empty">
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          component="span"
          disabled={loading}
        >
          Upload File
        </Button>
      </label>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Files
        </Typography>
        <Box>
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            onChange={handleUpload}
            disabled={loading}
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              component="span"
              disabled={loading}
            >
              Upload File
            </Button>
          </label>
          <Button
            variant="outlined"
            color="secondary"
            onClick={logout}
            sx={{ ml: 2 }}
            disabled={loading}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : files?.length === 0 ? (
        <Paper elevation={3}>
          <EmptyState />
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Original Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Upload Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files?.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>{file.originalname}</TableCell>
                    <TableCell>{file.mimetype}</TableCell>
                    <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                    <TableCell>{new Date(file.createdDate).toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, file)}
                        size="small"
                        disabled={loading}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              disabled={loading}
            />
          </Box>
        </>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handlePreview} disabled={loading}>
          Preview
        </MenuItem>
        <MenuItem onClick={handleDownload} disabled={loading}>
          Download
        </MenuItem>
        <MenuItem onClick={handleDelete} disabled={loading}>
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default FileList; 