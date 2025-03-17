import React, { useEffect, useState } from "react";
import { Row, Col, Button, Card, Table, DatePicker, message } from "antd";
import StatisticWidget from "../components/StatisticWidget";
import ChartWidget from "../components/ChartWidget";
import PieChartWidget from "../components/PieChartWidget";
import { formatCurrency } from "../utils/formatCurrency";
import User from "../assets/teamwork.png";
import Order from "../assets/shopping-bag.png";
import Product from "../assets/best-seller.png";
import COD from "../assets/cash-on-delivery.png";
import moment from "moment"; // Import moment for date formatting

const generatePaymentMethod = (method) => {
    switch (method) {
        case "COD":
            return (
                <img
                    src={COD}
                    alt="COD"
                    width={50}
                    height={50}
                    style={{ borderRadius: "15px" }}
                />
            );
        case "VNPay":
            return (
                <img
                    src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
                    alt="VNPay"
                    width={50}
                    height={50}
                    style={{ borderRadius: "15px" }}
                />
            );
        case "Paypal":
            return (
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png"
                    alt="Paypal"
                    width={50}
                    height={50}
                    style={{ borderRadius: "15px" }}
                />
            );
        default:
            return <span>{method}</span>;
    }
};

const generateStatus = (status) => {
    let color = "";
    switch (status) {
        case "Chờ xác nhận":
            color = "#FF9900";
            break;
        case "Đã xác nhận":
            color = "#0000FF";
            break;
        case "Đã đóng gói":
            color = "#800080";
            break;
        case "Đang vận chuyển":
            color = "#008000";
            break;
        case "Đã hủy":
            color = "#FF0000";
            break;
        case "Đã giao hàng":
            color = "#008080";
            break;
        default:
            color = "gray";
    }
    return (
        <span
            style={{
                color: color,
                padding: "3px 8px",
                border: `1px solid ${color}`,
                borderRadius: "5px",
                backgroundColor: `${color}20`,
                textAlign: "center",
                display: "inline-block",
            }}
        >
      {status}
    </span>
    );
};

export const Dashboard = () => {
    const [orders, setOrders] = useState([
            {
                "orderId": 82,
                "code": "ORD66781235",
                "date": "2025-02-21T12:45:00",
                "note": "Giao nhanh trong ngày",
                "paymentMethod": "VNPay",
                "totalPrice": 4800000,
                "discount": 200000,
                "user": {
                    "userId": 10,
                    "username": "tranminhanh",
                    "email": "minhanh.tran@gmail.com",
                    "phoneNumber": "0987456123",
                    "fullName": "Trần Minh Anh",
                    "avatar": null
                },
                "addressBook": {
                    "addressBookId": 12,
                    "recipientName": "Lê Hoàng Nam",
                    "phoneNumber": "0977112233",
                    "address": "123 Trần Duy Hưng",
                    "ward": "Phường Trung Hòa",
                    "district": "Quận Cầu Giấy",
                    "city": "Thành phố Hà Nội",
                    "email": "hoangnam.le@gmail.com"
                },
                "status": "Đang vận chuyển",
                "orderDetails": [
                    {
                        "orderDetailId": 12,
                        "productName": "Giày Nike Air Max 270",
                        "productImages": {
                            "imageId": null,
                            "imageUrl": "https://example.com/nike-air-max-270.jpg",
                            "isDefault": null
                        },
                        "productQuantity": 2,
                        "price": 2400000,
                        "variationName": "Màu Đen / Size 42"
                    }
                ]
            },
            {
                "orderId": 83,
                "code": "ORD77781236",
                "date": "2025-02-22T15:30:00",
                "note": "Gọi trước khi giao",
                "paymentMethod": "COD",
                "totalPrice": 3500000,
                "discount": 0,
                "user": {
                    "userId": 11,
                    "username": "phamthuy",
                    "email": "thuypham@gmail.com",
                    "phoneNumber": "0968123456",
                    "fullName": "Phạm Thúy",
                    "avatar": null
                },
                "addressBook": {
                    "addressBookId": 13,
                    "recipientName": "Nguyễn Văn Khoa",
                    "phoneNumber": "0977999888",
                    "address": "456 Lê Văn Sỹ",
                    "ward": "Phường 10",
                    "district": "Quận 3",
                    "city": "Thành phố Hồ Chí Minh",
                    "email": "khoanguyen@gmail.com"
                },
                "status": "Đã xác nhận",
                "orderDetails": [
                    {
                        "orderDetailId": 13,
                        "productName": "Giày Adidas Ultraboost 22",
                        "productImages": {
                            "imageId": null,
                            "imageUrl": "https://example.com/adidas-ultraboost-22.jpg",
                            "isDefault": null
                        },
                        "productQuantity": 1,
                        "price": 3500000,
                        "variationName": "Màu Trắng / Size 40"
                    }
                ]
            },
            {
                "orderId": 84,
                "code": "ORD88781237",
                "date": "2025-02-23T09:20:00",
                "note": "Không giao vào buổi sáng",
                "paymentMethod": "Paypal",
                "totalPrice": 2900000,
                "discount": 100000,
                "user": {
                    "userId": 12,
                    "username": "nguyenthinh",
                    "email": "thinhnguyen@gmail.com",
                    "phoneNumber": "0912345678",
                    "fullName": "Nguyễn Thịnh",
                    "avatar": null
                },
                "addressBook": {
                    "addressBookId": 14,
                    "recipientName": "Đặng Hoài Nam",
                    "phoneNumber": "0988776655",
                    "address": "789 Nguyễn Trãi",
                    "ward": "Phường 14",
                    "district": "Quận 5",
                    "city": "Thành phố Hồ Chí Minh",
                    "email": "hoainam@gmail.com"
                },
                "status": "Chờ xác nhận",
                "orderDetails": [
                    {
                        "orderDetailId": 14,
                        "productName": "Giày Converse Chuck Taylor",
                        "productImages": {
                            "imageId": null,
                            "imageUrl": "https://example.com/converse-chuck-taylor.jpg",
                            "isDefault": null
                        },
                        "productQuantity": 1,
                        "price": 2900000,
                        "variationName": "Màu Đỏ / Size 38"
                    }
                ]
            }
        ]

    );
    const [revenue, setRevenue] = useState({
        "todayRevenue": 120000,  // Giả sử doanh thu hôm nay
        "yesterdayRevenue": 100000, // Doanh thu ngày hôm qua
        "monthlyRevenue": 3200000, // Doanh thu tháng này
        "lastMonthRevenue": 2920000, // Doanh thu tháng trước
        "yearlyRevenue": 36000000, // Doanh thu năm nay
        "lastYearRevenue": 32000000, // Doanh thu năm trước
        "totalUsers": 10, // Tổng số người dùng
        "totalProducts": 75, // Tổng số sản phẩm
        "totalOrders": 12, // Tổng số đơn hàng
        "todayIncreasePercentage": ((120000 - 100000) / 100000 * 100).toFixed(2), // % tăng trưởng hôm nay so với hôm qua
        "monthlyIncreasePercentage": ((3200000 - 2920000) / 2920000 * 100).toFixed(2), // % tăng trưởng so với tháng trước
        "yearlyIncreasePercentage": ((36000000 - 32000000) / 32000000 * 100).toFixed(2) // % tăng trưởng so với năm trước
    });

    const [dailyData, setDailyData] = useState({
            "series": [
                {
                    "name": "Số đơn hàng",
                    "data": [3, 5, 2, 4, 6, 1, 3, 7, 2, 5]
                },
                {
                    "name": "Doanh thu",
                    "data": [1500000, 3200000, 2100000, 4500000, 6800000, 1200000, 3900000, 7700000, 2500000, 5200000]
                }
            ],
            "categories": [
                "2025-02-10",
                "2025-02-11",
                "2025-02-12",
                "2025-02-13",
                "2025-02-14",
                "2025-02-15",
                "2025-02-16",
                "2025-02-17",
                "2025-02-18",
                "2025-02-19"
            ]
        }
    );
    const [startDate, setStartDate] = useState(
        moment().subtract(1, "months").endOf("month").isAfter(moment())
            ? moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD")
            : moment().subtract(1, "months").format("YYYY-MM-DD")
    );
    const pieChartData = {
        series: [45, 32, 18, 25, 22], // Doanh thu của từng loại giày
        labels: ["Giày thể thao", "Giày da", "Sandal", "Giày cao gót", "Giày lười"], // Danh mục giày
    };


    const [endDate, setEndDate] = useState(
        moment().add(1, "days").format("YYYY-MM-DD")
    );
    // Default to current date

    // const fetchOrders = async () => {
    //   try {
    //     const data = await getAllOrders(1, limit); // Gọi API lấy đơn hàng
    //     setOrders(data.content);
    //   } catch (error) {
    //     console.error("Error fetching daily revenue:", error);
    //   }
    // };

    const handleFetchRevenue = async () => {
        // try {
        //   const dailyRevenueData = await getDailyRevenue(startDate, endDate);
        //   setDailyData(dailyRevenueData);
        // } catch (error) {
        //   console.error("Error fetching daily revenue:", error);
        // }
    };

    const columns = [
        {
            title: "Mã Đơn Hàng",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Người Mua",
            dataIndex: ["user", "fullName"],
            key: "user",
        },
        {
            title: "Số Điện Thoại",
            dataIndex: ["user", "phoneNumber"],
            key: "phoneNumber",
        },
        {
            title: "Email",
            dataIndex: ["user", "email"],
            key: "email",
        },
        {
            title: "Ngày Đặt",
            dataIndex: "date",
            key: "date",
            render: (text) => new Date(text).toLocaleDateString("vi-VN"), // Hiển thị ngày đặt với định dạng tiếng Việt
        },
        {
            title: "Phương Thức Thanh Toán",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            align: "center",
            render: (method) => generatePaymentMethod(method), // Hiển thị hình ảnh phương thức thanh toán
        },
        {
            title: "Tổng Giá",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (text) => `${formatCurrency(text)}`,
        },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            render: (status) => generateStatus(status), // Sử dụng hàm generateStatus để hiển thị trạng thái
        },
        {
            title: "Hành Động",
            key: "actions",
            align: "center", // Canh giữa cột Hành Động
            render: (text, record) => (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        size="small"
                        type="primary"

                    >
                        Xem chi tiết
                    </Button>
                </div>
            ),
        },
    ];
    const trendingProducts = [
        {
            productId: 101,
            name: "Nike Air Force 1",
            category: "Giày thể thao",
            sold: 250,
            price: 2800000,
            image: "https://i.pinimg.com/736x/e9/8d/96/e98d968014e875b37953f678b285d9d2.jpg",
        },
        {
            productId: 102,
            name: "Adidas Ultraboost 22",
            category: "Giày chạy bộ",
            sold: 190,
            price: 3200000,
            image: "https://i.pinimg.com/736x/af/ff/32/afff329ce9023cf164a7a8bb8a1d3c6b.jpg",
        },
        {
            productId: 103,
            name: "Converse Chuck Taylor",
            category: "Giày thời trang",
            sold: 175,
            price: 1500000,
            image: "https://i.pinimg.com/736x/7c/89/5f/7c895ffd5144bcc7aa9f69f7a0ce1edf.jpg",
        },
        {
            productId: 104,
            name: "Vans Old Skool",
            category: "Giày streetwear",
            sold: 140,
            price: 1700000,
            image: "https://i.pinimg.com/736x/cc/80/53/cc805312394d598e8acd70edae1f14c7.jpg",
        },
        {
            productId: 105,
            name: "Puma RS-X",
            category: "Giày sneaker",
            sold: 120,
            price: 2200000,
            image: "https://i.pinimg.com/736x/a4/86/49/a48649d8a8ac79d480a5af98aabb6e66.jpg",
        },
    ];
    const trendingColumns = [
        {
            title: "Ảnh",
            dataIndex: "image",
            key: "image",
            render: (image) => <img src={image} alt="Giày" style={{ width: 50, height: 50, borderRadius: "8px" }} />,
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Danh mục",
            dataIndex: "category",
            key: "category",
        },
        {
            title: "Đã bán",
            dataIndex: "sold",
            key: "sold",
            render: (sold) => <span>{sold} đôi</span>,
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (price) => <span>{new Intl.NumberFormat("vi-VN").format(price)} đ</span>,
        },
    ];

    return (
        <Card>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Row gutter={16}>
                        {/* Displaying Revenue Widgets */}
                        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                            <StatisticWidget
                                title={"Tổng số sản phẩm"}
                                value={`${revenue?.totalProducts} sản phẩm`}
                                imgSrc={Product}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                            <StatisticWidget
                                title={"Tổng số đơn hàng"}
                                value={`${revenue?.totalOrders} đơn hàng`}
                                imgSrc={Order}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                            <StatisticWidget
                                title={"Tổng số người dùng"}
                                value={`${revenue?.totalUsers} người dùng`}
                                imgSrc={User}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        {/* Displaying Revenue Widgets */}
                        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                            <StatisticWidget
                                title={"Doanh thu hôm nay"}
                                value={
                                    formatCurrency(revenue?.todayRevenue) ?? formatCurrency(0)
                                }
                                status={revenue?.todayIncreasePercentage}
                                subtitle={`So với hôm qua (${formatCurrency(
                                    revenue?.yesterdayRevenue
                                )})`}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                            <StatisticWidget
                                title={"Doanh thu tháng này"}
                                value={
                                    formatCurrency(revenue?.monthlyRevenue) ?? formatCurrency(0)
                                }
                                status={revenue?.monthlyIncreasePercentage}
                                subtitle={`So với tháng trước (${formatCurrency(
                                    revenue?.lastMonthRevenue
                                )})`}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                            <StatisticWidget
                                title={"Doanh thu năm"}
                                value={
                                    formatCurrency(revenue?.yearlyRevenue) ?? formatCurrency(0)
                                }
                                status={revenue?.yearlyIncreasePercentage}
                                subtitle={`So với năm ngoái (${formatCurrency(
                                    revenue?.lastYearRevenue
                                )})`}
                            />
                        </Col>
                    </Row>

                    {/* Date pickers and button for calculating revenue */}
                    <Row gutter={16} style={{ marginBottom: "20px", marginTop: "20px" }}>
                        <Col xs={24} sm={12} md={8}>
                            <DatePicker
                                onChange={(date, dateString) => setStartDate(dateString)}
                                value={moment(startDate)}
                                format={"YYYY-MM-DD"}
                                allowClear={false}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <DatePicker
                                onChange={(date, dateString) => setEndDate(dateString)}
                                value={moment(endDate)}
                                format={"YYYY-MM-DD"}
                                allowClear={false}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={8}>
                            <Button type="primary" onClick={handleFetchRevenue}>
                                Tính doanh thu
                            </Button>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                            <ChartWidget
                                title="Doanh thu theo ngày"
                                series={dailyData?.series}
                                xAxis={dailyData?.categories}
                                height={400}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <PieChartWidget title="Tỷ lệ doanh thu theo loại giày" data={pieChartData} />
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                    <Card title="Đơn hàng gần nhất">
                        <Table
                            columns={columns}
                            dataSource={orders}
                            pagination={false}
                            rowKey={(record) => record.orderId}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Card title="Sản phẩm thịnh hành">
                        <Table
                            columns={trendingColumns}
                            dataSource={trendingProducts}
                            pagination={false}
                            rowKey={(record) => record.productId}
                        />
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default Dashboard;
