export default async function handler(req, res) {
    const { image_tag } = req.body || req.query;

    if (!image_tag) return res.status(400).send("Thiếu image_tag");

    const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYBIW8log388fVI6fPpExqdzQSlrWQtCiciERtZzSLjUlUWIkQ3LPUuA_NZaT673DHhbFRTQWbsmYB/pub?output=csv";

    try {
        const response = await fetch(SHEET_CSV_URL);
        const csvData = await response.text();
        const rows = csvData.split(/\r?\n/);
        
        const normalize = (str) => {
            if (!str) return "";
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\[\]\s_]/g, "").toUpperCase();
        };

        let foundImageUrl = null;
        let foundContext = "";

        for (let i = 1; i < rows.length; i++) {
            if (!rows[i]) continue;

            // Regex này giúp tách cột chính xác kể cả khi nội dung có dấu phẩy
            const columns = rows[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            
            if (!columns || columns.length < 2) {
                // Fallback nếu regex không khớp với dòng đặc biệt
                const simpleSplit = rows[i].split(',');
                if (normalize(simpleSplit[1]) === normalize(image_tag)) {
                    foundImageUrl = simpleSplit[0];
                    foundContext = simpleSplit[2] || "hướng dẫn";
                    break;
                }
                continue;
            }

            const imageUrl = columns[0].replace(/"/g, "").trim();
            const tagInSheet = columns[1].replace(/"/g, "").trim();
            const context = columns[2] ? columns[2].replace(/"/g, "").trim() : "hướng dẫn";

            if (normalize(tagInSheet) === normalize(image_tag)) {
                foundImageUrl = imageUrl;
                foundContext = context;
                break;
            }
        }

        if (foundImageUrl) {
            return res.status(200).send(`[BOT]: Dạ, em gửi ảnh ${foundContext}: ${foundImageUrl}`);
        } else {
            return res.status(200).send(`Không tìm thấy mã: ${image_tag}`);
        }

    } catch (error) {
        return res.status(500).send("Lỗi hệ thống");
    }
}
