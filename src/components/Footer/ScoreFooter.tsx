import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLabelInfo } from '../../contexts/LabelInfoContext';
import { EmailModal } from '../EmailModal';
import TrophyImg1 from '../../../public/images/trophy_1.png';
import TrophyImg2 from '../../../public/images/trophy_2.png';
import TrophyImg3 from '../../../public/images/trophy_3.png';

const sceneNames = {
  road: 'Road',
  street: 'Street',
  plane: 'Plane',
} as const;

type SceneKey = keyof typeof sceneNames;

const sceneLabelCounts: Record<SceneKey, number> = {
  street: 5,
  road: 6,
  plane: 4,
};

const ScoreFooter: React.FC = () => {
  const { state } = useLabelInfo();
  const navigate = useNavigate();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const totalLabels = Object.values(sceneLabelCounts).reduce((a, b) => a + b, 0);
  const totalFound = Object.keys(sceneLabelCounts).reduce((sum, scene) => sum + (Object.values(state[scene] || {}).filter(Boolean).length), 0);

  const secretsFound = {
    street: Object.values(state.street || {}).filter(Boolean).length,
    road: Object.values(state.road || {}).filter(Boolean).length,
    plane: Object.values(state.plane || {}).filter(Boolean).length,
  };

  const handleEnterChamber = () => {
    if (totalFound === totalLabels) {
      // All secrets found - show email modal
      setIsEmailModalOpen(true);
    } else {
      // Not all secrets found - navigate directly (will show password modal on that page)
      navigate('/the-masked-sanctuary');
    }
  };

  const handleEmailModalSuccess = () => {
    setIsEmailModalOpen(false);
    // Navigate to the Masked Sanctuary after email is submitted
    navigate('/the-masked-sanctuary');
  };

  return (
    <>
      <div className='footer-score'>
        <div className="footer-trophies-row">
          {(Object.keys(sceneLabelCounts) as SceneKey[]).map((scene, idx) => {
            const total = sceneLabelCounts[scene];
            const found = Object.values(state[scene] || {}).filter(Boolean).length;
            let trophyImg;
            if (idx === 0) trophyImg = TrophyImg1;
            else if (idx === 1) trophyImg = TrophyImg2;
            else trophyImg = TrophyImg3;
            const isComplete = found === total;
            return (
              <div key={scene} className="footer-trophy-block">
                <img
                  src={trophyImg}
                  alt={`Trophée ${sceneNames[scene]}`}
                  className={`footer-trophy-img${!isComplete ? ' trophy-incomplete' : ''}`}
                />
                <div className="footer-trophy-score">{found} / {total}</div>
              </div>
            );
          })}
        </div>
        {(totalFound === totalLabels) ? (
          <div className='footer-text'>
            <h2 className='text'>
              Congratulations, you've unlocked all the secrets !
            </h2>
            <div className='description'>
              Welcome to the inner circle.
              <br />
              <br />
              The Masked Sanctuary awaits — a silent vault of guarded secrets, where exclusive works unfold in avant-première.
            </div>
            <button className='btn' onClick={handleEnterChamber}>Enter the Chamber</button>
          </div>
        ) : (
          <div className='footer-text'>
            <h2 className='text'>
              Some secrets remain hidden.
            </h2>
            <div className='description'>
              Keep exploring—something exciting awaits you.
            </div>
            <a href="mailto:contact@ostrometfils.com" className='btn'>CONTACT</a>
          </div>
        )}
      </div>

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSuccess={handleEmailModalSuccess}
        secretsFound={secretsFound}
        totalFound={totalFound}
        totalLabels={totalLabels}
      />
    </>
  );
};

export default ScoreFooter;
