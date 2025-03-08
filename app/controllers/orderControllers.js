import Order from '../models/Orders.js'
class OrderControllers {
   async checkout(req,res){
        const { userId, items, totalAmount, paymentMethod, shippingAddress } = req.body;

  try {
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
      status: "pending", 
    });

    
    await newOrder.save();

    
    res.status(201).json({
      success: true,
      message: "Thanh toán thành công!",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi thanh toán đơn hàng",
      error: error.message,
    });
    }
}
    async getOrder(req,res) {
        try {
            const userId = req.params.userId;
        
            if (userId){
                const orders = await Order.find({ userId })
              .populate("userId", "name email") // Populate thông tin người dùng
              .populate("items.productId", "name price images"); // Populate thông tin sản phẩm
        
            if (orders.length === 0) {
              return res.status(200).json({ success: true, message: "Người dùng chưa có đơn hàng nào", orders: [] });
            }

            res.status(200).json({ success: true, orders });
            }
          } catch (error) {
            res.status(500).json({
              success: false,
              message: "Lỗi khi lấy danh sách đơn hàng",
              error: error.message,
            });
          }        
    }
}
export default new OrderControllers