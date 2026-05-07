export default async function handler(req, res) {
    const image_tag = req.body?.image_tag || req.query?.image_tag;
    
    if (!image_tag) {
        return res.status(200).send("Thiếu mã thẻ hình ảnh.");
    }

    // URL của file Google Sheets đã xuất bản dưới dạng CSV
    // (Cách lấy: Vào Google Sheets -> File -> Share -> Publish to web -> Chọn định dạng CSV)
    const SHEET_CSV_URL = "LINK_URL_CSV_CUA_ANH_TAI_DAY";

    try {
        const response = await fetch(SHEET_CSV_URL);
        const data = await response.text();
        
        // Tách dữ liệu CSV thành các dòng và mảng
        const rows = data.split('\n').map(row => row.split(','));
        
        // Tìm dòng có Mã thẻ khớp với image_tag (xử lý bỏ qua khoảng trắng/viết hoa)
        const foundRow = rows.find(row => {
            const cleanTagInSheet = row[1]?.replace(/[\[\]\s]/g, '').toUpperCase();
            const cleanInputTag = image_tag.replace(/[\[\]\s]/g, '').toUpperCase();
            return cleanTagInSheet === cleanInputTag;
        });

        if (foundRow) {
            const imageUrl = foundRow[0]; // Cột A
            const description = foundRow[2] || "hướng dẫn"; // Cột C
            return res.status(200).send(`Dạ, em gửi ảnh ${description} cho anh/chị: ${imageUrl}`);
        } else {
            return res.status(200).send("Em đã tìm trong kho dữ liệu nhưng chưa thấy ảnh phù hợp cho mã này.");
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send("Lỗi kết nối kho dữ liệu hình ảnh.");
    }
}
