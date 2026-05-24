import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Infinity, Zap, ShieldCheck, X, CheckCircle, ChevronDown, ChevronUp, Search, Code, Database, Terminal, Menu, FileText, Layers, Cpu, MessageSquare } from 'lucide-react';
import './index.css';

import { products, type Product } from './data/products';
import SkeletonImage from './components/SkeletonImage';
import ProductPage from './pages/ProductPage';

import laptopImg from './assets/Samples/Laptop v2.png';
import sampleHsk2x from './assets/Samples/Sample Hsk 2x.jpeg';
import sampleHsk4x from './assets/Samples/Sample Hsk 4x.jpeg';
import ciliLogo from './assets/CILI.png';
import tiktokIcon from './assets/Icons/tiktokpng.png';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products/:productId" element={<ProductPage />} />
    </Routes>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'hsk' | 'sentences'>('hsk');
  const [activeCategory, setActiveCategory] = useState<'all' | 'bundles' | 'hsk-levels'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showComingSoon] = useState(false);

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
    },
    {
      question: "What HSK levels do you cover?",
      answer: "We cover all six HSK levels (HSK 1 through HSK 6), totaling over 5,000 vocabulary words. Each level is available individually or as value bundles (HSK 1–3, HSK 4–6, and the complete HSK 1–6 pack)."
    },
    {
      question: "How many words and sentences are included in each HSK level?",
      answer: "HSK 1: 150 words (300–600 sentences). HSK 2: 150 words (300–600 sentences). HSK 3: 300 words (600–1,200 sentences). HSK 4: 600 words (1,200–2,400 sentences). HSK 5: 1,300 words (2,600–5,200 sentences). HSK 6: 2,500 words (5,000–10,000 sentences). The range depends on whether you choose Standard (2 sentences per word) or Extended (4 sentences per word)."
    },
    {
      question: "Can I use these with Anki or other flashcard apps?",
      answer: "Yes. Every pack ships with a tab-separated TSV file alongside the PDF — it imports directly into Anki, Quizlet, Mochi, RemNote, Pleco, and any flashcard app that accepts TSV/CSV. A structured JSON is also included for developers and custom workflows."
    },
    {
      question: "Are the Chinese characters simplified or traditional?",
      answer: "All CILI materials use simplified Chinese characters, which is the standard for HSK exams and is used in mainland China. Each word includes Pinyin romanization and English translations for easy learning."
    }
  ];

  const slides = [laptopImg, sampleHsk2x, sampleHsk4x];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!location.hash) return;
    const id = location.hash.slice(1);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [isLoading, location.hash, location.key]);

  useEffect(() => {
    // Lock scroll when mobile menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  if (isLoading) {
    return (
      <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', padding: '100px 0' }}>
        <header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, borderBottom: '1px solid var(--border)', background: 'rgba(10, 15, 28, 0.85)', padding: '16px 0' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="skeleton" style={{ width: '120px', height: '32px' }}></div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="skeleton-circle skeleton"></div>
              <div className="skeleton skeleton-button" style={{ width: '100px' }}></div>
            </div>
          </div>
        </header>

        <main className="container">
          <section className="skeleton-hero-grid" style={{ display: 'grid', gap: '40px', alignItems: 'center', marginBottom: '80px', marginTop: '40px' }}>
            <div>
              <div className="skeleton skeleton-title" style={{ width: '80%', height: '60px', maxWidth: '400px' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '70%' }}></div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                <div className="skeleton skeleton-button" style={{ width: '160px', height: '50px' }}></div>
              </div>
            </div>
            <div className="skeleton skeleton-hero-image" style={{ width: '100%', height: '300px', borderRadius: 'var(--radius-lg)' }}></div>
          </section>

          <div className="skeleton-features-grid" style={{ display: 'grid', gap: '20px', marginBottom: '80px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-card" style={{ height: '120px' }}>
                <div className="skeleton skeleton-circle"></div>
                <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                <div className="skeleton skeleton-text"></div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="skeleton skeleton-title" style={{ width: '60%', maxWidth: '300px', margin: '0 auto 16px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '40%', maxWidth: '200px', margin: '0 auto' }}></div>
          </div>

          <div className="skeleton-products-grid" style={{ display: 'grid', gap: '24px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton" style={{ height: '180px', width: '100%', borderRadius: 'var(--radius-sm)' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '30%' }}></div>
                <div className="skeleton skeleton-title" style={{ height: '1.5rem', width: '70%' }}></div>
                <div className="skeleton skeleton-text"></div>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="skeleton skeleton-text" style={{ width: '25%', height: '2rem' }}></div>
                  <div className="skeleton skeleton-button" style={{ width: '100px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <header>
        <div className="container nav-container">
          <div className="logo" onClick={() => window.scrollTo(0, 0)} style={{ cursor: 'pointer' }}>
            <img src={ciliLogo} alt="CILI Logo" style={{ width: '32px', height: '32px' }} />
            CILI
          </div>

          <nav className="nav-links">
            <div className="nav-item">
              <span className="nav-link">Materials <ChevronDown size={14} /></span>
              <div className="dropdown-container">
                <div className="dropdown-inner">
                  <div className="dropdown-grid">
                    <div className="dropdown-section">
                      <h4>Learning Paths</h4>
                      <div className="dropdown-links">
                        <a href="#bundles" className="dropdown-item">
                          <div className="dropdown-icon"><Layers size={20} /></div>
                          <div className="dropdown-info">
                            <h5>Value Bundles</h5>
                            <p>HSK 1-6 complete collection.</p>
                          </div>
                        </a>
                        <a href="#hsk-levels" className="dropdown-item">
                          <div className="dropdown-icon"><FileText size={20} /></div>
                          <div className="dropdown-info">
                            <h5>HSK Workbooks</h5>
                            <p>Level-specific study guides.</p>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className="dropdown-section">
                      <h4>Immersion</h4>
                      <div className="dropdown-links">
                        <a href="#sentence-packs" className="dropdown-item">
                          <div className="dropdown-icon"><Zap size={20} /></div>
                          <div className="dropdown-info">
                            <h5>Sentence Packs</h5>
                            <p>Up to 30,000 native sentences.</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="nav-item">
              <span className="nav-link">Resources <ChevronDown size={14} /></span>
              <div className="dropdown-container">
                <div className="dropdown-inner">
                  <div className="dropdown-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="dropdown-section">
                      <h4>Developer</h4>
                      <div className="dropdown-links">
                        <a href="#dev" className="dropdown-item">
                          <div className="dropdown-icon"><Cpu size={20} /></div>
                          <div className="dropdown-info">
                            <h5>CILI Engine</h5>
                            <p>Developer data & JSON mapping.</p>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className="dropdown-section">
                      <h4>Support</h4>
                      <div className="dropdown-links">
                        <a href="#faq" className="dropdown-item">
                          <div className="dropdown-icon"><MessageSquare size={20} /></div>
                          <div className="dropdown-info">
                            <h5>FAQ</h5>
                            <p>Common questions answered.</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className="nav-actions">
            <a href="https://www.tiktok.com/@cililingo" target="_blank" rel="noopener noreferrer" className="tiktok-nav-link" aria-label="Follow us on TikTok">
              <img src={tiktokIcon} alt="TikTok" className="tiktok-icon-img" />
            </a>
            <a href="#products" className="btn btn-primary" style={{ padding: '10px 24px' }}>
              Shop Now
            </a>
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}>
        <a href="#products" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Products</a>
        <a href="#bundles" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Bundles</a>
        <a href="#sentence-packs" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Sentences</a>
        <a href="#dev" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Engine</a>
        <a href="#faq" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>FAQ</a>
        
        <div style={{ marginTop: '40px' }}>
          <a href="#products" className="btn btn-primary" style={{ padding: '16px 40px' }} onClick={() => setIsMenuOpen(false)}>
            Shop Now
          </a>
        </div>
      </div>

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
                        <SkeletonImage src={slide} alt={`CILI Preview ${index + 1}`} />
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
                <p>Get immediate access to beautifully formatted, high-resolution PDF workbooks that look great on any device. TSV and JSON files included as a bonus for Anki and flashcard apps.</p>
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

              <div className="main-tabs-container" style={{ marginTop: '48px', marginBottom: '32px' }}>
                <div className="main-tabs">
                  <div
                    className="main-tabs-sliding-bg"
                    style={{
                      width: 'calc(50% - 6px)',
                      transform: activeTab === 'hsk' ? 'translateX(0)' : 'translateX(100%)',
                      background: activeTab === 'hsk' ? 'var(--primary)' : 'linear-gradient(90deg, #8B5CF6, #D946EF)',
                      boxShadow: activeTab === 'hsk' ? '0 4px 15px var(--primary-glow)' : '0 4px 15px rgba(139, 92, 246, 0.4)'
                    }}
                  />
                  <button
                    className={`main-tab ${activeTab === 'hsk' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hsk')}
                  >
                    HSK Workbooks & Bundles
                  </button>
                  <button
                    className={`main-tab sentences-tab ${activeTab === 'sentences' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sentences')}
                  >
                    Sentence Mastery Packs
                  </button>
                </div>
              </div>

              <div className="search-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="search-input-wrapper">
                  <Search className="search-icon" size={20} />
                  <input
                    type="text"
                    placeholder={activeTab === 'hsk' ? "Search HSK levels and bundles..." : "Search sentence packs..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button className="search-clear" onClick={() => setSearchQuery('')}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {activeTab === 'hsk' && (
                <div className="filter-container" style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('all')}
                  >
                    All HSK
                  </button>
                  <button
                    className={`filter-btn ${activeCategory === 'bundles' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('bundles')}
                  >
                    Bundles
                  </button>
                  <button
                    className={`filter-btn ${activeCategory === 'hsk-levels' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('hsk-levels')}
                  >
                    Single Levels
                  </button>
                </div>
              )}
            </div>

            {activeTab === 'hsk' ? (
              <>
                {/* Bundles Section */}
                {(activeCategory === 'all' || activeCategory === 'bundles') && (
                  <div style={{ marginBottom: '80px' }}>
                    <div id="bundles" className="bundles-header">
                      <h3>Value Bundles</h3>
                      <div className="bundles-divider"></div>
                    </div>

                    <div className="products-grid bundles-grid">
                      {products.filter(p => p.isBundle && (
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.tag.toLowerCase().includes(searchQuery.toLowerCase())
                      )).map((product) => (
                        <div
                          key={product.id}
                          className={`product-card bundle-card ${product.featured ? 'featured' : ''}`}
                          onClick={() => navigate(`/products/${product.id}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="product-image-wrapper">
                            {product.bundleImages ? (
                              <div className="bundle-image-stack">
                                {product.bundleImages.map((imgSrc, idx, arr) => {
                                  const isSpread = arr.length === 3;
                                  return (
                                    <div
                                      key={idx}
                                      className="stacked-img"
                                      style={{
                                        position: 'absolute',
                                        width: '45%',
                                        '--offsetX': isSpread ? `${(idx - 1) * 60}px` : `${(idx - (arr.length - 1) / 2) * 12}px`,
                                        '--offsetY': isSpread ? `0px` : `${-(idx - (arr.length - 1) / 2) * 12}px`,
                                        '--hoverOffsetX': isSpread ? `${(idx - 1) * 90}px` : `${(idx - (arr.length - 1) / 2) * 20}px`,
                                        '--hoverOffsetY': isSpread ? `-10px` : `${-(idx - (arr.length - 1) / 2) * 20}px`,
                                        zIndex: idx + 1
                                      } as React.CSSProperties}
                                    >
                                      <SkeletonImage
                                        src={imgSrc}
                                        alt={`${product.name} - HSK level ${idx + 1} cover`}
                                        style={{ borderRadius: 'var(--radius-sm)', boxShadow: '-6px 6px 15px rgba(0, 0, 0, 0.5)' }}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <SkeletonImage src={product.image} alt={product.name} className="product-image" />
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
                                      navigate(`/products/${product.id}`);
                                    } else {
                                      e.stopPropagation();
                                    }
                                  }}
                                >
                                  {product.variants && product.variants.length > 0 ? 'View Details' : 'Buy Now'}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* HSK Levels Section */}
                {(activeCategory === 'all' || activeCategory === 'hsk-levels') && (
                  <div className="bottom-gradient-section">
                    <div id="hsk-levels" className="bundles-header" style={{ marginTop: '0' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h3>HSK Level Workbooks</h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', textTransform: 'none', letterSpacing: 'normal' }}>Comprehensive vocabulary and sentence mapping for specific HSK targets.</p>
                      </div>
                      <div className="bundles-divider"></div>
                    </div>

                    <div className="products-grid">
                      {products.filter(p => !p.isBundle && !p.isSentencePack && (
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.tag.toLowerCase().includes(searchQuery.toLowerCase())
                      )).map((product) => (
                        <div
                          key={product.id}
                          className={`product-card ${product.featured ? 'featured' : ''}`}
                          onClick={() => navigate(`/products/${product.id}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="product-image-wrapper">
                            <SkeletonImage src={product.image} alt={product.name} className="product-image" />
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
                                      navigate(`/products/${product.id}`);
                                    } else {
                                      e.stopPropagation();
                                    }
                                  }}
                                >
                                  {product.variants && product.variants.length > 0 ? 'View Details' : 'Buy Now'}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Sentence Packs Section */
              <div style={{ minHeight: '600px' }}>
                <div id="sentence-packs" className="bundles-header">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h3>Sentence Mastery Packs</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', textTransform: 'none', letterSpacing: 'normal' }}>High-volume sentence databases for intensive mining and total immersion.</p>
                  </div>
                  <div className="bundles-divider"></div>
                </div>

                <div className="sentence-premium-grid">
                  {products.filter(p => p.isSentencePack && (
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.tag.toLowerCase().includes(searchQuery.toLowerCase())
                  )).map((product) => {
                    // Extract sentence count for display
                    const countMatch = product.tag.match(/(\d+)K/i);
                    const count = countMatch ? countMatch[1] : '30';
                    const isFlagship = product.tag.includes('COMPLETE IMMERSION');
                    const isPopular = product.id === 'immersion-sentences';

                    return (
                      <div
                        key={product.id}
                        className={`sentence-card-v2 ${product.featured ? 'featured' : ''} ${isFlagship ? 'flagship' : ''}`}
                        onClick={() => navigate(`/products/${product.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="sentence-info">
                          <span className="tier-badge">{product.tag.split(' \u2022 ')[0]}</span>
                          <div className="sentence-count">
                            {count},000 <span>Sentences</span>
                          </div>
                          <h3>{product.name}</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>
                            {product.description}
                          </p>
                          <div className="price-tag" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            ${product.price}
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>Coming Soon</span>
                          </div>
                        </div>
                        {isFlagship && (
                          <div className="sentence-visual">
                            <SkeletonImage
                              src={product.image}
                              alt={product.name}
                              style={{ width: '100%', borderRadius: 'var(--radius-sm)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', height: 'auto' }}
                            />
                          </div>
                        )}
                        {isPopular && (
                          <div className="popular-badge">
                            <Zap size={14} fill="currentColor" />
                            Most Popular
                          </div>
                        )}
                        {isFlagship && (
                          <div className="flagship-badge-floating">
                            Flagship Choice
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="dev-section">
          <div className="container" id="dev">
            <div className="dev-grid">
              <div className="dev-content">
                <div className="dev-status-badge">
                  <Code size={14} />
                  Developer Resources
                </div>
                <h2>The CILI Engine <br /><span>Built for Data.</span></h2>
                <p>
                  Every sentence in our library is treated as high-quality linguistic data. We provide the structure you need for deep immersion and technical integration.
                </p>
                
                <div className="dev-features-list">
                  <div className="dev-feature-card">
                    <div className="dev-feature-icon">
                      <Database size={24} />
                    </div>
                    <div className="dev-feature-info">
                      <h4>Structured JSON Format</h4>
                      <p>Full access to IDs, simplified/traditional characters, verified pinyin, and semantic mapping.</p>
                    </div>
                  </div>
                  
                  <div className="dev-feature-card">
                    <div className="dev-feature-icon">
                      <Terminal size={24} />
                    </div>
                    <div className="dev-feature-info">
                      <h4>Study Pack Studio</h4>
                      <p>Our internal engine for generating custom PDF workbooks with precision layout and style control.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="dev-visual">
                <div className="dev-glow"></div>
                <div className="code-terminal">
                  <div className="terminal-header">
                    <div className="dot red"></div>
                    <div className="dot yellow"></div>
                    <div className="dot green"></div>
                    <span className="terminal-title">sentence_001.json</span>
                  </div>
                  <div className="terminal-body">
                    <span className="code-line"><span className="code-keyword">{"{"}</span></span>
                    <span className="code-line code-indent"><span className="code-key">"id"</span>: <span className="code-string">"81"</span>,</span>
                    <span className="code-line code-indent"><span className="code-key">"simplified"</span>: <span className="code-string">"我爱你"</span>,</span>
                    <span className="code-line code-indent"><span className="code-key">"pinyin"</span>: <span className="code-string">"wǒ ài nǐ"</span>,</span>
                    <span className="code-line code-indent"><span className="code-key">"english"</span>: <span className="code-string">"I love you"</span>,</span>
                    <span className="code-line code-indent"><span className="code-key">"level"</span>: <span className="code-number">1</span>,</span>
                    <span className="code-line code-indent"><span className="code-key">"tags"</span>: [<span className="code-string">"core"</span>, <span className="code-string">"immersion"</span>]</span>
                    <span className="code-line"><span className="code-keyword">{"}"}</span></span>
                    <span className="code-line code-comment" style={{marginTop: '16px'}}>// Precision mapping completed</span>
                    <span className="code-line code-comment">// Ready for export to Anki/Pleco</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="blitz-section">
          <div className="container">
            <div className="blitz-grid">
              <div className="blitz-content">
                <div className="blitz-badge">
                  <Zap size={14} fill="currentColor" />
                  Free to Play
                </div>
                <h2>CILI Blitz<br /><span>Learn Chinese by Playing.</span></h2>
                <p>
                  Our gamified web app turns HSK vocabulary into an interactive experience. Battle friends in real-time, climb the leaderboard, and build daily streaks — all while mastering Mandarin.
                </p>
                <div className="blitz-features">
                  <div className="blitz-feature">
                    <Zap size={18} color="#f59e0b" />
                    <span>Interactive quizzes across all HSK levels</span>
                  </div>
                  <div className="blitz-feature">
                    <Infinity size={18} color="#8B5CF6" />
                    <span>Real-time multiplayer battles</span>
                  </div>
                  <div className="blitz-feature">
                    <ShieldCheck size={18} color="#10B981" />
                    <span>XP, streaks, hearts & leaderboards</span>
                  </div>
                </div>
                <a
                  href="https://cililearnchinese.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-blitz"
                  style={{ textDecoration: 'none' }}
                >
                  <Zap size={18} />
                  Play CILI Blitz
                </a>
              </div>
              <div className="blitz-visual">
                <div className="blitz-glow"></div>
                <div className="blitz-card">
                  <div className="blitz-card-header">
                    <span className="blitz-card-dot"></span>
                    <span className="blitz-card-dot"></span>
                    <span className="blitz-card-dot"></span>
                  </div>
                  <div className="blitz-card-body">
                    <div className="blitz-question-label">What does this mean?</div>
                    <div className="blitz-character">我爱你</div>
                    <div className="blitz-pinyin">wǒ ài nǐ</div>
                    <div className="blitz-options">
                      <div className="blitz-option">I miss you</div>
                      <div className="blitz-option correct">I love you</div>
                      <div className="blitz-option">I need you</div>
                    </div>
                    <div className="blitz-xp">+15 XP</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="faq-section">
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
          <div className={`modal-content ${selectedProduct.variants?.[selectedVariantIndex]?.id === 'extended' ? 'extended-panel' : ''}`} onClick={(e) => e.stopPropagation()}>
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
                        <div
                          key={idx}
                          className="stacked-img"
                          style={{
                            position: 'absolute',
                            width: '45%',
                            '--offsetX': isSpread ? `${(idx - 1) * 70}px` : `${(idx - (arr.length - 1) / 2) * 16}px`,
                            '--offsetY': isSpread ? `0px` : `${-(idx - (arr.length - 1) / 2) * 16}px`,
                            '--hoverOffsetX': isSpread ? `${(idx - 1) * 100}px` : `${(idx - (arr.length - 1) / 2) * 24}px`,
                            '--hoverOffsetY': isSpread ? `-15px` : `${-(idx - (arr.length - 1) / 2) * 24}px`,
                            zIndex: idx + 1
                          } as React.CSSProperties}
                        >
                          <SkeletonImage
                            src={imgSrc}
                            alt={`${selectedProduct.name} - variant ${idx + 1} cover`}
                            style={{ borderRadius: 'var(--radius-sm)', boxShadow: '-6px 6px 15px rgba(0, 0, 0, 0.5)' }}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : selectedProduct.bundleImages ? (
                  <div className="bundle-image-stack modal-stack">
                    {selectedProduct.bundleImages.map((imgSrc, idx, arr) => {
                      const isSpread = arr.length === 3;
                      return (
                        <div
                          key={idx}
                          className="stacked-img"
                          style={{
                            position: 'absolute',
                            width: '45%',
                            '--offsetX': isSpread ? `${(idx - 1) * 70}px` : `${(idx - (arr.length - 1) / 2) * 16}px`,
                            '--offsetY': isSpread ? `0px` : `${-(idx - (arr.length - 1) / 2) * 16}px`,
                            '--hoverOffsetX': isSpread ? `${(idx - 1) * 100}px` : `${(idx - (arr.length - 1) / 2) * 24}px`,
                            '--hoverOffsetY': isSpread ? `-15px` : `${-(idx - (arr.length - 1) / 2) * 24}px`,
                            zIndex: idx + 1
                          } as React.CSSProperties}
                        >
                          <SkeletonImage
                            src={imgSrc}
                            alt={`${selectedProduct.name} - HSK level ${idx + 1} cover`}
                            style={{ borderRadius: 'var(--radius-sm)', boxShadow: '-6px 6px 15px rgba(0, 0, 0, 0.5)' }}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <SkeletonImage
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
                    <span>Instant Digital PDF Download</span>
                  </div>
                  <div className="modal-feature">
                    <CheckCircle size={18} color="var(--primary)" />
                    <span>Original Chinese Characters & Pinyin</span>
                  </div>
                  <div className="modal-feature">
                    <CheckCircle size={18} color="var(--primary)" />
                    <span>Professional English Translations</span>
                  </div>
                  <div className="modal-feature">
                    <CheckCircle size={18} color="var(--primary)" />
                    <span>Bonus: TSV + JSON for Anki & flashcard apps</span>
                  </div>
                  <div className="modal-feature" style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <ShieldCheck size={18} color="#10B981" />
                    <span style={{ color: '#10B981' }}>High-Quality Guarantee</span>
                  </div>
                </div>

                <div className="modal-actions">
                  {(selectedProduct.variants ? selectedProduct.variants[selectedVariantIndex].preview : selectedProduct.preview) && (
                    <a
                      href={selectedProduct.variants ? selectedProduct.variants[selectedVariantIndex].preview : selectedProduct.preview}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-preview"
                      style={{ textDecoration: 'none' }}
                    >
                      Preview
                    </a>
                  )}
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
                <li><a href="#sentence-packs">Sentence Packs</a></li>
                <li><a href="#hsk-levels">HSK Workbooks</a></li>
                <li><a href="#dev">Developer API</a></li>
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
            <div className="modal-info-col privacy-modal-inner">
              <h2 style={{ marginBottom: '24px' }}>Privacy Policy</h2>
              <div className="modal-desc" style={{ textAlign: 'left', maxHeight: '60vh', overflowY: 'auto', paddingRight: '16px' }}>
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

      {/* Coming Soon Toast */}
      <div className={`coming-soon-toast ${showComingSoon ? 'visible' : ''}`}>
        <Zap size={18} />
        <span>Coming Soon! Sentence Packs are currently in production.</span>
      </div>
    </>
  );
}

export default App;
