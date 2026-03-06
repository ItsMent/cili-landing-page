import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

const files = [
    "HSK_1_Vocabulary 150 Words 300 Example Sentences.pdf",
    "HSK_1_Vocabulary 150 Words 600 Example Sentences.pdf",
    "HSK_2_Vocabulary 150 Words 300 Example Sentences.pdf",
    "HSK_2_Vocabulary 150 Words 600 Example Sentences.pdf",
    "HSK_3_Vocabulary 300 Words 600 Example Sentences.pdf",
    "HSK_3_Vocabulary 300 Words 1200 Example Sentences.pdf",
    "HSK_4_Vocabulary 600 Words 1200 Example Sentences.pdf",
    "HSK_4_Vocabulary 600 Words 2400 Example Sentences.pdf",
    "HSK_5_Vocabulary 1300 Words 2600 Example Sentences.pdf",
    "HSK_5_Vocabulary 1300 Words 5200 Example Sentences.pdf",
    "HSK_6_Vocabulary 2500 Words 5000 Example Sentences.pdf",
    "HSK_6_Vocabulary 2500 Words 10000 Example Sentences.pdf"
];

const dir = "C:/Users/kitme/CILI - Landing Page/src/assets/Samples";

async function processPdf(filename) {
    const filePath = path.join(dir, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filename}`);
        return;
    }

    console.log(`Processing ${filename}...`);
    const existingPdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const totalPages = pdfDoc.getPageCount();

    const previewDoc = await PDFDocument.create();

    // Create an array of page indices to copy (max 5)
    const pagesToCopy = Math.min(5, totalPages);
    const indices = Array.from({ length: pagesToCopy }, (_, i) => i);

    const copiedPages = await previewDoc.copyPages(pdfDoc, indices);

    for (const page of copiedPages) {
        previewDoc.addPage(page);
    }

    const previewPdfBytes = await previewDoc.save();
    const previewFilename = filename.replace('.pdf', ' - Preview.pdf');
    const previewPath = path.join(dir, previewFilename);

    fs.writeFileSync(previewPath, previewPdfBytes);
    console.log(`Saved ${previewFilename}`);

    // Delete original
    fs.unlinkSync(filePath);
    console.log(`Deleted original ${filename}`);
}

async function main() {
    for (const file of files) {
        try {
            await processPdf(file);
        } catch (e) {
            console.error(`Error processing ${file}:`, e);
        }
    }
    console.log("Done!");
}

main();
