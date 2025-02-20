import React from 'react';
import { Loader, Check, Truck, DollarSign, CircleCheck } from 'lucide-react';
const OrderStatus = ({ status }) => {
    // Định nghĩa các trạng thái và màu sắc tương ứng
    const statusConfig = {
        'Chờ xác nhận': {
            color: 'bg-yellow-500',
            text: 'text-yellow-900',
            label: 'Chờ xác nhận',
            icon: <Loader className='text-yellow-500' />
        },
        'Đã xác nhận': {
            color: 'bg-blue-500',
            text: 'text-blue-900',
            label: 'Đã xác nhận',
            icon: <Check className='text-blue-500' />
        },
        'Chờ vận chuyển': {
            color: 'bg-purple-500',
            text: 'text-purple-900',
            label: 'Chờ vận chuyển',
            icon: <Truck className='text-purple-500' />
        },
        'Đã thanh toán': {
            color: 'bg-green-500',
            text: 'text-green-900',
            label: 'Đã thanh toán',
            icon: <DollarSign className='text-green-500' />

        },
        'Giao thành công': {
            color: 'bg-teal-500',
            text: 'text-teal-900',
            label: 'Giao thành công',
            icon: <CircleCheck className='text-teal-500' />
        },
    };

    // Lấy cấu hình trạng thái
    const config = statusConfig[status] || {
        color: 'bg-gray-500',
        text: 'text-gray-900',
        label: 'Không xác định',
    };

    return (
        <div className="flex flex-col items-center gap-3">
            {config.icon}
            <div className='flex items-center'>
                {/* Dot */}
                <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                {/* Label */}
                <span className={`ml-2 text-sm font-medium ${config.text}`}>
                    {config.label}
                </span>
            </div>
        </div>
    );
};

export default OrderStatus;