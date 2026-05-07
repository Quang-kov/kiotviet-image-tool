export default async function handler(req, res) {
    const { image_tag } = req.body || req.query;

    if (!image_tag) {
        return res.status(400).send("Vui lòng cung cấp image_tag.");
    }

    // Link CSV anh vừa tạo
    const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYBIW8log388fVI6fPpExqdzQSlrWQtCiciERtZzSLjUlUWIkQ3LPUuA_NZaT673DHhbFRTQWbsmYB/pub?output=csv";

    try {
        const response = await fetch(SHEET_CSV_URL);
        const csvData = await response.text();

        // Tách dữ liệu thành các dòng
        const rows = csvData.split('\n');
        
        // Hàm chuẩn hóa chuỗi: bỏ dấu, bỏ khoảng trắng, viết hoa để so sánh chính xác
        const normalize = (str) => {
            return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\[\]\s_]/g, "").toUpperCase() : "";
        };

        let foundImageUrl = null;
        let foundContext = "";

        // Duyệt qua từng dòng (bỏ qua dòng tiêu đề đầu tiên)
        for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(',');
            if (columns.length < 2) continue;

            const imageUrl = columns[0].trim();
            const tagInSheet = columns[1].trim();
            const context = columns[2] ? columns[2].trim() : "hướng dẫn";

            // So sánh Tag từ ElevenLabs gửi sang với Tag trong Sheets
            if (normalize(tagInSheet) === normalize(image_tag)) {
                foundImageUrl = imageUrl;
                foundContext = context;
                break;
            }
        }

        if (foundImageUrl) {
            // Trả về định dạng mà Chatbot hoặc AI có thể hiển thị
            return res.status(200).send(`[BOT]: Dạ, em gửi anh/chị hình ảnh ${foundContext}: ${foundImageUrl}`);
        } else {
            return res.status(200).send(`Không tìm thấy ảnh cho mã thẻ: ${image_tag}`);
        }

    } catch (error) {
        console.error("Lỗi đọc file Sheets:", error);
        return res.status(500).send("Lỗi hệ thống khi truy xuất kho ảnh.");
    }
}
