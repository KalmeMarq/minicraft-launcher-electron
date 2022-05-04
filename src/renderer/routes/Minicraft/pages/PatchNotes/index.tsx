import { useContext, useEffect, useState } from 'react';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { PatchNotesContext } from '../../../../utils/PatchNotesContext';
import PatchNoteDialog from './components/PatchNoteDialog';
// import cardTemp from '../../../../assets/card_temp1.png';
import './index.scss';

export interface Patch {
  title: string;
  version: string;
  image: string;
  body: string;
  id: string;
}

const PatchNoteCard: React.FC<{ patch: Patch; onCardClick: (id: string) => void }> = ({ patch, onCardClick }) => {
  return (
    <button className="patch-card" onClick={() => onCardClick(patch.id)}>
      <div className="card-inside">
        <div className="card-top">
          <img src={patch.image} alt={patch.title} />
        </div>
        <div className="card-bottom">{patch.title}</div>
      </div>
    </button>
  );
};

const PatchNotesPage = () => {
  const [showPatchDialog, setShowPatchDialog] = useState(false);
  const [noteSelected, setNoteSelected] = useState<null | Patch>(null);

  const { minicraft: notes } = useContext(PatchNotesContext);

  return (
    <div className="sub-page">
      {noteSelected !== null && <PatchNoteDialog onClose={() => setShowPatchDialog(false)} isOpen={showPatchDialog} patch={noteSelected} />}
      {notes.length === 0 && <LoadingSpinner />}
      <div className="patch-list">
        {notes.map((note) => (
          <PatchNoteCard
            key={note.id}
            patch={note}
            onCardClick={(id) => {
              setNoteSelected(notes.find((p) => p.id === id) ?? null);
              setShowPatchDialog(true);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PatchNotesPage;
