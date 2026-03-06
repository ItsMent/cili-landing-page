import { useState, useEffect } from 'react';
import { Infinity, Zap, ShieldCheck, X, CheckCircle } from 'lucide-react';
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

const products = [
  {
    id: 'hsk1-6',
    name: 'HSK 1\u20136 Complete Vocabulary & Sentence Pack',
    description: 'The ultimate bundle. Get all 5,000 HSK words precisely mapped to beautifully formatted example sentences with Pinyin and translations. Includes all Extended versions.',
    price: '49.99',
    originalPrice: '77.94',
    link: 'https://cililearnchinese.gumroad.com/l/hsk1-6-sentence-pack',
    preview: hsk6ExtendedPreview,
    image: bundleImg,
    featured: true,
    tag: '👑 BEST VALUE \u2022 SAVE 35%'
  },
  {
    id: 'hsk6',
    name: 'HSK 6 Vocabulary',
    description: 'Master advanced Chinese with 2,500 core words accompanied by 5,000 example sentences.',
    price: '19.99',
    link: 'https://cililearnchinese.gumroad.com/l/hsk6-vocab-sentences',
    image: hsk6Img,
    tag: 'Advanced',
    variants: [
      { id: 'standard', name: 'Standard Pack', price: '19.99', link: 'https://cililearnchinese.gumroad.com/l/hsk6-vocab-sentences?tier=Standard%20Pack', image: hsk6Img, preview: hsk6Preview },
      { id: 'extended', name: 'Extended Pack', price: '24.99', link: 'https://cililearnchinese.gumroad.com/l/hsk6-vocab-sentences?tier=Extended%20Pack', image: hsk6ExtendedImg, preview: hsk6ExtendedPreview }
    ]
  },
  {
    id: 'hsk5',
    name: 'HSK 5 Vocabulary',
    description: 'Bridge the gap to fluency with 1,300 essential upper-intermediate words and 2,600 examples.',
    price: '14.99',
    link: 'https://cililearnchinese.gumroad.com/l/hsk5-vocab-sentences',
    image: hsk5Img,
    tag: 'Upper Intermediate',
    variants: [
      { id: 'standard', name: 'Standard Pack', price: '14.99', link: 'https://cililearnchinese.gumroad.com/l/hsk5-vocab-sentences?tier=Standard%20Pack', image: hsk5Img, preview: hsk5Preview },
      { id: 'extended', name: 'Extended Pack', price: '19.99', link: 'https://cililearnchinese.gumroad.com/l/hsk5-vocab-sentences?tier=Extended%20Pack', image: hsk5ExtendedImg, preview: hsk5ExtendedPreview }
    ]
  },
  {
    id: 'hsk4',
    name: 'HSK 4 Vocabulary',
    description: 'Solidify your foundation with 600 intermediate words and 1,200 practical examples.',
    price: '9.99',
    link: 'https://cililearnchinese.gumroad.com/l/hsk4-vocab-sentences',
    image: hsk4Img,
    tag: 'Intermediate',
    variants: [
      { id: 'standard', name: 'Standard Pack', price: '9.99', link: 'https://cililearnchinese.gumroad.com/l/hsk4-vocab-sentences?tier=Standard%20Pack', image: hsk4Img, preview: hsk4Preview },
      { id: 'extended', name: 'Extended Pack', price: '14.99', link: 'https://cililearnchinese.gumroad.com/l/hsk4-vocab-sentences?tier=Extended%20Pack', image: hsk4ExtendedImg, preview: hsk4ExtendedPreview }
    ]
  },
  {
    id: 'hsk3',
    name: 'HSK 3 Vocabulary',
    description: 'Move beyond the basics with 300 pre-intermediate words and 600 context-rich examples.',
    price: '6.99',
    link: 'https://cililearnchinese.gumroad.com/l/hsk3-vocabulary-sentences',
    image: hsk3Img,
    tag: 'Pre-Intermediate',
    variants: [
      { id: 'standard', name: 'Standard Pack', price: '6.99', link: 'https://cililearnchinese.gumroad.com/l/hsk3-vocabulary-sentences?tier=Standard%20Pack', image: hsk3Img, preview: hsk3Preview },
      { id: 'extended', name: 'Extended Pack', price: '9.99', link: 'https://cililearnchinese.gumroad.com/l/hsk3-vocabulary-sentences?tier=Extended%20Pack', image: hsk3ExtendedImg, preview: hsk3ExtendedPreview }
    ]
  },
  {
    id: 'hsk2',
    name: 'HSK 2 Vocabulary',
    description: 'Expand your vocabulary with 150 beginner words and 300 easy-to-understand sentences.',
    price: '3.99',
    link: 'https://cililearnchinese.gumroad.com/l/hsk2-vocabulary-sentences',
    image: hsk2Img,
    tag: 'Beginner',
    variants: [
      { id: 'standard', name: 'Standard Pack', price: '3.99', link: 'https://cililearnchinese.gumroad.com/l/hsk2-vocabulary-sentences?tier=Standard%20Pack', image: hsk2Img, preview: hsk2Preview },
      { id: 'extended', name: 'Extended Pack', price: '5.99', link: 'https://cililearnchinese.gumroad.com/l/hsk2-vocabulary-sentences?tier=Extended%20Pack', image: hsk2ExtendedImg, preview: hsk2ExtendedPreview }
    ]
  },
  {
    id: 'hsk1',
    name: 'HSK 1 Vocabulary',
    description: 'Start your journey. Learn the absolute essential 150 words and 300 foundational sentences.',
    price: '0.99',
    link: 'https://cililearnchinese.gumroad.com/l/hsk1-vocabulary-sentences',
    image: hsk1Img,
    tag: 'Absolute Beginner',
    variants: [
      { id: 'standard', name: 'Standard Pack', price: '0.99', link: 'https://cililearnchinese.gumroad.com/l/hsk1-vocabulary-sentences?option=nnqHAChNGQ0rZrU4bq85RQ%3D%3D', image: hsk1Img, preview: hsk1Preview },
      { id: 'extended', name: 'Extended Pack', price: '1.99', link: 'https://cililearnchinese.gumroad.com/l/hsk1-vocabulary-sentences?option=IfNGuZzGS2XZ4CWWAAQUKw%3D%3D', image: hsk1ExtendedImg, preview: hsk1ExtendedPreview }
    ]
  }
];

type ProductType = Omit<typeof products[0], 'variants'> & {
  variants?: { id: string, name: string, price: string, link: string, image?: string, preview?: string }[];
  originalPrice?: string;
  preview?: string;
};

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
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
            CILI
          </div>
          <a href="#products" className="btn btn-primary" style={{ padding: '10px 24px' }}>
            Shop Materials
          </a>
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

            <div className="products-grid">
              {products.map((product) => (
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
                      <div className="price">
                        ${product.price}{product.variants ? '+' : ''}
                        {product.originalPrice && <span className="original-price">${product.originalPrice}</span>}
                      </div>
                      <div className="card-actions" style={{ display: 'flex', gap: '8px' }}>
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
              <div className="modal-image-col">
                <img
                  src={selectedProduct.variants && selectedProduct.variants[selectedVariantIndex]?.image
                    ? selectedProduct.variants[selectedVariantIndex].image
                    : selectedProduct.image}
                  alt={selectedProduct.name}
                  className="modal-image"
                />
              </div>
              <div className="modal-info-col">
                <span className="product-tag">{selectedProduct.tag}</span>
                <h2>{selectedProduct.name}</h2>
                <div className="modal-price">
                  ${selectedProduct.variants ? selectedProduct.variants[selectedVariantIndex].price : selectedProduct.price}
                  {selectedProduct.originalPrice && <span className="modal-original-price">${selectedProduct.originalPrice}</span>}
                </div>

                {selectedProduct.variants && (
                  <div className="variant-selectors">
                    {selectedProduct.variants.map((v, i) => (
                      <button
                        key={v.id}
                        className={`variant-btn ${i === selectedVariantIndex ? 'active' : ''}`}
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

                <p className="modal-desc">{selectedProduct.description}</p>

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

      <footer>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={ciliLogo} alt="CILI Logo" style={{ width: '48px', height: '48px', marginBottom: '16px', opacity: 0.8 }} />
          <p>&copy; {new Date().getFullYear()} CILI Learn Chinese. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
