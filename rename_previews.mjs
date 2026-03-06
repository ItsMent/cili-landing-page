import fs from 'fs';
import path from 'path';

const dir = "C:/Users/kitme/CILI - Landing Page/src/assets/Samples";

const mappings = {
    "HSK_1_Vocabulary 150 Words 300 Example Sentences - Preview.pdf": "hsk1-preview.pdf",
    "HSK_1_Vocabulary 150 Words 600 Example Sentences - Preview.pdf": "hsk1-extended-preview.pdf",
    "HSK_2_Vocabulary 150 Words 300 Example Sentences - Preview.pdf": "hsk2-preview.pdf",
    "HSK_2_Vocabulary 150 Words 600 Example Sentences - Preview.pdf": "hsk2-extended-preview.pdf",
    "HSK_3_Vocabulary 300 Words 600 Example Sentences - Preview.pdf": "hsk3-preview.pdf",
    "HSK_3_Vocabulary 300 Words 1200 Example Sentences - Preview.pdf": "hsk3-extended-preview.pdf",
    "HSK_4_Vocabulary 600 Words 1200 Example Sentences - Preview.pdf": "hsk4-preview.pdf",
    "HSK_4_Vocabulary 600 Words 2400 Example Sentences - Preview.pdf": "hsk4-extended-preview.pdf",
    "HSK_5_Vocabulary 1300 Words 2600 Example Sentences - Preview.pdf": "hsk5-preview.pdf",
    "HSK_5_Vocabulary 1300 Words 5200 Example Sentences - Preview.pdf": "hsk5-extended-preview.pdf",
    "HSK_6_Vocabulary 2500 Words 5000 Example Sentences - Preview.pdf": "hsk6-preview.pdf",
    "HSK_6_Vocabulary 2500 Words 10000 Example Sentences - Preview.pdf": "hsk6-extended-preview.pdf"
};

for (const [oldName, newName] of Object.entries(mappings)) {
    const oldPath = path.join(dir, oldName);
    const newPath = path.join(dir, newName);
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed to ${newName}`);
    }
}
