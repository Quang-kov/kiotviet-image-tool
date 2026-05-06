const axios = require('axios');

const imageMapping = {
    "[MODEL_paper_setup]": "https://domain.com/anh-1.jpg", // Thay link ảnh thật của anh
    "[MODEL_self_test]": "https://domain.com/anh-2.jpg"
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // ElevenLabs sẽ gửi image_tag và conversation_id
    const { image_tag, conversation_id } = req.body;
    const imageUrl = imageMapping[image_tag];

    if (!imageUrl) return res.status(404).json({ error: "Tag không tồn tại" });

    try {
        await axios.post(`https://api.freshchat.com/v2/conversations/${conversation_id}/messages`, {
            message_parts: [{ image: { url: imageUrl } }]
        }, {
            headers: {
                'Authorization': `Bearer CHEN_TOKEN_FRESHCHAT_CUA_ANH_VAO_DAY`,
                'Content-Type': 'application/json'
            }
        });
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
