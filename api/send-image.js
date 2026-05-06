export default async function handler(req, res) {
    // Cho phép nhận cả từ body hoặc query để tránh lỗi
    const image_tag = req.body?.image_tag || req.query?.image_tag;

    const imageMapping = {
        "[MODEL_paper_setup]": "https://img.kiotviet.vn/huong-dan/lap-giay.jpg",
        "[MODEL_self_test]": "https://img.kiotviet.vn/huong-dan/self-test.jpg"
    };

    const imageUrl = imageMapping[image_tag];

    if (imageUrl) {
        // Trả về văn bản thuần túy để ElevenLabs dễ đọc
        return res.status(200).send(`Link ảnh hướng dẫn của anh đây: ${imageUrl}`);
    }

    // Nếu không tìm thấy tag hoặc tag trống
    return res.status(200).send("Em đã tìm trong kho ảnh nhưng chưa thấy hình minh họa cho lỗi này, anh mô tả thêm giúp em nhé.");
}
