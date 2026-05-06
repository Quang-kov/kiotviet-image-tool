export default async function handler(req, res) {
    const { image_tag } = req.body;
    const imageMapping = {
        "[MODEL_paper_setup]": "https://img.kiotviet.vn/huong-dan/lap-giay.jpg",
        "[MODEL_self_test]": "https://img.kiotviet.vn/huong-dan/self-test.jpg"
    };

    const imageUrl = imageMapping[image_tag];

    if (imageUrl) {
        // Trả về cho ElevenLabs để nó "biết" link ảnh
        return res.status(200).json({ 
            success: true, 
            message: `Link ảnh hướng dẫn của bạn đây: ${imageUrl}` 
        });
    }
    return res.status(404).json({ error: "Không tìm thấy ảnh" });
}
