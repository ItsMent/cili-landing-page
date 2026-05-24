import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ShieldCheck, ChevronLeft, Zap } from 'lucide-react';
import { getProductById, getRelatedProducts } from '../data/products';
import SkeletonImage from '../components/SkeletonImage';

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const product = getProductById(productId || '');

  const navigate = useNavigate();
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
    });
  }, [productId]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  if (!product) {
    return (
      <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px' }}>
        <h1 style={{ color: 'white', fontSize: '2rem' }}>Product Not Found</h1>
        <Link to="/" className="btn btn-primary" style={{ padding: '12px 32px', textDecoration: 'none' }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product.id);
  const currentVariant = product.variants?.[selectedVariantIndex];
  const currentPrice = currentVariant?.price || product.price;
  const currentOriginalPrice = currentVariant?.originalPrice || product.originalPrice;
  const currentLink = currentVariant?.link || product.link;
  const currentPreview = currentVariant?.preview || product.preview;
  const currentImage = currentVariant?.image || product.image;
  const currentDescription = currentVariant?.description || product.description;
  const currentBundleImages = currentVariant?.bundleImages || product.bundleImages;

  const pageTitle = product.seoTitle || `${product.name} | CILI Learn Chinese`;
  const pageDescription = product.seoDescription || product.description;
  const canonicalUrl = `https://shop.cililearnchinese.com/products/${product.id}/`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": { "@type": "Brand", "name": "CILI - Learn Chinese" },
    "category": "Educational Materials",
    ...(product.variants ? {
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": product.variants[0].price,
        "highPrice": product.variants[product.variants.length - 1].price,
        "priceCurrency": "USD",
        "offerCount": product.variants.length,
        "availability": "https://schema.org/InStock",
        "url": canonicalUrl
      }
    } : {
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "USD",
        "availability": product.isSentencePack ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
        "url": canonicalUrl
      }
    })
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://shop.cililearnchinese.com/" },
      { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://shop.cililearnchinese.com/#products" },
      { "@type": "ListItem", "position": 3, "name": product.name, "item": canonicalUrl }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="product" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <div className="product-page" style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav style={{ marginBottom: '32px' }}>
            <button
              onClick={() => navigate('/#products')}
              style={{ color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <ChevronLeft size={18} />
              Back to all products
            </button>
          </nav>

          {/* Product Detail Grid */}
          <div className="product-detail-grid">
            {/* Image Column */}
            <div className="product-detail-image">
              {currentBundleImages ? (
                <div className="bundle-image-stack" style={{ position: 'relative', width: '100%', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {currentBundleImages.map((imgSrc, idx, arr) => {
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
                          alt={`${product.name} - level ${idx + 1} cover`}
                          style={{ borderRadius: 'var(--radius-sm)', boxShadow: '-6px 6px 15px rgba(0, 0, 0, 0.5)' }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <SkeletonImage src={currentImage} alt={product.name} style={{ maxWidth: '350px', margin: '0 auto' }} />
              )}
            </div>

            {/* Info Column */}
            <div>
              <span className="product-tag" style={{ marginBottom: '12px', display: 'inline-block' }}>{product.tag}</span>
              <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 700, marginBottom: '16px', lineHeight: 1.3 }}>{product.name}</h1>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '24px' }}>
                <span style={{ color: 'white', fontSize: '2rem', fontWeight: 700 }}>${currentPrice}</span>
                {currentOriginalPrice && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem', textDecoration: 'line-through' }}>${currentOriginalPrice}</span>
                )}
              </div>

              {product.variants && (
                <div className="variant-selectors-container" style={{ marginBottom: '24px' }}>
                  <div
                    className="variant-sliding-bg"
                    style={{
                      width: `${100 / product.variants.length}%`,
                      transform: `translateX(${selectedVariantIndex * 100}%)`
                    }}
                  />
                  {product.variants.map((v, i) => (
                    <button
                      key={v.id}
                      className={`variant-tab ${i === selectedVariantIndex ? 'active' : ''}`}
                      onClick={() => setSelectedVariantIndex(i)}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              )}

              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
                {currentDescription}
              </p>

              <div className="modal-features" style={{ marginBottom: '32px' }}>
                <div className="modal-feature">
                  <CheckCircle size={18} color="var(--primary)" />
                  <span>Instant Download — PDF + TSV + JSON</span>
                </div>
                <div className="modal-feature">
                  <CheckCircle size={18} color="var(--primary)" />
                  <span>Imports into Anki, Quizlet & flashcard apps</span>
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

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {currentPreview && (
                  <a
                    href={currentPreview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-preview"
                    style={{ textDecoration: 'none', padding: '14px 32px' }}
                  >
                    Preview PDF
                  </a>
                )}
                {product.isSentencePack ? (
                  <button className="btn btn-primary" style={{ padding: '14px 40px', opacity: 0.7, cursor: 'not-allowed' }} disabled>
                    <Zap size={18} /> Coming Soon
                  </button>
                ) : (
                  <a
                    href={currentLink}
                    className="btn btn-primary"
                    data-gumroad-overlay-checkout="true"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: '14px 40px', textDecoration: 'none' }}
                  >
                    Buy Now
                  </a>
                )}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '16px' }}>Secure 1-click checkout powered by Gumroad</p>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section style={{ marginTop: '80px' }}>
              <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, marginBottom: '32px' }}>You Might Also Like</h2>
              <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {relatedProducts.map((rp) => (
                  <Link
                    key={rp.id}
                    to={`/products/${rp.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="product-card" style={{ cursor: 'pointer' }}>
                      <div className="product-image-wrapper">
                        <SkeletonImage src={rp.image} alt={rp.name} className="product-image" />
                      </div>
                      <div className="product-content">
                        <span className="product-tag">{rp.tag}</span>
                        <h3>{rp.name}</h3>
                        <p>{rp.description}</p>
                        <div className="product-footer">
                          <div className="price-container">
                            <div className="price">${rp.price}</div>
                            {rp.originalPrice && <span className="original-price">${rp.originalPrice}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
