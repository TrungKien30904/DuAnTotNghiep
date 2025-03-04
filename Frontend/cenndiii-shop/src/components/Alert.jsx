import { Dialog, DialogActions, DialogContentText, DialogTitle, DialogContent } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';

export default function Alert({ message, open, onClose }) {
    const handleClose = (confirm) => {
        onClose(confirm);
    };

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={() => handleClose(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            style={{ alignItems: "flex-start" }}
        >
            <DialogTitle id="alert-dialog-title">Vui lòng xác nhận</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message || "Bạn có chắc chắn muốn thực hiện hành động này không?"}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <button
                    onClick={() => handleClose(false)}
                    className="px-3 py-1 border border-gray-400 text-gray-600 rounded-md"
                >Hủy
                </button>
                <button
                    onClick={() => handleClose(true)}
                    className="px-3 py-1 bg-black text-white rounded-md"
                >Đồng ý
                </button>
            </DialogActions>
        </Dialog>
    );
}