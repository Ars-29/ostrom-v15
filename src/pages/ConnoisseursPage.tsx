import { useEffect, useState, useRef } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ScoreDisplay } from '../components/ScoreDisplay/ScoreDisplay';
import HamburgerMenu from '../components/HamburgerMenu';
import { useNavigate, useLocation } from 'react-router-dom';
import { LabelInfoProvider } from '../contexts/LabelInfoContext';
import { useSound } from '../contexts/SoundContext';
import Logo from '../components/Logo/Logo';
import './ConnoisseursPage.scss';

// Optimized public asset paths
const heroVideo = '/assets/optimized/Ostrom-teaser-v1-1080.mp4';
const imgLandscape = '/assets/optimized/JB_00401-1080.webp';
const imgPortraitOne = '/assets/optimized/JB_00391_BL-1080.webp';
const imgPortraitTwo = '/assets/optimized/JB_00390-1080.webp';

// Use the same divider asset and resolution pathing as TitleSection
const dividerSrc = `${import.meta.env.BASE_URL}images/divider.png`;

export default function ConnoisseursPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { setSoundEnabled, setAmbient } = useSound();

  // Stop all audio from main route when this page mounts
  useEffect(() => {
    console.log('ConnoisseursPage mounted - stopping main route audio');
    setAmbient(null);
    setSoundEnabled(true);
  }, [setAmbient, setSoundEnabled]);

  // Stop audio when navigating away from this route
  useEffect(() => {
    if (location.pathname !== '/the-hidden-chamber') {
      console.log('Navigated away from ConnoisseursPage - stopping audio');
      setAmbient(null);
      setSoundEnabled(false);
    }
  }, [location.pathname, setAmbient, setSoundEnabled]);

  // Ensure root element is visible and start at hero section on mount
  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement) rootElement.classList.add('loaded');

    // Scroll to the top, then ensure hero is aligned at start
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setTimeout(() => {
      heroRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 0);
  }, []);

  // Unmute video after it starts playing (especially for iOS/mobile)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    const handlePlay = () => {
      // Unmute after video plays (allows iOS audio unlock)
      setTimeout(() => {
        if (video && (isMobile || isIOS)) {
          video.muted = false;
          console.log('Unmuting ConnoisseursPage video after play');
        }
      }, 500);
    };

    // Also unmute on any user interaction (for better iOS compatibility)
    const unlockAudio = () => {
      if (video && (isMobile || isIOS)) {
        setTimeout(() => {
          if (video) {
            video.muted = false;
            console.log('Unmuting ConnoisseursPage video on user interaction');
          }
        }, 100);
      }
    };

    video.addEventListener('play', handlePlay);
    
    // Listen for user interactions to unlock audio
    const events = ['touchstart', 'click'];
    events.forEach(eventType => {
      document.addEventListener(eventType, unlockAudio, { once: true, passive: true });
    });

    return () => {
      video.removeEventListener('play', handlePlay);
      events.forEach(eventType => {
        document.removeEventListener(eventType, unlockAudio);
      });
    };
  }, []);

  const menuItems = [
    { id: 'home', label: 'Home', onClick: () => navigate('/') },
  ];
  
  return (
    <LabelInfoProvider>
      <div className="connoisseurs">
        {/* Sticky header identical styling */}
        <div className="top-header">
          <Logo className="loader-logo move-to-corner" onClick={() => navigate('/')} />
          <ScoreDisplay />
        </div>
        <HamburgerMenu
          items={menuItems}
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen(!isMenuOpen)}
          onClose={() => setIsMenuOpen(false)}
          position="left"
        />

        {/* Hero Video Section */}
        <section ref={heroRef} className="connoisseurs__hero">
          <video 
            ref={videoRef}
            className="connoisseurs__video"
            autoPlay 
            muted 
            loop 
            playsInline
            controls={false}
          >
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </section>

        {/* Header */}
        <header className="connoisseurs__header">
          <h1 className="connoisseurs__title">
            The Hidden Chamber
          </h1>
          <img src={dividerSrc} alt="Divider" className="connoisseurs__divider-img" />
          <p className="connoisseurs__lead">
            A glimpse into the rebirth of a forgotten Parisian House. Archival fragments, hands at work, and echoes of the past invite you into the Hidden Chamber.
          </p>
        </header>

        {/* Main Content */}
        <main className="connoisseurs__main">
          {/* Introduction Section */}
          <section className="connoisseurs__intro">
            <p className="connoisseurs__text">
              Touch is our archive. Know-how revived.
            </p>
          </section>

          {/* Landscape Image Section */}
          <section className="connoisseurs__landscape">
            <div className="connoisseurs__image-wrap">
              <ImageWithFallback 
                src={imgLandscape}
                alt="Landscape view"
                className="connoisseurs__image-landscape"
              />
            </div>
            <div className="connoisseurs__section-body">
              {/* Text content commented out - waiting for client to provide content */}
              {/* <h2 className="connoisseurs__h2">The Journey Begins</h2>
              <p className="connoisseurs__text" style={{ marginBottom: '1rem' }}>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
              </p>
              <p className="connoisseurs__text">
                Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt.
              </p> */}
            </div>
          </section>

          {/* Two Portrait Images Section */}
          <section className="connoisseurs__landscape">
            <div className="connoisseurs__grid-two">
              <div>
                <ImageWithFallback 
                  src={imgPortraitOne}
                  alt="Portrait view one"
                  className="connoisseurs__portrait"
                />
                {/* Text content commented out - waiting for client to provide content */}
                {/* <h3 className="connoisseurs__h3">Architectural Elegance</h3>
                <p className="connoisseurs__text">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.
                </p> */}
              </div>
              <div>
                <ImageWithFallback 
                  src={imgPortraitTwo}
                  alt="Portrait view two"
                  className="connoisseurs__portrait"
                />
                {/* Text content commented out - waiting for client to provide content */}
                {/* <h3 className="connoisseurs__h3">Urban Stories</h3>
                <p className="connoisseurs__text">
                  Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias.
                </p> */}
              </div>
            </div>
          </section>

          {/* Closing Section */}
          <section className="connoisseurs__closing">
            {/* Divider image removed - button should match main page contact button */}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <a 
                href="https://wa.me/your-whatsapp-number" 
                rel="noopener noreferrer"
                className="connoisseurs__cta-button"
              >
                Access Confidential Dispatches
              </a>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="connoisseurs__footer">
          <p className="connoisseurs__footer-text">© 2025 The Hidden Chamber. All rights reserved.</p>
        </footer>
      </div>
    </LabelInfoProvider>
  );
}
