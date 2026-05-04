"use client";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo">
            Naya<span>Ghar</span>
          </div>
          <p>The demand-first real estate marketplace. Revolutionizing how you find your next home.</p>
        </div>
        
        <div className="footer-links">
          <div className="link-group">
            <h4>Platform</h4>
            <a href="/marketplace">Marketplace</a>
            <a href="/about">How it Works</a>
          </div>
          <div className="link-group">
            <h4>Company</h4>
            <a href="/contact">Contact Us</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
          <div className="link-group">
            <h4>Social</h4>
            <a href="https://twitter.com">Twitter</a>
            <a href="https://linkedin.com">LinkedIn</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} NayaGhar. All rights reserved.</p>
      </div>

      <style jsx>{`
        .footer {
          background: rgba(2, 6, 23, 0.8);
          backdrop-filter: blur(15px);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 4rem 10% 2rem;
          margin-top: auto;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          gap: 4rem;
          margin-bottom: 3rem;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }

        .footer-brand {
          max-width: 300px;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
        }

        .logo span {
          color: #3b82f6;
        }

        .footer-brand p {
          color: #64748b;
          line-height: 1.6;
          font-size: 0.9rem;
        }

        .footer-links {
          display: flex;
          gap: 4rem;
        }

        .link-group h4 {
          color: white;
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .link-group a {
          display: block;
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          transition: color 0.2s;
        }

        .link-group a:hover {
          color: white;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 2rem;
          text-align: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .footer-bottom p {
          color: #475569;
          font-size: 0.8rem;
        }

        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            gap: 2rem;
          }
          .footer-links {
            flex-direction: column;
            gap: 2rem;
          }
        }
      `}</style>
    </footer>
  );
}
