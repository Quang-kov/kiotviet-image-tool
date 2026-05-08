export default async function handler(req, res) {
    const { image_tag } = req.body || req.query;
    if (!image_tag) return res.status(200).send("Thiếu image_tag");

    const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYBIW8log388fVI6fPpExqdzQSlrWQtCiciERtZzSLjUlUWIkQ3LPUuA_NZaT673DHhbFRTQWbsmYB/pub?output=csv";

    try {
        const response = await fetch(SHEET_CSV_URL);
        const csvData = await response.text();
        const rows = csvData.split(/\r?\n/);

        // Hàm chuẩn hóa để so sánh không quan trọng dấu, khoảng trắng, gạch dưới
        const normalize = (str) => {
            if (!str) return "";
            return str.normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/[\[\]\s_]/g, "")
                      .toUpperCase();
        };

        const targetTag = normalize(image_tag);
        let foundRow = null;

        // Duyệt từng dòng để tìm mã thẻ
        for (let i = 1; i < rows.length; i++) {
            const currentRow = rows[i];
            if (!currentRow) continue;

            // Nếu trong dòng này có chứa mã thẻ (đã chuẩn hóa)
            if (normalize(currentRow).includes(targetTag)) {
                foundRow = currentRow;
                break;
            }
        }

        if (foundRow) {
            // Tách thủ công: link thường bắt đầu bằng http và kết thúc trước dấu phẩy đầu tiên
            const parts = foundRow.split(',');
            const imageUrl = parts[0].replace(/"/g, "").trim();
            // Lấy phần còn lại làm ngữ cảnh (loại bỏ phần mã thẻ)
            const context = parts[parts.length - 1].replace(/"/g, "").trim();

            return res.status(200).send(`[BOT]: Dạ, em gửi ảnh ${context}: ${imageUrl}`);
        }

        return res.status(200).send(`Không tìm thấy ảnh cho mã: ${image_tag}`);

    } catch (error) {
        return res.status(200).send("Lỗi kết nối kho ảnh.");
    }
}
