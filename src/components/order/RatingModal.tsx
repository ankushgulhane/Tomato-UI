import { useState } from 'react';
import { Button } from '../common/Button';
import { Textarea } from '../common/Input';
import { Modal } from '../common/Modal';
import { RatingStars } from '../restaurant/RatingStars';

interface RatingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (score: number, comment: string) => void;
  isSubmitting?: boolean;
}

export function RatingModal({ open, onClose, onSubmit, isSubmitting }: RatingModalProps) {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');

  return (
    <Modal open={open} onClose={onClose} title="Rate this restaurant">
      <div className="flex flex-col gap-4">
        <RatingStars value={score} interactive size={28} onChange={setScore} />
        <Textarea
          label="Comment (optional)"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSubmit(score, comment)} isLoading={isSubmitting}>
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
