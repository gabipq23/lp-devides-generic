export function onlyLetters(str: string) {
    // Remove tudo que não for letra ou espaço
    return str
        .replace(/[^A-Za-zÀ-ÿ\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}