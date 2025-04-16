import * as React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { DataGrid } from '@mui/x-data-grid';
import { Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from "../../../security/Axios";
import EditModal from './UpdateAttribute';

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
    const response = await api.post("/admin/de-giay/sua", {
      idDeGiay: updatedRow.idDeGiay,
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
      const response = await api.get("/admin/de-giay/hien-thi");
      const rowsWithSequence = response.data.map((row, index) => ({
        ...row,
        stt: index + 1
      }));
      setRows(rowsWithSequence);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu đế giày:", error);
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
    { field: 'ten', headerName: 'Tên đế giày', flex: 1 },
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
        <Typography color="text.primary">Đế giày</Typography>
      </Breadcrumbs>

      {/* Tiêu đề */}
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>
        Quản lý Đế giày
      </Typography>

      {/* DataGrid */}
      <Paper sx={{ height: '66vh', width: '100%' }}>
        <DataGrid
          getRowId={(row) => row.idDeGiay}
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
      <EditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        data={editingRow}
        existingNames={rows}
        type={"đế giày"}
      />
      <ToastContainer />
    </Box>

  );
}

