import { useState, useEffect } from 'react';
import { Infinity, Zap, ShieldCheck, X, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import './index.css';

// Import Assets
import bundleImg from './assets/Cili - CoverForGumRoad/Hsk1-6Bundle V2.png';
import hsk6Img from './assets/Cili - CoverForGumRoad/HSK_6_Vocabulary 2500 Words 5000 Example Sentences.png';
import hsk6ExtendedImg from './assets/Cili - CoverForGumRoad/HSK_6_Vocabulary 2500 Words 10000 Example Sentences.png';
import hsk5Img from './assets/Cili - CoverForGumRoad/HSK_5_Vocabulary 1300 Words 2600 Example Sentences.png';
import hsk5ExtendedImg from './assets/Cili - CoverForGumRoad/HSK_5_Vocabulary 1300 Words 5200 Example Sentences.png';
import hsk4Img from './assets/Cili - CoverForGumRoad/HSK_4_Vocabulary 600 Words 1200 Example Sentences.png';
import hsk4ExtendedImg from './assets/Cili - CoverForGumRoad/HSK_4_Vocabulary 600 Words 2400 Example Sentences.png';
import hsk3Img from './assets/Cili - CoverForGumRoad/HSK_3_Vocabulary 300 Words 600 Example Sentences.png';
import hsk3ExtendedImg from './assets/Cili - CoverForGumRoad/HSK_3_Vocabulary 300 Words 1200 Example Sentences.png';
import hsk2Img from './assets/Cili - CoverForGumRoad/HSK_2_Vocabulary 150 Words 300 Example Sentences.png';
import hsk2ExtendedImg from './assets/Cili - CoverForGumRoad/HSK_2_Vocabulary 150 Words 600 Example Sentences.png';
import hsk1Img from './assets/Cili - CoverForGumRoad/HSK_1_Vocabulary 150 Words 300 Example Sentences.png';
import hsk1ExtendedImg from './assets/Cili - CoverForGumRoad/HSK_1_Vocabulary 150 Words 600 Example Sentences.png';
import hsk6Preview from './assets/Samples/hsk6-preview.pdf';
import hsk6ExtendedPreview from './assets/Samples/hsk6-extended-preview.pdf';
import hsk5Preview from './assets/Samples/hsk5-preview.pdf';
import hsk5ExtendedPreview from './assets/Samples/hsk5-extended-preview.pdf';
import hsk4Preview from './assets/Samples/hsk4-preview.pdf';
import hsk4ExtendedPreview from './assets/Samples/hsk4-extended-preview.pdf';
import hsk3Preview from './assets/Samples/hsk3-preview.pdf';
import hsk3ExtendedPreview from './assets/Samples/hsk3-extended-preview.pdf';
import hsk2Preview from './assets/Samples/hsk2-preview.pdf';
import hsk2ExtendedPreview from './assets/Samples/hsk2-extended-preview.pdf';
import hsk1Preview from './assets/Samples/hsk1-preview.pdf';
import hsk1ExtendedPreview from './assets/Samples/hsk1-extended-preview.pdf';
import laptopImg from './assets/Samples/Laptop v2.png';
import sampleHsk2x from './assets/Samples/Sample Hsk 2x.jpeg';
import sampleHsk4x from './assets/Samples/Sample Hsk 4x.jpeg';
import ciliLogo from './assets/CILI.png';
import tiktokIcon from './assets/Icons/tiktokpng.png';

const products = [
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
    id: 'hsk6',
    name: 'HSK 6 Vocabulary',
    description: 'Master advanced Chinese with 2,500 core words accompanied by 5,000 example sentences.',
    price: '21.99',
    link: 'https://cililearnchinese.gumroad.com/l/hsk6-chinese-vocabulary-standard',
    image: hsk6Img,
    tag: 'Advanced',
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
    variants: [
      { id: 'standard', name: 'Standard Pack', price: '2.99', link: 'https://cililearnchinese.gumroad.com/l/hsk1-chinese-vocabulary-standard', image: hsk1Img, preview: hsk1Preview },
      { id: 'extended', name: 'Extended Pack', price: '4.99', link: 'https://cililearnchinese.gumroad.com/l/hsk1-chinese-vocabulary-extended', image: hsk1ExtendedImg, preview: hsk1ExtendedPreview }
    ]
  }
];

type ProductType = Omit<typeof products[0], 'variants'> & {
  variants?: { id: string, name: string, price: string, link: string, image?: string, preview?: string, originalPrice?: string, description?: string, bundleImages?: string[] }[];
  originalPrice?: string;
  preview?: string;
  bundleImages?: string[];
};

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const faqs = [
    {
      question: "Are these physically shipped books?",
      answer: "No, CILI materials are digital PDF workbooks. This allows for instant delivery so you can start studying immediately after checkout. You can print them or use them on any device."
    },
    {
      question: "Can I print the materials?",
      answer: "Yes! All our PDFs are high-resolution and professionally formatted for standard A4 and US Letter printing. They looks great both on screen and on paper."
    },
    {
      question: "What's the difference between Standard and Extended?",
      answer: "Standard packs include 2 example sentences per vocabulary word. Extended packs provide deep immersion with 4 unique example sentences per word, giving you double the context."
    },
    {
      question: "How do I receive my download?",
      answer: "After a secure checkout via Gumroad, you'll receive an instant download link on the confirmation page. You'll also get an email with a permanent link to your library."
    }
  ];

  const slides = [laptopImg, sampleHsk2x, sampleHsk4x];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <header>
        <div className="container nav-container">
          <div className="logo">
            <img src={ciliLogo} alt="CILI Logo" style={{ width: '32px', height: '32px' }} />
            CILI - Learn Chinese
          </div>
          <div className="nav-actions">
            <a href="https://www.tiktok.com/@cililingo" target="_blank" rel="noopener noreferrer" className="tiktok-nav-link" aria-label="Follow us on TikTok">
              <img src={tiktokIcon} alt="TikTok" className="tiktok-icon-img" />
            </a>
            <a href="#products" className="btn btn-primary" style={{ padding: '10px 24px' }}>
              Shop Materials
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-glow"></div>
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1>Unlock Your <br /><span>Chinese Fluency</span></h1>
                <p>
                  Accelerate your learning curve with our premium, meticulously formatted learning materials and study resources. Clear context for your studies.
                </p>
                <div className="hero-actions">
                  <a href="#products" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1.125rem' }}>
                    View Products
                  </a>
                </div>
              </div>
              <div className="hero-image-container">
                <div className="slider-container">
                  <div
                    className="slider-track"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {slides.map((slide, index) => (
                      <div className="slider-slide" key={index}>
                        <img src={slide} alt={`CILI Preview ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                  <div className="slider-dots">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <Zap size={24} color="var(--primary)" />
                </div>
                <h4>Instant Download</h4>
                <p>Get immediate access to beautifully formatted, high-resolution PDF workbooks that look great on any device.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <ShieldCheck size={24} color="var(--primary)" />
                </div>
                <h4>Accurate Context</h4>
                <p>Learn safely knowing every word, Pinyin mapping, and English translation is thoroughly verified.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <Infinity size={24} color="var(--primary)" />
                </div>
                <h4>Keep Forever</h4>
                <p>Lifetime access means you buy once and own the reference materials forever, including all future updates.</p>
              </div>
            </div>
          </div>
        </section>



        <section id="products" className="products-section">
          <div className="container">
            <div className="section-title">
              <h2>Select Your Learning Materials</h2>
              <p>Ready to upgrade your study routine? Secure checkout powered by Gumroad.</p>
            </div>

            <div id="bundles" className="bundles-header">
              <h3>Value Bundles</h3>
              <div className="bundles-divider"></div>
            </div>

            <div className="products-grid bundles-grid">
              {products.filter(p => p.isBundle).map((product) => (
                <div
                  key={product.id}
                  className={`product-card bundle-card ${product.featured ? 'featured' : ''}`}
                  onClick={() => {
                    setSelectedProduct(product as ProductType);
                    setSelectedVariantIndex(0);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="product-image-wrapper">
                    {product.bundleImages ? (
                      <div className="bundle-image-stack">
                        {product.bundleImages.map((imgSrc, idx, arr) => {
                          const isSpread = arr.length === 3;
                          return (
                            <img
                              key={idx}
                              src={imgSrc}
                              alt=""
                              className="stacked-img"
                              style={{
                                '--offsetX': isSpread ? `${(idx - 1) * 60}px` : `${(idx - (arr.length - 1) / 2) * 12}px`,
                                '--offsetY': isSpread ? `0px` : `${-(idx - (arr.length - 1) / 2) * 12}px`,
                                '--hoverOffsetX': isSpread ? `${(idx - 1) * 90}px` : `${(idx - (arr.length - 1) / 2) * 20}px`,
                                '--hoverOffsetY': isSpread ? `-10px` : `${-(idx - (arr.length - 1) / 2) * 20}px`,
                                zIndex: idx + 1
                              } as React.CSSProperties}
                              loading="lazy"
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
                    )}
                  </div>
                  <div className="product-content">
                    <span className="product-tag">{product.tag}</span>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-footer">
                      <div className="price-container">
                        <div className="price">
                          ${product.price}
                        </div>
                        {product.originalPrice && <span className="original-price">${product.originalPrice}</span>}
                      </div>
                      <div className="card-actions">
                        <a
                          href={product.variants && product.variants.length > 0 ? product.variants[0].preview : product.preview}
                          className="btn-preview-card"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          Preview
                        </a>
                        <a
                          href={product.variants && product.variants.length > 0 ? "#" : product.link}
                          className="btn-buy"
                          data-gumroad-overlay-checkout={product.variants && product.variants.length > 0 ? undefined : "true"}
                          target={product.variants && product.variants.length > 0 ? undefined : "_blank"}
                          rel={product.variants && product.variants.length > 0 ? undefined : "noopener noreferrer"}
                          onClick={(e) => {
                            if (product.variants && product.variants.length > 0) {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedProduct(product as ProductType);
                              setSelectedVariantIndex(0);
                            } else {
                              e.stopPropagation();
                            }
                          }}
                        >
                          {product.variants && product.variants.length > 0 ? 'Select Options' : 'Buy Now'}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bottom-gradient-section">
              <div id="individual-levels" className="bundles-header" style={{ marginTop: '80px' }}>
                <h3>Individual Levels</h3>
                <div className="bundles-divider"></div>
              </div>

              <div className="products-grid">
                {products.filter(p => !p.isBundle).map((product) => (
                  <div
                    key={product.id}
                    className={`product-card ${product.featured ? 'featured' : ''}`}
                    onClick={() => {
                      setSelectedProduct(product as ProductType);
                      setSelectedVariantIndex(0);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="product-image-wrapper">
                      <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
                    </div>
                    <div className="product-content">
                      <span className="product-tag">{product.tag}</span>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <div className="product-footer">
                        <div className="price-container">
                          <div className="price">
                            ${product.price}
                          </div>
                          {product.originalPrice && <span className="original-price">${product.originalPrice}</span>}
                        </div>
                        <div className="card-actions">
                          <a
                            href={product.variants && product.variants.length > 0 ? product.variants[0].preview : product.preview}
                            className="btn-preview-card"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            Preview
                          </a>
                          <a
                            href={product.variants && product.variants.length > 0 ? "#" : product.link}
                            className="btn-buy"
                            data-gumroad-overlay-checkout={product.variants && product.variants.length > 0 ? undefined : "true"}
                            target={product.variants && product.variants.length > 0 ? undefined : "_blank"}
                            rel={product.variants && product.variants.length > 0 ? undefined : "noopener noreferrer"}
                            onClick={(e) => {
                              if (product.variants && product.variants.length > 0) {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedProduct(product as ProductType);
                                setSelectedVariantIndex(0);
                              } else {
                                e.stopPropagation();
                              }
                            }}
                          >
                            {product.variants && product.variants.length > 0 ? 'Select Options' : 'Buy Now'}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="container">
            <div className="section-title">
              <h2>Frequently Asked Questions</h2>
              <p>Everything you need to know about CILI learning materials.</p>
            </div>
            <div className="faq-grid">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <div className="faq-question">
                    {faq.question}
                    {activeFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>
              <X size={24} />
            </button>
            <div className="modal-grid">
              <div className="modal-image-col" key={selectedVariantIndex}>
                {selectedProduct.variants && selectedProduct.variants[selectedVariantIndex]?.bundleImages ? (
                  <div className="bundle-image-stack modal-stack">
                    {selectedProduct.variants[selectedVariantIndex].bundleImages!.map((imgSrc, idx, arr) => {
                      const isSpread = arr.length === 3;
                      return (
                        <img
                          key={idx}
                          src={imgSrc}
                          alt=""
                          className="stacked-img"
                          style={{
                            '--offsetX': isSpread ? `${(idx - 1) * 70}px` : `${(idx - (arr.length - 1) / 2) * 16}px`,
                            '--offsetY': isSpread ? `0px` : `${-(idx - (arr.length - 1) / 2) * 16}px`,
                            '--hoverOffsetX': isSpread ? `${(idx - 1) * 100}px` : `${(idx - (arr.length - 1) / 2) * 24}px`,
                            '--hoverOffsetY': isSpread ? `-15px` : `${-(idx - (arr.length - 1) / 2) * 24}px`,
                            zIndex: idx + 1
                          } as React.CSSProperties}
                        />
                      );
                    })}
                  </div>
                ) : selectedProduct.bundleImages ? (
                  <div className="bundle-image-stack modal-stack">
                    {selectedProduct.bundleImages.map((imgSrc, idx, arr) => {
                      const isSpread = arr.length === 3;
                      return (
                        <img
                          key={idx}
                          src={imgSrc}
                          alt=""
                          className="stacked-img"
                          style={{
                            '--offsetX': isSpread ? `${(idx - 1) * 70}px` : `${(idx - (arr.length - 1) / 2) * 16}px`,
                            '--offsetY': isSpread ? `0px` : `${-(idx - (arr.length - 1) / 2) * 16}px`,
                            '--hoverOffsetX': isSpread ? `${(idx - 1) * 100}px` : `${(idx - (arr.length - 1) / 2) * 24}px`,
                            '--hoverOffsetY': isSpread ? `-15px` : `${-(idx - (arr.length - 1) / 2) * 24}px`,
                            zIndex: idx + 1
                          } as React.CSSProperties}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <img
                    src={selectedProduct.variants && selectedProduct.variants[selectedVariantIndex]?.image
                      ? selectedProduct.variants[selectedVariantIndex].image
                      : selectedProduct.image}
                    alt={selectedProduct.name}
                    className="modal-image"
                  />
                )}
              </div>
              <div className="modal-info-col">
                <span className="product-tag">{selectedProduct.tag}</span>
                <h2>{selectedProduct.name}</h2>
                <div className="modal-price">
                  ${selectedProduct.variants ? selectedProduct.variants[selectedVariantIndex].price : selectedProduct.price}
                  {(selectedProduct.variants ? selectedProduct.variants[selectedVariantIndex].originalPrice : selectedProduct.originalPrice) && (
                    <span className="modal-original-price">
                      ${selectedProduct.variants ? selectedProduct.variants[selectedVariantIndex].originalPrice : selectedProduct.originalPrice}
                    </span>
                  )}
                </div>

                {selectedProduct.variants && (
                  <div className="variant-selectors-container">
                    <div
                      className="variant-sliding-bg"
                      style={{
                        width: `${100 / selectedProduct.variants.length}%`,
                        transform: `translateX(${selectedVariantIndex * 100}%)`
                      }}
                    />
                    {selectedProduct.variants.map((v, i) => (
                      <button
                        key={v.id}
                        className={`variant-tab ${i === selectedVariantIndex ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVariantIndex(i);
                        }}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                )}

                <p className="modal-desc">
                  {selectedProduct.variants && selectedProduct.variants[selectedVariantIndex].description
                    ? selectedProduct.variants[selectedVariantIndex].description
                    : selectedProduct.description}
                </p>

                <div className="modal-features">
                  <div className="modal-feature">
                    <CheckCircle size={18} color="var(--primary)" />
                    <span>Instant Digital Download (PDF)</span>
                  </div>
                  <div className="modal-feature">
                    <CheckCircle size={18} color="var(--primary)" />
                    <span>Original Chinese Characters & Pinyin</span>
                  </div>
                  <div className="modal-feature">
                    <CheckCircle size={18} color="var(--primary)" />
                    <span>Professional English Translations</span>
                  </div>
                  <div className="modal-feature" style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <ShieldCheck size={18} color="#10B981" />
                    <span style={{ color: '#10B981' }}>High-Quality Guarantee</span>
                  </div>
                </div>

                <div className="modal-actions">
                  <a
                    href={selectedProduct.variants ? selectedProduct.variants[selectedVariantIndex].preview : selectedProduct.preview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-preview"
                    style={{ textDecoration: 'none' }}
                  >
                    Preview
                  </a>
                  <a
                    href={selectedProduct.variants ? selectedProduct.variants[selectedVariantIndex].link : selectedProduct.link}
                    className="btn-buy modal-btn-buy"
                    data-gumroad-overlay-checkout="true"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy Now
                  </a>
                </div>
                <p className="modal-secure-text">Secure 1-click checkout powered by Gumroad</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo" style={{ marginBottom: '16px' }}>
                <img src={ciliLogo} alt="CILI Logo" style={{ width: '32px', height: '32px' }} />
                CILI - Learn Chinese
              </div>
              <p>Premium HSK study materials designed for the modern learner. Master Chinese with context, one sentence at a time.</p>
            </div>
            <div className="footer-links">
              <h4>Resources</h4>
              <ul>
                <li><a href="#bundles">Bundles</a></li>
                <li><a href="#individual-levels">Individual Levels</a></li>
                <li><a href="#privacy" onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }}>Privacy Policy</a></li>
              </ul>
            </div>
            <div className="footer-social">
              <h4>Join the Community</h4>
              <p>Follow us for daily Chinese learning tips and study motivation.</p>
              <div className="social-links">
                <a href="https://www.tiktok.com/@cililingo" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="TikTok">
                  <img src={tiktokIcon} alt="TikTok" className="tiktok-icon-img" />
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} CILI Learn Chinese. All rights reserved.</p>
            <p>Secure payments by Gumroad</p>
          </div>
        </div>
      </footer>

      {showPrivacy && (
        <div className="modal-overlay" onClick={() => setShowPrivacy(false)}>
          <div className="modal-content privacy-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPrivacy(false)}>
              <X size={24} />
            </button>
            <div className="modal-info-col" style={{ padding: '48px', width: '100%', border: 'none' }}>
              <h2 style={{ marginBottom: '24px' }}>Privacy Policy</h2>
              <div className="modal-desc" style={{ textAlign: 'left', maxHeight: '400px', overflowY: 'auto', paddingRight: '20px' }}>
                <p>Welcome to <strong>CILI - Learn Chinese</strong>. Your privacy is critically important to us.</p>

                <h4 style={{ color: 'white', marginTop: '24px', marginBottom: '8px' }}>1. Information We Collect</h4>
                <p>We do not collect personal information directly on this website. All transactions are handled securely by **Gumroad**. When you purchase a product, Gumroad collects your email address and payment details to fulfill your order. Please refer to <a href="https://gumroad.com/privacy" target="_blank" style={{ color: 'var(--primary)' }}>Gumroad's Privacy Policy</a> for more details.</p>

                <h4 style={{ color: 'white', marginTop: '24px', marginBottom: '8px' }}>2. Digital Products</h4>
                <p>All CILI products are digital PDF files. Once a purchase is confirmed, you will receive an automated email from Gumroad with your download links. These files are for personal use only.</p>

                <h4 style={{ color: 'white', marginTop: '24px', marginBottom: '8px' }}>3. Cookies</h4>
                <p>This site may use basic session cookies to ensure the website functions correctly and to remember your preferences (such as which product you last viewed).</p>

                <h4 style={{ color: 'white', marginTop: '24px', marginBottom: '8px' }}>4. Contact</h4>
                <p>If you have any questions regarding your purchase or these policies, please contact us via our social media channels listed in the footer.</p>
              </div>
              <button
                className="btn btn-primary"
                style={{ marginTop: '32px', width: '100%' }}
                onClick={() => setShowPrivacy(false)}
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
