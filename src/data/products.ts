// Import Assets
import bundleImg from '../assets/Cili - CoverForGumRoad/Hsk1-6Bundle V2.png';
import hsk6Img from '../assets/Cili - CoverForGumRoad/HSK_6_Vocabulary 2500 Words 5000 Example Sentences.png';
import hsk6ExtendedImg from '../assets/Cili - CoverForGumRoad/HSK_6_Vocabulary 2500 Words 10000 Example Sentences.png';
import hsk5Img from '../assets/Cili - CoverForGumRoad/HSK_5_Vocabulary 1300 Words 2600 Example Sentences.png';
import hsk5ExtendedImg from '../assets/Cili - CoverForGumRoad/HSK_5_Vocabulary 1300 Words 5200 Example Sentences.png';
import hsk4Img from '../assets/Cili - CoverForGumRoad/HSK_4_Vocabulary 600 Words 1200 Example Sentences.png';
import hsk4ExtendedImg from '../assets/Cili - CoverForGumRoad/HSK_4_Vocabulary 600 Words 2400 Example Sentences.png';
import hsk3Img from '../assets/Cili - CoverForGumRoad/HSK_3_Vocabulary 300 Words 600 Example Sentences.png';
import hsk3ExtendedImg from '../assets/Cili - CoverForGumRoad/HSK_3_Vocabulary 300 Words 1200 Example Sentences.png';
import hsk2Img from '../assets/Cili - CoverForGumRoad/HSK_2_Vocabulary 150 Words 300 Example Sentences.png';
import hsk2ExtendedImg from '../assets/Cili - CoverForGumRoad/HSK_2_Vocabulary 150 Words 600 Example Sentences.png';
import hsk1Img from '../assets/Cili - CoverForGumRoad/HSK_1_Vocabulary 150 Words 300 Example Sentences.png';
import hsk1ExtendedImg from '../assets/Cili - CoverForGumRoad/HSK_1_Vocabulary 150 Words 600 Example Sentences.png';
import hsk6Preview from '../assets/Samples/hsk6-preview.pdf';
import hsk6ExtendedPreview from '../assets/Samples/hsk6-extended-preview.pdf';
import hsk5Preview from '../assets/Samples/hsk5-preview.pdf';
import hsk5ExtendedPreview from '../assets/Samples/hsk5-extended-preview.pdf';
import hsk4Preview from '../assets/Samples/hsk4-preview.pdf';
import hsk4ExtendedPreview from '../assets/Samples/hsk4-extended-preview.pdf';
import hsk3Preview from '../assets/Samples/hsk3-preview.pdf';
import hsk3ExtendedPreview from '../assets/Samples/hsk3-extended-preview.pdf';
import hsk2Preview from '../assets/Samples/hsk2-preview.pdf';
import hsk2ExtendedPreview from '../assets/Samples/hsk2-extended-preview.pdf';
import hsk1Preview from '../assets/Samples/hsk1-preview.pdf';
import hsk1ExtendedPreview from '../assets/Samples/hsk1-extended-preview.pdf';
import sentencePackImg from '../assets/sentence-pack.png';

export interface ProductVariant {
  id: string;
  name: string;
  price: string;
  link: string;
  image?: string;
  preview?: string;
  originalPrice?: string;
  description?: string;
  bundleImages?: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  link: string;
  preview?: string;
  image: string;
  bundleImages?: string[];
  featured?: boolean;
  isBundle?: boolean;
  isSentencePack?: boolean;
  tag: string;
  variants?: ProductVariant[];
  seoTitle?: string;
  seoDescription?: string;
}

export const products: Product[] = [
  {
    id: 'hsk1-6',
    name: 'HSK 1\u20136 Complete Vocabulary & Sentence Pack',
    description: 'The ultimate bundle. Get all 5,000 HSK words precisely mapped to beautifully formatted example sentences with Pinyin and translations.',
    price: '39.99',
    originalPrice: '66.94',
    link: 'https://cililearnchinese.gumroad.com/l/hsk1-6-complete-chinese-vocabulary-bundle-standard',
    preview: hsk6ExtendedPreview,
    image: bundleImg,
    bundleImages: [hsk1Img, hsk2Img, hsk3Img, hsk4Img, hsk5Img, hsk6Img],
    featured: true,
    isBundle: true,
    tag: 'BEST VALUE \u2022 SAVE 40%',
    seoTitle: 'HSK 1-6 Complete Vocabulary Bundle - 5,000 Words & 20,000 Sentences PDF',
    seoDescription: 'Get all 5,000 HSK words (levels 1-6) with up to 20,000 example sentences, Pinyin, and translations. Standard and Extended options available. Instant PDF download — bonus TSV and JSON included for Anki and any flashcard app.',
    variants: [
      {
        id: 'standard',
        name: 'Standard Bundle',
        price: '39.99',
        originalPrice: '66.94',
        link: 'https://cililearnchinese.gumroad.com/l/hsk1-6-complete-chinese-vocabulary-bundle-standard',
        image: bundleImg,
        bundleImages: [hsk1Img, hsk2Img, hsk3Img, hsk4Img, hsk5Img, hsk6Img],
        preview: hsk6Preview,
        description: 'Get all 5,000 HSK words from levels 1-6, including 10,000 foundational example sentences (2 per word). Clean, print-ready PDF format.'
      },
      {
        id: 'extended',
        name: 'Extended Bundle',
        price: '54.99',
        originalPrice: '90.94',
        link: 'https://cililearnchinese.gumroad.com/l/hsk1-6-complete-chinese-vocabulary-bundle-extended',
        image: bundleImg,
        bundleImages: [hsk1ExtendedImg, hsk2ExtendedImg, hsk3ExtendedImg, hsk4ExtendedImg, hsk5ExtendedImg, hsk6ExtendedImg],
        preview: hsk6ExtendedPreview,
        description: 'The ultimate collection. All 5,000 HSK words plus 20,000 sentences (4 per word). Unmatched context for advanced mastery.'
      }
    ]
  },
  {
    id: 'hsk1-3',
    name: 'HSK 1\u20133 Junior Vocabulary Pack',
    description: 'Master the fundamentals. Get all HSK 1, 2, and 3 words precisely mapped to example sentences.',
    price: '9.99',
    originalPrice: '15.97',
    link: 'https://cililearnchinese.gumroad.com/l/hsk1-3-chinese-vocabulary-bundle-standard',
    preview: hsk3ExtendedPreview,
    image: bundleImg,
    bundleImages: [hsk1Img, hsk2Img, hsk3Img],
    isBundle: true,
    tag: 'Starter Bundle \u2022 SAVE 37%',
    seoTitle: 'HSK 1-3 Junior Vocabulary Bundle - 600 Words & Sentences PDF',
    seoDescription: 'Master the fundamentals with all HSK 1, 2, and 3 vocabulary (600 words) with example sentences, Pinyin, and English translations. Instant PDF download — bonus TSV and JSON included for Anki and any flashcard app.',
    variants: [
      {
        id: 'standard',
        name: 'Standard Pack',
        price: '9.99',
        originalPrice: '15.97',
        link: 'https://cililearnchinese.gumroad.com/l/hsk1-3-chinese-vocabulary-bundle-standard',
        image: bundleImg,
        bundleImages: [hsk1Img, hsk2Img, hsk3Img],
        preview: hsk3Preview,
        description: 'Foundational vocabulary for HSK 1, 2, and 3. Includes 1,200 sentences (2 per word) to build your core Chinese proficiency.'
      },
      {
        id: 'extended',
        name: 'Extended Pack',
        price: '14.99',
        originalPrice: '24.97',
        link: 'https://cililearnchinese.gumroad.com/l/hsk1-3-chinese-vocabulary-bundle-extended',
        image: bundleImg,
        bundleImages: [hsk1ExtendedImg, hsk2ExtendedImg, hsk3ExtendedImg],
        preview: hsk3ExtendedPreview,
        description: 'Deep dive into HSK 1-3. Includes 2,400 sentences (4 per word) for maximum context and faster retention during your early stages.'
      }
    ]
  },
  {
    id: 'hsk4-6',
    name: 'HSK 4\u20136 Mastery Vocabulary Pack',
    description: 'Reach advanced proficiency. Complete collection of HSK 4, 5, and 6 words with context-rich sentences.',
    price: '29.99',
    originalPrice: '50.97',
    link: 'https://cililearnchinese.gumroad.com/l/hsk4-6-chinese-vocabulary-bundle-standard',
    preview: hsk6ExtendedPreview,
    image: bundleImg,
    bundleImages: [hsk4Img, hsk5Img, hsk6Img],
    isBundle: true,
    tag: 'Mastery Bundle \u2022 SAVE 41%',
    seoTitle: 'HSK 4-6 Mastery Vocabulary Bundle - 4,400 Advanced Words PDF',
    seoDescription: 'Reach advanced Chinese proficiency with HSK 4, 5, and 6 vocabulary (4,400 words) with context-rich example sentences. Instant PDF download — bonus TSV and JSON included for Anki and any flashcard app.',
    variants: [
      {
        id: 'standard',
        name: 'Standard Pack',
        price: '29.99',
        originalPrice: '50.97',
        link: 'https://cililearnchinese.gumroad.com/l/hsk4-6-chinese-vocabulary-bundle-standard',
        image: bundleImg,
        bundleImages: [hsk4Img, hsk5Img, hsk6Img],
        preview: hsk6Preview,
        description: 'Intermediate to advanced vocabulary for HSK 4, 5, and 6. Includes 8,800 sentences (2 per word) to master advanced context.'
      },
      {
        id: 'extended',
        name: 'Extended Pack',
        price: '39.99',
        originalPrice: '65.97',
        link: 'https://cililearnchinese.gumroad.com/l/hsk4-6-chinese-vocabulary-bundle-extended',
        image: bundleImg,
        bundleImages: [hsk4ExtendedImg, hsk5ExtendedImg, hsk6ExtendedImg],
        preview: hsk6ExtendedPreview,
        description: 'The complete set for HSK 4-6. Includes 17,600 sentences (4 per word) for true native-level context and mastery of complex word usage.'
      }
    ]
  },
  {
    id: 'starter-sentences',
    name: 'Starter Sentence Pack',
    description: '1,000 foundational sentences. Perfect for building your initial sentence-mining database.',
    price: '6.99',
    link: 'https://cililearnchinese.gumroad.com/l/starter-sentences',
    image: sentencePackImg,
    tag: 'FIRST STEPS \u2022 1K',
    isSentencePack: true,
    seoTitle: 'Chinese Starter Sentence Pack - 1,000 Foundational Sentences PDF',
    seoDescription: '1,000 foundational Chinese sentences for building your initial sentence-mining database. Instant PDF download with Pinyin and translations.'
  },
  {
    id: 'practice-sentences',
    name: 'Practice Sentence Pack',
    description: '3,000 practical sentences. Expand your vocabulary and master daily usage patterns.',
    price: '14.99',
    link: 'https://cililearnchinese.gumroad.com/l/practice-sentences',
    image: sentencePackImg,
    tag: 'CORE PRACTICE \u2022 3K',
    isSentencePack: true,
    seoTitle: 'Chinese Practice Sentence Pack - 3,000 Daily Usage Sentences PDF',
    seoDescription: '3,000 practical Chinese sentences to expand your vocabulary and master daily usage patterns. Instant PDF download — bonus TSV and JSON included for Anki and any flashcard app.'
  },
  {
    id: 'immersion-sentences',
    name: 'Immersion Sentence Pack',
    description: '5,000 immersive sentences. Designed for rapid comprehension and natural context.',
    price: '19.99',
    link: 'https://cililearnchinese.gumroad.com/l/immersion-sentences',
    image: sentencePackImg,
    tag: 'IMMERSION SET \u2022 5K',
    isSentencePack: true,
    featured: true,
    seoTitle: 'Chinese Immersion Sentence Pack - 5,000 Contextual Sentences PDF',
    seoDescription: '5,000 immersive Chinese sentences designed for rapid comprehension and natural context learning. Most popular sentence pack. Instant PDF download — bonus TSV and JSON included for Anki and any flashcard app.'
  },
  {
    id: 'advanced-sentences',
    name: 'Advanced Sentence Pack',
    description: '10,000 comprehensive sentences. Master complex grammar and sophisticated word usage.',
    price: '39.99',
    link: 'https://cililearnchinese.gumroad.com/l/advanced-sentences',
    image: sentencePackImg,
    tag: 'FLUENCY BUILDER \u2022 10K',
    isSentencePack: true,
    seoTitle: 'Chinese Advanced Sentence Pack - 10,000 Complex Grammar Sentences PDF',
    seoDescription: '10,000 comprehensive Chinese sentences to master complex grammar and sophisticated word usage. Instant PDF download — bonus TSV and JSON included for Anki and any flashcard app.'
  },
  {
    id: 'pro-sentences',
    name: 'Pro Mastery Sentence Pack',
    description: '20,000 extensive sentences. A massive expansion for deep linguistic immersion.',
    price: '79.99',
    link: 'https://cililearnchinese.gumroad.com/l/pro-sentences',
    image: sentencePackImg,
    tag: 'DEEP IMMERSION \u2022 20K',
    isSentencePack: true,
    seoTitle: 'Chinese Pro Mastery Sentence Pack - 20,000 Extensive Sentences PDF',
    seoDescription: '20,000 extensive Chinese sentences for deep linguistic immersion. A massive expansion for serious Mandarin learners. Instant PDF download — bonus TSV and JSON included for Anki and any flashcard app.'
  },
  {
    id: 'master-sentences',
    name: 'Master Sentence Pack',
    description: '30,000 ultimate sentences. The complete linguistic database for native-level fluency.',
    price: '89.99',
    link: 'https://cililearnchinese.gumroad.com/l/master-sentences',
    image: sentencePackImg,
    tag: 'COMPLETE IMMERSION \u2022 30K',
    isSentencePack: true,
    featured: true,
    seoTitle: 'Chinese Master Sentence Pack - 30,000 Ultimate Sentences PDF',
    seoDescription: '30,000 ultimate Chinese sentences. The complete linguistic database for achieving native-level fluency. Instant PDF download — bonus TSV and JSON included for Anki and any flashcard app.'
  },
  {
    id: 'hsk6',
    name: 'HSK 6 Vocabulary',
    description: 'Master advanced Chinese with 2,500 core words accompanied by 5,000 example sentences.',
    price: '21.99',
    link: 'https://cililearnchinese.gumroad.com/l/hsk6-chinese-vocabulary-standard',
    image: hsk6Img,
    tag: 'Advanced',
    seoTitle: 'HSK 6 Vocabulary PDF - 2,500 Advanced Chinese Words & Sentences',
    seoDescription: 'Master advanced Chinese with 2,500 HSK 6 core words and up to 10,000 example sentences. Standard and Extended options. Instant PDF download — bonus TSV and JSON included for Anki and any flashcard app.',
    variants: [
      { id: 'standard', name: 'Standard Pack', price: '21.99', link: 'https://cililearnchinese.gumroad.com/l/hsk6-chinese-vocabulary-standard', image: hsk6Img, preview: hsk6Preview },
      { id: 'extended', name: 'Extended Pack', price: '26.99', link: 'https://cililearnchinese.gumroad.com/l/hsk6-chinese-vocabulary-extended', image: hsk6ExtendedImg, preview: hsk6ExtendedPreview }
    ]
  },
  {
    id: 'hsk5',
    name: 'HSK 5 Vocabulary',
    description: 'Bridge the gap to fluency with 1,300 essential upper-intermediate words and 2,600 examples.',
    price: '16.99',
    link: 'https://cililearnchinese.gumroad.com/l/hsk5-chinese-vocabulary-standard',
    image: hsk5Img,
    tag: 'Upper Intermediate',
    seoTitle: 'HSK 5 Vocabulary PDF - 1,300 Upper-Intermediate Chinese Words',
    seoDescription: 'Bridge the gap to Chinese fluency with 1,300 HSK 5 upper-intermediate words and up to 5,200 example sentences. Instant PDF download — bonus TSV and JSON included for Anki and any flashcard app.',
    variants: [
      { id: 'standard', name: 'Standard Pack', price: '16.99', link: 'https://cililearnchinese.gumroad.com/l/hsk5-chinese-vocabulary-standard', image: hsk5Img, preview: hsk5Preview },
      { id: 'extended', name: 'Extended Pack', price: '21.99', link: 'https://cililearnchinese.gumroad.com/l/hsk5-chinese-vocabulary-extended', image: hsk5ExtendedImg, preview: hsk5ExtendedPreview }
    ]
  },
  {
    id: 'hsk4',
    name: 'HSK 4 Vocabulary',
    description: 'Solidify your foundation with 600 intermediate words and 1,200 practical examples.',
    price: '11.99',
    link: 'https://cililearnchinese.gumroad.com/l/hsk4-chinese-vocabulary-standard',
    image: hsk4Img,
    tag: 'Intermediate',
    seoTitle: 'HSK 4 Vocabulary PDF - 600 Intermediate Chinese Words & Sentences',
    seoDescription: 'Solidify your Chinese foundation with 600 HSK 4 intermediate words and up to 2,400 practical example sentences. Instant PDF download — bonus TSV and JSON included for Anki and any flashcard app.',
    variants: [
      { id: 'standard', name: 'Standard Pack', price: '11.99', link: 'https://cililearnchinese.gumroad.com/l/hsk4-chinese-vocabulary-standard', image: hsk4Img, preview: hsk4Preview },
      { id: 'extended', name: 'Extended Pack', price: '16.99', link: 'https://cililearnchinese.gumroad.com/l/hsk4-chinese-vocabulary-extended', image: hsk4ExtendedImg, preview: hsk4ExtendedPreview }
    ]
  },
  {
    id: 'hsk3',
    name: 'HSK 3 Vocabulary',
    description: 'Move beyond the basics with 300 pre-intermediate words and 600 context-rich examples.',
    price: '7.99',
    link: 'https://cililearnchinese.gumroad.com/l/hsk3-chinese-vocabulary-standard',
    image: hsk3Img,
    tag: 'Pre-Intermediate',
    seoTitle: 'HSK 3 Vocabulary PDF - 300 Pre-Intermediate Chinese Words',
    seoDescription: 'Move beyond the basics with 300 HSK 3 pre-intermediate words and up to 1,200 context-rich example sentences. Instant PDF download — bonus TSV and JSON included for Anki and any flashcard app.',
    variants: [
      { id: 'standard', name: 'Standard Pack', price: '7.99', link: 'https://cililearnchinese.gumroad.com/l/hsk3-chinese-vocabulary-standard', image: hsk3Img, preview: hsk3Preview },
      { id: 'extended', name: 'Extended Pack', price: '11.99', link: 'https://cililearnchinese.gumroad.com/l/hsk3-chinese-vocabulary-extended', image: hsk3ExtendedImg, preview: hsk3ExtendedPreview }
    ]
  },
  {
    id: 'hsk2',
    name: 'HSK 2 Vocabulary',
    description: 'Expand your vocabulary with 150 beginner words and 300 easy-to-understand sentences.',
    price: '4.99',
    link: 'https://cililearnchinese.gumroad.com/l/hsk2-chinese-vocabulary-standard',
    image: hsk2Img,
    tag: 'Beginner',
    seoTitle: 'HSK 2 Vocabulary PDF - 150 Beginner Chinese Words & Sentences',
    seoDescription: 'Expand your Chinese vocabulary with 150 HSK 2 beginner words and up to 600 easy-to-understand example sentences. Instant PDF download — bonus TSV and JSON included for Anki and any flashcard app.',
    variants: [
      { id: 'standard', name: 'Standard Pack', price: '4.99', link: 'https://cililearnchinese.gumroad.com/l/hsk2-chinese-vocabulary-standard', image: hsk2Img, preview: hsk2Preview },
      { id: 'extended', name: 'Extended Pack', price: '7.99', link: 'https://cililearnchinese.gumroad.com/l/hsk2-chinese-vocabulary-extended', image: hsk2ExtendedImg, preview: hsk2ExtendedPreview }
    ]
  },
  {
    id: 'hsk1',
    name: 'HSK 1 Vocabulary',
    description: 'Start your journey. Learn the absolute essential 150 words and 300 foundational sentences.',
    price: '2.99',
    link: 'https://cililearnchinese.gumroad.com/l/hsk1-chinese-vocabulary-standard',
    image: hsk1Img,
    tag: 'Absolute Beginner',
    seoTitle: 'HSK 1 Vocabulary PDF - 150 Essential Chinese Words for Beginners',
    seoDescription: 'Start your Chinese journey with 150 essential HSK 1 words and up to 600 foundational example sentences with Pinyin. Instant PDF download — bonus TSV and JSON included for Anki and any flashcard app.',
    variants: [
      { id: 'standard', name: 'Standard Pack', price: '2.99', link: 'https://cililearnchinese.gumroad.com/l/hsk1-chinese-vocabulary-standard', image: hsk1Img, preview: hsk1Preview },
      { id: 'extended', name: 'Extended Pack', price: '4.99', link: 'https://cililearnchinese.gumroad.com/l/hsk1-chinese-vocabulary-extended', image: hsk1ExtendedImg, preview: hsk1ExtendedPreview }
    ]
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getRelatedProducts(currentId: string, limit = 3): Product[] {
  const current = getProductById(currentId);
  if (!current) return products.slice(0, limit);

  return products
    .filter(p => p.id !== currentId)
    .filter(p => {
      if (current.isBundle) return p.isBundle;
      if (current.isSentencePack) return p.isSentencePack;
      return !p.isBundle && !p.isSentencePack;
    })
    .slice(0, limit);
}
