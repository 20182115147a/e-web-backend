import Product from "../models/Products.js";
class ProductControllers {
    async getProducts (req, res){
      const { page = 1, limit = 12 } = req.query; // Mặc định page 1 và limit 10 sản phẩm

      try {
        const products = await Product.find()
          .skip((page - 1) * limit)
          .limit(limit);
    
        const totalProducts = await Product.countDocuments(); // Tổng số sản phẩm
    
        res.status(200).json({
          message: "Lấy danh sách sản phẩm thành công",
          products,
          totalProducts,
          totalPages: Math.ceil(totalProducts / limit),
          currentPage: page,
        });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      }
      
    async getProductsByUser (req, res){
      const {user} =req.body
      try {
        const products = await Product.find({seller: user, deleted:false}) 
        if (!products) {
          return res.status(404).json({ message: "Không có sản phẩm" });
        }
        res.status(200).json({ message: "Lấy danh sách sản phẩm thành công", products });
      } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
      }
    }
      async getProductById (req, res) {
        const { id } = req.params;
        
        try {
          // Tìm sản phẩm theo ID
          const product = await Product.findById(id)
          if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
          }
          res.status(200).json({ message: "Lấy chi tiết sản phẩm thành công", product });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      }
      async createProduct  (req, res){
        let images = ''
        if (req.files) {
         images = req.files.map((file) => {
            return file.path
          })
        }
        const { name, description, price, category,seller, stock } = req.body;
   
        try {
          // Tạo sản phẩm mới
          const product = new Product({
            name,
            description,
            price,
            category,
            seller,
            images,
            stock,
          });
      
          await product.save(); // Lưu sản phẩm vào database
      
          res.status(201).json({ message: "Tạo sản phẩm thành công", product });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      }
      async deleteProduct(req,res) {
        try {
          const { id } = req.params;
      
          // Kiểm tra sản phẩm có tồn tại không
          const product = await Product.findById(id);
          if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
          }
      
          // Đánh dấu sản phẩm đã bị xóa mềm
          product.deleted = true;
          await product.save();
      
          res.status(200).json({ message: "Xóa mềm sản phẩm thành công", product });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      }
      async updateProduct(req, res) {
        let images = ''
        if (req.files) {
          images = req.files.map((file) => {
             return file.path
           })
         }
         const { name, description, price, category,seller, stock,id } = req.body;
         const product = await Product.findById(id);
        if (!product) {
          return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        try {
          Object.assign(product, {
            name,
            description,
            price,
            category,
            seller,
            images,
            stock
        })
        await product.save();

    res.status(200).json({ message: "Cập nhật sản phẩm thành công", product });

        }
        catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
        

      }
      async getProductBySort(req,res ) {
        try {
          const { page = 1, limit = 10, category, sortBy } = req.query;
      
          // Xây dựng query để lọc sản phẩm
          const query = {};
          if (category && category !== "Tất cả") {
            query.category = category;
          }
      
          // Xây dựng options để sắp xếp và phân trang
          const sortOptions = {};
          if (sortBy === "price-asc") {
            sortOptions.price = 1; // Sắp xếp giá tăng dần
          } else if (sortBy === "price-desc") {
            sortOptions.price = -1; // Sắp xếp giá giảm dần
          } else {
            sortOptions.createdAt = -1; // Mặc định sắp xếp theo ngày tạo mới nhất
          }
      
          // Tính toán phân trang
          const skip = (page - 1) * limit;
      
          // Lấy danh sách sản phẩm
          const products = await Product.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit))
      
          // Đếm tổng số sản phẩm (để tính tổng số trang)
          const totalProducts = await Product.countDocuments(query);
      
          res.status(200).json({
            message: "Lấy danh sách sản phẩm thành công",
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: Number(page),
          });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      }
      async searchProduct (req, res) {
        try {
          const { query, page = 1, limit = 10, category, sortBy } = req.query;
      
          const sortOptions = {};
          if (sortBy === "price-asc") {
            sortOptions.price = 1; // Sắp xếp giá tăng dần
          } else if (sortBy === "price-desc") {
            sortOptions.price = -1; // Sắp xếp giá giảm dần
          } else {
            sortOptions.createdAt = -1; // Mặc định sắp xếp theo ngày tạo mới nhất
          }
          // Xây dựng regex để tìm kiếm không phân biệt hoa thường
          const searchRegex = new RegExp(query, "i");
      
          // Tìm kiếm sản phẩm theo tên hoặc mô tả
          const products = await Product.find({
            $or: [
              { name: { $regex: searchRegex } },
              { description: { $regex: searchRegex } },
            ],
          }).sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(Number(limit))
      
          // Đếm tổng số sản phẩm phù hợp
          const totalProducts = await Product.countDocuments({
            $or: [
              { name: { $regex: searchRegex } },
              { description: { $regex: searchRegex } },
            ],
          });
      
          res.status(200).json({
            message: "Tìm kiếm sản phẩm thành công",
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: Number(page),
          });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      }
}
export default new ProductControllers