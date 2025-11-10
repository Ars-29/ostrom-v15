import { useEffect, useState, useRef } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import HamburgerMenu from '../components/HamburgerMenu';
import { PasswordModal } from '../components/PasswordModal';
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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { setSoundEnabled, setAmbient, registerVideo, unregisterVideo } = useSound();

  // Check if password is already verified in session
  useEffect(() => {
    const isVerified = sessionStorage.getItem('passwordVerified') === 'true';
    if (!isVerified) {
      // Show password modal if not verified
      setIsPasswordModalOpen(true);
    }
  }, []);

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

  // Ensure root element is visible and start at header on mobile, hero on desktop
  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement) rootElement.classList.add('loaded');

    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isMobile) {
      // On mobile: start at header (logo should be visible above hero video)
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      // Header will be visible, logo always shown on mobile
    } else {
      // On desktop: start at hero section (like before)
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      setTimeout(() => {
        heroRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 0);
    }
  }, []);

  // Show header on scroll (like main page)
  // On mobile: always show header (logo needs to be visible above hero video with no background)
  useEffect(() => {
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // On mobile, always show header
    if (isMobile) {
      setShowHeader(true);
      return;
    }
    
    // On desktop, show/hide based on scroll
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Register video with sound context for mute management
  useEffect(() => {
    if (videoRef.current) {
      registerVideo(videoRef.current);
    }
    return () => {
      if (videoRef.current) {
        unregisterVideo(videoRef.current);
      }
    };
  }, [registerVideo, unregisterVideo]);

  // Unmute video after it starts playing (for all devices, not just mobile/iOS)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    const handlePlay = () => {
      // Unmute after video plays (allows iOS audio unlock on mobile, and enables sound on desktop)
      setTimeout(() => {
        if (video) {
          // For mobile/iOS, wait a bit longer for audio unlock
          // For desktop, unmute immediately
          if (isMobile || isIOS) {
            setTimeout(() => {
              if (video) {
                video.muted = false;
                console.log('Unmuting ConnoisseursPage video after play (mobile/iOS)');
              }
            }, 500);
          } else {
            video.muted = false;
            console.log('Unmuting ConnoisseursPage video after play (desktop)');
          }
        }
      }, 100);
    };

    // Also unmute on any user interaction (for better iOS compatibility)
    const unlockAudio = () => {
      if (video) {
        setTimeout(() => {
          if (video) {
            video.muted = false;
            console.log('Unmuting ConnoisseursPage video on user interaction');
          }
        }, 100);
      }
    };

    video.addEventListener('play', handlePlay);
    
    // Listen for user interactions to unlock audio (especially important for iOS)
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
    {
      id: 'urban-pioneer',
      label: 'The Urban Pionnier',
      onClick: () => {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById('section-1');
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    },
    {
      id: 'connoisseurs',
      label: 'Connoisseurs of Speed',
      onClick: () => {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById('section-2');
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    },
    {
      id: 'above-beyond',
      label: 'Above and Beyond',
      onClick: () => {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById('section-3');
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    },
    {
      id: 'hidden-chamber',
      label: 'The Hidden Chamber',
      onClick: () => {
        // Already on this page, just close menu
        setIsMenuOpen(false);
        // Note: Password prompt is not needed here since user is already on the page
      }
    }
  ];
  
  return (
    <LabelInfoProvider>
      <div className="connoisseurs">
        {/* Sticky header identical styling - hidden initially, shown on scroll */}
        <div className={`top-header ${showHeader ? 'show-on-scroll' : 'hidden-on-load'}`}>
          <Logo className="loader-logo move-to-corner" onClick={() => navigate('/')} />
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
            muted={true}
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
            A glimpse into the rebirth of a forgotten Parisian house.
            <br />
            Archival fragments, hands at work, and echoes of the past guide you into the Hidden Chamber —
            <br />
            a private, exclusive space unlocked by your unique password,
            <br />
            where creations and stories are revealed in avant-première.
          </p>
        </header>

        {/* Main Content */}
        <main className="connoisseurs__main">
          {/* Introduction Section */}
          <section className="connoisseurs__intro">
            <p className="connoisseurs__text">
              Touch is our archive.
              <br />
              Know-how, revived.
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
              <p className="connoisseurs__text" style={{ marginBottom: '1.5rem', fontStyle: 'italic' }}>
                Where private invitations and whispered news await.
              </p>
              <a 
                href="https://wa.me/your-whatsapp-number" 
                rel="noopener noreferrer"
                className="connoisseurs__cta-button"
              >
                Join the Inner Circle
              </a>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="connoisseurs__footer">
          <p className="connoisseurs__footer-text">© 2025 The Hidden Chamber. All rights reserved.</p>
        </footer>
      </div>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          // Navigate back if password is cancelled
          navigate('/');
        }}
        onSuccess={() => {
          setIsPasswordModalOpen(false);
          // Password verified, user can now view the page
        }}
      />
    </LabelInfoProvider>
  );
}
