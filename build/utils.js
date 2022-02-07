export function generateRandomString(max) {
    let text = "";
    const len = Math.floor(Math.random() * max);
    const charset = "abcdefghijklmnopqrstuvwxyz0123456789!$?^#";
    for (let i = 0; i < len; i++) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return text;
}
//# sourceMappingURL=utils.js.map