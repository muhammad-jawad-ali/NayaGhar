"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="hero-section">
      <div className="hero-content">
        <div className="badge">Demand-First Real Estate</div>
        <h1>The Upwork for <span className="gradient-text">Real Estate</span></h1>
        <p>
          Stop scrolling through stale listings. Post your requirement brief and 
          let verified agents pitch currently available properties directly to you.
        </p>
        <div className="cta-group">
          <Link href="/auth/signup" className="primary-cta">Get Started</Link>
          <Link href="/marketplace" className="secondary-cta">Explore Marketplace</Link>
        </div>
        
        <div className="stats">
          <div className="stat-item">
            <h3>100%</h3>
            <p>Verified Agents</p>
          </div>
          <div className="stat-item">
            <h3>Live</h3>
            <p>Availability</p>
          </div>
          <div className="stat-item">
            <h3>Direct</h3>
            <p>Pitching</p>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="blob-bg"></div>
        <div className="card-stack">
          <div className="floating-card c1">
            <div className="card-header">New Brief</div>
            <div className="card-body">3BHK in DHA Phase 6, Lahore...</div>
          </div>
          <div className="floating-card c2">
            <div className="card-header">Bid Received</div>
            <div className="card-body">Modern Villa matching your brief!</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4rem 10%;
          min-height: calc(100vh - 80px);
          overflow: hidden;
        }

        .hero-content {
          max-width: 600px;
          z-index: 1;
        }

        .badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border-radius: 99px;
          font-weight: 600;
          font-size: 0.8rem;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .hero-content h1 {
          font-size: 4.5rem;
          line-height: 1.1;
          font-weight: 800;
          color: white;
          margin-bottom: 1.5rem;
          letter-spacing: -2px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-content p {
          font-size: 1.25rem;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }

        .cta-group {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .primary-cta {
          background: #3b82f6;
          color: white;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
        }

        .primary-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.5);
        }

        .secondary-cta {
          background: rgba(255, 255, 255, 0.05);
          color: white;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s;
        }

        .secondary-cta:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .stats {
          display: flex;
          gap: 3rem;
        }

        .stat-item h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.25rem;
        }

        .stat-item p {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 0;
        }

        .hero-visual {
          position: relative;
          width: 500px;
          height: 500px;
        }

        .blob-bg {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
          filter: blur(40px);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 8s infinite ease-in-out;
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }

        .floating-card {
          position: absolute;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 20px;
          width: 280px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: float 6s infinite ease-in-out;
        }

        .c1 { top: 100px; right: 50px; animation-delay: 0s; }
        .c2 { bottom: 100px; left: 0px; animation-delay: -3s; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .card-header {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #3b82f6;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .card-body {
          font-weight: 500;
          color: white;
        }

        @media (max-width: 1024px) {
          .hero-section {
            flex-direction: column;
            padding: 2rem 5%;
            text-align: center;
          }
          .hero-content { max-width: 100%; margin-bottom: 4rem; }
          .hero-content h1 { font-size: 3rem; }
          .cta-group { justify-content: center; }
          .stats { justify-content: center; }
          .hero-visual { width: 100%; height: 300px; display: none; }
        }
      `}</style>
    </main>
  );
}
