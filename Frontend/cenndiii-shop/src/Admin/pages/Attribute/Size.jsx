import * as React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Chip,
  IconButton,
  Modal,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { DataGrid } from '@mui/x-data-grid';
import { Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from "../../../security/Axios";


const EditSize = ({ open, onClose, onSave, data, existingNames = [] }) => {
  const [ten, setTen] = useState('');
  const [trangThai, setTrangThai] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (data) {
      setTen(data.ten);
      setTrangThai(data.trangThai);
      setError('');
    }
  }, [open, data]);

  const handleSave = () => {
    const cleanedInput = ten.trim().replace(',', '.');

    if (!cleanedInput) {
      setError('Tên kích cỡ không được để trống');
      return;
    }

    const parsed = parseFloat(cleanedInput);

    if (isNaN(parsed)) {
      setError('Kích cỡ không hợp lệ. Vui lòng nhập dạng: 35 đến 43, chỉ chấp nhận .5');
      return;
    }

    // Kiểm tra khoảng giá trị
    if (parsed < 35 || parsed > 43) {
      setError('Kích cỡ phải nằm trong khoảng từ 35 đến 43');
      return;
    }

    // Kiểm tra nếu có phần thập phân thì chỉ được là .5
    const decimalPart = parsed % 1;
    if (decimalPart !== 0 && decimalPart !== 0.5) {
      setError('Chỉ chấp nhận số thập phân là .5 (ví dụ: 35.5)');
      return;
    }

    // Format lại cho chuẩn: bỏ .0 nếu là số nguyên
    const normalizedTen = Number.isInteger(parsed)
      ? parsed.toString()
      : parsed.toFixed(1).replace(/\.0$/, '');

    const currentTen = data?.ten?.toLowerCase();

    if (
      existingNames
        .map((item) => item.ten.toLowerCase())
        .includes(normalizedTen.toLowerCase()) &&
      normalizedTen.toLowerCase() !== currentTen
    ) {
      setError('Tên kích cỡ đã tồn tại');
      return;
    }

    setError('');
    onSave({ ...data, ten: normalizedTen, trangThai });
  };


  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#fff',
          color: '#000',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: 400,
        }}
      >
        <Typography variant="h6" mb={2}>
          Sửa kích cỡ
        </Typography>

        <TextField
          fullWidth
          label="Tên kích cỡ"
          value={ten}
          onChange={(e) => setTen(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={trangThai}
              onChange={(e) => setTrangThai(e.target.checked)}
            />
          }
          label="Đang bán"
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="outlined" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Xác nhận
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const vietnameseLocaleText = {
  noRowsLabel: 'Không có dữ liệu',
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Hiển thị cột',
  columnMenuFilter: 'Bộ lọc',
  columnMenuHideColumn: 'Ẩn cột',
  columnMenuUnsort: 'Bỏ sắp xếp',
  columnMenuSortAsc: 'Sắp xếp tăng dần',
  columnMenuSortDesc: 'Sắp xếp giảm dần',
  footerRowsPerPage: 'Số hàng mỗi trang:',
  MuiTablePagination: {
    labelRowsPerPage: 'Số hàng mỗi trang:',
    labelDisplayedRows: ({ from, to, count }) => `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
  }
};
import Notification from '../../../components/Notification';
import { ToastContainer } from 'react-toastify';
export default function Size() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const openEditModal = (row) => {
    setEditingRow(row);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedRow) => {
    const response = await api.post("/admin/kich-co/sua", {
      idKichCo: updatedRow.idKichCo,
      ten: updatedRow.ten,
      trangThai: updatedRow.trangThai,
    })
    if (response.status === 200) {
      Notification("Sửa thành công", "success")
      fetchSize();
      setEditModalOpen(false);
    }
    // TODO: Gọi API cập nhật tại đây nếu muốn
  };

  const fetchSize = async () => {
    try {
      const response = await api.get("/admin/kich-co/hien-thi");
      const rowsWithSequence = response.data.map((row, index) => ({
        ...row,
        stt: index + 1
      }));
      setRows(rowsWithSequence);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu kích cỡ:", error);
    }
  };

  useEffect(() => {
    fetchSize();
  }, []);

  const getStatusColor = (status) => {
    switch (Number(status)) {
      case 1:
        return "success";
      case 0:
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    { field: 'stt', headerName: 'STT', width: 80 },
    { field: 'ten', headerName: 'Tên kích cỡ', flex: 1 },
    {
      field: 'trangThai',
      headerName: 'Trạng thái',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={Number(params.value) === 1 ? "Đang bán" : "Ngừng bán"}
          color={getStatusColor(params.value)}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'hanhDong',
      headerName: 'Hành động',
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() => openEditModal(params.row)}
          size="small"
        >
          <Edit size={18} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 1 }}
      >
        <Link underline="hover" color="inherit" onClick={() => navigate("/admin/dashboard")} sx={{ cursor: "pointer" }}>
          Thống kê
        </Link>
        <Typography color="text.primary">Kích cỡ</Typography>
      </Breadcrumbs>

      {/* Tiêu đề */}
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>
        Quản lý kích cỡ
      </Typography>

      {/* DataGrid */}
      <Paper sx={{ height: '66vh', width: '100%' }}>
        <DataGrid
          getRowId={(row) => row.idKichCo}
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 15]}
          disableColumnResize
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f9f9f9',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: 'none',
            }
          }}
          disableRowSelectionOnClick
          localeText={vietnameseLocaleText}
        />
      </Paper>
      <EditSize
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        data={editingRow}
        existingNames={rows}
      />
      <ToastContainer />
    </Box>

  );
}

